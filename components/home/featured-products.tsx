import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import type { ProductWithCategory } from "@/types/product";
import { Reveal } from "@/components/motion/reveal";
import { ProductGrid } from "@/components/products/product-grid";
import { SecondaryButton } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

type FeaturedProductsProps = {
  items: ProductWithCategory[];
  locale: Locale;
  dictionary: Dictionary;
};

export function FeaturedProducts({ items, locale, dictionary }: FeaturedProductsProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <PageContainer className="space-y-12">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={dictionary.featured.eyebrow} title={dictionary.featured.title} />
          <Reveal variant="right">
            <SecondaryButton href={routes.products(locale)}>
              {dictionary.common.viewAll}
            </SecondaryButton>
          </Reveal>
        </div>
        <ProductGrid items={items} locale={locale} dictionary={dictionary} />
      </PageContainer>
    </section>
  );
}
