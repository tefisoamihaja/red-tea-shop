"use client";

import { useActionState, useMemo } from "react";
import { startCheckout, type CheckoutState } from "@/app/actions/checkout";
import { ProductThumb } from "@/components/cards/ProductThumb";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormAlert } from "@/components/ui/FormAlert";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

export function CheckoutView({ catalog }: { catalog: Product[] }) {
  const { lines: cartLines, ready } = useCart();
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(startCheckout, {});

  // Same pricing as startCheckout: today's catalog price, discontinued teas left out
  const { lines, unavailable, subtotal } = useMemo(() => {
    const bySlug = new Map(catalog.map((product) => [product.slug, product]));
    const lines = cartLines.flatMap((line) => {
      const product = bySlug.get(line.slug);
      return product ? [{ ...line, name: product.name, origin: product.origin, price: product.price }] : [];
    });
    return {
      lines,
      unavailable: cartLines.filter((line) => !bySlug.has(line.slug)),
      subtotal: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    };
  }, [catalog, cartLines]);

  // Wait for the saved cart (avoids a flash of "empty bag")
  if (!ready) return <div className="min-h-80" aria-busy="true" />;

  if (lines.length === 0) {
    return <EmptyState>Your bag is empty.</EmptyState>;
  }

  const cart = JSON.stringify(lines.map(({ slug, quantity }) => ({ slug, quantity })));

  return (
    <div className="grid gap-16 xl:grid-cols-[1fr_400px] xl:gap-24">
      <div className="flex flex-col gap-6">
        <ul className="border-t border-tea-500/10">
          {lines.map((line) => (
            <li key={line.slug} className="flex items-center gap-6 border-b border-tea-500/10 py-6">
              <ProductThumb slug={line.slug} image={line.image} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-sm font-semibold tracking-widest uppercase">{line.name}</p>
                <p className="label opacity-70">
                  {line.origin} · Qty {line.quantity}
                </p>
              </div>
              <p className="font-display text-xl font-bold tracking-wider">
                {formatPrice(line.price * line.quantity, { decimals: true })}
              </p>
            </li>
          ))}
        </ul>
        {unavailable.length > 0 && (
          <p className="label opacity-60">
            No longer available, not included: {unavailable.map((line) => line.name).join(", ")}
          </p>
        )}
      </div>

      <form
        action={formAction}
        className="flex flex-col gap-6 self-start rounded-panel bg-blush-50 p-8 xl:sticky xl:top-8"
      >
        <input type="hidden" name="cart" value={cart} />
        <dl className="flex flex-col gap-4">
          <div className="flex justify-between">
            <dt className="label">Subtotal</dt>
            <dd className="text-sm">{formatPrice(subtotal, { decimals: true })}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="label">Shipping</dt>
            <dd className="text-sm">Free</dd>
          </div>
          <div className="flex items-end justify-between border-t border-tea-500/20 pt-4">
            <dt className="label font-bold">Total</dt>
            <dd className="font-display text-2xl font-bold tracking-wider">
              {formatPrice(subtotal, { decimals: true })}
            </dd>
          </div>
        </dl>

        <FormAlert>{state.error}</FormAlert>

        <Button type="submit" variant="solid" className="w-full" disabled={pending}>
          {pending ? "Opening Payment…" : "Proceed to Payment"}
        </Button>
        <p className="text-xs opacity-60">
          Shipping address and card details are entered on Stripe&apos;s secure payment page.
          Prices are checked again before payment.
        </p>
      </form>
    </div>
  );
}
