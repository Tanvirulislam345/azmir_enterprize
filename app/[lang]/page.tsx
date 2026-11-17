import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { productRepository } from "@/lib/products/product-repository";
import { CompanyIntro } from "@/components/home/company-intro";
import { EnquiryCta } from "@/components/home/enquiry-cta";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import { MaterialMarquee } from "@/components/home/material-marquee";
import { ProductCategorySection } from "@/components/home/product-category-section";
import { SupplyProcess } from "@/components/home/supply-process";
import { WhyChooseUs } from "@/components/home/why-choose-us";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const locale = await resolveLocale(params);
  const [dictionary, categories, featured] = await Promise.all([
    getDictionary(locale),
    productRepository.getPublishedCategories(),
    productRepository.getFeaturedProducts(),
  ]);
  const productNames = categories.flatMap((category) => category.variants.map((variant) => variant.name[locale]));

  return (
    <>
      <HeroSection locale={locale} dictionary={dictionary} />
      <MaterialMarquee items={productNames} />
      <CompanyIntro locale={locale} dictionary={dictionary} />
      <ProductCategorySection categories={categories} locale={locale} dictionary={dictionary} />
      <WhyChooseUs dictionary={dictionary} />
      <SupplyProcess dictionary={dictionary} />
      <FeaturedProducts items={featured} locale={locale} dictionary={dictionary} />
      <EnquiryCta locale={locale} dictionary={dictionary} />
    </>
  );
}
