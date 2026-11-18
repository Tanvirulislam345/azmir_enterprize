"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  /** Accessible name, e.g. "Copy 01761-116614". */
  label: string;
  copiedLabel: string;
  className?: string;
};

/**
 * Icon button that copies `value` to the clipboard. On success the icon turns into a check and a small "Copied"
 * bubble appears for two seconds; the confirmation is also announced to screen readers.
 */
export function CopyButton({ value, label, copiedLabel, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); the value stays visible to copy by hand.
    }
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        title={label}
        className={cn(className, copied && "border-accent bg-accent/15 text-accent")}
      >
        {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
      </button>
      <AnimatePresence>
        {copied && (
          <motion.span
            aria-hidden
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-inverse px-2 py-1 text-xs font-semibold whitespace-nowrap text-inverse-foreground shadow-soft"
          >
            {copiedLabel}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </span>
  );
}
