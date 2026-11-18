import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { productRepository } from "@/lib/products/product-repository";
import { projectRepository } from "@/lib/projects/project-repository";
import { CompanyIntro } from "@/components/home/company-intro";
import { EnquiryCta } from "@/components/home/enquiry-cta";
import { HeroSection } from "@/components/home/hero/hero-section";
import { ProductCategorySection } from "@/components/home/product-category-section";
import { SelectedProjects } from "@/components/home/selected-projects";
import { SupplyProcess } from "@/components/home/supply-process";
import { TransportHighlight } from "@/components/home/transport-highlight";
import { WhyChooseUs } from "@/components/home/why-choose-us";

export default async function HomePage() {
  const locale = await resolveLocale();
  const [dictionary, categories, projects] = await Promise.all([
    getDictionary(locale),
    productRepository.getPublishedCategories(),
    projectRepository.getSelectedProjects(),
  ]);

  return (
    <>
      <HeroSection locale={locale} dictionary={dictionary} />
      <CompanyIntro categories={categories} locale={locale} dictionary={dictionary} />
      <TransportHighlight categories={categories} locale={locale} dictionary={dictionary} />
      <ProductCategorySection
        categories={categories}
        locale={locale}
        dictionary={dictionary}
      />
      <WhyChooseUs dictionary={dictionary} />
      <SupplyProcess dictionary={dictionary} />
      <SelectedProjects projects={projects.slice(0, 6)} total={projects.length} locale={locale} dictionary={dictionary} />
      <EnquiryCta locale={locale} dictionary={dictionary} />
    </>
  );
}
