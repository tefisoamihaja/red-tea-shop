"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/cards/ProductCard";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-10 md:gap-y-16 xl:grid-cols-3 xl:gap-x-16">
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

const tab =
  "inline-block rounded-full border px-6 py-2.5 text-xs tracking-widest uppercase transition-colors duration-250 ease-out";

export function ShopGrid({ products, categories }: { products: Product[]; categories: string[] }) {
  const requested = useSearchParams().get("category");
  const active = requested && categories.includes(requested) ? requested : null;
  const shown = active ? products.filter((p) => p.category === active) : products;

  return (
    <div className="flex flex-col gap-12 xl:gap-16">
      <nav aria-label="Categories">
        <ul className="flex flex-wrap gap-x-3 gap-y-4">
          {[null, ...categories].map((category) => {
            const selected = category === active;
            return (
              <li key={category ?? "all"}>
                <Link
                  href={category ? `/shop?category=${encodeURIComponent(category)}` : "/shop"}
                  scroll={false}
                  aria-current={selected ? "page" : undefined}
                  className={cn(
                    tab,
                    selected
                      ? "border-tea-500 bg-tea-500 text-white"
                      : "border-tea-500/20 hover:border-tea-500",
                  )}
                >
                  {category ?? "All Teas"}
                  <span className="pl-2 opacity-60">
                    {category ? products.filter((p) => p.category === category).length : products.length}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <ProductGrid products={shown} />
    </div>
  );
}
