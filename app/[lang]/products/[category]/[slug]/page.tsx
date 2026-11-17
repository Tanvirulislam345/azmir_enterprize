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
import { Reveal } from "@/components/motion/reveal";
import { ProductAttributes } from "@/components/products/product-attributes";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductMedia } from "@/components/products/product-media";
import { RelatedProducts } from "@/components/products/related-products";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/ui/page-container";

type ProductPageProps = PageProps<"/[lang]/products/[category]/[slug]">;

export async function generateStaticParams() {
  return productRepository.getProductRouteParams();
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { category, slug } = await params;
  const result = await productRepository.getProductBySlug(category, slug);
  if (!result) return {};

  const { product } = result;
  return buildMetadata({
    locale,
    title: product.name[locale],
    description: product.shortDescription?.[locale] ?? `${product.name[locale]} — ${result.category.name[locale]}`,
    path: `/products/${category}/${slug}`,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const locale = await resolveLocale(params);
  const { category: categorySlug, slug } = await params;
  const [dictionary, result, related] = await Promise.all([
    getDictionary(locale),
    productRepository.getProductBySlug(categorySlug, slug),
    productRepository.getRelatedProducts(categorySlug, slug),
  ]);
  if (!result) notFound();

  const { product, category } = result;
  const name = product.name[locale];
  const gallery = product.gallery ?? (product.image ? [product.image] : []);

  return (
    <>
      <PageHero
        photo={photos.jaflong}
        eyebrow={category.name[locale]}
        title={name}
        description={product.shortDescription?.[locale]}
        breadcrumbs={[
          { href: routes.home(locale), label: dictionary.common.home },
          { href: routes.products(locale), label: dictionary.nav.products },
          { href: routes.category(locale, category.slug), label: category.name[locale] },
          { href: routes.product(locale, category.slug, product.slug), label: name },
        ]}
      />

      <section className="py-20 sm:py-24">
        <PageContainer className="grid items-start gap-12 lg:grid-cols-2">
          <Reveal variant="left">
            {gallery.length > 0 ? (
              <ProductGallery images={gallery} alt={name} />
            ) : (
              <ProductMedia alt={name} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] rounded-2xl" />
            )}
          </Reveal>
          <Reveal variant="right" className="space-y-6">
            {!product.isPublished && <Badge>{dictionary.common.draft}</Badge>}
            {product.description && <p className="text-lg text-muted">{product.description[locale]}</p>}
            <ProductAttributes
              attributes={product.attributes}
              locale={locale}
              title={dictionary.productPage.specifications}
              emptyMessage={dictionary.productPage.detailsPending}
            />
          </Reveal>
        </PageContainer>
      </section>

      <PageContainer>
        <RelatedProducts items={related} locale={locale} dictionary={dictionary} />
      </PageContainer>
      <EnquiryCta locale={locale} dictionary={dictionary} title={dictionary.productPage.enquire} />
    </>
  );
}
