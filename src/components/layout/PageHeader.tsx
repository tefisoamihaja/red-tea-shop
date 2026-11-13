import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

export function PageHeader({
  title,
  subtitle,
  children,
  titleClassName = "text-5xl md:text-7xl xl:text-8xl",
}: {
  title: ReactNode;
  subtitle?: string;
  /** Extra lines under the subtitle */
  children?: ReactNode;
  /** Title sizes (responsive) */
  titleClassName?: string;
}) {
  return (
    <Reveal as="header" className="flex flex-col gap-4">
      <h1 className={cn("heading leading-[0.85]", titleClassName)}>{title}</h1>
      {subtitle && <p className="label opacity-60">{subtitle}</p>}
      {children}
    </Reveal>
  );
}
