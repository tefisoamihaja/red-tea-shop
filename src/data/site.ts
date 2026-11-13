import type { NavLink } from "@/types";

export const mainNav = {
  left: [
    { label: "Shop", href: "/shop" },
    { label: "Philosophy", href: "/philosophy" },
  ] satisfies NavLink[],
  // Signed out, /account redirects to /identify
  account: { label: "Account", href: "/account" } satisfies NavLink,
};

export const contact = {
  email: "hello@xayteahouse.com",
  address: "42 Rue du Thé, Paris 75003",
  hours: "Tue — Sun, 10:00 — 19:00",
  mapUrl: "https://maps.google.com/?q=42+Rue+du+Th%C3%A9+Paris+75003",
};

export const instagramUrl = "https://instagram.com";

export const socialLinks: NavLink[] = [
  { label: "Instagram", href: instagramUrl },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

export const footerContactLinks: NavLink[] = [
  { label: "Inquiry", href: `mailto:${contact.email}` },
  { label: "Shipping", href: "/shipping" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
