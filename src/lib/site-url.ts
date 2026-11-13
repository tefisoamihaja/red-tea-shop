import "server-only";
import { headers } from "next/headers";

// Base URL for links that leave the site (emails, Stripe return pages).
// Set NEXT_PUBLIC_SITE_URL in production; in dev we fall back to the request host.
export async function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocol =
    h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "development" ? "http" : "https");
  return `${protocol}://${host}`;
}
