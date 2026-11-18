"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ProjectMonogram } from "./project-monogram";

export type ProjectShowcaseItem = {
  id: string;
  /** Localized display name. */
  name: string;
  /** Latin name the monogram initials are taken from. */
  monogramName: string;
  index: string;
  image: string;
};

type ProjectShowcaseProps = {
  items: ProjectShowcaseItem[];
  /** Pre-formatted total, e.g. "10" or "১০". */
  total: string;
  listLabel: string;
  previewLabel: string;
  /**
   * `pinned` (default) keeps a viewport-tall photo pinned beside a list of any length.
   * `compact` is for a handful of projects: roomier rows and a photo that matches the list's height.
   */
  variant?: "pinned" | "compact";
  className?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/** Projects beside a photo of the one in focus; see `PinnedShowcase` and `CompactShowcase`. */
export function ProjectShowcase({ variant = "pinned", ...props }: ProjectShowcaseProps) {
  return variant === "pinned" ? <PinnedShowcase {...props} /> : <CompactShowcase {...props} />;
}

type ShowcaseProps = Omit<ProjectShowcaseProps, "variant">;

/** Scroll distance (px) that advances the pinned showcase by one project. */
const STEP = 110;
/** Rows visible at once in the pinned showcase's list window. */
const WINDOW = 6;

/**
 * Viewport-pinned showcase for any number of projects. A tall track gives the page scroll distance while the stage
 * inside it stays stuck to the screen; every `STEP` pixels of scroll advances one project, gliding the six-row list
 * window along and wiping in that project's photo. After the last project the stage releases and the page scrolls
 * on. Rows are buttons that scroll straight to their project.
 */
function PinnedShowcase({ items, total, listLabel, previewLabel, className }: ShowcaseProps) {
  const count = items.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstRowRef = useRef<HTMLLIElement>(null);
  const reduceMotion = useReducedMotion();

  // How far the track's top has scrolled above the viewport top (px). Measured from the track rather than the
  // sticky stage, so the header sliding in or out (which moves the stage) never shifts which project is active.
  const scrolledDistance = useCallback(() => -(trackRef.current?.getBoundingClientRect().top ?? 0), []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const step = Math.round(scrolledDistance() / STEP);
      setActiveIndex(Math.min(count - 1, Math.max(0, step)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [count, scrolledDistance]);

  // Row height changes with the breakpoint; the list window and its offset are measured from it.
  useEffect(() => {
    const row = firstRowRef.current;
    if (!row) return;
    const observer = new ResizeObserver(() => setRowHeight(row.offsetHeight));
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number, behavior: ScrollBehavior) => {
    window.scrollTo({ top: window.scrollY + index * STEP - scrolledDistance(), behavior: reduceMotion ? "auto" : behavior });
  };

  const active = items[activeIndex];
  if (!active) return null;
  const visible = Math.min(WINDOW, count);
  // The active row rides in the third slot, and the window settles flush at both ends of the list.
  const offset = Math.min(Math.max(activeIndex - 2, 0), count - visible);
  const progress = count > 1 ? activeIndex / (count - 1) : 1;
  const preview = <Preview item={active} total={total} progress={progress} label={previewLabel} />;

  return (
    <div ref={trackRef} className={cn("relative", className)} style={{ height: `calc(100svh + ${(count - 1) * STEP}px)` }}>
      <div
        className="sticky top-(--header-offset) flex h-[calc(100svh-var(--header-offset))] flex-col gap-5 py-5 transition-[top] duration-300 ease-out-expo lg:grid lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16 lg:py-8 xl:gap-24"
      >
        {/* Phones and tablets: the photo fills the space above the list window. */}
        <div className="relative min-h-40 flex-1 lg:hidden">{preview}</div>

        <div className="relative shrink-0 overflow-hidden border-y border-border" style={rowHeight ? { height: visible * rowHeight } : undefined}>
          <motion.ol
            aria-label={listLabel}
            animate={{ y: -offset * rowHeight }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 34 }}
          >
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={item.id} ref={index === 0 ? firstRowRef : undefined} className="h-14 border-b border-border sm:h-16 lg:h-20">
                  <button
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => goTo(index, "smooth")}
                    onFocus={(event) => event.currentTarget.matches(":focus-visible") && goTo(index, "auto")}
                    className={cn(
                      "relative flex h-full w-full items-center gap-4 text-left outline-none transition-opacity duration-500 focus-visible:bg-surface sm:gap-6",
                      !isActive && "opacity-45 hover:opacity-80",
                    )}
                  >
                    <RowContent item={item} isActive={isActive} />
                  </button>
                </li>
              );
            })}
          </motion.ol>
          {/* Fades hint at rows beyond the window. */}
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b from-background to-transparent transition-opacity duration-300",
              offset > 0 ? "opacity-100" : "opacity-0",
            )}
          />
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-background to-transparent transition-opacity duration-300",
              offset < count - visible ? "opacity-100" : "opacity-0",
            )}
          />
        </div>

        <div className="relative hidden h-[min(70vh,44rem)] lg:block">
          <span aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-accent/60" />
          {preview}
        </div>
      </div>
    </div>
  );
}

