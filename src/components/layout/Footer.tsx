import { cacheLife } from "next/cache";
import Link from "next/link";
import { footerContactLinks, socialLinks } from "@/data/site";
import type { NavLink } from "@/types";
import { Reveal } from "@/components/ui/Reveal";

// `block`: no extra inline line box under each link
const footerLink = "label block transition-opacity duration-250 ease-out hover:opacity-60";

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="label font-bold">{title}</p>
      <ul className="flex flex-col gap-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className={footerLink}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Cache Components won't allow a raw clock read, so the year is cached for a day
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export function Footer() {
  return (
    <footer className="border-t border-tea-500/10">
      <Reveal className="mx-auto grid max-w-page grid-cols-2 gap-x-6 gap-y-12 px-6 py-16 md:px-10 xl:grid-cols-[1fr_288px_288px] xl:gap-16 xl:px-16 xl:py-20">
        <div className="col-span-2 flex flex-col gap-8 xl:col-span-1">
          <p className="font-display text-5xl font-black tracking-wider">XAY™</p>
          <div className="flex flex-col gap-3">
            <p className="label opacity-70">© <CurrentYear /> XAY Teahouse — All rights reserved.</p>
            <p className="label opacity-70">Developed by Tefy, designed by Sariaka</p>
          </div>
        </div>
        <FooterColumn title="Follow" links={socialLinks} />
        <FooterColumn title="Link" links={footerContactLinks} />
      </Reveal>
    </footer>
  );
}
