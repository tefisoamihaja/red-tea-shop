import type { Metadata } from "next";
import { Big_Shoulders, Inter } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { CartProvider } from "@/hooks/useCart";
import { publicSiteUrl } from "@/lib/public-site-url";
import { WishlistProvider } from "@/hooks/useWishlist";
import "./globals.css";

// Titles. The opsz axis gives the narrow "Display" cut (see globals.css).
const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  axes: ["opsz"],
});

// Body text (italic is used by the testimonials)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(publicSiteUrl),
  title: "XAY Teahouse — Red Tea Shop",
  description: "Pure red tea, curated by XAY Teahouse.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${inter.variable} h-full antialiased`}
      // Browser extensions add attributes to <html>
      suppressHydrationWarning
    >
      <body className="relative flex min-h-full flex-col">
        <CartProvider>
          <WishlistProvider>
            <Nav />
            <main className="mx-auto w-full max-w-page flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
