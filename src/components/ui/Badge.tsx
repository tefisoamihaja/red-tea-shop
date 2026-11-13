import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// outline: order status · strong: status in the archive (border = text color) · solid: address tag
const variants = {
  outline: "rounded-full border border-tea-500/20 px-3.25 py-1 tracking-widest",
  strong: "rounded-full border border-current px-3.25 py-0.5 tracking-widest",
  solid: "rounded-xs bg-tea-500 px-2 py-0.5 tracking-ultra text-white",
};

export function Badge({
  children,
  variant = "outline",
  className,
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center text-2xs uppercase", variants[variant], className)}>
      {children}
    </span>
  );
}
