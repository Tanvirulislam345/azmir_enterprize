import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { productRepository } from "@/lib/products/product-repository";
import { routes } from "@/lib/routes";
import type { NavCategory } from "@/types/navigation";

/** Primary site links, shared by header and footer. */
export function getPrimaryLinks(locale: Locale, labels: Dictionary["nav"]) {
  return {
    home: { href: routes.home(locale), label: labels.home },
    about: { href: routes.about(locale), label: labels.about },
    products: { href: routes.products(locale), label: labels.products },
    contact: { href: routes.contact(locale), label: labels.contact },
  };
}

/** Menu tree built from the same repository the catalogue pages use. */
export async function getNavCategories(locale: Locale): Promise<NavCategory[]> {
  const categories = await productRepository.getPublishedCategories();

  return categories.map((category) => ({
    id: category.id,
    href: routes.category(locale, category.slug),
    label: category.name[locale],
    variants: category.variants.map((variant) => ({
      href: routes.product(locale, category.slug, variant.slug),
      label: variant.name[locale],
    })),
  }));
}
