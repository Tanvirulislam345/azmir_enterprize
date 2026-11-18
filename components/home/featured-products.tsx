import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ProductWithCategory } from "@/types/product";
import { ClipReveal } from "@/components/motion/clip-reveal";
import { Reveal } from "@/components/motion/reveal";
import { Tilt } from "@/components/motion/tilt";
import { formatIndex } from "@/components/products/catalogue/format";
import { ShowcaseCard } from "@/components/products/showcase-card";
import { SecondaryButton } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

type FeaturedProductsProps = {
  items: ProductWithCategory[];
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * Desktop placement on the six-track grid (three cards per row): the middle card of each full row drops
 * lower for a staggered rhythm, and a shorter last row is centred instead of hugging the left edge.
 */
function featuredPlacement(index: number, count: number) {
  const remainder = count % 3;
  const lastRowStart = count - remainder;
  if (index < lastRowStart) return index % 3 === 1 && "lg:translate-y-16";
  if (index !== lastRowStart) return undefined;
  return remainder === 2 ? "lg:col-start-2" : "lg:col-start-3";
}

/** Featured products as tall tilt cards, one per category. */
export function FeaturedProducts({ items, locale, dictionary }: FeaturedProductsProps) {
  if (items.length === 0) return null;

  return (
    <section className="overflow-hidden py-20 sm:py-28 lg:pb-40">
      <PageContainer className="space-y-12 sm:space-y-16">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={dictionary.featured.eyebrow} title={dictionary.featured.title} />
          <Reveal variant="right">
            <SecondaryButton href={routes.products(locale)} withArrow>
              {dictionary.common.viewAll}
            </SecondaryButton>
          </Reveal>
        </div>

        {/* Extra row gap on desktop leaves room for the lowered middle card. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-x-8 lg:gap-y-24">
          {items.map(({ product, category }, index) => (
            <div
              key={product.id}
              className={cn(
                "aspect-[4/5] sm:aspect-[3/4] lg:col-span-2",
                featuredPlacement(index, items.length),
                // A lone last card on the two-column layout spans the row.
                index === items.length - 1 && items.length % 2 === 1 && "sm:col-span-2 sm:aspect-[16/9] lg:aspect-[3/4]",
              )}
            >
              <ClipReveal delay={(index % 3) * 0.15}>
                <Tilt>
                  <ShowcaseCard
                    href={routes.product(locale, category.slug, product.slug)}
                    name={product.name[locale]}
                    image={product.image}
                    chip={category.name[locale]}
                    index={formatIndex(index + 1, locale)}
                    description={product.shortDescription?.[locale]}
                    ctaLabel={dictionary.common.viewDetails}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </Tilt>
              </ClipReveal>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
