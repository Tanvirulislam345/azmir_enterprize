import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAboutIcon } from "@/lib/about/about-icons";
import { aboutRepository } from "@/lib/about/about-repository";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { EnquiryCta } from "@/components/home/enquiry-cta";
import { SupplyProcess } from "@/components/home/supply-process";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { PageHero } from "@/components/layout/page-hero";
import { photos } from "@/data/photos";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageContainer } from "@/components/ui/page-container";
import { CaptionedPhoto } from "@/components/ui/captioned-photo";
import { SectionHeading } from "@/components/ui/section-heading";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const { about } = await getDictionary(locale);
  return buildMetadata({ locale, title: about.metaTitle, description: about.metaDescription, path: "/about" });
}

export default async function AboutPage() {
  const locale = await resolveLocale();
  const [dictionary, pages] = await Promise.all([getDictionary(locale), aboutRepository.getAboutPages()]);
  const { about, aboutSection: section } = dictionary;

  return (
    <>
      <PageHero
        photo={photos.brickMoulding}
        eyebrow={about.eyebrow}
        title={about.title}
        description={about.description}
        breadcrumbs={[
          { href: routes.home(locale), label: dictionary.common.home },
          { href: routes.about(locale), label: dictionary.nav.about },
        ]}
      />

      <section className="py-20 sm:py-28">
        <PageContainer className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading title={about.focusTitle} description={about.focusDescription} />
          <Reveal variant="right">
            <CaptionedPhoto
              photo={photos.jaflong}
              locale={locale}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[5/4] rounded-[2rem]"
            />
          </Reveal>
        </PageContainer>
      </section>

      <section className="bg-surface-muted/60 py-20 sm:py-28">
        <PageContainer className="space-y-12">
          <SectionHeading eyebrow={section.leadershipEyebrow} title={section.leadershipTitle} description={section.leadershipDescription} />
          <RevealGroup stagger={0.1} className="grid gap-5 md:grid-cols-2">
            {pages.map((page) => {
              const Icon = getAboutIcon(page.icon);
              return (
                <RevealItem key={page.id}>
                  <Link
                    href={routes.aboutPage(locale, page.slug)}
                    className="group relative isolate flex h-full items-center gap-5 overflow-hidden rounded-[1.75rem] border border-border bg-surface p-6 shadow-soft transition-all duration-500 ease-out-expo hover:border-accent/60 hover:shadow-lift motion-safe:hover:-translate-y-1 sm:p-8"
                  >
                    <span aria-hidden className="absolute -top-20 -right-20 -z-10 size-48 rounded-full bg-accent/0 blur-3xl transition-colors duration-700 group-hover:bg-accent/15" />
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-accent-foreground">
                      <Icon aria-hidden className="size-6" />
                    </span>
                    <span className="min-w-0 flex-1 space-y-1">
                      <span className="block text-xl font-semibold tracking-tight">{page.title[locale]}</span>
                      <span className="block text-sm text-muted">{page.summary[locale]}</span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-5 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    />
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </PageContainer>
      </section>

      <WhyChooseUs dictionary={dictionary} />
      <SupplyProcess dictionary={dictionary} />
      <EnquiryCta locale={locale} dictionary={dictionary} />
    </>
  );
}
