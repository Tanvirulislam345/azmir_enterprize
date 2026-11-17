"use client";

import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { HeaderMenu } from "./header-menu";

// Language names are always shown in their own language.
const OPTIONS = [
  { value: "bn", label: "বাংলা", lang: "bn" },
  { value: "en", label: "English", lang: "en" },
] satisfies { value: Locale; label: string; lang: string }[];

type LanguageMenuProps = {
  locale: Locale;
  labels: Dictionary["language"];
};

export function LanguageMenu({ locale, labels }: LanguageMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const current = OPTIONS.find((option) => option.value === locale) ?? OPTIONS[0];

  const switchTo = (target: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
    router.push(pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${target}`), { scroll: false });
  };

  return (
    <HeaderMenu<Locale>
      id="language"
      label={`${labels.label}: ${current.label}`}
      trigger={
        <>
          <Globe aria-hidden className="size-4" />
          <span lang={current.lang} className="hidden sm:inline">
            {current.label}
          </span>
        </>
      }
      options={OPTIONS}
      value={locale}
      onSelect={switchTo}
    />
  );
}
