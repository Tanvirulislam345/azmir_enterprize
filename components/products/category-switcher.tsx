"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export type CategorySwitcherItem = {
  id: string;
  href: string;
  number: string;
  label: string;
  /** Shown below the `lg` breakpoint so every tab fits without scrolling. */
  shortLabel: string;
};

type CategorySwitcherProps = {
  label: string;
  allLabel: string;
  allHref: string;
  items: CategorySwitcherItem[];
  activeId: string;
};

const pillClass =
  "relative isolate flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors lg:gap-2.5 lg:px-4";

/**
 * Sticky bar on category pages: jump back to the full catalogue or across to a sibling category.
 * The current category sits on an accent pill that springs into place when the page loads.
 */
export function CategorySwitcher({ label, allLabel, allHref, items, activeId }: CategorySwitcherProps) {
  return (
    <nav
      aria-label={label}
      className="sticky top-(--header-offset) z-40 border-y border-border bg-background/85 backdrop-blur-xl transition-[top] duration-300 ease-out-expo"
    >
      <ul className="mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 lg:gap-2 lg:px-8 [&::-webkit-scrollbar]:hidden">
        <li className="shrink-0">
          <Link href={allHref} className={cn(pillClass, "text-muted hover:text-foreground")}>
            <LayoutGrid aria-hidden className="size-4 text-accent" />
            <span className="sr-only sm:not-sr-only">{allLabel}</span>
          </Link>
        </li>
        <li aria-hidden className="my-2 w-px shrink-0 bg-border" />
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id} className="min-w-0 flex-1 lg:flex-none lg:shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(pillClass, active ? "text-accent-foreground" : "text-muted hover:text-foreground")}
              >
                {active && (
                  <motion.span
                    layoutId="category-switcher-pill"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={cn("text-xs font-bold tabular-nums", active ? "text-accent-foreground/80" : "text-accent")}>
                  {item.number}
                </span>
                <span className="lg:hidden">{item.shortLabel}</span>
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
