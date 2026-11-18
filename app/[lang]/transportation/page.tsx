import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Truck } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { getCategoryIcon } from "@/lib/products/category-icons";
import { productRepository } from "@/lib/products/product-repository";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { EnquiryCta } from "@/components/home/enquiry-cta";
import { SupplyProcess } from "@/components/home/supply-process";
import { PageHero } from "@/components/layout/page-hero";
import { photos } from "@/data/photos";
import { ClipReveal } from "@/components/motion/clip-reveal";
import { Parallax } from "@/components/motion/parallax";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { formatIndex, formatNumber } from "@/components/products/catalogue/format";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const { transportation } = await getDictionary(locale);
  return buildMetadata({
    locale,
    title: transportation.metaTitle,
    description: transportation.metaDescription,
    path: "/transportation",
  });
}

/** Transportation service: what it is, everything in the catalogue it can carry, and how an order reaches the site. */
export default async function TransportationPage() {
  const locale = await resolveLocale();
  const [dictionary, categories] = await Promise.all([getDictionary(locale), productRepository.getPublishedCategories()]);
  const { transportation: copy } = dictionary;
  const truck = photos.tipperTruck;

  return (
    <>
      <PageHero
        photo={truck}
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        breadcrumbs={[
          { href: routes.home(locale), label: dictionary.common.home },
          { href: routes.transportation(locale), label: dictionary.nav.transportation },
        ]}
      />

      <section className="overflow-hidden py-20 sm:py-28">
        <PageContainer className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="space-y-8">
            <SectionHeading title={copy.introTitle} description={copy.introDescription} />
            <Reveal delay={0.1} className="flex flex-wrap gap-3">
              <ButtonLink href={routes.contact(locale)} withArrow>
                {dictionary.nav.requestQuote}
              </ButtonLink>
              <ButtonLink href={routes.products(locale)} variant="secondary">
                {dictionary.categories.viewAllProducts}
              </ButtonLink>
            </Reveal>
          </div>

          <div className="relative">
            {/* Offset frame behind the photo, with a truck badge riding its corner. */}
            <Reveal variant="fade" delay={0.5} className="absolute inset-0">
              <span aria-hidden className="absolute inset-0 -translate-x-4 translate-y-4 rounded-[1.75rem] border-2 border-accent/70 sm:-translate-x-6 sm:translate-y-6" />
            </Reveal>
            <div className="relative aspect-[4/3]">
              <ClipReveal>
                <div className="relative h-full overflow-hidden rounded-[1.75rem] bg-surface-muted shadow-lift">
                  <Parallax className="absolute inset-x-0 -top-[8%] h-[116%]" distance={10}>
                    <Image src={truck.src} alt={truck.alt[locale]} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
                  </Parallax>
                </div>
              </ClipReveal>
            </div>
            <Reveal variant="scale" delay={0.6} className="absolute -top-6 -right-2 sm:-right-6">
              <span aria-hidden className="grid size-16 place-items-center rounded-full bg-accent text-accent-foreground shadow-lift ring-8 ring-background sm:size-20">
                <Truck className="size-7 sm:size-8" />
              </span>
            </Reveal>
          </div>
        </PageContainer>
      </section>

      {categories.length > 0 && (
        <section className="bg-surface-muted/60 py-20 sm:py-28">
          <PageContainer className="space-y-12">
            <SectionHeading eyebrow={copy.carryEyebrow} title={copy.carryTitle} description={copy.carryDescription} />
            <RevealGroup stagger={0.07} className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-4">
              {categories.map((category, index) => {
                const Icon = getCategoryIcon(category);
                const count = category.variants.length;
                return (
                  <RevealItem key={category.id}>
                    <Link
                      href={routes.category(locale, category.slug)}
                      className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-[1.5rem] border border-border bg-surface p-6 shadow-soft transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                    >
                      {/* Accent wash that rises from the bottom on hover. */}
                      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-accent transition-[height] duration-500 ease-out-expo group-hover:h-1.5" />
                      <span className="flex items-start justify-between">
                        <span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-accent-foreground">
                          <Icon aria-hidden className="size-5" />
                        </span>
                        <span aria-hidden className="text-xs font-bold text-muted tabular-nums">
                          {formatIndex(index + 1, locale)}
                        </span>
                      </span>
                      <span className="mt-auto space-y-1">
                        <span className="block text-lg font-semibold">{category.name[locale]}</span>
                        <span className="flex items-center justify-between gap-2 text-sm text-muted">
                          {count === 1
                            ? dictionary.categories.variantsCountOne
                            : dictionary.categories.variantsCount.replace("{count}", formatNumber(count, locale))}
                          <ArrowUpRight aria-hidden className="size-4 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </span>
                    </Link>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </PageContainer>
        </section>
      )}

      <SupplyProcess dictionary={dictionary} content={copy.process} />
      <EnquiryCta locale={locale} dictionary={dictionary} title={copy.ctaTitle} />
    </>
  );
}
