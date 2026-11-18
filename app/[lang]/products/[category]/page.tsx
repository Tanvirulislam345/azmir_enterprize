import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { productRepository } from "@/lib/products/product-repository";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { CategoryPanels } from "@/components/home/category-panels";
import { EnquiryCta } from "@/components/home/enquiry-cta";
import { PageHero } from "@/components/layout/page-hero";
import { getCategoryHeroPhoto } from "@/data/photos";
import { formatIndex } from "@/components/products/catalogue/format";
import { CategoryShowcase } from "@/components/products/category-showcase";
import { CategorySwitcher } from "@/components/products/category-switcher";
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
  const { category: slug } = await params;
  const [dictionary, categories] = await Promise.all([getDictionary(locale), productRepository.getPublishedCategories()]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const copy = dictionary.categoryPage;
  const name = category.name[locale];
  const position = categories.indexOf(category) + 1;
  const numbers = Object.fromEntries(categories.map((item, index) => [item.id, index + 1]));
  const others = categories.filter((item) => item.id !== category.id);

  return (
    <>
      <PageHero
        photo={getCategoryHeroPhoto(category.id)}
        eyebrow={copy.eyebrow
          .replace("{n}", formatIndex(position, locale))
          .replace("{total}", formatIndex(categories.length, locale))}
        title={name}
        description={category.description?.[locale]}
        breadcrumbs={[
          { href: routes.home(locale), label: dictionary.common.home },
          { href: routes.products(locale), label: dictionary.nav.products },
          { href: routes.category(locale, category.slug), label: name },
        ]}
      />

      <CategorySwitcher
        label={copy.switcherLabel}
        allLabel={copy.allProducts}
        allHref={routes.products(locale)}
        activeId={category.id}
        items={categories.map((item) => ({
          id: item.id,
          href: routes.category(locale, item.slug),
          number: formatIndex(numbers[item.id], locale),
          label: item.name[locale],
          shortLabel: item.shortName?.[locale] ?? item.name[locale],
        }))}
      />

      <section className="overflow-hidden py-20 sm:py-24">
        <PageContainer className="space-y-12">
          <SectionHeading title={copy.productsTitle} />
          <CategoryShowcase category={category} locale={locale} dictionary={dictionary} />
        </PageContainer>
      </section>

      {others.length > 0 && (
        <section className="overflow-hidden bg-surface-muted/60 py-20 sm:py-24">
          <PageContainer className="space-y-12">
            <SectionHeading title={copy.otherCategories} description={copy.otherCategoriesDescription} />
            <CategoryPanels
              categories={others}
              numbers={numbers}
              locale={locale}
              dictionary={dictionary}
              className="lg:h-[26rem]"
            />
          </PageContainer>
        </section>
      )}

      <EnquiryCta locale={locale} dictionary={dictionary} title={copy.enquire} />
    </>
  );
}
