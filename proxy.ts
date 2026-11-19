import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, defaultLocale, hasLocale, locales } from "@/lib/i18n/config";

/** "/en/products/stone" → locale and category; a category has no page of its own, only a section on /products. */
const CATEGORY_PAGE = /^\/([^/]+)\/products\/([^/]+)\/?$/;

/**
 * Redirects locale-less URLs to the visitor's saved locale, or Bengali by default, and old category page URLs to
 * their section on the products page.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const categoryPage = CATEGORY_PAGE.exec(pathname);
  if (categoryPage && hasLocale(categoryPage[1])) {
    const url = request.nextUrl.clone();
    url.pathname = `/${categoryPage[1]}/products`;
    url.hash = categoryPage[2];
    return NextResponse.redirect(url, 308);
  }

  const hasLocalePrefix = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (hasLocalePrefix) return;

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = saved && hasLocale(saved) ? saved : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, metadata routes and any path with a file extension.
  matcher: ["/((?!_next|sitemap.xml|robots.txt|.*\\..*).*)"],
};
