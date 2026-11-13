import type { Metadata } from "next";
import type { ComponentType, SVGProps } from "react";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { GhostIcon, SparklesIcon, UserScanIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Identify Yourself — XAY Teahouse",
};

type Path = {
  title: string;
  text: string;
  cta: string;
  href: string;
  variant: ButtonVariant;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const paths: Path[] = [
  {
    title: "Returning",
    text: "Welcome back. Sign in to access your saved blends and order history.",
    cta: "Sign In",
    href: "/sign-in",
    variant: "outline",
    Icon: UserScanIcon,
  },
  {
    title: "New Client",
    text: "Join our circle for exclusive seasonal harvests and faster checkout.",
    cta: "Create Account",
    href: "/register",
    variant: "solid",
    Icon: SparklesIcon,
  },
  {
    title: "Visitor",
    text: "Proceed without an account. You can always join the list later.",
    cta: "Guest Checkout",
    href: "/checkout",
    variant: "outline",
    Icon: GhostIcon,
  },
];

export default function IdentifyPage() {
  return (
    <div className="flex flex-col items-center px-6 pt-32 pb-24 md:px-10 xl:px-16 xl:pt-48 xl:pb-32">
      <Reveal as="header" className="flex flex-col items-center gap-6 pb-16 text-center xl:pb-24">
        <h1 className="heading text-5xl leading-none md:text-7xl">Identify Yourself</h1>
        <p className="text-sm tracking-ultra uppercase opacity-70">Choose your path to the ceremony</p>
      </Reveal>

      <ul className="grid w-full max-w-[1200px] gap-6 md:max-w-140 xl:max-w-[1200px] xl:grid-cols-3 xl:gap-8">
        {paths.map(({ title, text, cta, href, variant, Icon }, i) => (
          <Reveal
            as="li"
            delay={0.12 * i}
            key={title}
            className="flex flex-col items-center rounded-panel border border-tea-500/10 bg-white p-8 text-center md:rounded-card xl:p-12"
          >
            <span className="mb-8 flex size-20 items-center justify-center rounded-full bg-paper-500">
              <Icon className="size-10" />
            </span>
            <h2 className="pb-4 font-display text-4xl font-bold tracking-wider uppercase">{title}</h2>
            {/* text-sm would wrap to 3 lines */}
            <p className="flex-1 px-3 pb-10 xl:pb-14 text-xs leading-relaxed tracking-wide uppercase opacity-60">
              {text}
            </p>
            <Button href={href} variant={variant} size="md" className="w-full">
              {cta}
            </Button>
          </Reveal>
        ))}
      </ul>

      <p className="flex items-center gap-4 pt-16 xl:pt-24">
        <span className="h-px w-16 bg-tea-500/20" />
        <span className="text-2xs font-medium tracking-ultra uppercase opacity-40">
          Secure Encrypted Protocol
        </span>
        <span className="h-px w-16 bg-tea-500/20" />
      </p>
    </div>
  );
}
