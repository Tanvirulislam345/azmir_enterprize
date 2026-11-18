import type { CategoryIconName } from "@/lib/products/category-icons";
import type { LocalizedText } from "./i18n";

/**
 * Catalogue chapter design for a category on the products page:
 * `mosaic` bento tiles, `panels` expanding photo panels, `spotlight` dark split feature,
 * `showcase` lead banner with portrait cards (the default).
 */
export type CategoryLayout = "mosaic" | "panels" | "spotlight" | "showcase";

export type ProductAttribute = {
  label: LocalizedText;
  value: LocalizedText;
};

export type ProductVariant = {
  id: string;
  slug: string;
  name: LocalizedText;
  shortDescription?: LocalizedText;
  description?: LocalizedText;
  image?: string;
  gallery?: string[];
  attributes?: ProductAttribute[];
  isPublished: boolean;
  featured?: boolean;
  sortOrder: number;
};

export type ProductCategory = {
  id: string;
  slug: string;
  layout?: CategoryLayout;
  icon?: CategoryIconName;
  name: LocalizedText;
  /** One-word label for tight spaces such as mobile tabs, e.g. "Stone". */
  shortName?: LocalizedText;
  description?: LocalizedText;
  image?: string;
  isPublished: boolean;
  sortOrder: number;
  variants: ProductVariant[];
};

/** A variant resolved for display, carrying the category it belongs to. */
export type ProductWithCategory = {
  product: ProductVariant;
  category: Pick<ProductCategory, "id" | "slug" | "name">;
};
