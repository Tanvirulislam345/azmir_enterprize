import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { aboutRepository } from "@/lib/about/about-repository";
import { productRepository } from "@/lib/products/product-repository";
import { getBaseUrl } from "@/lib/seo/metadata";

/** Lists only publicly visible routes, in every locale. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const [categories, aboutPages] = await Promise.all([productRepository.getPublishedCategories(), aboutRepository.getAboutPages()]);

  const paths = [
    "",
    "/about",
    ...aboutPages.map((page) => `/about/${page.slug}`),
    "/products",
    "/transportation",
    "/projects",
    "/contact",
    // Categories are sections of /products, so only product details pages are listed.
    ...categories.flatMap((category) => category.variants.map((variant) => `/products/${category.slug}/${variant.slug}`)),
  ];

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      alternates: { languages: Object.fromEntries(locales.map((code) => [code, `${baseUrl}/${code}${path}`])) },
    })),
  );
}
