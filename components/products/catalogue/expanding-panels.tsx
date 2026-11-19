"use client";

import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";
import { ProductMedia } from "@/components/products/product-media";

export type ExpandingPanelItem = {
  id: string;
  href: string;
  name: string;
  image?: string;
  index: string;
  /** Optional supporting line shown while the panel is open. */
  description?: string;
  /** Optional small label such as a product count. */
  meta?: string;
};

type ExpandingPanelsProps = {
  items: ExpandingPanelItem[];
  ctaLabel: string;
  /** "lg" adds the outlined index and description for richer category panels; "sm" is the compact catalogue row. */
  size?: "sm" | "md" | "lg";
  className?: string;
};

const ENTRANCE_STAGGER = 0.12;

/** Row height on desktop, and each panel's height when stacked on smaller screens. */
const PANEL_HEIGHTS = {
  sm: { row: "lg:h-[18rem]", panel: "h-32 sm:h-40" },
  md: { row: "lg:h-[24rem]", panel: "h-40 sm:h-48" },
  lg: { row: "lg:h-[34rem]", panel: "h-64 sm:h-80" },
} as const;

const panelVariants: Variants = {
  hidden: { x: 120, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

/**
 * Tall photo panels side by side on desktop.
 * Entrance runs right to left (the last panel arrives first, panel 01 last) with every panel at equal
 * width; once panel 01 lands it opens. Hover or keyboard focus opens any panel; the others show their
 * name vertically. Leaving the viewport resets the row so the sequence replays on return.
 * On smaller screens the panels stack as wide cards with captions always visible.
 */
export function ExpandingPanels({ items, ctaLabel, size = "md", className }: ExpandingPanelsProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  // null = entrance in progress, all panels equal width.
  const [active, setActive] = useState<number | null>(null);
  const rich = size === "lg";

  return (
    <div
      ref={rowRef}
      className={cn("flex flex-col gap-3 sm:gap-4 lg:flex-row", PANEL_HEIGHTS[size].row, className)}
    >
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
              isActive ? (rich ? "lg:grow-[2.6]" : "lg:grow-[3.2]") : "lg:grow",
            )}
          >
            <Link
              href={item.href}
              data-active={isActive}
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              className={cn(
                "group relative isolate block overflow-hidden rounded-[1.75rem] bg-surface-muted shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:h-full",
                PANEL_HEIGHTS[size].panel,
              )}
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
                  "pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/5 transition-colors duration-700",
                  !isActive && "lg:bg-black/45",
                )}
              />

              {rich ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-4 left-5 text-5xl leading-none font-black tracking-tighter text-transparent tabular-nums [-webkit-text-stroke:1.5px_rgb(255_255_255/0.85)] transition-all duration-700 ease-out-expo sm:top-5 sm:text-6xl",
                    isActive ? "lg:text-7xl lg:[-webkit-text-stroke:1.5px_var(--accent-soft)]" : "lg:text-4xl",
                  )}
                >
                  {item.index}
                </span>
              ) : (
                <span className="absolute top-4 left-4 text-xs font-semibold tracking-[0.2em] text-white/80 tabular-nums">
                  {item.index}
                </span>
              )}

              {/* Collapsed desktop label, read bottom-to-top like a spine. */}
              <span
                aria-hidden
                className={cn(
                  "absolute bottom-6 left-1/2 hidden -translate-x-1/2 rotate-180 font-semibold whitespace-nowrap text-white [writing-mode:vertical-rl] transition-opacity duration-500 lg:block",
                  rich ? "text-2xl" : "text-lg",
                  isActive ? "lg:opacity-0" : "lg:opacity-100",
                )}
              >
                {item.name}
              </span>

              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 transition-all duration-700 ease-out-expo sm:p-6",
                  rich && "lg:p-8",
                  !isActive && "lg:pointer-events-none lg:translate-y-4 lg:opacity-0",
                )}
              >
                <span className={cn("space-y-1.5", rich && "max-w-md space-y-2.5")}>
                  {item.meta && (
                    <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {item.meta}
                    </span>
                  )}
                  <span className={cn("block font-semibold text-white", rich ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl")}>
                    {item.name}
                  </span>
                  {item.description && (
                    <span className="line-clamp-2 block text-sm text-white/75 sm:text-base">{item.description}</span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-soft">
                    {ctaLabel}
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
