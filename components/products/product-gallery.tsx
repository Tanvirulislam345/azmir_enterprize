"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

/** Main image with thumbnail switcher; rendered only when approved photos exist. */
export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-muted">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={images[activeIndex]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={images[activeIndex]}
              alt={`${alt}  ${activeIndex + 1}`}
              fill
              priority={activeIndex === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`${alt}  ${index + 1}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                index === activeIndex
                  ? "border-accent"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className="object-cover transition-transform duration-500 ease-out-expo motion-safe:group-hover:scale-110"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
