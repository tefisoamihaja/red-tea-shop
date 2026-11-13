import Image from "next/image";
import Link from "next/link";
import { AddToBagButton } from "@/components/cart/AddToBagButton";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

// Add to Bag sits outside the link: a button can't go inside a link.
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative">
      <Link href={`/shop/${product.slug}`} className="flex flex-col gap-6">
        <div className="relative aspect-[403/504] overflow-hidden rounded-panel transition-shadow duration-250 ease-out group-hover:shadow-card md:rounded-card">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1440px) 403px, (min-width: 1280px) 28vw, 45vw"
            className="object-cover"
          />
        </div>
        {/* Mobile: price under the name (narrow 2-column grid) */}
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold tracking-widest uppercase md:text-lg">{product.name}</h3>
            <p className="label opacity-70">{product.origin}</p>
          </div>
          <p className="font-display text-xl font-bold tracking-wider md:text-2xl">{formatPrice(product.price)}</p>
        </div>
      </Link>

      <AddToBagButton
        product={product}
        className="absolute top-3 left-1/2 -translate-x-1/2 px-4 whitespace-nowrap md:top-6 md:right-6 md:left-auto md:translate-x-0 md:px-6 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:focus-visible:opacity-100"
      />
    </div>
  );
}
