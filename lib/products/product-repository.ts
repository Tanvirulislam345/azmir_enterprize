import { categories } from "@/data/categories";
import type { ProductCategory, ProductWithCategory } from "@/types/product";
import { getVisibleCategories } from "./product-utils";

/**
 * The single data access point for categories and products.
 * Navigation, catalogue pages, sitemap and static params all go through it,
 * so swapping the local data for an API later only touches this file.
 */
export interface ProductRepository {
  getPublishedCategories(): Promise<ProductCategory[]>;
  getCategoryBySlug(slug: string): Promise<ProductCategory | null>;
  getProductBySlug(categorySlug: string, productSlug: string): Promise<ProductWithCategory | null>;
  getFeaturedProducts(): Promise<ProductWithCategory[]>;
  getRelatedProducts(categorySlug: string, productSlug: string, limit?: number): Promise<ProductWithCategory[]>;
  /**
   * Every known route param, including drafts. Cache Components requires non-empty static params,
   * and hidden items still resolve to a 404 because pages read through the visibility-aware methods.
   */
  getCategoryRouteParams(): Promise<{ category: string }[]>;
  getProductRouteParams(): Promise<{ category: string; slug: string }[]>;
}

const toProductWithCategory = (category: ProductCategory) =>
  category.variants.map<ProductWithCategory>((product) => ({
    product,
    category: { id: category.id, slug: category.slug, name: category.name },
  }));

export const productRepository: ProductRepository = {
  async getPublishedCategories() {
    return getVisibleCategories(categories);
  },

  async getCategoryBySlug(slug) {
    return getVisibleCategories(categories).find((category) => category.slug === slug) ?? null;
  },

  async getProductBySlug(categorySlug, productSlug) {
    const category = await this.getCategoryBySlug(categorySlug);
    const product = category?.variants.find((variant) => variant.slug === productSlug);
    return category && product ? { product, category } : null;
  },

  async getFeaturedProducts() {
    return getVisibleCategories(categories)
      .flatMap(toProductWithCategory)
      .filter(({ product }) => product.featured);
  },

  async getRelatedProducts(categorySlug, productSlug, limit = 3) {
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return [];

    return toProductWithCategory(category)
      .filter(({ product }) => product.slug !== productSlug)
      .slice(0, limit);
  },

  async getCategoryRouteParams() {
    return categories.map((category) => ({ category: category.slug }));
  },

  async getProductRouteParams() {
    return categories.flatMap((category) =>
      category.variants.map((variant) => ({ category: category.slug, slug: variant.slug })),
    );
  },
};
