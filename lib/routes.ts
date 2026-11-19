import type { Locale } from "@/types/i18n";

/** Every internal URL is built here so links never drift from the route tree. */
export const routes = {
  home: (locale: Locale) => `/${locale}`,
  about: (locale: Locale) => `/${locale}/about`,
  aboutPage: (locale: Locale, slug: string) => `/${locale}/about/${slug}`,
  products: (locale: Locale) => `/${locale}/products`,
  /** A category is a section of the products page, not a page of its own. */
  category: (locale: Locale, category: string) => `/${locale}/products#${category}`,
  product: (locale: Locale, category: string, slug: string) => `/${locale}/products/${category}/${slug}`,
  transportation: (locale: Locale) => `/${locale}/transportation`,
  projects: (locale: Locale) => `/${locale}/projects`,
  contact: (locale: Locale) => `/${locale}/contact`,
} as const;
