import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import type { ProductCategory } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { ProductMedia } from "./product-media";

type ProductCategoryCardProps = {
  category: ProductCategory;
  locale: Locale;
  dictionary: Dictionary;
};

export function ProductCategoryCard({ category, locale, dictionary }: ProductCategoryCardProps) {
  const name = category.name[locale];

  return (
    <Link
      href={routes.category(locale, category.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-lift"
    >
      <ProductMedia
        src={category.image}
        alt={name}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-[4/3]"
      />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold">{name}</h3>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border transition-all duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
            <ArrowUpRight aria-hidden className="size-4" />
          </span>
        </div>
        {category.description && <p className="text-sm text-muted">{category.description[locale]}</p>}
        <div className="mt-auto flex items-center gap-2 pt-2 text-sm font-medium text-accent">
          {category.variants.length === 1
            ? dictionary.categories.variantsCountOne
            : dictionary.categories.variantsCount.replace("{count}", String(category.variants.length))}
          {!category.isPublished && <Badge>{dictionary.common.draft}</Badge>}
        </div>
      </div>
    </Link>
  );
}
