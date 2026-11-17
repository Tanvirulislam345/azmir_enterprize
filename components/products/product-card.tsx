import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import type { ProductWithCategory } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { ProductMedia } from "./product-media";

type ProductCardProps = ProductWithCategory & {
  locale: Locale;
  dictionary: Dictionary;
};

export function ProductCard({ product, category, locale, dictionary }: ProductCardProps) {
  const name = product.name[locale];

  return (
    <Link
      href={routes.product(locale, category.slug, product.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:border-accent/50 hover:shadow-lift"
    >
      <ProductMedia
        src={product.image}
        alt={name}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-[4/3]"
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-sm text-muted">{category.name[locale]}</p>
        <h3 className="text-lg font-semibold">{name}</h3>
        {product.shortDescription && <p className="text-sm text-muted">{product.shortDescription[locale]}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
            {dictionary.common.viewDetails}
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          {!product.isPublished && <Badge>{dictionary.common.draft}</Badge>}
        </div>
      </div>
    </Link>
  );
}
