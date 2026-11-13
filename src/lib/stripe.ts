import "server-only";
import Stripe from "stripe";

// Server only. Test keys start with sk_test_. Never expose the key as NEXT_PUBLIC_.

const secretKey = process.env.STRIPE_SECRET_KEY ?? "";
export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export const isStripeConfigured = secretKey !== "";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!isStripeConfigured) throw new Error("STRIPE_SECRET_KEY is not set (see .env.example)");
  client ??= new Stripe(secretKey);
  return client;
}
