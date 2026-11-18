import Image from "next/image";
import Link from "next/link";
import { ClipboardList, MapPin, Truck } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { getCategoryIcon } from "@/lib/products/category-icons";
import { routes } from "@/lib/routes";
import type { ProductCategory } from "@/types/product";
import { photos } from "@/data/photos";
import { ClipReveal } from "@/components/motion/clip-reveal";
import { Parallax } from "@/components/motion/parallax";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { formatIndex } from "@/components/products/catalogue/format";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { RoadTruck } from "./road-truck";

type TransportHighlightProps = {
  categories: ProductCategory[];
  locale: Locale;
  dictionary: Dictionary;
};

const STEP_ICONS = [ClipboardList, Truck, MapPin];

/**
 * Home: the transportation service, right after "Who we are". A truck photo with a road the truck drives along,
 * beside how an order reaches the site, which materials can be carried, and a link to the full service page.
 */
export function TransportHighlight({ categories, locale, dictionary }: TransportHighlightProps) {
  const copy = dictionary.transportation;
  const labels = dictionary.transportHighlight;
  const truck = photos.tipperTruck;

  return (
    <section className="relative isolate overflow-x-clip bg-inverse py-20 text-inverse-foreground sm:py-28">
      <span aria-hidden className="absolute -top-40 -right-20 -z-10 size-[34rem] rounded-full bg-accent/15 blur-[130px]" />
      <PageContainer className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16 xl:gap-20">
        <div className="relative">
          <Reveal variant="fade" delay={0.4} className="absolute inset-0">
            <span aria-hidden className="absolute inset-0 -translate-x-4 translate-y-4 rounded-[2rem] border-2 border-accent/70 sm:-translate-x-6 sm:translate-y-6" />
          </Reveal>
          <ClipReveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-white/5 shadow-lift">
              <Parallax className="absolute inset-x-0 -top-[8%] h-[116%]" distance={10}>
                <Image src={truck.src} alt={truck.alt[locale]} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              </Parallax>
              <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-6 bottom-5 sm:inset-x-8 sm:bottom-7">
                <RoadTruck />
              </div>
            </div>
          </ClipReveal>
        </div>

        <div className="space-y-9">
          <Reveal className="space-y-4">
            <p className="text-sm font-semibold text-accent">{copy.eyebrow}</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{copy.title}</h2>
            <p className="text-lg leading-relaxed text-inverse-muted">{copy.introDescription}</p>
          </Reveal>

          <div role="list">
          <RevealGroup stagger={0.1} className="relative space-y-5">
            {/* Connecting line behind the step badges. */}
            <span aria-hidden className="absolute top-6 bottom-6 left-6 w-px bg-white/15" />
            {copy.process.steps.map((step, index) => {
              const Icon = STEP_ICONS[index] ?? Truck;
              return (
                <RevealItem key={step.title} className="relative flex items-start gap-4">
                  <span role="listitem" className="contents">
                  <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-inverse ring-1 ring-white/15">
                    <span className="grid size-10 place-items-center rounded-full bg-accent text-accent-foreground">
                      <Icon aria-hidden className="size-5" />
                    </span>
                  </span>
                  <span className="space-y-1 pt-1">
                    <span className="flex items-baseline gap-2">
                      <span aria-hidden className="text-xs font-bold text-accent tabular-nums">{formatIndex(index + 1, locale)}</span>
                      <span className="font-semibold">{step.title}</span>
                    </span>
                    <span className="block text-sm text-inverse-muted">{step.description}</span>
                  </span>
                  </span>
                </RevealItem>
              );
            })}
          </RevealGroup>
          </div>

          {categories.length > 0 && (
            <Reveal delay={0.1} className="space-y-3">
              <p className="text-sm font-semibold text-inverse-muted">{labels.carryLabel}</p>
              <ul className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category);
                  return (
                    <li key={category.id}>
                      <Link
                        href={routes.category(locale, category.slug)}
                        className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pr-4 pl-1.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/15"
                      >
                        <span className="grid size-7 place-items-center rounded-full bg-white/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                          <Icon aria-hidden className="size-3.5" />
                        </span>
                        {category.shortName?.[locale] ?? category.name[locale]}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          )}

          <Reveal delay={0.15} className="flex flex-wrap gap-3">
            <ButtonLink href={routes.transportation(locale)} withArrow>
              {labels.learnMore}
            </ButtonLink>
            <ButtonLink href={routes.contact(locale)} variant="inverse">
              {dictionary.nav.requestQuote}
            </ButtonLink>
          </Reveal>
        </div>
      </PageContainer>
    </section>
  );
}
