import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

// Register and Sign In layout: big title on the left, form card on the right.
type AuthSplitProps = {
  /** Big left title; use <br /> to control line breaks */
  title: ReactNode;
  intro: string;
  cardTitle: string;
  cardSubtitle: string;
  children: ReactNode;
};

export function AuthSplit({ title, intro, cardTitle, cardSubtitle, children }: AuthSplitProps) {
  return (
    <div className="grid grid-cols-1 pt-32 xl:grid-cols-2">
      <Reveal className="flex flex-col justify-center gap-6 px-6 pt-8 md:px-10 xl:gap-8 xl:border-r xl:border-tea-500/10 xl:px-16 xl:pt-0">
        <h1 className="heading text-5xl leading-[0.85] md:text-8xl">{title}</h1>
        <p className="max-w-80 text-sm leading-relaxed font-light tracking-wide uppercase">{intro}</p>
      </Reveal>

      <div className="flex items-center justify-center px-6 py-16 md:px-10 xl:px-16 xl:py-40">
        <Reveal delay={0.15} className="flex w-full max-w-140 flex-col gap-10 rounded-panel bg-white px-8 pt-10 pb-12 shadow-xs md:gap-16 md:rounded-card md:px-16 md:pt-16 md:pb-20">
          <header className="flex flex-col gap-2">
            <h2 className="heading text-5xl leading-none">{cardTitle}</h2>
            <p className="label opacity-60">{cardSubtitle}</p>
          </header>
          {children}
        </Reveal>
      </div>
    </div>
  );
}
