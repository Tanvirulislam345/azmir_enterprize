import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/product";
import { ProductGrid } from "@/components/products/product-grid";
import { PageContainer } from "@/components/ui/page-container";
import { BrickSpotlight } from "./brick-spotlight";
import { ChapterHeader } from "./chapter-header";
import { formatIndex } from "./format";
import { SandPanels } from "./sand-panels";
import { StoneMosaic } from "./stone-mosaic";

type CatalogueChapterProps = {
  category: ProductCategory;
  number: number;
  locale: Locale;
  dictionary: Dictionary;
};

type Theme = { section: string; inverse?: boolean };

/** Each known category gets its own backdrop; anything new falls back to the plain grid. */
const THEMES: Record<string, Theme> = {
  stone: { section: "bg-background" },
  sand: { section: "bg-accent-soft/15" },
  bricks: { section: "bg-inverse", inverse: true },
};

function ChapterBody({ category, locale, dictionary }: Omit<CatalogueChapterProps, "number">) {
  switch (category.id) {
    case "stone":
      return <StoneMosaic category={category} locale={locale} dictionary={dictionary} />;
    case "sand":
      return (
        <SandPanels
          viewDetails={dictionary.common.viewDetails}
          items={category.variants.map((variant, index) => ({
            id: variant.id,
            href: routes.product(locale, category.slug, variant.slug),
            name: variant.name[locale],
            image: variant.image,
            index: formatIndex(index + 1, locale),
          }))}
        />
      );
    case "bricks":
      return <BrickSpotlight category={category} locale={locale} dictionary={dictionary} />;
    default:
      return (
        <ProductGrid
          items={category.variants.map((product) => ({ product, category }))}
          locale={locale}
          dictionary={dictionary}
        />
      );
  }
}

export function CatalogueChapter({ category, number, locale, dictionary }: CatalogueChapterProps) {
  const theme = THEMES[category.id] ?? { section: number % 2 === 0 ? "bg-surface-muted/60" : "bg-background" };

  return (
    <section
      id={category.slug}
      aria-labelledby={`${category.slug}-heading`}
      // Clears the fixed header plus the sticky jump bar when reached via an anchor link.
      className={cn("scroll-mt-[calc(var(--header-offset)+4rem)] overflow-hidden py-20 sm:py-28", theme.section)}
    >
      <PageContainer className="space-y-12 sm:space-y-16">
        <ChapterHeader category={category} number={number} locale={locale} dictionary={dictionary} inverse={theme.inverse} />
        <ChapterBody category={category} locale={locale} dictionary={dictionary} />
      </PageContainer>
    </section>
  );
}
