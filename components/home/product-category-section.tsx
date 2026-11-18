import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import type { ProductCategory } from "@/types/product";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink, SecondaryButton } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryPanels } from "./category-panels";

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
    <section className="overflow-hidden bg-surface-muted/60 py-20 sm:py-28">
      <PageContainer className="space-y-12">
        {showHeading && (
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
            {categories.length > 0 && (
              <Reveal variant="right">
                <SecondaryButton href={routes.products(locale)} withArrow>
                  {copy.viewAllProducts}
                </SecondaryButton>
              </Reveal>
            )}
          </div>
        )}

        {categories.length > 0 ? (
          <CategoryPanels categories={categories} locale={locale} dictionary={dictionary} />
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
