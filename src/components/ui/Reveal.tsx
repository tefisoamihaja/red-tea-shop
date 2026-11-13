"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export const revealEase = [0.22, 1, 0.36, 1] as const;
export const revealDuration = 1.1;

const tags = { div: motion.div, li: motion.li, header: motion.header, section: motion.section } as const;

// Fades and rises into place the first time it scrolls into view.
// `delay` (seconds) staggers siblings. Reduced motion: a quick fade only.
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  ...attributes
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof typeof tags;
  id?: string;
  "aria-labelledby"?: string;
}) {
  const reduceMotion = useReducedMotion();
  const Tag = tags[as];

  return (
    <Tag
      {...attributes}
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={reduceMotion ? { duration: 0.2 } : { duration: revealDuration, ease: revealEase, delay }}
    >
      {children}
    </Tag>
  );
}
