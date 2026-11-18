import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ProductCategory, ProductVariant } from "@/types/product";
import { ClipReveal } from "@/components/motion/clip-reveal";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { Tilt } from "@/components/motion/tilt";
import { formatIndex } from "@/components/products/catalogue/format";
import { ProductMedia } from "@/components/products/product-media";
import { ShowcaseCard } from "@/components/products/showcase-card";
import { ButtonLink } from "@/components/ui/button";

type CategoryShowcaseProps = {
  category: ProductCategory;
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * Product layout for a category page. A single product gets a split feature; larger ranges open
 * with the featured product as a wide banner, followed by staggered portrait cards.
 */
export function CategoryShowcase({ category, locale, dictionary }: CategoryShowcaseProps) {
  // Featured product leads; the rest keep their catalogue order.
  const variants = [...category.variants].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  const [lead, ...rest] = variants;
  if (!lead) return null;

  if (rest.length === 0) {
    return <SingleFeature variant={lead} category={category} locale={locale} dictionary={dictionary} />;
  }

  const total = formatIndex(variants.length, locale);
  const label = (index: number) => `${formatIndex(index + 1, locale)} / ${total}`;
  const href = (variant: ProductVariant) => routes.product(locale, category.slug, variant.slug);

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]">
        <ClipReveal>
          <Tilt max={2.5}>
            <ShowcaseCard
              lead
              href={href(lead)}
              name={lead.name[locale]}
              image={lead.image}
              index={label(0)}
              badge={lead.featured ? dictionary.productsPage.featured : undefined}
              description={lead.shortDescription?.[locale]}
              ctaLabel={dictionary.common.viewDetails}
              sizes="(min-width: 1280px) 1216px, 100vw"
            />
          </Tilt>
        </ClipReveal>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:pb-16">
        {rest.map((variant, index) => (
          <div
            key={variant.id}
            className={cn(
              "aspect-[4/5] sm:aspect-[3/4]",
              index % 3 === 1 && "lg:translate-y-16",
              // A lone last card on the two-column layout spans the row.
              index === rest.length - 1 && rest.length % 2 === 1 && "sm:col-span-2 sm:aspect-[16/9] lg:col-span-1 lg:aspect-[3/4]",
            )}
          >
            <ClipReveal delay={(index % 3) * 0.12}>
              <Tilt>
                <ShowcaseCard
                  href={href(variant)}
                  name={variant.name[locale]}
                  image={variant.image}
                  index={label(index + 1)}
                  description={variant.shortDescription?.[locale]}
                  ctaLabel={dictionary.common.viewDetails}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </Tilt>
            </ClipReveal>
          </div>
        ))}
      </div>
    </div>
  );
}

type SingleFeatureProps = CategoryShowcaseProps & { variant: ProductVariant };

/** One-product category: a parallax photo with an offset accent frame beside the product story. */
function SingleFeature({ variant, category, locale, dictionary }: SingleFeatureProps) {
  const name = variant.name[locale];
  const href = routes.product(locale, category.slug, variant.slug);

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <div className="relative">
        <Reveal variant="fade" delay={0.5} className="absolute inset-0">
          <span aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 rounded-[1.75rem] border-2 border-accent/70 sm:translate-x-6 sm:translate-y-6" />
        </Reveal>
        <div className="relative aspect-[4/3]">
          <ClipReveal>
            <Link href={href} className="group relative block h-full overflow-hidden rounded-[1.75rem] bg-surface-muted shadow-lift">
              <Parallax className="absolute inset-x-0 -top-[8%] h-[116%]" distance={10}>
                <ProductMedia src={variant.image} alt={name} sizes="(min-width: 1024px) 55vw, 100vw" className="h-full w-full" />
              </Parallax>
            </Link>
          </ClipReveal>
        </div>
      </div>

      <Reveal variant="right" delay={0.15} className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold tracking-[0.2em] text-accent tabular-nums">
            {formatIndex(1, locale)} / {formatIndex(1, locale)}
          </span>
          {variant.featured && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              {dictionary.productsPage.featured}
            </span>
          )}
        </div>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{name}</h2>
        <span aria-hidden className="block h-1 w-16 rounded-full bg-accent" />
        <p className="max-w-lg text-lg text-muted">
          {variant.shortDescription?.[locale] ?? dictionary.productPage.detailsPending}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <ButtonLink href={href} withArrow>
            {dictionary.common.viewDetails}
          </ButtonLink>
          <ButtonLink href={routes.contact(locale)} variant="secondary">
            {dictionary.nav.requestQuote}
          </ButtonLink>
        </div>
      </Reveal>
    </div>
  );
}
