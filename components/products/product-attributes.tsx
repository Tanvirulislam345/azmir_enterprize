import type { Locale } from "@/lib/i18n/config";
import type { ProductAttribute } from "@/types/product";

type ProductAttributesProps = {
  attributes?: ProductAttribute[];
  locale: Locale;
  title: string;
  emptyMessage: string;
  /** The variant shows option chips; without attributes, nothing else is needed. */
  hasOptions?: boolean;
};

/** Shows only confirmed attributes; never fills gaps with assumed values. */
export function ProductAttributes({ attributes = [], locale, title, emptyMessage, hasOptions = false }: ProductAttributesProps) {
  if (attributes.length === 0 && hasOptions) return null;

  return (
    <section aria-labelledby="product-attributes" className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <h2 id="product-attributes" className="mb-5 text-xl font-bold">
        {title}
      </h2>
      {attributes.length > 0 ? (
        <dl className="divide-y divide-border">
          {attributes.map((attribute) => (
            <div key={attribute.label.en} className="grid grid-cols-2 gap-4 py-3 text-sm">
              <dt className="text-muted">{attribute.label[locale]}</dt>
              <dd className="font-medium">{attribute.value[locale]}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-muted">{emptyMessage}</p>
      )}
    </section>
  );
}
