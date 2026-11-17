"use client";

import type { ReactNode } from "react";
import { useScrollReveal } from "@/lib/motion/use-scroll-reveal";
import { initialRevealStyle, type RevealVariant } from "@/lib/motion/variants";

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  amount?: number;
};

/** Animates its content into view on scroll in both directions. */
export function Reveal({ children, className, variant = "up", delay = 0, amount = 0.2 }: RevealProps) {
  const scope = useScrollReveal<HTMLDivElement>({ variant, amount, delay });

  return (
    <div ref={scope} data-reveal className={className} style={initialRevealStyle(variant)}>
      {children}
    </div>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
};

/** Staggers the reveal of every descendant `RevealItem`. */
export function RevealGroup({ children, className, stagger = 0.08, delay = 0, amount = 0.15 }: RevealGroupProps) {
  const scope = useScrollReveal<HTMLDivElement>({ variant: "up", amount, delay, staggerChildren: stagger });

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-reveal-item className={className} style={initialRevealStyle("up")}>
      {children}
    </div>
  );
}
