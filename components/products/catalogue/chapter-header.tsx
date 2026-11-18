import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/product";
import { Reveal } from "@/components/motion/reveal";
import { formatIndex, formatNumber } from "./format";

type ChapterHeaderProps = {
  category: ProductCategory;
  number: number;
  locale: Locale;
  dictionary: Dictionary;
  inverse?: boolean;
};

/** Opening of a catalogue chapter: outlined number, name, description and a "View all (n)" category link. */
export function ChapterHeader({ category, number, locale, dictionary, inverse = false }: ChapterHeaderProps) {
  const headingId = `${category.slug}-heading`;

  return (
    <div className="grid items-end gap-x-10 gap-y-6 lg:grid-cols-[auto_1fr_auto]">
      <Reveal variant="left">
        <span
          aria-hidden
          className="block text-[5.5rem] leading-[0.8] font-black tracking-tighter text-transparent [-webkit-text-stroke:1.5px_var(--accent)] sm:text-[8rem]"
        >
          {formatIndex(number, locale)}
        </span>
      </Reveal>

      <Reveal delay={0.08} className="max-w-2xl space-y-3">
        <h2
          id={headingId}
          className={cn("text-3xl font-bold tracking-tight sm:text-4xl", inverse ? "text-inverse-foreground" : "text-foreground")}
        >
          {category.name[locale]}
        </h2>
        {category.description && (
          <p className={cn("text-base sm:text-lg", inverse ? "text-inverse-muted" : "text-muted")}>
            {category.description[locale]}
          </p>
        )}
      </Reveal>

      <Reveal delay={0.16} variant="right">
        <Link
          href={routes.category(locale, category.slug)}
          className={cn(
            "group inline-flex items-center gap-2 border-b pb-1 text-sm font-semibold transition-colors",
            inverse
              ? "border-inverse-foreground/30 text-inverse-foreground hover:border-accent hover:text-accent-soft"
              : "border-border text-foreground hover:border-accent hover:text-accent",
          )}
        >
          {dictionary.productsPage.viewAll.replace("{count}", formatNumber(category.variants.length, locale))}
          <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </div>
  );
}
