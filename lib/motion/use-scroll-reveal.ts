"use client";

import { stagger, useAnimate, useInView, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { EASE_OUT_EXPO, REVEAL_DURATION, hiddenState, visibleState, type RevealVariant } from "./variants";

type ScrollRevealOptions = {
  variant: RevealVariant;
  /** Fraction of the element that must be visible before it reveals. */
  amount: number;
  delay: number;
  /** When set, children marked `data-reveal-item` animate in sequence instead of the container. */
  staggerChildren?: number;
};

/**
 * Reveals an element every time it enters the viewport — scrolling down or up —
 * and resets it once it leaves, remembering which edge it left through.
 */
export function useScrollReveal<T extends HTMLElement>({ variant, amount, delay, staggerChildren }: ScrollRevealOptions) {
  const [scope, animate] = useAnimate<T>();
  const inView = useInView(scope, { amount });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = scope.current;
    if (!element) return;

    const targets = staggerChildren ? element.querySelectorAll<HTMLElement>("[data-reveal-item]") : element;

    if (inView || reduceMotion) {
      animate(targets, visibleState, {
        duration: reduceMotion ? 0 : REVEAL_DURATION,
        ease: EASE_OUT_EXPO,
        delay: staggerChildren ? stagger(staggerChildren, { startDelay: delay }) : delay,
      });
      return;
    }

    const exitedAbove = element.getBoundingClientRect().top < 0;
    animate(targets, hiddenState(variant, exitedAbove), { duration: 0 });
  }, [inView, reduceMotion, animate, scope, variant, delay, staggerChildren]);

  return scope;
}
