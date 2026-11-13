import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/cards/ProductCard";
import { ProductPurchase } from "@/components/cart/ProductPurchase";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/format";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/products";
import { Reveal } from "@/components/ui/Reveal";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not Found — XAY Teahouse" };
  return {
    title: `${product.name} — XAY Teahouse`,
    description: product.description ?? `${product.name}, ${product.origin}. ${product.category} by XAY Teahouse.`,
  };
}

const crumbLink = "transition-opacity duration-250 ease-out hover:opacity-60";

// Read the slug outside Suspense so an unknown slug gets a real 404 (inside it would be a 200).
export const instant = false;

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(slug);

  return (
    <div className="flex flex-col gap-24 px-6 pt-32 pb-24 md:px-10 xl:gap-40 xl:px-16 xl:pt-48 xl:pb-40">
      <div className="flex flex-col gap-10">
        <nav aria-label="Breadcrumb" className="label flex flex-wrap gap-3 opacity-60">
          <Link href="/shop" className={crumbLink}>
            Shop
          </Link>
          <span aria-hidden>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className={crumbLink}>
            {product.category}
          </Link>
          <span aria-hidden>/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <Reveal className="grid gap-12 md:grid-cols-2 md:gap-10 xl:gap-24">
          <div className="relative aspect-[403/504] overflow-hidden rounded-panel bg-paper-500 md:rounded-card">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1440px) 634px, (min-width: 1280px) 44vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-10 md:sticky md:top-8 md:self-start xl:pt-8">
            <header className="flex flex-col gap-4">
              <p className="label opacity-70">
                {product.category} · {product.origin}
              </p>
              <h1 className="heading text-6xl leading-none md:text-7xl">{product.name}</h1>
              <p className="flex items-baseline gap-4">
                <span className="font-display text-4xl font-bold tracking-wider">{formatPrice(product.price)}</span>
                {product.weight && <span className="label opacity-60">{product.weight}</span>}
              </p>
            </header>

            {product.description && <p className="max-w-150 text-base">{product.description}</p>}

            {product.notes && product.notes.length > 0 && (
              <div className="flex flex-col gap-4">
                <p className="label opacity-60">Tasting Notes</p>
                <ul className="flex flex-wrap gap-3">
                  {product.notes.map((note) => (
                    <li key={note}>
                      <Badge className="px-4 py-2 text-xs">{note}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ProductPurchase product={product} />

            {product.brewing && (
              <div className="flex flex-col gap-4 border-t border-tea-500/10 pt-8">
                <p className="label opacity-60">Brewing Ritual</p>
                <dl className="grid grid-cols-3 gap-4">
                  {(
                    [
                      ["Leaves", product.brewing.amount],
                      ["Water", product.brewing.temperature],
                      ["Steep", product.brewing.time],
                    ] as const
                  ).map(([term, value]) => (
                    <div key={term} className="flex flex-col gap-1">
                      <dt className="text-2xs tracking-ultra uppercase opacity-60">{term}</dt>
                      <dd className="font-display text-lg font-bold tracking-wider uppercase md:text-xl">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <ul className="flex flex-col gap-2 border-t border-tea-500/10 pt-8 text-xs tracking-wide uppercase opacity-70">
              <li>Free shipping in the EU, Switzerland and the UK</li>
              <li>Secure payment with Stripe</li>
              <li>
                Returns within 14 days ·{" "}
                <Link href="/shipping" className="underline underline-offset-4 hover:opacity-60">
                  Shipping &amp; Returns
                </Link>
              </li>
            </ul>
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <Reveal as="section" className="flex flex-col gap-12 xl:gap-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="heading text-5xl md:text-6xl">You May Also Like</h2>
            <Link href="/shop" className="label pb-2 transition-opacity duration-250 ease-out hover:opacity-60">
              View All Teas
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-10 xl:grid-cols-3 xl:gap-x-16">
            {related.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </div>
  );
}
