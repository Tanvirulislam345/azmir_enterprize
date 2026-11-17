"use client";

import { useEffect, type RefObject } from "react";

/**
 * Calls `onDismiss` on Escape or on a pointer press outside `containerRef`.
 * Listeners are attached only while `active`; pass a stable `onDismiss`.
 */
export function useDismiss(containerRef: RefObject<HTMLElement | null>, active: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) onDismiss();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [containerRef, active, onDismiss]);
}
