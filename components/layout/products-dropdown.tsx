"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ChevronRight, LayoutGrid, Truck, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { useHoverMenu } from "@/lib/hooks/use-hover-menu";
import { getCategoryIconByName } from "@/lib/products/category-icons";
import { cn } from "@/lib/utils";
import type { NavCategory, NavLink } from "@/types/navigation";
import { formatNumber } from "@/components/products/catalogue/format";
import { DropdownTrigger } from "./dropdown-trigger";

type ProductsDropdownProps = {
  categories: NavCategory[];
  allProducts: NavLink;
  /** Listed last, as a plain link with no sub-menu. */
  transportation: NavLink;
  labels: Dictionary["nav"];
  locale: Locale;
  active: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;
/**
 * While a sub-menu is open, the mouse must rest this long on another row before it switches, so cutting
 * diagonally across rows on the way into the sub-menu doesn't swap it out (ms).
 */
const SWITCH_DELAY = 150;

/**
 * Products menu: a list of All products, every category and Transportation. Hovering or focusing a category opens
 * a sub-menu beside the list with just that category's products. A category opens its section on the products page;
 * a product opens its details page.
 */
export function ProductsDropdown({ categories, allProducts, transportation, labels, locale, active }: ProductsDropdownProps) {
  const { open: dropdownOpen, panelId, wrapperRef, buttonRef, labelProps, wrapperProps, onButtonClick, closeAll } = useHoverMenu("products");

  return (
    <li ref={wrapperRef} className="relative flex items-center self-stretch" {...wrapperProps}>
      <DropdownTrigger
        label={labels.products}
        active={active}
        open={dropdownOpen}
        panelId={panelId}
        buttonRef={buttonRef}
        labelProps={labelProps}
        onClick={onButtonClick}
      />

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            id={panelId}
            aria-label={labels.productsMenu}
            role="region"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            // Padding, not margin, bridges the gap below the trigger so the pointer never leaves the menu.
            className="absolute top-full -left-3 pt-2"
          >
            <MenuList
              categories={categories}
              allProducts={allProducts}
              transportation={transportation}
              labels={labels}
              locale={locale}
              onNavigate={closeAll}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

type MenuListProps = Omit<ProductsDropdownProps, "active"> & { onNavigate: () => void };

/** Lives only while the menu is open, so it always opens with no sub-menu showing. */
function MenuList({ categories, allProducts, transportation, labels, locale, onNavigate }: MenuListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelSwitch = () => {
    if (switchTimer.current) clearTimeout(switchTimer.current);
    switchTimer.current = null;
  };
  useEffect(() => cancelSwitch, []);

  /** Mouse: immediate when nothing is open, otherwise after a short rest. Keyboard focus is always immediate. */
  const activate = (id: string | null, immediate: boolean) => {
    cancelSwitch();
    if (immediate || activeId === null) setActiveId(id);
    else switchTimer.current = setTimeout(() => setActiveId(id), SWITCH_DELAY);
  };

  const countLabel = (count: number) =>
    count === 1 ? labels.productCountOne : labels.productCount.replace("{count}", formatNumber(count, locale));

  return (
    <ul className="relative w-72 space-y-0.5 rounded-2xl border border-border bg-surface p-2 shadow-lift">
      <li>
        <MenuRow href={allProducts.href} label={allProducts.label} icon={LayoutGrid} onActivate={(immediate) => activate(null, immediate)} onLeave={cancelSwitch} onNavigate={onNavigate} />
      </li>
      <li aria-hidden className="mx-3 my-1.5 border-t border-border" />

      {categories.map((category) => {
        const isActive = category.id === activeId;
        return (
          <li key={category.id}>
            <MenuRow
              href={category.href}
              label={category.label}
              meta={countLabel(category.variants.length)}
              icon={getCategoryIconByName(category.icon)}
              active={isActive}
              hasSubmenu
              onActivate={(immediate) => activate(category.id, immediate)}
              onLeave={cancelSwitch}
              onNavigate={onNavigate}
            />
            {/* The sub-menu sits inside its category in the DOM, so Tab moves from a category into its products. */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.2, ease: EASE }}
                  // `pl-2` bridges the gap to the list so moving the pointer across never closes it.
                  // Reaching the sub-menu settles any pending switch in favour of the open one.
                  onMouseEnter={cancelSwitch}
                  className="absolute top-0 left-full w-64 pl-2"
                >
                  <ul aria-label={category.label} className="space-y-0.5 rounded-2xl border border-border bg-surface p-2 shadow-lift">
                    {category.variants.map((variant) => (
                      <li key={variant.href}>
                        <Link
                          href={variant.href}
                          onClick={onNavigate}
                          className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted hover:text-accent focus-visible:bg-surface-muted focus-visible:outline-none"
                        >
                          <span aria-hidden className="h-px w-2 shrink-0 bg-border transition-all duration-300 group-hover:w-3.5 group-hover:bg-accent" />
                          {variant.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}

      <li aria-hidden className="mx-3 my-1.5 border-t border-border" />
      <li>
        <MenuRow href={transportation.href} label={transportation.label} icon={Truck} onActivate={(immediate) => activate(null, immediate)} onLeave={cancelSwitch} onNavigate={onNavigate} />
      </li>
    </ul>
  );
}

type MenuRowProps = {
  href: string;
  label: string;
  /** Muted second line, e.g. the product count. */
  meta?: string;
  icon: LucideIcon;
  active?: boolean;
  /** Shows a chevron: hovering the row opens a sub-menu. */
  hasSubmenu?: boolean;
  /** `true` when activated by keyboard focus, which switches immediately. */
  onActivate: (immediate: boolean) => void;
  onLeave: () => void;
  onNavigate: () => void;
};

function MenuRow({ href, label, meta, icon: Icon, active = false, hasSubmenu = false, onActivate, onLeave, onNavigate }: MenuRowProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      onMouseEnter={() => onActivate(false)}
      onMouseLeave={onLeave}
      onFocus={() => onActivate(true)}
      aria-expanded={hasSubmenu ? active : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-200 focus-visible:outline-none",
        active ? "bg-surface-muted" : "hover:bg-surface-muted/70 focus-visible:bg-surface-muted/70",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-2 left-0 w-1 rounded-full bg-accent transition-transform duration-300 ease-out-expo",
          active ? "scale-y-100" : "scale-y-0",
        )}
      />
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-lg transition-colors duration-200",
          active ? "bg-accent text-accent-foreground" : "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground",
        )}
      >
        <Icon aria-hidden className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-sm font-semibold transition-colors", active ? "text-accent" : "text-foreground")}>{label}</span>
        {meta && <span className="block truncate text-xs text-muted">{meta}</span>}
      </span>
      {hasSubmenu && (
        <ChevronRight
          aria-hidden
          className={cn("size-4 shrink-0 transition-all duration-200", active ? "translate-x-0.5 text-accent" : "text-muted/60")}
        />
      )}
    </Link>
  );
}
