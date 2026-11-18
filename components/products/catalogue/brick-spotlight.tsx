import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import type { ProductCategory } from "@/types/product";
import { Parallax } from "@/components/motion/parallax";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductMedia } from "@/components/products/product-media";
import { ButtonLink } from "@/components/ui/button";
import { formatIndex } from "./format";

type BrickSpotlightProps = {
  category: ProductCategory;
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * `spotlight` layout: a split spotlight on a dark band. The lead product gets a large parallax photo
 * set against an offset accent frame; any further products follow as compact rows.
 */
export function BrickSpotlight({ category, locale, dictionary }: BrickSpotlightProps) {
  const [lead, ...others] = category.variants;
  if (!lead) return null;

  const name = lead.name[locale];
  const href = routes.product(locale, category.slug, lead.slug);

  return (
    <div className="space-y-12">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal variant="left" className="relative">
          {/* Offset frame sits behind the photo like the next course of bricks. */}
          <span aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-accent/70 sm:translate-x-6 sm:translate-y-6" />
          <Link href={href} className="group relative block aspect-[4/3] overflow-hidden rounded-[2rem] bg-inverse-foreground/5 shadow-lift">
            <Parallax className="absolute inset-x-0 -top-[8%] h-[116%]" distance={10}>
              <ProductMedia src={lead.image} alt={name} sizes="(min-width: 1024px) 55vw, 100vw" className="h-full w-full" />
            </Parallax>
          </Link>
        </Reveal>

        <Reveal variant="right" delay={0.1} className="space-y-6">
          <p className="text-sm font-semibold tracking-[0.2em] text-accent-soft tabular-nums">
            {formatIndex(1, locale)} / {formatIndex(category.variants.length, locale)}
          </p>
          <h3 className="text-4xl font-bold tracking-tight text-inverse-foreground sm:text-5xl">{name}</h3>
          <p className="max-w-lg text-lg text-inverse-muted">
            {lead.shortDescription?.[locale] ?? dictionary.productPage.detailsPending}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <ButtonLink href={href} withArrow>
              {dictionary.common.viewDetails}
            </ButtonLink>
            <ButtonLink href={routes.contact(locale)} variant="inverse">
              {dictionary.nav.requestQuote}
            </ButtonLink>
          </div>
        </Reveal>
      </div>

      {others.length > 0 && (
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((variant, index) => (
            <RevealItem key={variant.id}>
              <Link
                href={routes.product(locale, category.slug, variant.slug)}
                className="group flex items-center gap-4 rounded-2xl border border-inverse-foreground/15 p-3 transition-colors hover:border-accent"
              >
                <ProductMedia src={variant.image} alt={variant.name[locale]} sizes="96px" className="size-20 shrink-0 rounded-xl" />
                <span className="space-y-1">
                  <span className="block text-xs text-inverse-muted tabular-nums">{formatIndex(index + 2, locale)}</span>
                  <span className="block font-semibold text-inverse-foreground">{variant.name[locale]}</span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
