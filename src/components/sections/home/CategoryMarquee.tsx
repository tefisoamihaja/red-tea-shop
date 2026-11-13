"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";

// Two identical halves, so the loop is seamless.
export function CategoryMarquee({ categories }: { categories: string[] }) {
  const reduceMotion = useReducedMotion();
  const items = [...categories, ...categories];

  const half = (key: string) => (
    <div key={key} className="flex shrink-0 items-center gap-8 pr-8 md:gap-16 md:pr-16" aria-hidden={key === "b"}>
      {items.map((category, i) => (
        <Fragment key={i}>
          <span className="heading text-5xl leading-normal md:text-6xl xl:text-7xl">{category}</span>
          <span className="heading text-5xl leading-normal opacity-20 md:text-6xl xl:text-7xl">•</span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <section className="overflow-hidden border-y border-tea-500/10 py-8 md:py-12 xl:py-16">
      <motion.div
        className="flex w-max"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {half("a")}
        {half("b")}
      </motion.div>
    </section>
  );
}
