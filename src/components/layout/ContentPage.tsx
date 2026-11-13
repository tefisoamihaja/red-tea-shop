import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

export type ContentSection = { title: string; body: ReactNode };

// Shipping, privacy and terms: title, intro, then numbered sections.
export function ContentPage({
  title,
  intro,
  updated,
  sections,
  children,
}: {
  title: ReactNode;
  intro: string;
  /** "Last updated" date, written out (e.g. "November 13, 2026") */
  updated?: string;
  sections: ContentSection[];
  /** Shown after the sections (e.g. a call to action) */
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-16 px-6 pt-32 pb-24 md:px-10 xl:gap-24 xl:px-16 xl:pt-48 xl:pb-40">
      <Reveal as="header" className="flex max-w-240 flex-col gap-6">
        <h1 className="heading text-6xl leading-[0.85] md:text-8xl xl:text-9xl">{title}</h1>
        <p className="max-w-150 text-sm leading-relaxed tracking-wide uppercase opacity-80">{intro}</p>
        {updated && <p className="label opacity-50">Last updated {updated}</p>}
      </Reveal>

      <ol className="border-b border-tea-500/10">
        {sections.map((section, i) => (
          <Reveal
            as="li"
            key={section.title}
            className="grid gap-4 border-t border-tea-500/10 py-10 md:grid-cols-[1fr_2fr] md:gap-12 xl:py-12"
          >
            <h2 className="flex gap-4 font-display text-2xl font-bold tracking-wider uppercase md:text-3xl">
              <span className="opacity-30">{String(i + 1).padStart(2, "0")}</span>
              {section.title}
            </h2>
            <div className="flex max-w-170 flex-col gap-4 text-base [&_a]:underline [&_a]:underline-offset-4 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6">
              {section.body}
            </div>
          </Reveal>
        ))}
      </ol>

      {children && <Reveal>{children}</Reveal>}
    </div>
  );
}
