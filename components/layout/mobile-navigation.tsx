"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useCallback, useId, useRef, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { useDismiss } from "@/lib/hooks/use-dismiss";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";
import { cn } from "@/lib/utils";
import type { NavAboutPage, NavCategory, NavLink } from "@/types/navigation";
import { buttonClassName } from "@/components/ui/button";
import { isActivePath } from "./desktop-navigation";
import { useNavigationDispatch, useNavigationState } from "./navigation-context";

type MobileNavigationProps = {
  links: { home: NavLink; products: NavLink; transportation: NavLink; about: NavLink; contact: NavLink };
  categories: NavCategory[];
  aboutPages: NavAboutPage[];
  labels: Dictionary["nav"];
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function MobileNavigation({ links, categories, aboutPages, labels }: MobileNavigationProps) {
  const { mobileOpen, expandedCategory } = useNavigationState();
  const dispatch = useNavigationDispatch();
  const pathname = usePathname();
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    dispatch({ type: "closeAll" });
    toggleRef.current?.focus();
  }, [dispatch]);
  const closeAll = useCallback(() => dispatch({ type: "closeAll" }), [dispatch]);

  useDismiss(containerRef, mobileOpen, close);
  useScrollLock(mobileOpen);

  const primaryLinks = [links.home];

  return (
    <div ref={containerRef} className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={mobileOpen}
        aria-controls={panelId}
        aria-label={mobileOpen ? labels.closeMenu : labels.openMenu}
        onClick={() => dispatch({ type: "toggleMobile" })}
        className="grid size-11 place-items-center rounded-full border border-border bg-surface transition-colors hover:border-accent"
      >
        {mobileOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id={panelId}
            aria-label={labels.label}
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute inset-x-0 top-full h-[calc(100dvh-100%)] overflow-y-auto border-t border-border bg-background"
          >
            <motion.ul
              className="flex flex-col gap-1 px-4 py-6 sm:px-6"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
            >
              {primaryLinks.map((link) => (
                <DrawerItem key={link.href}>
                  <DrawerLink link={link} active={isActivePath(pathname, link.href, link === links.home)} onNavigate={closeAll} />
                </DrawerItem>
              ))}

              <DrawerItem>
                <DrawerLink link={links.products} active={isActivePath(pathname, links.products.href)} onNavigate={closeAll} />
                <ul className="mt-1 space-y-1 border-l border-border pl-3">
                  {categories.map((category) => (
                    <CategoryAccordion
                      key={category.id}
                      category={category}
                      expanded={expandedCategory === category.id}
                      onToggle={() => dispatch({ type: "toggleCategory", id: category.id })}
                      onNavigate={closeAll}
                    />
                  ))}
                </ul>
              </DrawerItem>

              <DrawerItem>
                <DrawerLink link={links.transportation} active={isActivePath(pathname, links.transportation.href)} onNavigate={closeAll} />
              </DrawerItem>

              <DrawerItem>
                {aboutPages.length > 0 ? (
                  // Same accordion as a product category: the overview first, then each About page.
                  <ul>
                    <CategoryAccordion
                      category={{
                        id: "about",
                        href: links.about.href,
                        label: links.about.label,
                        variants: aboutPages.map(({ href, label }) => ({ href, label })),
                      }}
                      expanded={expandedCategory === "about"}
                      onToggle={() => dispatch({ type: "toggleCategory", id: "about" })}
                      onNavigate={closeAll}
                      firstLabel={labels.overview}
                      size="lg"
                    />
                  </ul>
                ) : (
                  <DrawerLink link={links.about} active={isActivePath(pathname, links.about.href)} onNavigate={closeAll} />
                )}
              </DrawerItem>

              <DrawerItem>
                <DrawerLink link={links.contact} active={isActivePath(pathname, links.contact.href)} onNavigate={closeAll} />
              </DrawerItem>

              <DrawerItem className="mt-6">
                <Link href={links.contact.href} onClick={closeAll} className={cn(buttonClassName("primary", "lg"), "w-full")}>
                  {labels.requestQuote}
                </Link>
              </DrawerItem>
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

function DrawerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.li
      className={className}
      variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {children}
    </motion.li>
  );
}

function DrawerLink({ link, active, onNavigate }: { link: NavLink; active: boolean; onNavigate: () => void }) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-12 items-center rounded-lg px-3 text-lg font-semibold transition-colors hover:bg-surface-muted",
        active && "text-accent",
      )}
    >
      {link.label}
    </Link>
  );
}

type CategoryAccordionProps = {
  category: NavCategory;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  /** Label for the first link (the group's own page); defaults to the group label. */
  firstLabel?: string;
  /** `lg` matches the drawer's top-level links (used for About). */
  size?: "md" | "lg";
};

function CategoryAccordion({ category, expanded, onToggle, onNavigate, firstLabel, size = "md" }: CategoryAccordionProps) {
  const regionId = useId();

  return (
    <li>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={regionId}
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-lg px-3 text-left transition-colors hover:bg-surface-muted",
          size === "lg" ? "min-h-12 text-lg font-semibold" : "min-h-11 font-medium",
        )}
      >
        {category.label}
        <ChevronDown aria-hidden className={cn("size-4 shrink-0 transition-transform duration-300", expanded && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.ul
            id={regionId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden pl-3"
          >
            {[{ href: category.href, label: firstLabel ?? category.label }, ...category.variants].map((link, index) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex min-h-11 items-center rounded-lg px-3 text-sm text-muted transition-colors hover:text-foreground",
                    index === 0 && "font-semibold text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
