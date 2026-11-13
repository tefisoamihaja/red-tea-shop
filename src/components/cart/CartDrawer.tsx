"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { ProductThumb } from "@/components/cards/ProductThumb";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/hooks/useCart";
import { useDialog } from "@/hooks/useDialog";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/types";

function CartLineItem({ line }: { line: CartLine }) {
  const { setQuantity, removeItem, closeCart } = useCart();

  return (
    <li className="flex gap-6 border-b border-tea-500/10 py-6">
      <ProductThumb slug={line.slug} image={line.image} onClick={closeCart} />

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <Link
              href={`/shop/${line.slug}`}
              onClick={closeCart}
              className="link-fade text-sm font-semibold tracking-widest uppercase"
            >
              {line.name}
            </Link>
            <p className="label opacity-70">{line.origin}</p>
          </div>
          <p className="font-display text-xl font-bold tracking-wider">
            {formatPrice(line.price * line.quantity)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <QuantityStepper
            value={line.quantity}
            min={0}
            label={line.name}
            onChange={(quantity) => setQuantity(line.slug, quantity)}
          />
          <button type="button" className="label link-fade" onClick={() => removeItem(line.slug)}>
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

// TODO: compare with the Figma "Your Bag" frame (1:648), built without access to it.
export function CartDrawer() {
  const { lines, count, subtotal, isOpen, closeCart } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  useDialog(isOpen, closeCart, closeRef);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-ink-900/40"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white text-tea-500 sm:w-111"
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-tea-500/10 px-6 py-6 sm:px-8">
              <h2 id="cart-title" className="heading text-4xl">
                Your Bag <span className="opacity-40">({count})</span>
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={closeCart}
                className="label font-medium transition-opacity duration-250 ease-out hover:opacity-60"
              >
                Close
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 text-center">
                <p className="label opacity-70">Your bag is empty</p>
                <Button href="/shop" onClick={closeCart}>
                  Explore Collection
                </Button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6 sm:px-8">
                  {lines.map((line) => (
                    <CartLineItem key={line.slug} line={line} />
                  ))}
                </ul>

                <footer className="flex flex-col gap-6 border-t border-tea-500/10 px-6 py-8 sm:px-8">
                  <div className="flex items-end justify-between">
                    <p className="label">Subtotal</p>
                    <p className="font-display text-2xl font-bold tracking-wider" aria-live="polite">
                      {formatPrice(subtotal, { decimals: true })}
                    </p>
                  </div>
                  <p className="text-xs opacity-60">Shipping and taxes calculated at checkout.</p>
                  <Button variant="solid" href="/checkout" onClick={closeCart} className="w-full">
                    Checkout Now
                  </Button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
