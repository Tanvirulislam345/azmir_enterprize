import type { LocalizedText } from "./i18n";

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
  name: LocalizedText;
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
