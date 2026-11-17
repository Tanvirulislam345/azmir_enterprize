"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Distance travelled (in %) while the element scrolls out of view. */
  distance?: number;
};

export function Parallax({ children, className, distance = 18 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Same style shape on server and client (avoids hydration mismatch); reduced motion just pins it at 0.
  const y = useTransform(scrollYProgress, (progress) => `${reduceMotion ? 0 : progress * distance}%`);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
