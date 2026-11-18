"use client";

import { motion } from "motion/react";
import { Truck } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A dashed road with a truck that drives along it once when it scrolls into view, drawing an accent trail behind it.
 * With reduced motion (`MotionConfig reducedMotion="user"`) it simply appears at the end of the road.
 */
export function RoadTruck() {
  return (
    <div aria-hidden className="relative h-10">
      <span className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-white/35" />
      <motion.div
        className="relative h-full"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2.2, ease: EASE, delay: 0.4 }}
      >
        <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-accent" />
        <span className="absolute top-1/2 right-0 grid size-10 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-accent-foreground shadow-lift ring-4 ring-black/30">
          <Truck className="size-5" />
        </span>
      </motion.div>
    </div>
  );
}
