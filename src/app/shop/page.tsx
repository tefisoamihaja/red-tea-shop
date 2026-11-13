import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { getCategories, getProducts } from "@/lib/products";
import { ProductGrid, ShopGrid } from "./ShopGrid";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Shop — XAY Teahouse",
  description: "Every tea of the XAY collection: red tea, green tea and oolong from single estates.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="flex flex-col gap-12 px-6 pt-32 pb-24 md:px-10 xl:gap-16 xl:px-16 xl:pt-48 xl:pb-40">
      <PageHeader
        title="The Collection"
        subtitle="Single-estate teas, hand-picked"
        titleClassName="text-5xl md:text-8xl xl:text-9xl"
      />

      {/* Until the URL is read, show every tea */}
      <Reveal delay={0.15}>
        <Suspense fallback={<ProductGrid products={products} />}>
          <ShopGrid products={products} categories={categories} />
        </Suspense>
      </Reveal>
    </div>
  );
}
