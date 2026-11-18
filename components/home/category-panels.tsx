import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import type { ProductCategory } from "@/types/product";
import { ExpandingPanels } from "@/components/products/catalogue/expanding-panels";
import { formatIndex, formatNumber } from "@/components/products/catalogue/format";

type CategoryPanelsProps = {
  categories: ProductCategory[];
  locale: Locale;
  dictionary: Dictionary;
  /** Catalogue position of each category, so numbering stays stable when some are filtered out. */
  numbers?: Record<string, number>;
  className?: string;
};

/** One photo panel per category, each opening onto its category page. */
export function CategoryPanels({ categories, locale, dictionary, numbers, className }: CategoryPanelsProps) {
  const copy = dictionary.categories;

  return (
    <ExpandingPanels
      size="lg"
      className={className}
      ctaLabel={copy.explore}
      items={categories.map((category, index) => ({
        id: category.id,
        href: routes.category(locale, category.slug),
        name: category.name[locale],
        image: category.image,
        index: formatIndex(numbers?.[category.id] ?? index + 1, locale),
        description: category.description?.[locale],
        meta:
          category.variants.length === 1
            ? copy.variantsCountOne
            : copy.variantsCount.replace("{count}", formatNumber(category.variants.length, locale)),
      }))}
    />
  );
}
