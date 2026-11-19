import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { LocalizedText } from "@/types/i18n";
import type { ProductCategory, ProductVariant } from "@/types/product";
import { Reveal } from "@/components/motion/reveal";

type CategorySummaryProps = {
  category: ProductCategory;
  locale: Locale;
  dictionary: Dictionary;
  inverse?: boolean;
};

/** Attributes worth comparing side by side; longer notes (use, size guide, unit) stay on the details page. */
const SUMMARY_ATTRIBUTES = new Set(["Origin", "Source", "Type"]);

type Column =
  | { kind: "option"; key: string; label: LocalizedText }
  | { kind: "attribute"; key: string; label: LocalizedText };

/** Columns that at least one product in the category has: option groups first, then the key attributes. */
function summaryColumns(variants: ProductVariant[]): Column[] {
  const options = new Map<string, LocalizedText>();
  const attributes = new Map<string, LocalizedText>();
  for (const variant of variants) {
    variant.options?.forEach((group) =>
      options.set(group.label.en, group.label),
    );
    variant.attributes?.forEach((item) => {
      if (SUMMARY_ATTRIBUTES.has(item.label.en))
        attributes.set(item.label.en, item.label);
    });
  }
  return [
    ...[...options].map(([key, label]) => ({
      kind: "option" as const,
      key,
      label,
    })),
    ...[...attributes].map(([key, label]) => ({
      kind: "attribute" as const,
      key,
      label,
    })),
  ];
}

/** Whether a category has anything to compare in its summary. */
export const hasSummaryColumns = (
  category: Pick<ProductCategory, "variants">,
) => summaryColumns(category.variants).length > 0;

/**
 * "At a glance" summary under a catalogue chapter: every product in the category with its sizes, grade, packing,
 * origin and type, each linking to its details page. Columns come from the data, so a category only shows what its
 * products actually have; with nothing to compare it renders nothing (see `hasSummaryColumns`).
 */
export function CategorySummary({
  category,
  locale,
  dictionary,
  inverse = false,
}: CategorySummaryProps) {
  const copy = dictionary.productsPage;
  const columns = summaryColumns(category.variants);
  if (columns.length === 0) return null;
  const tone = inverse
    ? {
        card: "border-white/10 bg-white/[0.04]",
        head: "bg-white/[0.06]",
        line: "divide-white/10 border-white/10",
        text: "text-inverse-foreground",
        muted: "text-inverse-muted",
        hover: "hover:bg-white/[0.06]",
      }
    : {
        card: "border-border bg-surface",
        head: "bg-surface-muted/70",
        line: "divide-border border-border",
        text: "text-foreground",
        muted: "text-muted",
        hover: "hover:bg-surface-muted/50",
      };
  const href = (variant: ProductVariant) =>
    routes.product(locale, category.slug, variant.slug);

  return (
    <Reveal>
      <div
        id={`${category.slug}-summary`}
        className="scroll-mt-[calc(var(--header-offset)+5rem)] space-y-5"
      >
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <h3 className={cn("text-xl font-bold tracking-tight", tone.text)}>
            {copy.summaryTitle}
          </h3>
          <p className={cn("text-sm", tone.muted)}>{copy.summaryDescription}</p>
        </div>

        {/* Tablets and up: a comparison table; each row is one product. */}
        <div
          className={cn(
            "hidden overflow-hidden rounded-2xl border md:block",
            tone.card,
          )}
        >
          <table className="w-full text-left text-sm">
            <thead
              className={cn("text-xs font-semibold", tone.head, tone.muted)}
            >
              <tr>
                <th scope="col" className="px-5 py-3">
                  {copy.summaryProduct}
                </th>
                {columns.map((column) => (
                  <th key={column.key} scope="col" className="px-4 py-3">
                    {column.label[locale]}
                  </th>
                ))}
                <th scope="col" className="w-12">
                  <span className="sr-only">
                    {dictionary.common.viewDetails}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", tone.line)}>
              {category.variants.map((variant) => (
                <tr
                  key={variant.id}
                  className={cn(
                    "group relative align-top transition-colors duration-200",
                    tone.hover,
                  )}
                >
                  <td className="max-w-xs px-5 py-4">
                    {/* The name's link stretches over the whole row. */}
                    <Link
                      href={href(variant)}
                      className={cn(
                        "font-semibold transition-colors group-hover:text-accent after:absolute after:inset-0",
                        tone.text,
                      )}
                    >
                      {variant.name[locale]}
                    </Link>
                    {variant.shortDescription && (
                      <p
                        className={cn(
                          "mt-1 text-xs leading-relaxed",
                          tone.muted,
                        )}
                      >
                        {variant.shortDescription[locale]}
                      </p>
                    )}
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4">
                      <SummaryCell
                        variant={variant}
                        column={column}
                        locale={locale}
                        tone={tone}
                      />
                    </td>
                  ))}
                  <td className="py-4 pr-5 text-right">
                    <ArrowUpRight
                      aria-hidden
                      className="ml-auto size-4 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phones: one card per product. */}
        <ul className="grid gap-3 md:hidden">
          {category.variants.map((variant) => (
            <li key={variant.id}>
              <Link
                href={href(variant)}
                className={cn(
                  "group block rounded-2xl border p-4 transition-colors duration-300 hover:border-accent/60",
                  tone.card,
                )}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className={cn("font-semibold", tone.text)}>
                    {variant.name[locale]}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-accent"
                  />
                </span>
                {variant.shortDescription && (
                  <span className={cn("mt-1 block text-xs", tone.muted)}>
                    {variant.shortDescription[locale]}
                  </span>
                )}
                <span
                  className={cn("mt-3 grid gap-2.5 border-t pt-3", tone.line)}
                >
                  {columns.map((column) => (
                    <span
                      key={column.key}
                      className="grid grid-cols-[6.5rem_1fr] items-start gap-3 text-xs"
                    >
                      <span className={tone.muted}>{column.label[locale]}</span>
                      <SummaryCell
                        variant={variant}
                        column={column}
                        locale={locale}
                        tone={tone}
                      />
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function SummaryCell({
  variant,
  column,
  locale,
  tone,
}: {
  variant: ProductVariant;
  column: Column;
  locale: Locale;
  tone: { text: string; muted: string };
}) {
  if (column.kind === "option") {
    const group = variant.options?.find((item) => item.label.en === column.key);
    if (!group) return <span className={tone.muted}>—</span>;
    return (
      <span className="flex flex-wrap gap-1">
        {group.values.map((value) => (
          <span
            key={value.en}
            className={cn(
              "rounded-full border border-accent/35 bg-accent/5 px-2 py-0.5 text-xs font-semibold whitespace-nowrap tabular-nums",
              tone.text,
            )}
          >
            {value[locale]}
          </span>
        ))}
      </span>
    );
  }
  const attribute = variant.attributes?.find(
    (item) => item.label.en === column.key,
  );
  return (
    <span className={attribute ? tone.text : tone.muted}>
      {attribute ? attribute.value[locale] : "—"}
    </span>
  );
}
