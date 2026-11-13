import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Address, Order, OrderStatus } from "@/types";

// RLS only returns the signed-in customer's orders. Reads cookies: call it inside <Suspense>.

const STATUSES: OrderStatus[] = ["Processing", "Shipped", "Delivered", "Archived"];

type OrderRow = {
  id: string;
  number: string;
  created_at: string;
  status: string;
  total: number | string;
  order_items: {
    product_slug: string;
    product_name: string;
    origin: string;
    unit_price: number | string;
    quantity: number;
  }[];
};

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    number: row.number,
    date: row.created_at,
    // numeric columns can come back as strings: always convert
    total: Number(row.total),
    status: STATUSES.includes(row.status as OrderStatus) ? (row.status as OrderStatus) : "Processing",
    items: row.order_items.map((item) => ({
      productSlug: item.product_slug,
      productName: item.product_name,
      origin: item.origin,
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
    })),
  };
}

/** Newest first. null = could not load (e.g. migration not run yet). */
export async function getMyOrders({ limit }: { limit?: number } = {}): Promise<Order[] | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("id, number, created_at, status, total, order_items (product_slug, product_name, origin, unit_price, quantity)")
    .order("created_at", { ascending: false })
    .order("id", { referencedTable: "order_items", ascending: true });
  if (limit) query = query.limit(limit);

  const { data, error } = await query.overrideTypes<OrderRow[], { merge: false }>();
  if (error) {
    console.error("getMyOrders failed:", error.code, error.message);
    return null;
  }
  return data.map(toOrder);
}

// Shipping address saved by Stripe Checkout (orders.shipping)
type ShippingDetails = {
  name?: string | null;
  address?: {
    line1?: string | null;
    line2?: string | null;
    postal_code?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
  } | null;
};

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryName(code: string) {
  try {
    return countryNames.of(code) ?? code;
  } catch {
    return code;
  }
}

function toAddress(shipping: ShippingDetails, id: string): Address | null {
  const a = shipping.address;
  if (!a?.line1) return null;
  const cityLine = [a.postal_code, a.city].filter(Boolean).join(" ");
  const lastLine = [cityLine, a.state, a.country ? countryName(a.country) : null].filter(Boolean).join(", ");
  return {
    id,
    label: shipping.name?.trim() || "Shipping Address",
    lines: [a.line1, a.line2, lastLine].filter((line): line is string => Boolean(line)),
  };
}

/** Distinct shipping addresses from past orders, newest first. null = could not load. */
export async function getMyShippingAddresses({ limit = 4 }: { limit?: number } = {}): Promise<Address[] | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, shipping")
    .not("shipping", "is", null)
    .order("created_at", { ascending: false })
    .limit(50)
    .overrideTypes<{ id: string; shipping: ShippingDetails }[], { merge: false }>();
  if (error) {
    console.error("getMyShippingAddresses failed:", error.code, error.message);
    return null;
  }

  const seen = new Set<string>();
  const addresses: Address[] = [];
  for (const row of data) {
    const address = toAddress(row.shipping, row.id);
    if (!address) continue;
    const key = [address.label, ...address.lines].join("|").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    addresses.push(address);
    if (addresses.length === limit) break;
  }
  return addresses;
}
