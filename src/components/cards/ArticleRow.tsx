"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { formatDate } from "@/lib/format";
import type { Article } from "@/types";

// Hovering, tapping or focusing the question shows its answer in a popup.
export function ArticleRow({ article }: { article: Article }) {
  const [open, setOpen] = useState(false);
  const pointerType = useRef<string>("mouse");
  const rowRef = useRef<HTMLLIElement>(null);
  const reduceMotion = useReducedMotion();
  const answerId = useId();

  // Escape, or a tap outside the row, closes the popup
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rowRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <li
      ref={rowRef}
      className={`relative border-t border-tea-500/10 transition-colors duration-250 ease-out hover:bg-blush-50 ${open ? "z-10 bg-blush-50" : ""}`}
    >
      <div className="flex flex-col items-start gap-2 py-6 md:flex-row md:items-center md:gap-0 md:py-8">
        <time dateTime={article.date} className="shrink-0 md:w-40 xl:w-55 text-xs tracking-widest uppercase opacity-50">
          {formatDate(article.date)}
        </time>

        <div className="relative">
          <h3>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={answerId}
              className="cursor-help text-left font-display text-2xl font-semibold tracking-wider uppercase md:text-3xl xl:text-4xl"
              onPointerDown={(e) => (pointerType.current = e.pointerType)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
              onFocus={(e) => e.currentTarget.matches(":focus-visible") && setOpen(true)}
              onBlur={() => setOpen(false)}
              // Touch: tap toggles (mouse already opened it on hover)
              onClick={() => pointerType.current !== "mouse" && setOpen((v) => !v)}
            >
              {article.title}
            </button>
          </h3>

          <AnimatePresence>
            {open && (
              <motion.div
                id={answerId}
                role="note"
                className="pointer-events-none absolute top-full left-0 z-20 mt-4 w-88 rounded-panel bg-tea-500 p-8 text-white shadow-card md:w-120"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <p className="label pb-4 opacity-60">The answer</p>
                <p className="text-base">{article.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </li>
  );
}
