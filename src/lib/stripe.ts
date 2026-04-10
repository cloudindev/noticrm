import 'server-only';

import Stripe from 'stripe';

// Fallback to a dummy key to prevent server crash during boot/build if env is missing
const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';

export const stripe = new Stripe(apiKey, {
  apiVersion: '2025-01-27.acacia' as any, // Bypass strict typing if needed format has changed
  appInfo: {
    name: 'NotiCRM',
    url: 'https://noticrm.com',
  },
});
