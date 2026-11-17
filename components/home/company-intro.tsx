import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SecondaryButton } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { SectionHeading } from "@/components/ui/section-heading";

export function CompanyIntro({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const { intro } = dictionary;

  return (
    <section id="intro" className="scroll-mt-24 py-20 sm:py-28">
      <PageContainer className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal variant="left" className="order-2 lg:order-1">
          <Parallax className="aspect-[5/4] overflow-hidden rounded-[2rem]" distance={-8}>
            <PlaceholderMedia seed="intro" className="h-[110%]" />
          </Parallax>
        </Reveal>
        <div className="order-1 space-y-8 lg:order-2">
          <SectionHeading eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />
          <Reveal delay={0.15}>
            <SecondaryButton href={routes.about(locale)} withArrow>
              {intro.cta}
            </SecondaryButton>
          </Reveal>
        </div>
      </PageContainer>
    </section>
  );
}
