"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import type { WhatsAppTarget } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";
import { WhatsAppIcon } from "./whatsapp-icon";
import { WhatsAppLink } from "./whatsapp-link";

export type OfficePhone = {
  /** Localized display, e.g. "01761-116614". */
  display: string;
  /** What the copy button puts on the clipboard, e.g. "01761116614". */
  copyValue: string;
  telHref: string;
  whatsapp: WhatsAppTarget;
};

export type OfficeView = {
  id: string;
  name: string;
  address: string;
  /** This office's own number. */
  phone: OfficePhone;
  mapSrc: string;
  directionsHref: string;
  mapTitle: string;
};

export type OfficeLabels = {
  /** Accessible name for the group of office cards. */
  group: string;
  directions: string;
  copied: string;
  /** Templates with a `{value}` placeholder. */
  copyValue: string;
  callValue: string;
  whatsappValue: string;
  emailValue: string;
};

type OfficeSwitcherProps = {
  offices: OfficeView[];
  /** Shared by every office. */
  email: { value: string; href: string };
  labels: OfficeLabels;
};

const EASE = [0.16, 1, 0.3, 1] as const;

const ACTION =
  "grid size-9 place-items-center rounded-full border border-border bg-surface text-foreground transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";

const WHATSAPP_ACTION = "border-[#25D366]/40 text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366] hover:text-white";

const fill = (template: string, value: string) => template.replace("{value}", value);

/**
 * Office cards beside a live Google Map of the selected office. Each card carries that office's number and the
 * shared email, with copy / call / WhatsApp actions. The card header is a toggle button that shows the office on
 * the map, and clicking anywhere on a card also selects it.
 */
export function OfficeSwitcher({ offices, email, labels }: OfficeSwitcherProps) {
  const [activeId, setActiveId] = useState(offices[0]?.id);
  const baseId = useId();
  const active = offices.find((office) => office.id === activeId) ?? offices[0];
  if (!active) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      <div role="group" aria-label={labels.group} className="flex flex-col gap-5">
        {offices.map((office) => {
          const selected = office.id === active.id;
          const { phone } = office;
          return (
            <div
              key={office.id}
              // Mouse convenience: the whole card selects its office; keyboard users use the header button.
              onClick={() => setActiveId(office.id)}
              className={cn(
                "group/card relative isolate cursor-pointer overflow-hidden rounded-[1.5rem] border transition-all duration-500 ease-out-expo hover:shadow-lift motion-safe:hover:-translate-y-1",
                selected ? "border-accent bg-surface shadow-lift" : "border-border bg-surface/60 hover:border-accent/60 hover:bg-surface",
              )}
            >
              {/* Accent glow that blooms from the top-right corner on hover. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 -z-10 size-56 rounded-full bg-accent/0 blur-3xl transition-colors duration-700 group-hover/card:bg-accent/15"
              />
              {/* Left accent bar: springs between cards when the selection changes, grows on hover otherwise. */}
              {selected ? (
                <motion.span
                  layoutId={`${baseId}-active`}
                  aria-hidden
                  className="absolute inset-y-0 left-0 -z-10 w-1.5 bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              ) : (
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 -z-10 w-1.5 origin-center scale-y-0 bg-accent transition-transform duration-500 ease-out-expo group-hover/card:scale-y-100"
                />
              )}

              <button
                type="button"
                aria-pressed={selected}
                aria-controls={`${baseId}-map`}
                onClick={() => setActiveId(office.id)}
                className="flex w-full items-start gap-4 p-5 text-left outline-none focus-visible:bg-accent/5 sm:p-6"
              >
                <span
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-2xl transition-colors duration-500",
                    selected
                      ? "bg-accent text-accent-foreground"
                      : "bg-accent/10 text-accent group-hover/card:bg-accent group-hover/card:text-accent-foreground",
                  )}
                >
                  <MapPin aria-hidden className="size-5 transition-transform duration-500 ease-out-expo motion-safe:group-hover/card:-translate-y-0.5" />
                </span>
                <span className="min-w-0 space-y-1">
                  <span className="block text-lg font-semibold transition-colors duration-300 group-hover/card:text-accent">{office.name}</span>
                  <span className="block text-sm leading-relaxed text-muted">{office.address}</span>
                </span>
              </button>

              <div className="space-y-1 border-t border-border px-5 py-4 sm:px-6">
                <ContactRow icon={<Phone aria-hidden className="size-4" />} value={phone.display}>
                  <CopyButton value={phone.copyValue} label={fill(labels.copyValue, phone.display)} copiedLabel={labels.copied} className={ACTION} />
                  <a href={phone.telHref} aria-label={fill(labels.callValue, phone.display)} title={fill(labels.callValue, phone.display)} className={ACTION}>
                    <Phone aria-hidden className="size-4" />
                  </a>
                  <WhatsAppLink
                    whatsapp={phone.whatsapp}
                    aria-label={fill(labels.whatsappValue, phone.display)}
                    title={fill(labels.whatsappValue, phone.display)}
                    className={cn(ACTION, WHATSAPP_ACTION)}
                  >
                    <WhatsAppIcon className="size-4" />
                  </WhatsAppLink>
                </ContactRow>
                <ContactRow icon={<Mail aria-hidden className="size-4" />} value={email.value} breakAll>
                  <CopyButton value={email.value} label={fill(labels.copyValue, email.value)} copiedLabel={labels.copied} className={ACTION} />
                  <a href={email.href} aria-label={fill(labels.emailValue, email.value)} title={fill(labels.emailValue, email.value)} className={ACTION}>
                    <Mail aria-hidden className="size-4" />
                  </a>
                </ContactRow>
              </div>

              <div className="border-t border-border px-5 py-4 sm:px-6">
                <a
                  href={office.directionsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-foreground"
                >
                  {labels.directions}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div
        id={`${baseId}-map`}
        role="region"
        aria-label={active.mapTitle}
        aria-live="polite"
        className="relative h-80 sm:h-96 lg:sticky lg:top-[calc(var(--header-offset)+2rem)] lg:h-[min(36rem,calc(100svh-var(--header-offset)-4rem))]"
      >
        <span aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border-2 border-accent/60 sm:translate-x-4 sm:translate-y-4" />
        {/* Muted backdrop shows while the map loads. */}
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-surface-muted shadow-lift">
          <AnimatePresence initial={false}>
            <motion.iframe
              key={active.id}
              src={active.mapSrc}
              title={active.mapTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute inset-0 size-full border-0"
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ icon, value, breakAll = false, children }: { icon: ReactNode; value: string; breakAll?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-1.5">
      <span className="flex min-w-0 flex-1 items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">{icon}</span>
        <span className={cn("min-w-0 font-semibold", breakAll && "break-all")}>{value}</span>
      </span>
      <span className="ml-auto flex shrink-0 items-center gap-2">{children}</span>
    </div>
  );
}
