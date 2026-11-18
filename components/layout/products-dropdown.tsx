"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, LayoutGrid, Truck, type LucideIcon } from "lucide-react";
import { memo } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { useHoverMenu } from "@/lib/hooks/use-hover-menu";
import { cn } from "@/lib/utils";
import type { NavCategory, NavLink } from "@/types/navigation";
import { DropdownTrigger } from "./dropdown-trigger";

type ProductsDropdownProps = {
  categories: NavCategory[];
  allProducts: NavLink;
  /** Service link in the bottom bar beside "All products", so buyers find delivery from the catalogue menu too. */
  transportation: NavLink;
  labels: Dictionary["nav"];
  active: boolean;
};

export function ProductsDropdown({ categories, allProducts, transportation, labels, active }: ProductsDropdownProps) {
  const { open: dropdownOpen, panelId, wrapperRef, buttonRef, labelProps, wrapperProps, onButtonClick, closeAll } = useHoverMenu("products");

  return (
    <li ref={wrapperRef} className="flex items-center self-stretch" {...wrapperProps}>
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
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full px-4 pt-2 sm:px-6 lg:px-8"
          >
            <div className="mx-auto flex max-h-[calc(100dvh-var(--header-offset)-1.5rem)] max-w-7xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-lift">
              <div className="grid min-h-0 grid-cols-2 gap-x-8 gap-y-6 overflow-y-auto overscroll-contain px-8 py-7 lg:grid-cols-3 xl:gap-x-12">
                {categories.map((category, index) => (
                  <CategoryGroup key={category.id} category={category} index={index} onNavigate={closeAll} />
                ))}
              </div>
              <div className="grid shrink-0 gap-3 border-t border-border bg-surface-muted/60 p-4 sm:grid-cols-2">
                <FooterLink
                  link={allProducts}
                  icon={LayoutGrid}
                  onNavigate={closeAll}
                  className="bg-inverse text-inverse-foreground"
                  iconClassName="bg-white/10 text-accent"
                />
                <FooterLink
                  link={transportation}
                  icon={Truck}
                  onNavigate={closeAll}
                  className="bg-accent text-accent-foreground"
                  iconClassName="bg-black/10"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

type FooterLinkProps = {
  link: NavLink;
  icon: LucideIcon;
  onNavigate: () => void;
  className: string;
  iconClassName: string;
};

function FooterLink({ link, icon: Icon, onNavigate, className, iconClassName }: FooterLinkProps) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center justify-between gap-3 rounded-xl px-4 py-3 font-semibold transition-transform duration-300 hover:-translate-y-0.5",
        className,
      )}
    >
      <span className="flex items-center gap-3">
        <span className={cn("grid size-9 place-items-center rounded-lg", iconClassName)}>
          <Icon aria-hidden className="size-4" />
        </span>
        {link.label}
      </span>
      <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
    </Link>
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
        className="mb-2 block border-b border-border pb-2.5 font-semibold text-foreground transition-colors hover:text-accent"
      >
        {category.label}
      </Link>
      <ul className="space-y-0.5">
        {category.variants.map((variant) => (
          <li key={variant.href}>
            <Link
              href={variant.href}
              onClick={onNavigate}
              className="group flex items-center gap-2 rounded-md py-1 text-sm text-muted transition-colors hover:text-foreground"
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
