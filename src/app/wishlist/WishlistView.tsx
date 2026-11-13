"use client";

import Link from "next/link";
import { ProductThumb } from "@/components/cards/ProductThumb";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

export function WishlistView({ catalog }: { catalog: Product[] }) {
  const { items, ready, remove } = useWishlist();
  const { addItem } = useCart();

  if (!ready) return <div className="min-h-80" aria-busy="true" />;

  // Keep only teas still sold, with today's price
  const products = items
    .map((item) => catalog.find((p) => p.slug === item.slug))
    .filter((p): p is Product => p !== undefined);

  if (products.length === 0) {
    return (
      <EmptyState>Your wishlist is empty. Save a tea from its page to keep it here.</EmptyState>
    );
  }

  return (
    <ul className="border-t border-tea-500/10">
      {products.map((product) => (
        <li key={product.slug} className="flex flex-wrap items-center gap-6 border-b border-tea-500/10 py-6">
          <ProductThumb slug={product.slug} image={product.image} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Link href={`/shop/${product.slug}`} className="link-fade text-sm font-semibold tracking-widest uppercase">
              {product.name}
            </Link>
            <p className="label opacity-70">{product.origin}</p>
          </div>
          <p className="font-display text-xl font-bold tracking-wider">{formatPrice(product.price)}</p>
          <div className="flex items-center gap-8">
            <button type="button" className="label link-fade" onClick={() => remove(product.slug)}>
              Remove
            </button>
            <Button size="sm" onClick={() => addItem(product)}>
              Add to Bag
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
