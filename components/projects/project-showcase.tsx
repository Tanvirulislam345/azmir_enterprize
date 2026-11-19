"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  /** Labels for the window variant's arrow cue, which points the way the visitor is scrolling. */
  nextLabel?: string;
  prevLabel?: string;
  /**
   * `window` (default) shows six rows at a time in a list that scrolls one project at a time, for any number of
   * projects. `compact` is for a handful: every row in the page flow beside a photo of the same height.
   */
  variant?: "window" | "compact";
  className?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/** Projects beside a photo of the one in focus; see `WindowShowcase` and `CompactShowcase`. */
export function ProjectShowcase({ variant = "window", ...props }: ProjectShowcaseProps) {
  return variant === "window" ? <WindowShowcase {...props} /> : <CompactShowcase {...props} />;
}

type ShowcaseProps = Omit<ProjectShowcaseProps, "variant">;

/** Rows visible at once in the window showcase. */
const WINDOW = 6;
/** Wheel travel (px) that counts as one step, so trackpads don't skip several rows at once. */
const WHEEL_THRESHOLD = 40;
/** Pause after a step before the wheel can move again (ms). */
const WHEEL_LOCK_MS = 260;

/**
 * Six rows at a time, for lists of any length. Each wheel step moves the active project by exactly one; the list
 * window slides only when the active row would leave it, keeping it in the third slot. The rest of the list stays
 * hidden until reached, and once the first or last project is active the page scrolls on as usual, so the section
 * is never taller than what it shows. Touch scrolls the window natively (snapping by row) and carries the active
 * row along. The active project's photo sits beside the list at the same height.
 */
