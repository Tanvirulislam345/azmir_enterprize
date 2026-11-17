import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { ProductWithCategory } from "@/types/product";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  items: ProductWithCategory[];
  locale: Locale;
  dictionary: Dictionary;
};

export function ProductGrid({ items, locale, dictionary }: ProductGridProps) {
  return (
    <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <RevealItem key={item.product.id}>
          <ProductCard {...item} locale={locale} dictionary={dictionary} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
