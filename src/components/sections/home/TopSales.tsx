import Image from "next/image";
import Link from "next/link";
import { AddToBagButton } from "@/components/cart/AddToBagButton";
import { ArrowRightIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import { getTopSale } from "@/lib/products";

export async function TopSales() {
  const product = await getTopSale();
  if (!product) return null;

  return (
    <section className="flex flex-col gap-12 px-6 py-24 md:gap-16 md:px-10 md:py-32 xl:gap-24 xl:px-16 xl:py-40">
      <h2 className="heading text-center text-6xl md:text-8xl xl:text-9xl">Top Sales</h2>

      <div className="flex flex-col gap-10 xl:flex-row xl:items-center xl:gap-24">
        <div className="relative aspect-[743/418] w-full shrink-0 overflow-hidden rounded-panel md:rounded-card xl:w-[56%]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1440px) 743px, (min-width: 1280px) 56vw, 100vw"
            className="object-contain"
          />
          <span className="absolute right-4 bottom-4 rounded-full bg-white/80 px-6 md:right-8 md:bottom-8 md:px-8 py-2 text-xs tracking-widest uppercase backdrop-blur-md">
            Limited Edition
          </span>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <h3 className="font-display text-4xl font-bold md:text-5xl tracking-wider uppercase">{product.name}</h3>
            <p className="text-2xl font-light opacity-60 md:text-3xl">{formatPrice(product.price)}</p>
          </div>
          <p className="text-base tracking-wide uppercase opacity-80">{product.description}</p>
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
            <AddToBagButton product={product} variant="outline" />
            <Link href={`/shop/${product.slug}`} className="group flex items-center gap-4">
              <span className="text-base font-semibold tracking-ultra uppercase">Shop Now</span>
              <span className="flex size-13 items-center justify-center rounded-full border border-tea-500 transition-colors duration-250 ease-out group-hover:bg-tea-500 group-hover:text-white">
                <ArrowRightIcon className="size-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
