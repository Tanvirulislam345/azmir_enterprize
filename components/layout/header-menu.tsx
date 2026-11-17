"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { useDismiss } from "@/lib/hooks/use-dismiss";
import { cn } from "@/lib/utils";
import { useNavigationDispatch, useNavigationState, type MenuId } from "./navigation-context";

export type HeaderMenuOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
  /** Sets the option's language for screen readers, e.g. "bn" for "বাংলা". */
  lang?: string;
};

type HeaderMenuProps<T extends string> = {
  id: MenuId;
  /** Accessible name of the trigger, e.g. "Colour theme: Dark". */
  label: string;
  trigger: ReactNode;
  options: HeaderMenuOption<T>[];
  value: T;
  onSelect: (value: T) => void;
  className?: string;
};

/** Accessible single-choice menu button (WAI-ARIA menu with menuitemradio items). */
export function HeaderMenu<T extends string>({ id, label, trigger, options, value, onSelect, className }: HeaderMenuProps<T>) {
  const open = useNavigationState().openMenu === id;
  const dispatch = useNavigationDispatch();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    const focusWasInside = containerRef.current?.contains(document.activeElement);
    dispatch({ type: "closeMenu", id });
    if (focusWasInside) triggerRef.current?.focus();
  }, [dispatch, id]);

  useDismiss(containerRef, open, close);

  // Move focus to the selected option when the menu opens.
  useEffect(() => {
    if (open) listRef.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
  }, [open]);

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const items = [...(listRef.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [])];
    const current = items.indexOf(document.activeElement as HTMLElement);
    const targets: Record<string, number> = {
      ArrowDown: (current + 1) % items.length,
      ArrowUp: (current - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    };
    if (event.key in targets) {
      event.preventDefault();
      items[targets[event.key]]?.focus();
    } else if (event.key === "Tab") {
      dispatch({ type: "closeMenu", id });
    }
  };

  const choose = (next: T) => {
    dispatch({ type: "closeMenu", id });
    triggerRef.current?.focus();
    if (next !== value) onSelect(next);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => dispatch({ type: "toggleMenu", id })}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            dispatch({ type: "openMenu", id });
          }
        }}
        className={cn(
          "flex h-11 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-sm font-medium sm:gap-2 transition-colors hover:border-accent",
          open && "border-accent",
        )}
      >
        {trigger}
        <ChevronDown
          aria-hidden
          className={cn("hidden size-3.5 text-muted transition-transform duration-300 sm:block", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={menuId}
            role="menu"
            aria-label={label}
            onKeyDown={onListKeyDown}
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full right-0 z-10 mt-2 min-w-44 origin-top-right rounded-xl border border-border bg-surface p-1.5 shadow-lift"
          >
            {options.map((option) => {
              const selected = option.value === value;
              return (
                <li key={option.value} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={selected}
                    lang={option.lang}
                    tabIndex={-1}
                    onClick={() => choose(option.value)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-muted focus-visible:bg-surface-muted",
                      selected && "font-semibold text-accent",
                    )}
                  >
                    {option.icon}
                    <span className="flex-1">{option.label}</span>
                    {selected && <Check aria-hidden className="size-4" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
