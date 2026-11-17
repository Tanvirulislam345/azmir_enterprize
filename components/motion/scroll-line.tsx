"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** A progress line that draws while its container scrolls through the viewport, and un-draws on the way back. */
export function ScrollLine({ className, orientation = "horizontal" }: { className?: string; orientation?: "horizontal" | "vertical" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const isHorizontal = orientation === "horizontal";

  return (
    <div ref={ref} aria-hidden className={cn("overflow-hidden rounded-full bg-border", className)}>
      <motion.div
        style={isHorizontal ? { scaleX: progress } : { scaleY: progress }}
        className={cn("h-full w-full bg-accent", isHorizontal ? "origin-left" : "origin-top")}
      />
    </div>
  );
}
