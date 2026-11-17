import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { productRepository } from "@/lib/products/product-repository";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { EnquiryCta } from "@/components/home/enquiry-cta";
import { ProductCategorySection } from "@/components/home/product-category-section";
import { PageHero } from "@/components/layout/page-hero";
import { photos } from "@/data/photos";

export async function generateMetadata({ params }: PageProps<"/[lang]/products">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { productsPage } = await getDictionary(locale);
  return buildMetadata({ locale, title: productsPage.metaTitle, description: productsPage.metaDescription, path: "/products" });
}

export default async function ProductsPage({ params }: PageProps<"/[lang]/products">) {
  const locale = await resolveLocale(params);
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
      <ProductCategorySection categories={categories} locale={locale} dictionary={dictionary} showHeading={false} />
      <EnquiryCta locale={locale} dictionary={dictionary} />
    </>
  );
}
