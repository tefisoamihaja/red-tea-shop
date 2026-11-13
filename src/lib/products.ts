import { cacheLife, cacheTag } from "next/cache";
import type { Product } from "@/types";

// Catalog access. Moving to a database only means changing loadCatalog().
// The JSON is imported rather than read with fs, so Turbopack picks up edits in dev.

/** A product as stored: the public Product plus where it is shown on the home page */
type ProductRecord = Product & {
  /** Shown in "Featured Selection" (in file order) */
  featured?: boolean;
  /** Shown in "Top Sales" (the first one wins) */
  topSale?: boolean;
};

type Catalog = { categories: string[]; products: ProductRecord[] };

function isBrewing(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const b = value as Record<string, unknown>;
  return typeof b.amount === "string" && typeof b.temperature === "string" && typeof b.time === "string";
}

function isProductRecord(value: unknown): value is ProductRecord {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.slug === "string" &&
    typeof p.name === "string" &&
    typeof p.origin === "string" &&
    typeof p.category === "string" &&
    typeof p.image === "string" &&
    typeof p.price === "number" &&
    p.price >= 0 &&
    (p.description === undefined || typeof p.description === "string") &&
    (p.weight === undefined || typeof p.weight === "string") &&
    (p.notes === undefined || (Array.isArray(p.notes) && p.notes.every((n) => typeof n === "string"))) &&
    (p.brewing === undefined || isBrewing(p.brewing)) &&
    (p.featured === undefined || typeof p.featured === "boolean") &&
    (p.topSale === undefined || typeof p.topSale === "boolean")
  );
}

// Fail loudly on a malformed file (a typo in the JSON should break the build, not the page)
function parseCatalog(raw: unknown): Catalog {
  if (typeof raw !== "object" || raw === null) throw new Error("products.json: expected an object");
  const { categories, products } = raw as Record<string, unknown>;
  if (!Array.isArray(categories) || !categories.every((c) => typeof c === "string")) {
    throw new Error("products.json: `categories` must be a list of strings");
  }
  if (!Array.isArray(products)) throw new Error("products.json: `products` must be a list");
  products.forEach((p, i) => {
    if (!isProductRecord(p)) throw new Error(`products.json: invalid product at index ${i}`);
  });
  const slugs = new Set<string>();
  for (const { slug, category } of products as ProductRecord[]) {
    if (slugs.has(slug)) throw new Error(`products.json: duplicate slug "${slug}"`);
    if (!categories.includes(category)) {
      throw new Error(`products.json: unknown category "${category}" for "${slug}"`);
    }
    slugs.add(slug);
  }
  return { categories, products: products as ProductRecord[] };
}

async function loadCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  // TODO: replace with a database query
  const { default: raw }: { default: unknown } = await import("@/data/products.json");
  return parseCatalog(raw);
}

// Keep only the public fields (no home page flags sent to components)
function toProduct(record: ProductRecord): Product {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { featured, topSale, ...product } = record;
  return product;
}

export async function getProducts(): Promise<Product[]> {
  const { products } = await loadCatalog();
  return products.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { products } = await loadCatalog();
  const product = products.find((p) => p.slug === slug);
  return product ? toProduct(product) : null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { products } = await loadCatalog();
  return products.filter((p) => p.featured).map(toProduct);
}

export async function getTopSale(): Promise<Product | null> {
  const { products } = await loadCatalog();
  const product = products.find((p) => p.topSale);
  return product ? toProduct(product) : null;
}

/** Other products to suggest on a product page: same category first, then the rest */
export async function getRelatedProducts(slug: string, limit = 3): Promise<Product[]> {
  const products = await getProducts();
  const current = products.find((p) => p.slug === slug);
  const others = products.filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === current?.category);
  const rest = others.filter((p) => p.category !== current?.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export async function getCategories(): Promise<string[]> {
  const { categories } = await loadCatalog();
  return categories;
}
