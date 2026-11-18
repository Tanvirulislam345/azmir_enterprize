"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type ClipRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

// Fully revealed state overshoots the box so tilted or lifted children are never clipped.
const HIDDEN = { clipPath: "inset(110% -10% -10% -10%)", scale: 1.06 };
const VISIBLE = { clipPath: "inset(-10% -10% -10% -10%)", scale: 1 };

/**
 * Wipes its content up from the bottom edge (with a slight settle in scale) whenever it enters
 * the viewport, and resets once it leaves so the reveal replays in either scroll direction.
 */
export function ClipReveal({ children, className, delay = 0, amount = 0.25 }: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={ref} className={cn("h-full", className)}>
      <motion.div
        initial={HIDDEN}
        animate={inView || reduceMotion ? VISIBLE : HIDDEN}
        transition={{
          duration: reduceMotion ? 0 : inView ? 1.1 : 0,
          ease: EASE_OUT_EXPO,
          delay: inView && !reduceMotion ? delay : 0,
        }}
        className="h-full will-change-[clip-path]"
      >
        {children}
      </motion.div>
    </div>
  );
}
