import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ProductCategory, ProductVariant } from "@/types/product";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductMedia } from "@/components/products/product-media";
import { formatIndex } from "./format";

type StoneMosaicProps = {
  category: ProductCategory;
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * Grid spans for the mosaic. The lead tile is 2×2; the rest fill single cells, and any
 * incomplete last row stretches its tiles so the mosaic always ends on a clean edge.
 */
function tileSpans(count: number): string[] {
  const spans = ["col-span-2 row-span-2"];
  const rest = count - 1;

  // Mobile (2 columns): an odd one out at the end goes full width.
  const mobileLastWide = rest % 2 === 1;
  // Desktop (4 columns): the lead tile leaves 4 single cells beside it, then rows of 4.
  const tail = Math.max(rest - 4, 0) % 4;
  const tailStart = rest - tail;
  const desktopTail: Record<number, string[]> = {
    1: ["lg:col-span-4"],
    2: ["lg:col-span-2", "lg:col-span-2"],
    3: ["lg:col-span-2", "lg:col-span-1", "lg:col-span-1"],
  };

  for (let i = 0; i < rest; i++) {
    const mobile = mobileLastWide && i === rest - 1 ? "col-span-2" : "col-span-1";
    const desktop = rest > 4 && tail > 0 && i >= tailStart ? desktopTail[tail][i - tailStart] : "lg:col-span-1";
    spans.push(cn(mobile, desktop));
  }
  return spans;
}

/** Stone chapter: a bento mosaic of full-bleed photo tiles, led by the featured product. */
export function StoneMosaic({ category, locale, dictionary }: StoneMosaicProps) {
  // Featured product leads; the rest keep their catalogue order.
  const variants = [...category.variants].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  const spans = tileSpans(variants.length);

  return (
    <RevealGroup
      stagger={0.07}
      className="grid auto-rows-[10.5rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:gap-4 lg:grid-cols-4 lg:auto-rows-[14rem]"
    >
      {variants.map((variant, index) => (
        <RevealItem key={variant.id} className={spans[index]}>
          <StoneTile
            variant={variant}
            href={routes.product(locale, category.slug, variant.slug)}
            label={`${formatIndex(index + 1, locale)} / ${formatIndex(variants.length, locale)}`}
            lead={index === 0}
            locale={locale}
            dictionary={dictionary}
          />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

type StoneTileProps = {
  variant: ProductVariant;
  href: string;
  label: string;
  lead: boolean;
  locale: Locale;
  dictionary: Dictionary;
};

function StoneTile({ variant, href, label, lead, locale, dictionary }: StoneTileProps) {
  const name = variant.name[locale];

  return (
    <Link
      href={href}
      className="group relative isolate block h-full overflow-hidden rounded-2xl bg-surface-muted shadow-soft ring-1 ring-border transition-shadow duration-500 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-accent"
    >
      <ProductMedia
        src={variant.image}
        alt={name}
        sizes={lead ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
        className="h-full w-full"
      />
      {/* Permanent legibility gradient under the caption. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" />

      <span className="absolute top-3 left-3 rounded-full bg-black/35 px-2.5 py-1 text-[0.7rem] font-semibold tracking-wider text-white backdrop-blur-sm tabular-nums sm:top-4 sm:left-4">
        {label}
      </span>
      <span
        aria-hidden
        className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-accent text-accent-foreground opacity-0 transition-all duration-500 ease-out-expo group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:-translate-y-2 motion-safe:rotate-45 motion-safe:group-hover:translate-y-0 motion-safe:group-hover:rotate-0 sm:top-4 sm:right-4"
      >
        <ArrowUpRight className="size-4" />
      </span>

      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 transition-transform duration-500 ease-out-expo motion-safe:group-hover:-translate-y-1.5 sm:p-5">
        {lead && variant.featured && (
          <span className="w-fit rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
            {dictionary.productsPage.featured}
          </span>
        )}
        <span className={cn("font-semibold text-white", lead ? "text-2xl sm:text-3xl" : "text-sm sm:text-lg")}>{name}</span>
        <span
          aria-hidden
          className="h-0.5 w-8 origin-left bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-x-[2.5]"
        />
      </span>
    </Link>
  );
}
