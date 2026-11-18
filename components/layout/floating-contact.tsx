"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Phone, X } from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";
import { useDismiss } from "@/lib/hooks/use-dismiss";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/contact/whatsapp-icon";
import { FADE_START, SHOW_FROM } from "./back-to-top";

export type FloatingContactNumber = {
  id: string;
  /** Office the number belongs to, e.g. "Sylhet office". */
  office: string;
  /** Localized display, e.g. "01761-116614". */
  display: string;
  telHref: string;
  whatsappHref: string;
};

type FloatingContactProps = {
  numbers: FloatingContactNumber[];
  labels: { open: string; close: string; call: string; whatsapp: string };
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Round WhatsApp button in the bottom-right corner of every page. When the back-to-top button fades in below it,
 * this one rises in step to sit just above it (and settles back down when back-to-top hides), so the two never
 * overlap. It opens a small menu with each office's number and a WhatsApp and a call link for it.
 */
export function FloatingContact({ numbers, labels }: FloatingContactProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const { scrollY } = useScroll();
  // Back-to-top is 48px tall; lift by that plus a 12px gap, over exactly the scroll range it fades in on.
  const lift = useTransform(scrollY, [FADE_START, SHOW_FROM], [0, -60]);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);
  useDismiss(containerRef, open, close);

  if (numbers.length === 0) return null;

  return (
    // right-3/right-5 centres this 56px button over the 48px back-to-top at right-4/right-6.
    <motion.div ref={containerRef} style={{ y: lift }} className="fixed right-3 bottom-4 z-40 sm:right-5 sm:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="absolute right-0 bottom-full mb-3 w-72 max-w-[calc(100vw-1.5rem)] origin-bottom-right rounded-[1.5rem] border border-border bg-surface p-2 shadow-lift"
          >
            <ul className="space-y-1">
              {numbers.map((number) => (
                <li key={number.id} className="rounded-2xl p-2">
                  <p className="px-2 pb-2">
                    <span className="block text-xs font-semibold text-accent">{number.office}</span>
                    <span className="block text-base font-bold tracking-tight">{number.display}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={number.whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setOpen(false)}
                      className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <WhatsAppIcon className="size-4" />
                      {labels.whatsapp}
                    </a>
                    <a
                      href={number.telHref}
                      onClick={() => setOpen(false)}
                      className="flex h-10 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-accent-foreground transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <Phone aria-hidden className="size-4" />
                      {labels.call}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? labels.close : labels.open}
        onClick={() => setOpen((value) => !value)}
        className="relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform duration-300 ease-out-expo hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        {/* Soft pulse that invites a tap; hidden once open and for reduced motion. */}
        {!open && (
          <span aria-hidden className="absolute inset-0 rounded-full bg-[#25D366]/60 motion-safe:animate-ping motion-reduce:hidden" />
        )}
        <span className={cn("relative transition-transform duration-300", open && "rotate-90")}>
          {open ? <X aria-hidden className="size-6" /> : <WhatsAppIcon className="size-7" />}
        </span>
      </button>
    </motion.div>
  );
}
