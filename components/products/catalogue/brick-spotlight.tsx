import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import type { ProductCategory } from "@/types/product";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Tilt } from "@/components/motion/tilt";
import { ShowcaseCard } from "@/components/products/showcase-card";
import { formatIndex } from "./format";

type BrickSpotlightProps = {
  category: ProductCategory;
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * `spotlight` layout: the category's products as a row of photo cards on the dark band. Each card lifts its caption
 * and zooms its photo on hover, and opens the product's details page.
 */
export function BrickSpotlight({ category, locale, dictionary }: BrickSpotlightProps) {
  const total = formatIndex(category.variants.length, locale);

  return (
    <RevealGroup stagger={0.1} className="grid gap-4 sm:grid-cols-3 lg:gap-6">
      {category.variants.map((variant, index) => (
        <RevealItem key={variant.id} className="aspect-[4/3]">
          <Tilt>
            <ShowcaseCard
              href={routes.product(locale, category.slug, variant.slug)}
              name={variant.name[locale]}
              image={variant.image}
              index={`${formatIndex(index + 1, locale)} / ${total}`}
              description={variant.shortDescription?.[locale]}
              ctaLabel={dictionary.common.viewDetails}
              sizes="(min-width: 640px) 33vw, 100vw"
            />
          </Tilt>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
