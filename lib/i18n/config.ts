import { locales, type Locale } from "@/types/i18n";

export { locales, type Locale };

export const defaultLocale: Locale = "bn";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
