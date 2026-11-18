import type { Locale } from "@/lib/i18n/config";

const LOCALE_TAGS: Record<Locale, string> = { bn: "bn-BD", en: "en-GB" };

/** Two-digit chapter/index number in the page's own numerals, e.g. "01" or "০১". */
export const formatIndex = (value: number, locale: Locale) =>
  new Intl.NumberFormat(LOCALE_TAGS[locale], { minimumIntegerDigits: 2, useGrouping: false }).format(value);

/** Plain number in the page's own numerals, e.g. "7" or "৭". */
export const formatNumber = (value: number, locale: Locale) => new Intl.NumberFormat(LOCALE_TAGS[locale]).format(value);
