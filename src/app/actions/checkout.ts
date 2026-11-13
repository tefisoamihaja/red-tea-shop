"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { MAX_LINES, MAX_QUANTITY } from "@/lib/cart";
import { getProducts } from "@/lib/products";
import { siteUrl } from "@/lib/site-url";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

// The browser only sends slugs and quantities: names and prices always come from the catalog.

export type CheckoutState = { error?: string };

// Where we ship: EU + a few neighbours
const SHIPPING_COUNTRIES = [
  "FR", "BE", "LU", "CH", "MC", "DE", "AT", "NL", "IT", "ES", "PT", "IE", "DK", "SE", "FI", "PL", "GB",
] as const;

function readCart(formData: FormData): { slug: string; quantity: number }[] {
  try {
    const raw: unknown = JSON.parse(String(formData.get("cart") ?? "[]"));
    if (!Array.isArray(raw)) return [];
    return raw
      .slice(0, MAX_LINES)
      .map((line) => ({
        slug: typeof line?.slug === "string" ? line.slug : "",
        quantity: Math.min(MAX_QUANTITY, Math.floor(Number(line?.quantity) || 0)),
      }))
      .filter((line) => line.slug && line.quantity > 0);
  } catch {
    return [];
  }
}

export async function startCheckout(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  if (!isStripeConfigured || !isSupabaseAdminConfigured) {
    return { error: "Payment is not available yet. Please try again later." };
  }

  const products = new Map((await getProducts()).map((product) => [product.slug, product]));
  const lines = readCart(formData).filter((line) => products.has(line.slug));
  if (lines.length === 0) return { error: "Your bag is empty or its products are no longer available." };

  const user = await getCurrentUser();
  const base = await siteUrl();

  let url: string | null;
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      locale: "en",
      line_items: lines.map(({ slug, quantity }) => {
        const product = products.get(slug)!;
        return {
          quantity,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(product.price * 100), // cents
            product_data: {
              name: product.name,
              description: product.origin,
              metadata: { slug: product.slug, origin: product.origin },
              // Stripe can't load images from localhost
              ...(base.startsWith("https://") ? { images: [`${base}${product.image}`] } : {}),
            },
          },
        };
      }),
      // Signed in: link the order to the account. Guests type their email on Stripe.
      ...(user ? { client_reference_id: user.id, customer_email: user.email } : {}),
      shipping_address_collection: { allowed_countries: [...SHIPPING_COUNTRIES] },
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout`,
    });
    url = session.url;
  } catch (error) {
    console.error("startCheckout failed:", error instanceof Error ? error.message : error);
    return { error: "We could not open the payment page. Please try again." };
  }

  if (!url) return { error: "We could not open the payment page. Please try again." };
  redirect(url);
}