/** Index, monogram and name for one row; the active row shifts right and fills its index. */
function RowContent({ item, isActive, wrap = false }: { item: ProjectShowcaseItem; isActive: boolean; wrap?: boolean }) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-2.5 left-0 w-1 origin-center rounded-full bg-accent transition-transform duration-500 ease-out-expo",
          isActive ? "scale-y-100" : "scale-y-0",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "w-10 shrink-0 text-xl font-bold tabular-nums transition-all duration-500 ease-out-expo sm:w-14 sm:text-3xl",
          isActive ? "translate-x-4 text-accent" : "text-transparent [-webkit-text-stroke:1px_var(--muted)]",
        )}
      >
        {item.index}
      </span>
      <span className={cn("flex min-w-0 flex-1 items-center gap-4 transition-transform duration-500 ease-out-expo", isActive && "translate-x-4")}>
        <ProjectMonogram name={item.monogramName} className="hidden sm:grid" />
        <span className={cn("min-w-0 flex-1 text-lg font-semibold tracking-tight text-foreground sm:text-2xl", !wrap && "truncate")}>{item.name}</span>
      </span>
    </>
  );
}

/**
 * For a handful of projects (home page): the list flows normally beside a photo of the same height, and the row
 * nearest the reading line (or under the mouse) is active. Below `lg` the photo pins to the top of the screen and
 * the rows slide up beneath it.
 */
function CompactShowcase({ items, total, listLabel, previewLabel, className }: ShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const mobileFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const desktop = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      // Desktop reads at mid-screen; on phones, a little below the pinned photo.
      let line = viewport * 0.5;
      const mobileFrame = mobileFrameRef.current;
      if (!desktop.matches && mobileFrame) {
        const bottom = mobileFrame.getBoundingClientRect().bottom;
        line = bottom + (viewport - bottom) * 0.2;
      }

      // Rows are in document order, so distance to the line falls and then rises: stop at the turn.
      let best = 0;
      let bestDistance = Infinity;
      for (let index = 0; index < rowRefs.current.length; index++) {
        const row = rowRefs.current[index];
        if (!row) continue;
        const rect = row.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - line);
        if (distance > bestDistance) break;
        best = index;
        bestDistance = distance;
      }
      setActiveIndex(best);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items.length]);

  const active = items[Math.min(activeIndex, items.length - 1)];
  if (!active) return null;
  const progress = items.length > 1 ? activeIndex / (items.length - 1) : 1;
  const preview = <Preview item={active} total={total} progress={progress} label={previewLabel} />;

  return (
    <div className={cn("grid lg:grid-cols-[1fr_1.05fr] lg:gap-16 xl:gap-24", className)}>
      <div>
        {/* Phones and tablets: the photo pins under the header and the list slides beneath it. */}
        <div ref={mobileFrameRef} className="sticky top-(--header-offset) z-10 -mx-4 bg-background px-4 pt-3 pb-4 sm:-mx-6 sm:px-6 lg:hidden">
          <div className="relative h-[38svh] min-h-56">{preview}</div>
        </div>

        <ol aria-label={listLabel} className="border-t border-border">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={item.id}
                ref={(node) => {
                  rowRefs.current[index] = node;
                }}
                aria-current={isActive ? "true" : undefined}
                onPointerEnter={(event) => event.pointerType === "mouse" && setActiveIndex(index)}
                className={cn(
                  "relative flex items-center gap-4 border-b border-border transition-opacity duration-500 sm:gap-6",
                  "py-4 sm:py-6",
                  !isActive && "opacity-50",
                )}
              >
                <RowContent item={item} isActive={isActive} wrap />
              </li>
            );
          })}
        </ol>
      </div>

      <div className="hidden lg:block">
        <div className="relative h-full min-h-[30rem]">
          <span aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-accent/60" />
          {preview}
        </div>
      </div>
    </div>
  );
}

type PreviewProps = { item: ProjectShowcaseItem; total: string; progress: number; label: string };

/** Photo frame for the active project: the new photo wipes up over the old one, with name, counter and a progress rail. */
function Preview({ item, total, progress, label }: PreviewProps) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] bg-surface-muted shadow-lift lg:rounded-[2rem]">
      <AnimatePresence initial={false}>
        <motion.div
          key={item.id}
          initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.12, zIndex: 1 }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1, zIndex: 1 }}
          exit={{ zIndex: 0, opacity: 0, transition: { delay: 0.6, duration: 0.01 } }}
          transition={{ duration: 0.8, ease: EASE }}
          className="absolute inset-0"
        >
          <Image src={item.image} alt={`${label}: ${item.name}`} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </motion.div>
      </AnimatePresence>
      <span aria-hidden className="pointer-events-none absolute inset-0 z-[2] bg-linear-to-t from-black/75 via-black/5 to-transparent" />

      {/* Progress rail: how far through the whole list the reader is. */}
      <span aria-hidden className="absolute top-5 bottom-5 left-5 z-[3] w-0.5 overflow-hidden rounded-full bg-white/25 lg:top-6 lg:bottom-6 lg:left-6">
        <motion.span
          className="absolute inset-0 origin-top rounded-full bg-accent"
          initial={false}
          animate={{ scaleY: progress }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </span>

      <div className="absolute right-5 bottom-5 left-10 z-[3] flex items-end justify-between gap-4 text-white lg:right-6 lg:bottom-6 lg:left-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="text-xl font-semibold tracking-tight sm:text-2xl xl:text-3xl"
          >
            {item.name}
          </motion.p>
        </AnimatePresence>
        <p aria-hidden className="shrink-0 text-sm font-semibold text-white/80 tabular-nums">
          <span className="text-accent">{item.index}</span> / {total}
        </p>
      </div>
    </div>
  );
}
