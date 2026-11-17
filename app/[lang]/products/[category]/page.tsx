import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { productRepository } from "@/lib/products/product-repository";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { EnquiryCta } from "@/components/home/enquiry-cta";
import { PageHero } from "@/components/layout/page-hero";
import { photos } from "@/data/photos";
import { ProductGrid } from "@/components/products/product-grid";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

type CategoryPageProps = PageProps<"/[lang]/products/[category]">;

export async function generateStaticParams() {
  return productRepository.getCategoryRouteParams();
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const locale = await resolveLocale();
  const category = await productRepository.getCategoryBySlug((await params).category);
  if (!category) return {};

  return buildMetadata({
    locale,
    title: category.name[locale],
    description: category.description?.[locale] ?? category.name[locale],
    path: `/products/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const locale = await resolveLocale();
  const [dictionary, category] = await Promise.all([
    getDictionary(locale),
    productRepository.getCategoryBySlug((await params).category),
  ]);
  if (!category) notFound();

  const name = category.name[locale];
  const items = category.variants.map((product) => ({ product, category }));

  return (
    <>
      <PageHero
        photo={photos.bholaganj}
        title={name}
        description={category.description?.[locale]}
        breadcrumbs={[
          { href: routes.home(locale), label: dictionary.common.home },
          { href: routes.products(locale), label: dictionary.nav.products },
          { href: routes.category(locale, category.slug), label: name },
        ]}
      />
      <section className="py-20 sm:py-24">
        <PageContainer className="space-y-12">
          <SectionHeading title={dictionary.categoryPage.productsTitle} />
          <ProductGrid items={items} locale={locale} dictionary={dictionary} />
        </PageContainer>
      </section>
      <EnquiryCta locale={locale} dictionary={dictionary} title={dictionary.categoryPage.enquire} />
    </>
  );
}
