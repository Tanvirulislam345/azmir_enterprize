import type { ProductCategory, ProductVariant } from "@/types/product";

/**
 * Draft preview is a server-only, development-time switch.
 * It can never be enabled in a production build.
 */
export const isDraftPreview =
  process.env.NODE_ENV !== "production" && process.env.SHOW_DRAFT_CONTENT === "true";

const bySortOrder = <T extends { sortOrder: number }>(a: T, b: T) => a.sortOrder - b.sortOrder;

const isVisible = (item: { isPublished: boolean }) => isDraftPreview || item.isPublished;

/** Returns the category with only visible variants, or null if it should not be shown at all. */
export function toVisibleCategory(category: ProductCategory): ProductCategory | null {
  if (!isVisible(category)) return null;

  const variants = category.variants.filter(isVisible).sort(bySortOrder);
  // A category appears only when it has at least one visible variant.
  return variants.length > 0 ? { ...category, variants } : null;
}

export function getVisibleCategories(source: readonly ProductCategory[]): ProductCategory[] {
  return source
    .map(toVisibleCategory)
    .filter((category): category is ProductCategory => category !== null)
    .sort(bySortOrder);
}

export const isDraft = (item: Pick<ProductVariant, "isPublished">) => !item.isPublished;
