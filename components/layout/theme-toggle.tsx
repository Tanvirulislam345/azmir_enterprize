"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { themeStore, type ThemePreference } from "@/lib/theme/theme-store";

const NEXT_PREFERENCE: Record<ThemePreference, ThemePreference> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const ICONS = { light: Sun, dark: Moon, system: Monitor } as const;

export function ThemeToggle({ labels }: { labels: Dictionary["theme"] }) {
  const preference = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot, themeStore.getServerSnapshot);
  const Icon = ICONS[preference];

  return (
    <button
      type="button"
      onClick={() => themeStore.set(NEXT_PREFERENCE[preference])}
      aria-label={`${labels.label}: ${labels[preference]}`}
      title={`${labels.label}: ${labels[preference]}`}
      className="grid size-11 place-items-center rounded-full border border-border bg-surface transition-colors hover:border-accent hover:text-accent"
    >
      <Icon key={preference} aria-hidden className="size-[1.1rem] animate-[spin_0.5s_ease-out_1]" />
    </button>
  );
}
