import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { locales, type Locale } from "@/lib/i18n/config";

const OG_LOCALE: Record<Locale, string> = { bn: "bn_BD", en: "en_US" };

/** Absolute origin for sitemap/robots. Falls back to localhost until the production domain is confirmed. */
export const getBaseUrl = () => siteConfig.url || "http://localhost:3000";

type PageMetadataInput = {
  locale: Locale;
  title?: string;
  description: string;
  /** Path without the locale prefix, e.g. "/products/stone". */
  path?: string;
};

export function buildMetadata({ locale, title, description, path = "" }: PageMetadataInput): Metadata {
  // Canonical and hreflang are only emitted once a production domain is configured.
  const alternates = siteConfig.url
    ? {
        canonical: `/${locale}${path}`,
        languages: Object.fromEntries(locales.map((code) => [code, `/${code}${path}`])),
      }
    : undefined;

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
      locale: OG_LOCALE[locale],
    },
  };
}
