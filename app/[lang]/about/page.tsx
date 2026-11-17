import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { EnquiryCta } from "@/components/home/enquiry-cta";
import { SupplyProcess } from "@/components/home/supply-process";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { PageHero } from "@/components/layout/page-hero";
import { photos } from "@/data/photos";
import { Reveal } from "@/components/motion/reveal";
import { PageContainer } from "@/components/ui/page-container";
import { CaptionedPhoto } from "@/components/ui/captioned-photo";
import { SectionHeading } from "@/components/ui/section-heading";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { about } = await getDictionary(locale);
  return buildMetadata({ locale, title: about.metaTitle, description: about.metaDescription, path: "/about" });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const locale = await resolveLocale(params);
  const dictionary = await getDictionary(locale);
  const { about } = dictionary;

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
          <div className="space-y-6">
            <SectionHeading title={about.focusTitle} description={about.focusDescription} />
            <Reveal delay={0.1}>
              <p className="rounded-xl border-l-4 border-accent bg-surface p-4 text-sm text-muted">{about.pendingNote}</p>
            </Reveal>
          </div>
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

      <WhyChooseUs dictionary={dictionary} />
      <SupplyProcess dictionary={dictionary} />
      <EnquiryCta locale={locale} dictionary={dictionary} />
    </>
  );
}
