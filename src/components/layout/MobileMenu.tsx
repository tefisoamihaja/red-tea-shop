"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { revealEase } from "@/components/ui/Reveal";
import { useDialog } from "@/hooks/useDialog";
import type { NavLink } from "@/types";

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const reduceMotion = useReducedMotion();
  useDialog(open, close, closeRef);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="flex size-10 flex-col items-end justify-center gap-1.5"
      >
        <span className="h-px w-6 bg-current" />
        <span className="h-px w-4 bg-current" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-30 flex flex-col bg-tea-500 px-6 py-6 text-white"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduceMotion ? 0.2 : 0.7, ease: revealEase }}
          >
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={close}
                className="font-display text-4xl leading-none font-black tracking-tighter"
              >
                XAY
              </Link>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="label font-medium transition-opacity duration-250 ease-out hover:opacity-60"
              >
                Close
              </button>
            </div>

            <ul className="flex flex-1 flex-col justify-center gap-6">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: revealEase, delay: reduceMotion ? 0 : 0.25 + i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={close}
                    className="heading text-5xl transition-opacity duration-250 ease-out hover:opacity-60"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
