import type { Metadata } from "next";
import { Suspense } from "react";
import { MessagePage } from "@/components/layout/MessagePage";
import { Button } from "@/components/ui/Button";
import { fulfillCheckoutSession, type PaidOrder } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import { isStripeConfigured } from "@/lib/stripe";
import { ClearCart } from "./ClearCart";

export const metadata: Metadata = {
  title: "Thank You — XAY Teahouse",
};

// Stripe redirects here after payment (?session_id=cs_…)
export default function CheckoutSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  return (
    <MessagePage>
      {/* Reads the URL and calls Stripe: needs Suspense */}
      <Suspense fallback={<p className="label opacity-60">Confirming your payment…</p>}>
        <Confirmation searchParams={searchParams} />
      </Suspense>
    </MessagePage>
  );
}

async function Confirmation({ searchParams }: Pick<PageProps<"/checkout/success">, "searchParams">) {
  const { session_id: raw } = await searchParams;
  const sessionId = typeof raw === "string" && raw.startsWith("cs_") ? raw : null;

  let order: PaidOrder | null = null;
  let failed = false;
  if (sessionId && isStripeConfigured) {
    try {
      order = await fulfillCheckoutSession(sessionId);
    } catch (error) {
      console.error("Checkout success page:", error instanceof Error ? error.message : error);
      failed = true;
    }
  }

  if (!order) {
    return (
      <>
        <h1 className="heading text-6xl md:text-8xl xl:text-10xl">{failed ? "Almost" : "Pending"}</h1>
        <p className="text-sm tracking-ultra uppercase opacity-80">
          {failed
            ? "Your payment went through but we could not record your order yet. It will appear shortly; contact us if it does not."
            : "We could not confirm a payment for this link yet. If you were charged, your order will appear shortly."}
        </p>
        <Button href="/shop">Back to the Shop</Button>
      </>
    );
  }

  return (
    <>
      <ClearCart />
      <h1 className="heading text-6xl md:text-8xl xl:text-10xl">Thank You</h1>
      <p className="font-display text-3xl font-bold tracking-wider uppercase">Order #{order.number}</p>
      <p className="text-sm tracking-ultra uppercase opacity-80">
        {formatPrice(order.total, { decimals: true })} paid
        {order.email ? ` · A receipt is on its way to ${order.email}` : ""}
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        {order.hasAccount && <Button href="/account/orders">View My Orders</Button>}
        <Button href="/shop" variant="solid" size="md">
          Continue Shopping
        </Button>
      </div>
    </>
  );
}
