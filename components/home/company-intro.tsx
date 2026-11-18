import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { getCategoryIcon } from "@/lib/products/category-icons";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Photo } from "@/types/photo";
import type { ProductCategory } from "@/types/product";
import { getCategoryHeroPhoto, photos } from "@/data/photos";
import { ClipReveal } from "@/components/motion/clip-reveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { formatIndex } from "@/components/products/catalogue/format";
import { ButtonLink, SecondaryButton } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

type CompanyIntroProps = {
  categories: ProductCategory[];
  locale: Locale;
  dictionary: Dictionary;
};

type Service = {
  id: string;
  href: string;
  /** Short label on the photo tile. */
  label: string;
  /** Full name in the navigation list. */
  title: string;
  description?: string;
  icon: LucideIcon;
  photo: Photo;
};

/** Tiles mostly reuse the category hero photos; bricks swaps the dark kiln scene for one where the bricks read clearly. */
const TILE_PHOTOS: Record<string, Photo> = { bricks: photos.brickMoulding };

/** Deals items round-robin into `count` columns, keeping each item's overall position for its number. */
function toColumns<T>(items: T[], count: number) {
  const columns: { item: T; position: number }[][] = Array.from({ length: count }, () => []);
  items.forEach((item, position) => columns[position % count].push({ item, position }));
  return columns;
}

/**
 * Home "Who we are": the story across the top, then a photo mosaic of every product category beside the
 * calls to action and a numbered link to each.
 */
export function CompanyIntro({ categories, locale, dictionary }: CompanyIntroProps) {
  const { intro } = dictionary;

  const services: Service[] = categories.map((category) => ({
    id: category.id,
    href: routes.category(locale, category.slug),
    label: category.shortName?.[locale] ?? category.name[locale],
    title: category.name[locale],
    description: category.description?.[locale],
    icon: getCategoryIcon(category),
    photo: TILE_PHOTOS[category.id] ?? getCategoryHeroPhoto(category.id),
  }));

  return (
    <section id="intro" className="scroll-mt-24 overflow-hidden py-20 sm:py-28">
      <PageContainer className="space-y-14 sm:space-y-16">
        <SectionHeading eyebrow={intro.eyebrow} title={intro.title} description={intro.description} className="lg:max-w-[75%]" />

        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 xl:gap-20">
          <div className="order-2 lg:order-1">
            {/* Two columns on phones, three from `sm`; the hidden copy is display:none, so it is never read twice. */}
            <Mosaic services={services} columns={2} locale={locale} className="h-[36rem] sm:hidden" />
            <Mosaic services={services} columns={3} locale={locale} className="hidden h-[38rem] sm:flex lg:h-[40rem]" />
          </div>

          <div className="order-1 space-y-8 lg:order-2">
            <Reveal className="flex flex-wrap gap-3">
              <ButtonLink href={routes.contact(locale)} withArrow>
                {dictionary.nav.requestQuote}
              </ButtonLink>
              <SecondaryButton href={routes.about(locale)}>{intro.cta}</SecondaryButton>
            </Reveal>
            <nav aria-label={intro.servicesLabel}>
              <RevealGroup stagger={0.08} className="border-t border-border">
                {services.map((service, index) => (
                  <RevealItem key={service.id}>
                    <ServiceRow service={service} index={formatIndex(index + 1, locale)} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </nav>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

type MosaicProps = { services: Service[]; columns: number; locale: Locale; className?: string };

/**
 * Masonry of photo tiles for any number of services. Each column is a fixed-height stack whose tiles
 * alternate tall and short (offset per column), so the gutters never line up but the bottoms always do.
 */
function Mosaic({ services, columns, locale, className }: MosaicProps) {
  return (
    <div className={cn("flex gap-3 sm:gap-4", className)}>
      {toColumns(services, columns).map((column, columnIndex) => (
        <div key={columnIndex} className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          {column.map(({ item, position }, rowIndex) => (
            <div key={item.id} className={cn("min-h-0 basis-0", (rowIndex + columnIndex) % 2 === 0 ? "grow-[1.7]" : "grow")}>
              <ClipReveal delay={position * 0.08}>
                <MosaicTile service={item} index={formatIndex(position + 1, locale)} />
              </ClipReveal>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function MosaicTile({ service, index }: { service: Service; index: string }) {
  const Icon = service.icon;

  return (
    <Link
      href={service.href}
      className="group relative isolate block h-full overflow-hidden rounded-[1.75rem] bg-surface-muted shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Image
        src={service.photo.src}
        alt=""
        fill
        sizes="(min-width: 1024px) 26vw, 50vw"
        className="object-cover saturate-[0.92] transition-[transform,filter] duration-[1200ms] ease-out-expo group-hover:saturate-[1.1] motion-safe:group-hover:scale-110"
      />
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-black/5" />

      <span aria-hidden className="absolute top-3 left-3 text-xs font-semibold tracking-[0.2em] text-white/80 tabular-nums sm:top-4 sm:left-4">
        {index}
      </span>
      <span
        aria-hidden
        className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-accent text-accent-foreground opacity-0 transition-all duration-500 ease-out-expo group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:-translate-y-2 motion-safe:rotate-45 motion-safe:group-hover:translate-y-0 motion-safe:group-hover:rotate-0 sm:top-4 sm:right-4"
      >
        <ArrowUpRight className="size-4" />
      </span>

      <span className="absolute inset-x-3 bottom-3 flex items-center gap-2.5 sm:inset-x-4 sm:bottom-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors duration-500 group-hover:bg-accent sm:size-10">
          <Icon aria-hidden className="size-4 sm:size-5" />
        </span>
        <span className="truncate text-base font-semibold text-white sm:text-lg">{service.label}</span>
      </span>
    </Link>
  );
}

function ServiceRow({ service, index }: { service: Service; index: string }) {
  const Icon = service.icon;

  return (
    <Link
      href={service.href}
      className="group relative flex items-center gap-4 border-b border-border py-3.5 outline-none transition-colors duration-300 focus-visible:bg-surface sm:gap-5 sm:py-4"
    >
      {/* Accent rule that grows along the left edge on hover. */}
      <span aria-hidden className="absolute inset-y-3 left-0 w-0.5 origin-center scale-y-0 rounded-full bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-y-100 group-focus-visible:scale-y-100" />
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent transition-all duration-500 ease-out-expo group-hover:bg-accent group-hover:text-accent-foreground motion-safe:group-hover:translate-x-2">
        <Icon aria-hidden className="size-5" />
      </span>
      <span className="min-w-0 flex-1 space-y-0.5 transition-transform duration-500 ease-out-expo motion-safe:group-hover:translate-x-2">
        <span className="flex items-baseline gap-2.5">
          <span aria-hidden className="text-xs font-bold text-accent tabular-nums">{index}</span>
          <span className="font-semibold text-foreground">{service.title}</span>
        </span>
        {service.description && <span className="line-clamp-1 block text-sm text-muted">{service.description}</span>}
      </span>
      <ArrowRight
        aria-hidden
        className="size-5 shrink-0 text-muted transition-all duration-500 ease-out-expo group-hover:text-accent motion-safe:group-hover:translate-x-1"
      />
    </Link>
  );
}
