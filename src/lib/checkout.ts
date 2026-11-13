import "server-only";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Turns a paid Stripe session into an order. Called by the success page AND the webhook:
// create_paid_order is idempotent, so whichever runs second gets the same order back.

export type PaidOrder = {
  number: string;
  email: string | null;
  total: number;
  /** True when the order belongs to a signed-in account */
  hasAccount: boolean;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function fulfillCheckoutSession(sessionId: string): Promise<PaidOrder | null> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // Not paid (yet): bank transfers etc. arrive later through the webhook
  if (session.mode !== "payment" || session.payment_status !== "paid") return null;

  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    limit: 100,
    expand: ["data.price.product"],
  });

  const items = lineItems.data.map((line) => {
    const product = line.price?.product as Stripe.Product | undefined;
    return {
      slug: product?.metadata?.slug ?? "unknown",
      name: product?.name ?? line.description ?? "Product",
      origin: product?.metadata?.origin ?? "",
      unit_price: (line.price?.unit_amount ?? 0) / 100,
      quantity: line.quantity ?? 1,
    };
  });

  const userId =
    session.client_reference_id && UUID.test(session.client_reference_id)
      ? session.client_reference_id
      : null;
  const email = session.customer_details?.email ?? session.customer_email ?? null;
  const total = (session.amount_total ?? 0) / 100;

  const { data, error } = await createAdminClient()
    .rpc("create_paid_order", {
      p_stripe_session_id: session.id,
      p_user_id: userId,
      p_customer_email: email,
      p_total: total,
      p_shipping: session.collected_information?.shipping_details ?? null,
      p_items: items,
    })
    .single<{ order_id: string; order_number: string }>();

  if (error) throw new Error(`create_paid_order failed: ${error.code} ${error.message}`);

  return { number: data.order_number, email, total, hasAccount: userId !== null };
}
