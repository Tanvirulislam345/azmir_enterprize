import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductMedia } from "./product-media";

type ShowcaseCardProps = {
  href: string;
  name: string;
  image?: string;
  /** Small chip at the top left, e.g. the category name. */
  chip?: string;
  /** Index label at the top right of the caption, e.g. "01 / 07". */
  index?: string;
  /** Accent badge such as "Featured". */
  badge?: string;
  description?: string;
  ctaLabel: string;
  lead?: boolean;
  sizes: string;
  className?: string;
};

/**
 * Portrait photo card: full-bleed image, legibility gradient and a caption that lifts on hover
 * to reveal the description and call to action. Hover motion is limited to `motion-safe`.
 */
export function ShowcaseCard({
  href,
  name,
  image,
  chip,
  index,
  badge,
  description,
  ctaLabel,
  lead = false,
  sizes,
  className,
}: ShowcaseCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative isolate block h-full overflow-hidden rounded-[1.75rem] bg-surface-muted shadow-soft ring-1 ring-border outline-none transition-shadow duration-500 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
    >
      <ProductMedia src={image} alt={name} sizes={sizes} className="absolute inset-0" />
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/10" />

      <span className="absolute inset-x-4 top-4 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-5">
        <span className="flex flex-wrap gap-2">
          {chip && (
            <span className="rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">{chip}</span>
          )}
          {badge && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{badge}</span>
          )}
        </span>
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-500 ease-out-expo group-hover:bg-accent group-hover:text-accent-foreground motion-safe:group-hover:rotate-45"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </span>

      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-6">
        {index && <span className="text-xs font-semibold tracking-[0.2em] text-white/70 tabular-nums">{index}</span>}
        <span className={cn("font-semibold text-white", lead ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl")}>{name}</span>
        <span aria-hidden className="h-0.5 w-10 origin-left bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-x-[2.5]" />
        {/* Desktop folds the details away until hover or focus; touch screens always show them. */}
        <span className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-out-expo lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-visible:grid-rows-[1fr]">
          <span className="flex min-h-0 flex-col gap-2 overflow-hidden transition-opacity duration-500 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
            {description && <span className="line-clamp-2 max-w-md pt-1 text-sm text-white/75">{description}</span>}
            <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-accent-soft">
              {ctaLabel}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
}
