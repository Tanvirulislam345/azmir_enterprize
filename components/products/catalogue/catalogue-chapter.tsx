import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { CategoryLayout, ProductCategory } from "@/types/product";
import { CategoryShowcase } from "@/components/products/category-showcase";
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

/** Fixed backdrops for the bold layouts; the rest alternate by position so neighbouring chapters never blend. */
const LAYOUT_THEMES: Partial<Record<CategoryLayout, Theme>> = {
  panels: { section: "bg-accent-soft/15" },
  spotlight: { section: "bg-inverse", inverse: true },
};

function chapterTheme(layout: CategoryLayout, number: number): Theme {
  return LAYOUT_THEMES[layout] ?? { section: number % 2 === 0 ? "bg-surface-muted/60" : "bg-background" };
}

/** Body of a chapter, chosen by the category's `layout` (see `CategoryLayout`). */
function ChapterBody({ category, locale, dictionary }: Omit<CatalogueChapterProps, "number">) {
  switch (category.layout ?? "showcase") {
    case "mosaic":
      return <StoneMosaic category={category} locale={locale} dictionary={dictionary} />;
    case "panels":
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
    case "spotlight":
      return <BrickSpotlight category={category} locale={locale} dictionary={dictionary} />;
    case "showcase":
      return <CategoryShowcase category={category} locale={locale} dictionary={dictionary} />;
  }
}

export function CatalogueChapter({ category, number, locale, dictionary }: CatalogueChapterProps) {
  const theme = chapterTheme(category.layout ?? "showcase", number);

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
