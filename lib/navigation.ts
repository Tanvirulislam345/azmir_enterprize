import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { aboutRepository } from "@/lib/about/about-repository";
import { productRepository } from "@/lib/products/product-repository";
import { routes } from "@/lib/routes";
import type { NavAboutPage, NavCategory } from "@/types/navigation";

/** Primary site links, shared by header and footer. */
export function getPrimaryLinks(locale: Locale, labels: Dictionary["nav"]) {
  return {
    home: { href: routes.home(locale), label: labels.home },
    products: { href: routes.products(locale), label: labels.products },
    transportation: { href: routes.transportation(locale), label: labels.transportation },
    projects: { href: routes.projects(locale), label: labels.projects },
    about: { href: routes.about(locale), label: labels.about },
    contact: { href: routes.contact(locale), label: labels.contact },
  };
}

/** Menu tree built from the same repository the catalogue pages use. */
export async function getNavCategories(locale: Locale): Promise<NavCategory[]> {
  const categories = await productRepository.getPublishedCategories();

  return categories.map((category) => ({
    id: category.id,
    // A category is a section of the products page.
    href: routes.category(locale, category.slug),
    label: category.name[locale],
    icon: category.icon,
    variants: category.variants.map((variant) => ({
      href: routes.product(locale, category.slug, variant.slug),
      label: variant.name[locale],
    })),
  }));
}

/** About sub-pages (Managing Director, IT Support Team, …) for the About menu and mobile drawer. */
export async function getNavAboutPages(locale: Locale): Promise<NavAboutPage[]> {
  const pages = await aboutRepository.getAboutPages();
  return pages.map((page) => ({
    id: page.id,
    href: routes.aboutPage(locale, page.slug),
    label: page.title[locale],
    summary: page.summary[locale],
    icon: page.icon,
  }));
}
