"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type JumpNavItem = {
  id: string;
  number: string;
  label: string;
  /** Shown below the `lg` breakpoint (phones and tablets) so all tabs fit without scrolling. */
  shortLabel: string;
};

type CategoryJumpNavProps = {
  items: JumpNavItem[];
  label: string;
};

/**
 * Sticky chapter bar for the catalogue. Follows the header as it hides and returns
 * (via `--header-offset`) and highlights the chapter currently in the middle of the viewport.
 */
export function CategoryJumpNav({ items, label }: CategoryJumpNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    // A thin band across the middle of the screen decides which chapter is "current".
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={label}
      className="sticky top-(--header-offset) z-40 border-y border-border bg-background/85 backdrop-blur-xl transition-[top] duration-300 ease-out-expo"
    >
      <ul className="mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 lg:gap-2 lg:px-8 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id} className="min-w-0 flex-1 lg:flex-none lg:shrink-0">
              <a
                href={`#${item.id}`}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "relative isolate flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors lg:gap-2.5 lg:px-4",
                  active ? "text-accent-foreground" : "text-muted hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="catalogue-jump-pill"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={cn("text-xs font-bold tabular-nums", active ? "text-accent-foreground/80" : "text-accent")}>
                  {item.number}
                </span>
                <span className="whitespace-nowrap lg:hidden">{item.shortLabel}</span>
                <span className="hidden whitespace-nowrap lg:inline">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
