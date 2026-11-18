"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees on each axis. */
  max?: number;
};

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

/**
 * Leans its content toward a fine pointer in 3D, with a soft glare following the cursor.
 * Touch input and reduced-motion visitors get a still card.
 */
export function Tilt({ children, className, max = 7 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // Pointer position within the card, 0..1 on each axis (0.5 = centre).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const glare = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING);
  const glareOpacity = useSpring(glare, SPRING);
  const glareX = useTransform(px, (value) => `${value * 100}%`);
  const glareY = useTransform(py, (value) => `${value * 100}%`);
  const background = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.28), transparent 55%)`;

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
    glare.set(1);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
    glare.set(0);
  };

  return (
    <div ref={ref} onPointerMove={handleMove} onPointerLeave={handleLeave} className={cn("h-full [perspective:1100px]", className)}>
      <motion.div style={{ rotateX, rotateY }} className="relative h-full transform-3d">
        {children}
        <motion.span
          aria-hidden
          style={{ opacity: glareOpacity, background }}
          className="pointer-events-none absolute inset-0 z-10 rounded-[1.75rem] mix-blend-overlay"
        />
      </motion.div>
    </div>
  );
}
