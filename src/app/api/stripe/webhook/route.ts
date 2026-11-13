import type Stripe from "stripe";
import { fulfillCheckoutSession } from "@/lib/checkout";
import { getStripe, isStripeConfigured, stripeWebhookSecret } from "@/lib/stripe";

// Backup for the success page: records the order even if the customer closes the tab.
// Local testing: stripe listen --forward-to localhost:3000/api/stripe/webhook

const HANDLED: Stripe.Event.Type[] = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
];

export async function POST(request: Request) {
  if (!isStripeConfigured || !stripeWebhookSecret) {
    return new Response("Webhook not configured", { status: 503 });
  }

  // The signature is checked on the raw body, so don't parse it as JSON
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, stripeWebhookSecret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (HANDLED.includes(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      // null while unpaid: async_payment_succeeded will come later
      await fulfillCheckoutSession(session.id);
    } catch (error) {
      console.error("Stripe webhook:", error instanceof Error ? error.message : error);
      // 500 → Stripe retries later
      return new Response("Could not record the order", { status: 500 });
    }
  }

  return new Response("ok", { status: 200 });
}
