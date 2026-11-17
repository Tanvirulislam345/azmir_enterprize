import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { ProductWithCategory } from "@/types/product";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "./product-grid";

type RelatedProductsProps = {
  items: ProductWithCategory[];
  locale: Locale;
  dictionary: Dictionary;
};

export function RelatedProducts({ items, locale, dictionary }: RelatedProductsProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-10">
      <SectionHeading title={dictionary.productPage.related} />
      <ProductGrid items={items} locale={locale} dictionary={dictionary} />
    </section>
  );
}
