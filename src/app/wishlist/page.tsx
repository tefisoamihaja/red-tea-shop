import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { getProducts } from "@/lib/products";
import { WishlistView } from "./WishlistView";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Wishlist — XAY Teahouse",
};

export default async function WishlistPage() {
  const catalog = await getProducts();

  return (
    <div className="flex flex-col gap-16 px-6 pt-32 pb-40 md:px-10 xl:px-16 xl:pt-48">
      <PageHeader title="Wishlist" subtitle="Teas you saved for later" />
      <Reveal delay={0.15}>
        <WishlistView catalog={catalog} />
      </Reveal>
    </div>
  );
}
