"use client";

import { useCallback, useEffect, useId, useRef, type PointerEvent } from "react";
import { useNavigationDispatch, useNavigationState, type MenuId } from "@/components/layout/navigation-context";
import { useDismiss } from "./use-dismiss";

/** How long the pointer must rest on the item's name before the menu opens (ms). */
const OPEN_DELAY = 120;
/** Grace period after the pointer leaves the item and its panel, so crossing the gap never snaps it shut (ms). */
const CLOSE_DELAY = 150;

const isMouse = (event: PointerEvent) => event.pointerType === "mouse";

/**
 * Hover-intent behaviour shared by the header dropdowns.
 *
 * - The menu opens only when a mouse pointer **rests on the item's name** (`labelProps`), not on the button's
 *   padding or the rest of the nav cell. Sweeping across the name quickly does not open it.
 * - Leaving the item and its panel (`wrapperProps`) closes it after a short grace period.
 * - Click and keyboard always work: the button toggles, Escape or an outside press closes. A click right after a
 *   hover-open keeps the menu open instead of snapping it shut.
 */
export function useHoverMenu<TWrapper extends HTMLElement = HTMLLIElement>(id: MenuId) {
  const open = useNavigationState().openMenu === id;
  const dispatch = useNavigationDispatch();
  const panelId = useId();
  const wrapperRef = useRef<TWrapper>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedByHover = useRef(false);

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  useEffect(() => clearTimers, [clearTimers]);
  // However the menu closed (Escape, outside click, navigation, another menu), the next click simply toggles it.
  useEffect(() => {
    if (!open) openedByHover.current = false;
  }, [open]);

  const close = useCallback(() => {
    const focusWasInside = wrapperRef.current?.contains(document.activeElement);
    dispatch({ type: "closeMenu", id });
    if (focusWasInside) buttonRef.current?.focus();
  }, [dispatch, id]);

  const closeAll = useCallback(() => dispatch({ type: "closeAll" }), [dispatch]);

  useDismiss(wrapperRef, open, close);

  const labelProps = {
    onPointerEnter: (event: PointerEvent) => {
      if (!isMouse(event) || open) return;
      if (openTimer.current) clearTimeout(openTimer.current);
      openTimer.current = setTimeout(() => {
        openTimer.current = null;
        openedByHover.current = true;
        dispatch({ type: "openMenu", id });
      }, OPEN_DELAY);
    },
    onPointerLeave: (event: PointerEvent) => {
      if (!isMouse(event) || !openTimer.current) return;
      clearTimeout(openTimer.current);
      openTimer.current = null;
    },
  };

  const wrapperProps = {
    onPointerEnter: (event: PointerEvent) => {
      if (!isMouse(event) || !closeTimer.current) return;
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    },
    onPointerLeave: (event: PointerEvent) => {
      if (!isMouse(event)) return;
      clearTimers();
      if (!open) return;
      closeTimer.current = setTimeout(() => {
        closeTimer.current = null;
        dispatch({ type: "closeMenu", id });
      }, CLOSE_DELAY);
    },
  };

  const onButtonClick = () => {
    if (openTimer.current) {
      // Clicked before the hover delay finished: open now rather than toggling twice.
      clearTimers();
      dispatch({ type: "openMenu", id });
      return;
    }
    if (openedByHover.current) {
      openedByHover.current = false;
      return;
    }
    dispatch({ type: "toggleMenu", id });
  };

  return { open, panelId, wrapperRef, buttonRef, labelProps, wrapperProps, onButtonClick, closeAll };
}
