import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { productRepository } from "@/lib/products/product-repository";
import { getBaseUrl } from "@/lib/seo/metadata";

/** Lists only publicly visible routes, in every locale. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const categories = await productRepository.getPublishedCategories();

  const paths = [
    "",
    "/about",
    "/products",
    "/transportation",
    "/projects",
    "/contact",
    ...categories.flatMap((category) => [
      `/products/${category.slug}`,
      ...category.variants.map((variant) => `/products/${category.slug}/${variant.slug}`),
    ]),
  ];

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      alternates: { languages: Object.fromEntries(locales.map((code) => [code, `${baseUrl}/${code}${path}`])) },
    })),
  );
}
