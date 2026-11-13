"use client";

import { HeartIcon } from "@/components/ui/icons";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

export function WishlistButton({ product, className }: { product: Product; className?: string }) {
  const { has, toggle, ready } = useWishlist();
  const saved = ready && has(product.slug);

  return (
    <button
      type="button"
      onClick={() => toggle(product)}
      aria-pressed={saved}
      className={cn("label link-fade inline-flex items-center gap-3", className)}
    >
      <HeartIcon filled={saved} className="size-5" />
      {saved ? "Saved to Wishlist" : "Save to Wishlist"}
    </button>
  );
}
