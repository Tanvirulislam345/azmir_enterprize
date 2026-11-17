"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: Locale;
  labels: Dictionary["language"];
  className?: string;
};

export function LanguageSwitcher({ locale, labels, className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const target: Locale = locale === "bn" ? "en" : "bn";
  const href = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${target}`);

  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={labels.switchToLabel}
      onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-semibold transition-colors hover:border-accent hover:text-accent",
        className,
      )}
    >
      <Languages aria-hidden className="size-4" />
      {labels.switchTo}
    </Link>
  );
}
