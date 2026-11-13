"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

// pill: over a product image · outline: Top Sales
export function AddToBagButton({
  product,
  variant = "pill",
  className,
}: {
  product: Product;
  variant?: "pill" | "outline";
  className?: string;
}) {
  const { addItem } = useCart();
  const label = `Add ${product.name} to bag`;

  if (variant === "outline") {
    return (
      <Button onClick={() => addItem(product)} aria-label={label} className={className}>
        Add to Bag
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      aria-label={label}
      className={cn(
        "rounded-full bg-white/80 px-6 py-2 text-xs tracking-widest uppercase backdrop-blur-md transition duration-250 ease-out hover:bg-tea-500 hover:text-white",
        className,
      )}
    >
      Add to Bag
    </button>
  );
}
