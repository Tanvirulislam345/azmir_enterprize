import type { Locale } from "@/lib/i18n/config";
import type { ProductOptionGroup } from "@/types/product";

type ProductOptionsProps = {
  options?: ProductOptionGroup[];
  locale: Locale;
  title: string;
};

/** Sizes, grades, packing and other choices for a product, each group as a row of chips. */
export function ProductOptions({ options = [], locale, title }: ProductOptionsProps) {
  if (options.length === 0) return null;

  return (
    <section aria-labelledby="product-options" className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <h2 id="product-options" className="mb-5 text-xl font-bold">
        {title}
      </h2>
      <div className="space-y-5">
        {options.map((group) => (
          <div key={group.label.en} className="space-y-2.5">
            <h3 className="text-sm text-muted">{group.label[locale]}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.values.map((value) => (
                <li
                  key={value.en}
                  className="rounded-full border border-accent/40 bg-accent/5 px-3.5 py-1.5 text-sm font-semibold text-foreground tabular-nums transition-colors duration-300 hover:border-accent hover:bg-accent/10"
                >
                  {value[locale]}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
