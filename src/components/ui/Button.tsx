import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Hover transitions are 250ms ease-out, like the Smart Animate of the Figma.
// outline (default) · solid · white and link (for red backgrounds)
// Sizes: sm (Reorder) · md (default) · wide (Reset Password) · lg (default for solid)
export type ButtonVariant = "outline" | "solid" | "white" | "link";
export type ButtonSize = "sm" | "md" | "wide" | "lg";

const base =
  "inline-flex items-center justify-center uppercase transition duration-250 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  outline: "border-tea-500 bg-transparent text-tea-500 hover:bg-tea-500 hover:text-white",
  solid: "border-tea-500 bg-tea-500 text-white hover:border-tea-700 hover:bg-tea-700",
  white: "border-white bg-white text-tea-500 hover:border-blush-100 hover:bg-blush-100",
  link: "font-display text-xl font-bold tracking-wider text-paper-500 hover:opacity-55",
};

// Shape + padding + type of the pill buttons, without the font weight
const sizes: Record<ButtonSize, string> = {
  sm: "px-8 py-3.25 text-xs",
  md: "px-10 py-4 text-sm",
  wide: "px-16 py-4 text-sm",
  lg: "px-10 py-6 text-md",
};

const weights: Record<ButtonSize, string> = {
  sm: "font-normal",
  md: "font-semibold",
  wide: "font-semibold",
  lg: "font-black",
};

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

// href → Next <Link>, otherwise <button>
type ButtonAsButton = ButtonOwnProps &
  ComponentProps<"button"> & { href?: undefined };
type ButtonAsLink = ButtonOwnProps & ComponentProps<typeof Link>;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = "outline", size, className, ...props }: ButtonProps) {
  let classes: string;
  if (variant === "link") {
    classes = cn(base, variants.link, className);
  } else {
    const s = size ?? (variant === "solid" ? "lg" : "md");
    // "Read Our Story" (white) uses a regular weight in the Figma
    const weight = variant === "white" ? "font-normal" : weights[s];
    classes = cn(base, "rounded-full border tracking-label", sizes[s], weight, variants[variant], className);
  }

  if (props.href !== undefined) {
    return <Link {...(props as ComponentProps<typeof Link>)} className={classes} />;
  }

  const { type = "button", ...buttonProps } = props as ComponentProps<"button">;
  return <button type={type} {...buttonProps} className={classes} />;
}
