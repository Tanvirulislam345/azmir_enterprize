"use client";

import { ChevronDown } from "lucide-react";
import type { RefObject } from "react";
import type { useHoverMenu } from "@/lib/hooks/use-hover-menu";
import { cn } from "@/lib/utils";

type DropdownTriggerProps = {
  label: string;
  active: boolean;
  open: boolean;
  panelId: string;
  buttonRef: RefObject<HTMLButtonElement | null>;
  labelProps: ReturnType<typeof useHoverMenu>["labelProps"];
  onClick: () => void;
};

/**
 * Header dropdown button. Hover intent is attached to the name and chevron only (`labelProps`), so resting the
 * pointer on the button's padding or elsewhere in the nav cell never opens the menu.
 */
export function DropdownTrigger({ label, active, open, panelId, buttonRef, labelProps, onClick }: DropdownTriggerProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-expanded={open}
      aria-controls={panelId}
      onClick={onClick}
      className={cn(
        "relative flex items-center rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:text-accent xl:px-3",
        (active || open) && "text-accent",
      )}
    >
      <span {...labelProps} className="flex items-center gap-1.5">
        {label}
        <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-300", open && "rotate-180")} />
      </span>
    </button>
  );
}
