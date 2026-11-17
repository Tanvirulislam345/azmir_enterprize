"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const media = matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

/**
 * Hydration-safe reduced-motion flag: `false` while hydrating (matching the server HTML),
 * then the real preference. Use it when the value changes what gets rendered.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false);
}