function WindowShowcase({ items, total, listLabel, previewLabel, nextLabel, prevLabel, className }: ShowcaseProps) {
  const count = items.length;
  const [activeIndex, setActiveIndex] = useState(0);
  /** Which way the visitor last moved through the list; the arrow cue points this way. */
  const [direction, setDirection] = useState<"down" | "up">("down");
  const rootRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState(0);
  const [edges, setEdges] = useState({ atTop: true, atBottom: count <= WINDOW });
  const listRef = useRef<HTMLDivElement>(null);
  const firstRowRef = useRef<HTMLLIElement>(null);
  const activeRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const visible = Math.min(WINDOW, count);

  const activate = (index: number) => {
    activeRef.current = index;
    setActiveIndex(index);
  };

  // Row height changes with the breakpoint; the window and the photo beside it are sized from it.
  useEffect(() => {
    const row = firstRowRef.current;
    if (!row) return;
    const observer = new ResizeObserver(() => setRowHeight(row.offsetHeight));
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  // Native scrolling (touch, keyboard): update the edge fades and keep the active row inside the window.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    let lastTop = list.scrollTop;
    const update = () => {
      frame = 0;
      if (list.scrollTop !== lastTop) setDirection(list.scrollTop > lastTop ? "down" : "up");
      lastTop = list.scrollTop;
      const max = list.scrollHeight - list.clientHeight;
      setEdges({ atTop: list.scrollTop <= 1, atBottom: list.scrollTop >= max - 1 });
      const row = firstRowRef.current?.offsetHeight;
      if (!row) return;
      const top = Math.round(list.scrollTop / row);
      const clamped = Math.min(Math.max(activeRef.current, top), top + visible - 1);
      if (clamped !== activeRef.current) {
        activeRef.current = clamped;
        setActiveIndex(clamped);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    list.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      list.removeEventListener("scroll", schedule);
    };
  }, [visible]);

  /** Make `next` active and slide the window so it rides in the third slot (flush at both ends of the list). */
  const moveTo = useCallback(
    (next: number) => {
      if (next !== activeRef.current) setDirection(next > activeRef.current ? "down" : "up");
      activeRef.current = next;
      setActiveIndex(next);
      const list = listRef.current;
      const row = firstRowRef.current?.offsetHeight ?? 0;
      const offset = Math.min(Math.max(next - 2, 0), count - visible);
      list?.scrollTo({ top: offset * row, behavior: reduceMotion ? "auto" : "smooth" });
    },
    [count, visible, reduceMotion],
  );

  // Wheel anywhere in the enclosing section (heading, list or photo): one project per step while there is a next one
  // that way; at the first or last the page takes over. It only steps while the whole list window is on screen, so the
  // page first scrolls the section fully into view instead of getting stuck with it half visible.
  useEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    if (!root || !list) return;
    const scope = root.closest("section") ?? root;
    let travel = 0;
    let lockedUntil = 0;
    const listFullyVisible = () => {
      const rect = list.getBoundingClientRect();
      const headerBottom = Math.max(0, document.querySelector("header")?.getBoundingClientRect().bottom ?? 0);
      return rect.top >= headerBottom - 1 && rect.bottom <= window.innerHeight + 1;
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      if (!listFullyVisible()) {
        travel = 0;
        return;
      }
      const down = event.deltaY > 0;
      const current = activeRef.current;
      const next = down ? current + 1 : current - 1;
      if (next < 0 || next > count - 1) {
        travel = 0;
        return;
      }
      event.preventDefault();
      if (performance.now() < lockedUntil) return;
      travel += event.deltaY;
      if (Math.abs(travel) < WHEEL_THRESHOLD) return;
      travel = 0;
      lockedUntil = performance.now() + WHEEL_LOCK_MS;
      moveTo(next);
    };
    scope.addEventListener("wheel", onWheel, { passive: false });
    return () => scope.removeEventListener("wheel", onWheel);
  }, [count, moveTo]);

  const active = items[Math.min(activeIndex, count - 1)];
  if (!active) return null;
  const windowHeight = rowHeight ? { height: visible * rowHeight } : undefined;
  const progress = count > 1 ? activeIndex / (count - 1) : 1;
  const preview = <Preview item={active} total={total} progress={progress} label={previewLabel} />;
  // The cue follows the visitor's direction, flipping at either end so it always points somewhere to go.
  const cue: "down" | "up" =
    direction === "down" ? (activeIndex < count - 1 ? "down" : "up") : activeIndex > 0 ? "up" : "down";
  const cueLabel = cue === "down" ? nextLabel : prevLabel;
  const CueIcon = cue === "down" ? ChevronDown : ChevronUp;

  return (
    <div ref={rootRef} className={cn("grid gap-5 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16 xl:gap-24", className)}>
      {/* Phones and tablets: the photo sits above the list. */}
      <div className="relative h-[38svh] min-h-56 lg:hidden">{preview}</div>

      <div className="relative border-y border-border">
        <div
          ref={listRef}
          className="h-72 snap-y snap-mandatory overflow-y-auto overscroll-y-auto [scrollbar-width:none] sm:h-84 lg:h-96 [&::-webkit-scrollbar]:hidden"
          style={windowHeight}
        >
          <ol aria-label={listLabel}>
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={item.id} ref={index === 0 ? firstRowRef : undefined} className="h-12 snap-start border-b border-border last:border-b-0 sm:h-14 lg:h-16">
                  <button
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    // Real pointer movement only: rows sliding under a still pointer while the list scrolls don't count.
                    onPointerMove={(event) => event.pointerType === "mouse" && activeRef.current !== index && activate(index)}
                    onClick={() => activate(index)}
                    onFocus={(event) => {
                      if (!event.currentTarget.matches(":focus-visible")) return;
                      activate(index);
                      event.currentTarget.scrollIntoView({ block: "nearest" });
                    }}
                    className={cn(
                      "group relative flex h-full w-full items-center gap-4 px-2 text-left outline-none transition-colors duration-300 focus-visible:bg-surface-muted/70 sm:gap-5",
                      isActive ? "bg-surface-muted/50" : "hover:bg-surface-muted/70",
                    )}
                  >
                    <RowContent item={item} isActive={isActive} />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        {/* Fades hint at rows beyond the window. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-background to-transparent transition-opacity duration-300",
            edges.atTop ? "opacity-0" : "opacity-100",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-background to-transparent transition-opacity duration-300",
            edges.atBottom ? "opacity-0" : "opacity-100",
          )}
        />
        {/* Arrow cue just below the window, inside the section's bottom padding so it takes no space. It points the
            way the visitor is scrolling (flipping at either end) and moves one project that way when clicked. */}
        {count > WINDOW && (
          <button
            type="button"
            onClick={() => moveTo(cue === "down" ? activeRef.current + 1 : activeRef.current - 1)}
            aria-label={cueLabel}
            title={cueLabel}
            className="absolute top-full left-1/2 z-10 mt-1.5 grid size-8 -translate-x-1/2 place-items-center overflow-hidden rounded-full bg-accent text-accent-foreground shadow-lift transition-transform duration-300 hover:scale-110 focus-visible:ring-4 focus-visible:ring-accent/30 focus-visible:outline-none lg:mt-3 lg:size-9"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={cue}
                initial={{ opacity: 0, rotate: cue === "down" ? -90 : 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: cue === "down" ? 90 : -90 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="grid place-items-center"
              >
                <motion.span
                  className="grid place-items-center"
                  animate={reduceMotion ? undefined : { y: cue === "down" ? [0, 3, 0] : [0, -3, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CueIcon aria-hidden className="size-5" />
                </motion.span>
              </motion.span>
            </AnimatePresence>
          </button>
        )}
      </div>

      {/* Same height as the list window beside it, so both columns line up. */}
      <div className="relative hidden h-96 lg:block" style={windowHeight}>
        <span aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-accent/60" />
        {preview}
      </div>
    </div>
  );
}

/**
 * Index, monogram and name for one row (its row element carries `group`). Names are soft grey and turn black on
 * hover; the active row also shifts right and fills its index.
 */
function RowContent({
  item,
  isActive,
  wrap = false,
}: {
  item: ProjectShowcaseItem;
  isActive: boolean;
  wrap?: boolean;
}) {
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
          "w-8 shrink-0 text-lg font-bold tabular-nums transition-all duration-500 ease-out-expo sm:w-11 sm:text-2xl",
          isActive ? "translate-x-4 text-accent" : "text-transparent [-webkit-text-stroke:1px_var(--muted)]",
        )}
      >
        {item.index}
      </span>
      <span className={cn("flex min-w-0 flex-1 items-center gap-4 transition-transform duration-500 ease-out-expo", isActive && "translate-x-4")}>
        <ProjectMonogram name={item.monogramName} className="hidden sm:grid" />
        <span
          className={cn(
            "min-w-0 flex-1 text-base font-semibold tracking-tight transition-colors duration-300 sm:text-lg",
            isActive ? "text-foreground" : "text-foreground/70 group-hover:text-foreground",
            !wrap && "truncate",
          )}
        >
          {item.name}
        </span>
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
                  "group relative flex cursor-pointer items-center gap-4 border-b border-border px-2 py-3 transition-colors duration-300 sm:gap-5",
                  isActive ? "bg-surface-muted/50" : "hover:bg-surface-muted/70",
                )}
              >
                <RowContent item={item} isActive={isActive} wrap />
              </li>
            );
          })}
        </ol>
      </div>

      <div className="hidden lg:block">
        <div className="relative h-full min-h-[24rem]">
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
