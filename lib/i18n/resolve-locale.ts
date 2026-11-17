import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale, type Locale } from "./config";

/**
 * Reads the `[lang]` root parameter and 404s for unsupported locales.
 * Root params are shared by every route under the root layout, so reading them
 * doesn't block instant navigation the way awaiting a page's `params` does.
 */
export async function resolveLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}
