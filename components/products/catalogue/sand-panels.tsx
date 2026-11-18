"use client";

import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";
import { ProductMedia } from "@/components/products/product-media";

export type SandPanelItem = {
  id: string;
  href: string;
  name: string;
  image?: string;
  index: string;
};

type SandPanelsProps = {
  items: SandPanelItem[];
  viewDetails: string;
};

const ENTRANCE_STAGGER = 0.12;

const panelVariants: Variants = {
  hidden: { x: 120, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

/**
 * Sand chapter: tall photo panels side by side on desktop.
 * Entrance runs right to left (the last panel arrives first, panel 01 last) with every panel at equal
 * width; once panel 01 lands it opens. Hover or keyboard focus opens any panel; the others show their
 * name vertically. Leaving the viewport resets the row so the sequence replays on return.
 * On smaller screens the panels stack as wide cards with captions always visible.
 */
export function SandPanels({ items, viewDetails }: SandPanelsProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  // null = entrance in progress, all panels equal width.
  const [active, setActive] = useState<number | null>(null);

  return (
    <div ref={rowRef} className="flex flex-col gap-3 sm:gap-4 lg:h-[30rem] lg:flex-row">
      {items.map((item, index) => {
        const isActive = index === active;
        const isFirst = index === 0;
        return (
          <motion.div
            key={item.id}
            variants={panelVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{
              duration: reduceMotion ? 0 : 0.8,
              ease: EASE_OUT_EXPO,
              // Right to left: the rightmost panel starts first.
              delay: reduceMotion || !inView ? 0 : (items.length - 1 - index) * ENTRANCE_STAGGER,
            }}
            // Panel 01 lands last, so its completion marks the end of the entrance.
            onAnimationComplete={
              isFirst
                ? (definition) => {
                    if (definition === "visible") setActive((current) => current ?? 0);
                    else if (definition === "hidden") setActive(null);
                  }
                : undefined
            }
            className={cn(
              "min-w-0 lg:basis-0 motion-safe:lg:transition-[flex-grow] motion-safe:lg:duration-700 motion-safe:lg:ease-out-expo",
              isActive ? "lg:grow-[3.2]" : "lg:grow",
            )}
          >
            <Link
              href={item.href}
              data-active={isActive}
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              className="group relative isolate block h-44 overflow-hidden rounded-[1.75rem] bg-surface-muted shadow-soft sm:h-56 lg:h-full"
            >
              <ProductMedia
                src={item.image}
                alt={item.name}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full"
              />
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/5 transition-colors duration-700",
                  !isActive && "lg:bg-black/45",
                )}
              />

              <span className="absolute top-4 left-4 text-xs font-semibold tracking-[0.2em] text-white/80 tabular-nums">
                {item.index}
              </span>

              {/* Collapsed desktop label, read bottom-to-top like a spine. */}
              <span
                aria-hidden
                className={cn(
                  "absolute bottom-6 left-1/2 hidden -translate-x-1/2 rotate-180 text-lg font-semibold whitespace-nowrap text-white [writing-mode:vertical-rl] transition-opacity duration-500 lg:block",
                  isActive ? "lg:opacity-0" : "lg:opacity-100",
                )}
              >
                {item.name}
              </span>

              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 transition-all duration-700 ease-out-expo sm:p-6",
                  !isActive && "lg:pointer-events-none lg:translate-y-4 lg:opacity-0",
                )}
              >
                <span className="space-y-1.5">
                  <span className="block text-xl font-semibold text-white sm:text-2xl">{item.name}</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-soft">
                    {viewDetails}
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </span>
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
