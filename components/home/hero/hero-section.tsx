import { heroSlides } from "@/data/photos";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { AnimatedHeading } from "@/components/motion/animated-heading";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { HeroSlider } from "./hero-slider";

export function HeroSection({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const { hero } = dictionary;

  return (
    <HeroSlider slides={heroSlides} locale={locale} labels={hero}>
      <PageContainer className="max-w-7xl space-y-7">
        <Reveal variant="fade">
          <p className="text-sm font-semibold text-accent-soft [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]">{hero.eyebrow}</p>
        </Reveal>
        <AnimatedHeading
          text={hero.title}
          className="max-w-4xl text-4xl leading-[1.15] font-extrabold tracking-tight text-white [text-shadow:0_2px_24px_rgb(0_0_0/0.45)] sm:text-6xl lg:text-7xl"
        />
        <Reveal delay={0.4}>
          <p className="max-w-xl text-base text-white/90 [text-shadow:0_1px_12px_rgb(0_0_0/0.6)] sm:text-lg">{hero.description}</p>
        </Reveal>
        <Reveal delay={0.55} className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={routes.products(locale)} size="lg" withArrow>
            {hero.primaryCta}
          </ButtonLink>
          <ButtonLink href={routes.contact(locale)} size="lg" variant="inverse" className="backdrop-blur-sm">
            {hero.secondaryCta}
          </ButtonLink>
        </Reveal>
      </PageContainer>
    </HeroSlider>
  );
}
