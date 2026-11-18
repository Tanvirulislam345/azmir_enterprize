"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { getAboutIcon } from "@/lib/about/about-icons";
import { useHoverMenu } from "@/lib/hooks/use-hover-menu";
import type { NavAboutPage, NavLink } from "@/types/navigation";
import { DropdownTrigger } from "./dropdown-trigger";

type AboutDropdownProps = {
  /** The About overview page. */
  overview: NavLink;
  pages: NavAboutPage[];
  labels: Dictionary["nav"];
  active: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * "About Us" menu: an overview card on the left and one button per About page on the right
 * (Managing Director, IT Support Team, …). New pages appear here automatically from `data/about.ts`.
 */
export function AboutDropdown({ overview, pages, labels, active }: AboutDropdownProps) {
  const { open, panelId, wrapperRef, buttonRef, labelProps, wrapperProps, onButtonClick, closeAll } = useHoverMenu("about");

  return (
    <li ref={wrapperRef} className="relative flex items-center self-stretch" {...wrapperProps}>
      <DropdownTrigger
        label={labels.about}
        active={active}
        open={open}
        panelId={panelId}
        buttonRef={buttonRef}
        labelProps={labelProps}
        onClick={onButtonClick}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-label={labels.aboutMenu}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            // Centred under the item; the top padding bridges the gap so the pointer can travel into the panel.
            className="absolute top-full left-1/2 w-[36rem] -translate-x-1/2 pt-2"
          >
            <div className="grid grid-cols-[13rem_1fr] gap-3 rounded-2xl border border-border bg-surface p-3 shadow-lift">
              <Link
                href={overview.href}
                onClick={closeAll}
                className="group relative isolate flex flex-col justify-between overflow-hidden rounded-xl bg-inverse p-5 text-inverse-foreground"
              >
                <span aria-hidden className="absolute -right-12 -bottom-12 -z-10 size-40 rounded-full bg-accent/25 blur-2xl transition-transform duration-700 ease-out-expo group-hover:scale-125" />
                <span className="space-y-2">
                  <span className="block text-lg font-semibold">{labels.about}</span>
                  <span className="block text-sm leading-relaxed text-inverse-muted">{labels.aboutSummary}</span>
                </span>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  {labels.overview}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>

              <ul className="flex min-w-0 flex-col justify-center gap-1.5">
                {pages.map((page, index) => {
                  const Icon = getAboutIcon(page.icon);
                  return (
                    <motion.li
                      key={page.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + index * 0.06, duration: 0.3, ease: EASE }}
                    >
                      <Link
                        href={page.href}
                        onClick={closeAll}
                        className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition-colors duration-300 hover:border-accent/30 hover:bg-accent/5"
                      >
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                          <Icon aria-hidden className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-foreground">{page.label}</span>
                          <span className="block truncate text-sm text-muted">{page.summary}</span>
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className="size-4 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
