import { ProductCard } from "@/components/cards/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

export async function FeaturedSelection() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <section
      id="shop"
      className="flex scroll-mt-8 flex-col gap-12 px-6 py-24 md:gap-16 md:px-10 md:py-32 xl:gap-24 xl:px-16 xl:py-40"
    >
      <h2 className="heading max-w-104 text-5xl md:text-6xl">Featured Selection</h2>

      {/* Desktop: 3 columns, the third one shifted down */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-10 md:gap-y-16 xl:grid-cols-3 xl:gap-x-16">
        {featuredProducts.map((product, i) => (
          <li key={product.slug} className={i % 3 === 2 ? "xl:pt-32" : "xl:pb-32"}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
