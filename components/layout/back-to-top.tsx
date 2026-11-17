"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUp } from "lucide-react";

const SHOW_FROM = 480;

/** Fades in after scrolling; driven entirely by motion values so it never re-renders on scroll. */
export function BackToTop({ label }: { label: string }) {
  const { scrollY, scrollYProgress } = useScroll();
  const opacity = useTransform(scrollY, [SHOW_FROM - 120, SHOW_FROM], [0, 1]);
  const y = useTransform(scrollY, [SHOW_FROM - 120, SHOW_FROM], [16, 0]);
  const visibility = useTransform(scrollY, (value) => (value > SHOW_FROM - 120 ? "visible" : "hidden"));
  const ring = useTransform(scrollYProgress, (value) => `conic-gradient(var(--accent) ${value * 360}deg, transparent 0deg)`);

  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0 })}
      style={{ opacity, y, visibility, background: ring }}
      className="fixed right-4 bottom-4 z-40 grid size-12 place-items-center rounded-full p-0.5 shadow-lift sm:right-6 sm:bottom-6"
    >
      <span className="grid size-full place-items-center rounded-full bg-surface text-foreground transition-colors hover:text-accent">
        <ArrowUp aria-hidden className="size-5" />
      </span>
    </motion.button>
  );
}
