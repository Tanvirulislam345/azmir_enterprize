"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useReducer, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { Photo } from "@/types/photo";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { PageContainer } from "@/components/ui/page-container";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 8000;
const DISSOLVE_MS = 1600;
// One camera move per slide, in order: zoom in, pan right, zoom out, pan left.
const SHOTS = ["shot-zoom-in", "shot-pan-right", "shot-zoom-out", "shot-pan-left"];
const SHOT_EASING = "cubic-bezier(0.37, 0, 0.63, 1)";
const EASE = [0.16, 1, 0.3, 1] as const;

type SliderState = { index: number; count: number; paused: boolean };

type SliderAction = { type: "next" } | { type: "prev" } | { type: "goTo"; index: number } | { type: "togglePause" };

function sliderReducer(state: SliderState, action: SliderAction): SliderState {
  switch (action.type) {
    case "next":
      return { ...state, index: (state.index + 1) % state.count };
    case "prev":
      return { ...state, index: (state.index - 1 + state.count) % state.count };
    case "goTo":
      return { ...state, index: action.index };
    case "togglePause":
      return { ...state, paused: !state.paused };
  }
}

type HeroSliderProps = {
  slides: Photo[];
  locale: Locale;
  labels: Dictionary["hero"];
  /** Headline and calls to action, rendered on the server and layered over the photos. */
  children: ReactNode;
};

/**
 * Full-bleed photo slideshow made to feel like footage: slow camera drift, dissolves,
 * film grain, pointer-driven depth, and a scroll-linked zoom/dim that reverses on scroll up.
 */
export function HeroSlider({ slides, locale, labels, children }: HeroSliderProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [{ index, paused }, dispatch] = useReducer(sliderReducer, { index: 0, count: slides.length, paused: false });
  const reduceMotion = usePrefersReducedMotion();
  const inView = useInView(sectionRef, { amount: 0.3 });
  const autoplay = !paused && !reduceMotion && inView;
  const slide = slides[index];
  const nextSlide = slides[(index + 1) % slides.length];

  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => dispatch({ type: "next" }), SLIDE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [autoplay, index]);

  // Scroll-linked: zoom, sink, dim and soften the photo while the hero scrolls away (and back).
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const stageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const stageFilter = useTransform(scrollYProgress, (p) => `brightness(${1 - 0.65 * p}) blur(${6 * p}px)`);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Pointer-driven depth: photo counter-moves and tilts, text drifts slightly the other way.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 60, damping: 20 });
  const springY = useSpring(pointerY, { stiffness: 60, damping: 20 });
  const photoX = useTransform(springX, [-0.5, 0.5], [14, -14]);
  const photoY = useTransform(springY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-1.5, 1.5]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [1.5, -1.5]);
  const textX = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") dispatch({ type: "next" });
    if (event.key === "ArrowLeft") dispatch({ type: "prev" });
  };

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label={labels.slideshowLabel}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onKeyDown={onKeyDown}
      className="relative isolate flex min-h-[clamp(36rem,calc(100svh-4.5rem),60rem)] flex-col justify-end overflow-hidden bg-inverse text-inverse-foreground lg:min-h-[clamp(36rem,calc(100svh-5rem),60rem)]"
    >
      {/* Photo stage */}
      <motion.div aria-hidden style={{ scale: stageScale, y: stageY, filter: stageFilter }} className="absolute inset-0 -z-20">
        <div className="absolute inset-0 [perspective:1200px]">
          <motion.div style={{ x: photoX, y: photoY, rotateX, rotateY }} className="absolute -inset-[4%]">
            <AnimatePresence initial={false}>
              <motion.div
                key={slide.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: DISSOLVE_MS / 1000, ease: EASE }}
              >
                <div
                  className="absolute inset-0 will-change-transform"
                  // The shot outlasts the slide so the photo is still moving while the next one dissolves in.
                  style={{
                    animation: `${SHOTS[index % SHOTS.length]} ${SLIDE_DURATION_MS + DISSOLVE_MS}ms ${SHOT_EASING} forwards`,
                  }}
                >
                  <Image
                    src={slide.src}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                {/* Brighter photos get a dark wash so every slide reads as dark as the brick kiln. It sits inside the
                    slide, so it fades in and out with its own photo. */}
                {!slide.dark && <div className="absolute inset-0 bg-[rgb(15_17_18/0.55)]" />}
              </motion.div>
            </AnimatePresence>
            {/* Warm the cache for the upcoming photo so the dissolve never waits on the network. */}
            <Image src={nextSlide.src} alt="" fill sizes="100vw" className="invisible object-cover" />
          </motion.div>
        </div>
      </motion.div>

      {/* Legibility scrim, darkest where the text sits */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(15_17_18/0.7)_0%,rgb(15_17_18/0.3)_40%,transparent_70%),linear-gradient(to_right,rgb(15_17_18/0.3),transparent_60%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden mix-blend-overlay">
        <div className="film-grain" />
      </div>

      <motion.div style={{ y: contentY, opacity: contentOpacity, x: textX }} className="pt-16 pb-10 sm:pt-20 sm:pb-14">
        {children}
      </motion.div>

      {/* Controls */}
      <PageContainer className="relative pb-6">
        <div className="flex flex-col gap-4 border-t border-white/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {slides.map((item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={labels.slideOf.replace("{n}", String(itemIndex + 1)).replace("{total}", String(slides.length))}
                  aria-current={itemIndex === index ? "true" : undefined}
                  onClick={() => dispatch({ type: "goTo", index: itemIndex })}
                  className="group grid h-8 place-items-center"
                >
                  <span className="relative block h-0.5 w-8 overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/50 sm:w-12">
                    {itemIndex === index && (
                      <span
                        key={`${index}-${autoplay}`}
                        className="absolute inset-0 origin-left bg-accent"
                        style={
                          autoplay
                            ? { animation: `slide-progress ${SLIDE_DURATION_MS}ms linear forwards` }
                            : undefined
                        }
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <ControlButton label={labels.prevSlide} onClick={() => dispatch({ type: "prev" })}>
                <ChevronLeft aria-hidden className="size-4" />
              </ControlButton>
              {!reduceMotion && (
                <ControlButton label={paused ? labels.play : labels.pause} onClick={() => dispatch({ type: "togglePause" })}>
                  {paused ? <Play aria-hidden className="size-3.5" /> : <Pause aria-hidden className="size-3.5" />}
                </ControlButton>
              )}
              <ControlButton label={labels.nextSlide} onClick={() => dispatch({ type: "next" })}>
                <ChevronRight aria-hidden className="size-4" />
              </ControlButton>
            </div>
          </div>

          <div
            role="group"
            aria-roledescription="slide"
            aria-label={labels.slideOf.replace("{n}", String(index + 1)).replace("{total}", String(slides.length))}
            aria-live={autoplay ? "off" : "polite"}
            className="text-sm"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={slide.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="font-medium [text-shadow:0_1px_8px_rgb(0_0_0/0.5)]"
              >
                <span className="sr-only">{slide.alt[locale]}. </span>
                {slide.caption[locale]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid size-9 place-items-center rounded-full border border-white/20 text-white backdrop-blur-sm",
        "transition-colors hover:border-accent hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}
