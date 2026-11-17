import { ArrowDown } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { AnimatedHeading } from "@/components/motion/animated-heading";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";

export function HeroSection({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const { hero } = dictionary;

  return (
    <section className="relative isolate overflow-hidden bg-inverse text-inverse-foreground">
      <Parallax className="absolute inset-0 -z-10" distance={25}>
        <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
        <div aria-hidden className="absolute top-1/4 -left-32 size-[28rem] rounded-full bg-accent/20 blur-3xl" />
      </Parallax>

      <PageContainer className="grid min-h-[min(calc(100dvh-4.5rem),52rem)] items-center gap-12 py-16 lg:min-h-[min(calc(100dvh-5rem),56rem)] lg:grid-cols-[1.15fr_1fr] lg:py-24">
        <div className="space-y-8">
          <Reveal variant="fade">
            <p className="inline-flex items-center gap-2 rounded-full border border-inverse-foreground/15 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-accent-soft uppercase">
              <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-accent" />
              {hero.eyebrow}
            </p>
          </Reveal>
          <AnimatedHeading text={hero.title} className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl" />
          <Reveal delay={0.4}>
            <p className="max-w-xl text-lg text-inverse-muted">{hero.description}</p>
          </Reveal>
          <Reveal delay={0.55} className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={routes.products(locale)} size="lg" withArrow>
              {hero.primaryCta}
            </ButtonLink>
            <ButtonLink href={routes.contact(locale)} size="lg" variant="inverse">
              {hero.secondaryCta}
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal variant="scale" delay={0.3} className="relative hidden aspect-[4/5] lg:block">
          <Parallax className="h-full overflow-hidden rounded-[2rem] shadow-lift" distance={-10}>
            <PlaceholderMedia seed="hero" className="h-[115%]" />
          </Parallax>
          <div aria-hidden className="absolute -bottom-6 -left-6 size-32 rounded-3xl border-2 border-accent/60" />
        </Reveal>
      </PageContainer>

      <a
        href="#intro"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-inverse-muted transition-colors hover:text-accent md:flex"
      >
        {hero.scrollHint}
        <ArrowDown aria-hidden className="size-4 animate-bounce" />
      </a>
    </section>
  );
}
