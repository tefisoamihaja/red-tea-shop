import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/public-site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/checkout", "/auth/", "/api/", "/reset-password/update", "/wishlist"],
    },
    sitemap: `${publicSiteUrl}/sitemap.xml`,
  };
}
