"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { themeStore, type Theme } from "@/lib/theme/theme-store";
import { HeaderMenu } from "./header-menu";

const ICONS = { light: Sun, dark: Moon } as const;

export function ThemeMenu({ labels }: { labels: Dictionary["theme"] }) {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot, themeStore.getServerSnapshot);
  const CurrentIcon = ICONS[theme];

  const options = (["light", "dark"] as const).map((value) => {
    const Icon = ICONS[value];
    return { value, label: labels[value], icon: <Icon aria-hidden className="size-4" /> };
  });

  return (
    <HeaderMenu<Theme>
      id="theme"
      label={`${labels.label}: ${labels[theme]}`}
      trigger={<CurrentIcon aria-hidden className="size-[1.1rem]" />}
      options={options}
      value={theme}
      onSelect={themeStore.set}
    />
  );
}
