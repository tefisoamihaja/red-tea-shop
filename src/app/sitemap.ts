import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { publicSiteUrl } from "@/lib/public-site-url";

const pages = ["", "/shop", "/philosophy", "/shipping", "/privacy", "/terms"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    ...pages.map((path) => ({ url: `${publicSiteUrl}${path}` })),
    ...products.map(({ slug }) => ({ url: `${publicSiteUrl}/shop/${slug}` })),
  ];
}
