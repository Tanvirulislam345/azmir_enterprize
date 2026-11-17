import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import type { ProductCategory } from "@/types/product";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductCategoryCard } from "@/components/products/product-category-card";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

type ProductCategorySectionProps = {
  categories: ProductCategory[];
  locale: Locale;
  dictionary: Dictionary;
  /** Hide the section heading when the page already provides one. */
  showHeading?: boolean;
};

export function ProductCategorySection({ categories, locale, dictionary, showHeading = true }: ProductCategorySectionProps) {
  const { categories: copy } = dictionary;

  return (
    <section className="bg-surface-muted/60 py-20 sm:py-28">
      <PageContainer className="space-y-12">
        {showHeading && <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />}

        {categories.length > 0 ? (
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <RevealItem key={category.id}>
                <ProductCategoryCard category={category} locale={locale} dictionary={dictionary} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <Reveal className="flex flex-col items-start gap-6 rounded-2xl border border-dashed border-border bg-surface p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-muted">{copy.empty}</p>
            <ButtonLink href={routes.contact(locale)} withArrow>
              {dictionary.cta.button}
            </ButtonLink>
          </Reveal>
        )}
      </PageContainer>
    </section>
  );
}
