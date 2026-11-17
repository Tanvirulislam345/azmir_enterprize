"use client";

import { motion } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type AnimatedHeadingProps = {
  text: string;
  className?: string;
  delay?: number;
};

/** Page-load headline: each word rises out of a mask in sequence. */
export function AnimatedHeading({ text, className, delay = 0.1 }: AnimatedHeadingProps) {
  const words = text.split(" ");

  return (
    <h1 className={cn(className)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden py-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: delay + index * 0.06 }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 && " "}
        </span>
      ))}
    </h1>
  );
}
