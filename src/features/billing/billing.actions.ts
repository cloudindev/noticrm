"use server";

import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function createCheckoutSessionAction(productId: string, tenantId: string, isAnnual: boolean = false) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Validate membership and role
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, tenantId: tenantId },
    include: { tenant: true },
  });

  if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
    throw new Error("Only workspace admins can manage billing");
  }

  // Get current host from request to handle domains dynamically
  const headersList = await headers();
  const rawUrl = headersList.get("origin") || headersList.get("referer") || "https://noticrm.com";
  // Create safe absolute URL
  const domain = new URL(rawUrl).origin;

  // Find the price for the requested product
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 10,
  });
  
  if (prices.data.length === 0) {
    throw new Error("No active price found for this product.");
  }
  
  // Try to match recurring interval if possible
  const price = prices.data.find(p => p.recurring?.interval === (isAnnual ? 'year' : 'month')) || prices.data[0];

  let customerId = membership.tenant.stripeCustomerId;

  if (!customerId) {
    // Create new customer
    const customerInfo = await stripe.customers.create({
      email: session.user.email || undefined,
      name: membership.tenant.name,
      metadata: {
        tenantId: membership.tenantId,
      },
    });
    customerId = customerInfo.id;
    // Update tenant logic will be mostly handled by webhook but we can store customer ID proactively
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    metadata: {
      tenantId: membership.tenantId,
    },
    success_url: `${domain}/${membership.tenant.slug}/settings/billing?success=true`,
    cancel_url: `${domain}/${membership.tenant.slug}/settings/plans?canceled=true`,
  });

  return { url: checkoutSession.url };
}

export async function createCustomerPortalSessionAction(tenantId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, tenantId: tenantId },
    include: { tenant: true },
  });

  if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
    throw new Error("Only workspace admins can manage billing");
  }

  const customerId = membership.tenant.stripeCustomerId;
  
  if (!customerId) {
    throw new Error("No active subscription/customer found.");
  }

  const headersList = await headers();
  const rawUrl = headersList.get("origin") || headersList.get("referer") || "https://noticrm.com";
  const domain = new URL(rawUrl).origin;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${domain}/${membership.tenant.slug}/settings/billing`,
  });

  return { url: portalSession.url };
}
