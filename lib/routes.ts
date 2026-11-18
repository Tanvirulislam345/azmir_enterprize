import type { Locale } from "@/types/i18n";

/** Every internal URL is built here so links never drift from the route tree. */
export const routes = {
  home: (locale: Locale) => `/${locale}`,
  about: (locale: Locale) => `/${locale}/about`,
  products: (locale: Locale) => `/${locale}/products`,
  category: (locale: Locale, category: string) => `/${locale}/products/${category}`,
  product: (locale: Locale, category: string, slug: string) => `/${locale}/products/${category}/${slug}`,
  transportation: (locale: Locale) => `/${locale}/transportation`,
  projects: (locale: Locale) => `/${locale}/projects`,
  contact: (locale: Locale) => `/${locale}/contact`,
} as const;
