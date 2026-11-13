import Link from "next/link";
import { CartButton } from "@/components/cart/CartButton";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { mainNav } from "@/data/site";

const navLink = "label font-medium transition-opacity duration-250 ease-out hover:opacity-60";

// Mobile: logo, cart and burger. From md: the 3-column bar.
export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-page items-center justify-between px-6 py-6 md:grid md:grid-cols-3 md:px-10 xl:px-16 xl:py-8">
        <ul className="hidden items-center gap-12 md:flex">
          {mainNav.left.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={navLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/"
          className="font-display text-4xl leading-none font-black tracking-tighter md:justify-self-center"
        >
          XAY
        </Link>

        <ul className="flex items-center gap-6 md:justify-self-end md:gap-12">
          <li className="hidden md:block">
            <Link href={mainNav.account.href} className={navLink}>
              {mainNav.account.label}
            </Link>
          </li>
          <li>
            <CartButton className={`${navLink} normal-case`} />
          </li>
          <li className="md:hidden">
            <MobileMenu links={[...mainNav.left, mainNav.account]} />
          </li>
        </ul>
      </nav>
    </header>
  );
}
