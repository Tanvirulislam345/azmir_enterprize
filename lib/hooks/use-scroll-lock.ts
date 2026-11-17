"use client";

import { useEffect } from "react";

/** Prevents background scrolling while an overlay is open, without layout shift from the scrollbar. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };

    body.style.overflow = "hidden";
    body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
    };
  }, [locked]);
}
