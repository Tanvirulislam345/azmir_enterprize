"use client";

import { animate, motion, useMotionValue, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useNavigationState } from "./navigation-context";

const HIDE_AFTER = 120;
const DIRECTION_THRESHOLD = 6;

/**
 * Fixed header that slides away while scrolling down and returns on scroll up.
 * Scroll position is tracked with motion values, so scrolling never re-renders React.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);
  const { openMenu, mobileOpen } = useNavigationState();
  const menuOpen = openMenu !== null || mobileOpen;
  const { scrollY } = useScroll();
  const y = useMotionValue(0);

  useMotionValueEvent(scrollY, "change", (current) => {
    const header = headerRef.current;
    if (!header) return;

    header.dataset.scrolled = String(current > 8);

    const delta = current - (scrollY.getPrevious() ?? 0);
    if (Math.abs(delta) < DIRECTION_THRESHOLD) return;

    const hide = !menuOpen && delta > 0 && current > HIDE_AFTER;
    // Lets sticky page elements (e.g. the catalogue jump bar) sit flush under the header or the viewport top.
    document.documentElement.style.setProperty("--header-offset", hide ? "0px" : `${header.offsetHeight}px`);
    animate(y, hide ? -header.offsetHeight : 0, { duration: 0.35, ease: [0.16, 1, 0.3, 1] });
  });

  return (
    <motion.header
      ref={headerRef}
      style={{ y }}
      data-scrolled="false"
      className="group/header fixed inset-x-0 top-0 z-50 border-b border-transparent bg-background/70 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 data-[scrolled=true]:border-border data-[scrolled=true]:bg-background/90 data-[scrolled=true]:shadow-soft"
    >
      {children}
    </motion.header>
  );
}
