import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

const items = [
  { label: "Order History", href: "#orders" },
  { label: "Addresses", href: "#addresses" },
  { label: "Settings", href: "#settings" },
  { label: "Wishlist", href: "/wishlist" },
];

export function AccountNav() {
  return (
    <nav aria-label="Account" className="self-start xl:sticky xl:top-8">
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="group flex items-center justify-between border-b border-tea-500/10 pb-4 text-sm font-semibold tracking-ultra uppercase"
            >
              {item.label}
              <ArrowRightIcon className="size-3.5 transition-transform duration-250 ease-out group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
