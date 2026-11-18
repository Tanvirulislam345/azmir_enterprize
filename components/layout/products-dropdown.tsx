"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Truck } from "lucide-react";
import { memo, useCallback, useId, useRef } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { useDismiss } from "@/lib/hooks/use-dismiss";
import { cn } from "@/lib/utils";
import type { NavCategory, NavLink } from "@/types/navigation";
import { useNavigationDispatch, useNavigationState } from "./navigation-context";

type ProductsDropdownProps = {
  categories: NavCategory[];
  allProducts: NavLink;
  /** Service link shown beneath "All products", so buyers find delivery from the catalogue menu too. */
  transportation: NavLink;
  labels: Dictionary["nav"];
  active: boolean;
};

export function ProductsDropdown({ categories, allProducts, transportation, labels, active }: ProductsDropdownProps) {
  const dropdownOpen = useNavigationState().openMenu === "products";
  const dispatch = useNavigationDispatch();
  const panelId = useId();
  const wrapperRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    const focusWasInside = wrapperRef.current?.contains(document.activeElement);
    dispatch({ type: "closeMenu", id: "products" });
    if (focusWasInside) buttonRef.current?.focus();
  }, [dispatch]);

  const closeAll = useCallback(() => dispatch({ type: "closeAll" }), [dispatch]);

  useDismiss(wrapperRef, dropdownOpen, close);

  return (
    <li
      ref={wrapperRef}
      className="flex self-stretch"
      // Hover is an enhancement for mouse users only; click and keyboard always work.
      onPointerEnter={(event) => event.pointerType === "mouse" && dispatch({ type: "openMenu", id: "products" })}
      onPointerLeave={(event) => event.pointerType === "mouse" && dispatch({ type: "closeMenu", id: "products" })}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={dropdownOpen}
        aria-controls={panelId}
        onClick={() => dispatch({ type: "toggleMenu", id: "products" })}
        className={cn(
          "relative flex items-center gap-1.5 px-3 text-sm font-medium transition-colors hover:text-accent",
          (active || dropdownOpen) && "text-accent",
        )}
      >
        {labels.products}
        <ChevronDown
          aria-hidden
          className={cn("size-4 transition-transform duration-300", dropdownOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            id={panelId}
            aria-label={labels.productsMenu}
            role="region"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full px-4 pt-2 sm:px-6 lg:px-8"
          >
            <div className="mx-auto grid max-w-7xl gap-8 rounded-2xl border border-border bg-surface p-8 shadow-lift lg:grid-cols-[1fr_16rem]">
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {categories.map((category, index) => (
                  <CategoryGroup key={category.id} category={category} index={index} onNavigate={closeAll} />
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href={allProducts.href}
                  onClick={closeAll}
                  className="group flex flex-1 flex-col justify-end rounded-xl bg-inverse p-6 text-inverse-foreground transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="text-lg font-semibold">{allProducts.label}</span>
                  <ArrowRight aria-hidden className="mt-3 size-5 text-accent transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href={transportation.href}
                  onClick={closeAll}
                  className="group flex items-center justify-between gap-3 rounded-xl bg-accent p-5 text-accent-foreground transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="flex items-center gap-3 font-semibold">
                    <Truck aria-hidden className="size-5" />
                    {transportation.label}
                  </span>
                  <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

type CategoryGroupProps = {
  category: NavCategory;
  index: number;
  onNavigate: () => void;
};

const CategoryGroup = memo(function CategoryGroup({ category, index, onNavigate }: CategoryGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.06, duration: 0.3 }}
    >
      <Link
        href={category.href}
        onClick={onNavigate}
        className="mb-3 block border-b border-border pb-3 font-semibold text-foreground transition-colors hover:text-accent"
      >
        {category.label}
      </Link>
      <ul className="space-y-1">
        {category.variants.map((variant) => (
          <li key={variant.href}>
            <Link
              href={variant.href}
              onClick={onNavigate}
              className="group flex items-center gap-2 rounded-md py-1.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              <span aria-hidden className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" />
              {variant.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
});
