"use client";

import { useCart } from "@/hooks/useCart";

export function CartButton({ className }: { className?: string }) {
  const { count, openCart, isOpen } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      className={className}
    >
      Cart ({count})
    </button>
  );
}
