import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { productRepository } from "@/lib/products/product-repository";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { EnquiryCta } from "@/components/home/enquiry-cta";
import { ProductCategorySection } from "@/components/home/product-category-section";
import { PageHero } from "@/components/layout/page-hero";
import { CatalogueChapter } from "@/components/products/catalogue/catalogue-chapter";
import { CategoryJumpNav } from "@/components/products/catalogue/category-jump-nav";
import { formatIndex } from "@/components/products/catalogue/format";
import { photos } from "@/data/photos";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const { productsPage } = await getDictionary(locale);
  return buildMetadata({ locale, title: productsPage.metaTitle, description: productsPage.metaDescription, path: "/products" });
}

export default async function ProductsPage() {
  const locale = await resolveLocale();
  const [dictionary, categories] = await Promise.all([getDictionary(locale), productRepository.getPublishedCategories()]);
  const { productsPage } = dictionary;

  return (
    <>
      <PageHero
        photo={photos.bholaganj}
        eyebrow={productsPage.eyebrow}
        title={productsPage.title}
        description={productsPage.description}
        breadcrumbs={[
          { href: routes.home(locale), label: dictionary.common.home },
          { href: routes.products(locale), label: dictionary.nav.products },
        ]}
      />

      {categories.length > 0 ? (
        <>
          <CategoryJumpNav
            label={productsPage.jumpLabel}
            items={categories.map((category, index) => ({
              id: category.slug,
              number: formatIndex(index + 1, locale),
              label: category.name[locale],
              shortLabel: category.shortName?.[locale] ?? category.name[locale],
            }))}
          />
          {categories.map((category, index) => (
            <CatalogueChapter key={category.id} category={category} number={index + 1} locale={locale} dictionary={dictionary} />
          ))}
        </>
      ) : (
        // Nothing published yet: keep the existing empty state with its contact prompt.
        <ProductCategorySection categories={categories} locale={locale} dictionary={dictionary} showHeading={false} />
      )}

      <EnquiryCta locale={locale} dictionary={dictionary} />
    </>
  );
}
