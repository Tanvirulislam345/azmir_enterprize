import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";

/** Reads the `[lang]` segment and 404s for unsupported locales. */
export async function resolveLocale(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return lang;
}
