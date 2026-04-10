import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to deduce the PlanTier from the Price/Product ID
// The user provided the product IDs. 
const PRODUCT_SOLO = 'prod_UJPwD4rYyYsCaW';
const PRODUCT_TEAM = 'prod_UJPxwLOTTAv6sO';
const PRODUCT_PRO = 'prod_UJPyHli8umFJxW';
const PRODUCT_CORP = 'prod_UJPzL4zPBJOC1r';

function determinePlanTier(productId: string) {
  switch (productId) {
    case PRODUCT_SOLO: return 'SOLO';
    case PRODUCT_TEAM: return 'TEAM';
    case PRODUCT_PRO: return 'PRO';
    case PRODUCT_CORP: return 'UNLIMITED';
    default: return 'TRIAL';
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        
        // Retrieve subscription details
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const tenantId = session.metadata?.tenantId;
          
          if (!tenantId) {
            console.error('No tenantId in session metadata');
            break;
          }

          const priceId = subscription.items.data[0].price.id;
          const productId = subscription.items.data[0].price.product as string;

          await prisma.tenant.update({
            where: { id: tenantId },
            data: {
              stripeSubscriptionId: subscription.id,
              stripeCustomerId: session.customer as string,
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
              planTier: determinePlanTier(productId) as any,
            },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;

        // Find tenant by customer ID
        const tenant = await prisma.tenant.findUnique({
          where: { stripeCustomerId: customerId }
        });

        if (tenant) {
          const priceId = subscription.items.data[0].price.id;
          const productId = subscription.items.data[0].price.product as string;

          await prisma.tenant.update({
            where: { id: tenant.id },
            data: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              planTier: determinePlanTier(productId) as any,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;

        // When a subscription is cancelled or ends due to non-payment
        const tenant = await prisma.tenant.findUnique({
          where: { stripeCustomerId: customerId }
        });

        if (tenant) {
          // The user explicitly requested: "Cuando un usuario ADMIN del workspace se dé de baja o cancele... Sus datos se borrarán."
          console.warn(`Deleting tenant ${tenant.id} due to subscription cancellation.`);
          await prisma.tenant.delete({
            where: { id: tenant.id }
          });
        }
        break;
      }
    }

    return new NextResponse('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Internal Server Error processing webhook', { status: 500 });
  }
}
