import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BrickWall, LayoutGrid, Mountain, Shovel, Truck, type LucideIcon } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
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

const CATEGORY_ICONS: Record<string, LucideIcon> = { stone: Mountain, sand: Shovel, bricks: BrickWall };

/** Tiles mostly reuse the category hero photos; bricks swaps the dark kiln scene for one where the bricks read clearly. */
const TILE_PHOTOS: Record<string, Photo> = { bricks: photos.brickMoulding };

/**
 * Mosaic placement: a tall lead tile and a short one in each column, offset so the gutters never line up.
 * Order matches the services: first category, second, third, then transport.
 */
const TILE_PLACEMENT = [
  "col-start-1 row-start-1 row-span-4",
  "col-start-2 row-start-1 row-span-2",
  "col-start-1 row-start-5 row-span-2",
  "col-start-2 row-start-3 row-span-4",
];

/** Home "Who we are": a four-photo mosaic of what we supply and carry, beside the story and a link to each. */
export function CompanyIntro({ categories, locale, dictionary }: CompanyIntroProps) {
  const { intro } = dictionary;

  const services: Service[] = [
    ...categories.slice(0, 3).map((category) => ({
      id: category.id,
      href: routes.category(locale, category.slug),
      label: category.shortName?.[locale] ?? category.name[locale],
      title: category.name[locale],
      description: category.description?.[locale],
      icon: CATEGORY_ICONS[category.id] ?? LayoutGrid,
      photo: TILE_PHOTOS[category.id] ?? getCategoryHeroPhoto(category.id),
    })),
    {
      id: "transport",
      href: routes.contact(locale),
      label: intro.transport,
      title: intro.transport,
      description: intro.transportDescription,
      icon: Truck,
      photo: photos.tipperTruck,
    },
  ];

  return (
    <section id="intro" className="scroll-mt-24 overflow-hidden py-20 sm:py-28">
      <PageContainer className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 xl:gap-20">
        <div className="relative order-2 lg:order-1">
          <div className="grid h-[30rem] grid-cols-2 grid-rows-6 gap-3 sm:h-[38rem] sm:gap-4 lg:h-[40rem]">
            {services.map((service, index) => (
              <div key={service.id} className={cn("min-h-0", TILE_PLACEMENT[index])}>
                <ClipReveal delay={index * 0.12}>
                  <MosaicTile service={service} index={formatIndex(index + 1, locale)} />
                </ClipReveal>
              </div>
            ))}
          </div>
          <RotatingBadge text={intro.badge} locale={locale} />
        </div>

        <div className="order-1 space-y-10 lg:order-2">
          <SectionHeading eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />

          <nav aria-label={intro.servicesLabel}>
            <RevealGroup stagger={0.08} className="border-t border-border">
              {services.map((service, index) => (
                <RevealItem key={service.id}>
                  <ServiceRow service={service} index={formatIndex(index + 1, locale)} />
                </RevealItem>
              ))}
            </RevealGroup>
          </nav>

          <Reveal delay={0.1} className="flex flex-wrap gap-3">
            <ButtonLink href={routes.contact(locale)} withArrow>
              {dictionary.nav.requestQuote}
            </ButtonLink>
            <SecondaryButton href={routes.about(locale)}>{intro.cta}</SecondaryButton>
          </Reveal>
        </div>
      </PageContainer>
    </section>
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
      className="group relative flex items-center gap-4 border-b border-border py-4 outline-none transition-colors duration-300 focus-visible:bg-surface sm:gap-5 sm:py-5"
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

/**
 * Circular label spinning slowly around a truck, cut out of the mosaic by a background-coloured ring.
 * Sits on the centre gutter where the lead tiles' rows meet, clear of every tile's index and label.
 */
function RotatingBadge({ text, locale }: { text: string; locale: Locale }) {
  // Letter-spacing and stretched glyph spacing break apart Bengali conjuncts, so only Latin text is tracked out.
  const latin = locale === "en";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-2/3 left-1/2 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-background ring-8 ring-background sm:size-36"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full motion-safe:animate-[spin_22s_linear_infinite]">
        <defs>
          <path id="intro-badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className={cn("fill-foreground font-semibold", latin ? "text-[9.5px] tracking-[0.18em] uppercase" : "text-[8.4px]")}>
          <textPath href="#intro-badge-circle" {...(latin && { textLength: 235, lengthAdjust: "spacing" })}>
            {/* Untracked Bengali covers about 60% of the ring, so it goes round twice at a smaller size. */}
            {latin ? text : text.repeat(2)}
          </textPath>
        </text>
      </svg>
      <span className="grid size-12 place-items-center rounded-full bg-accent text-accent-foreground shadow-lift sm:size-14">
        <Truck className="size-5 sm:size-6" />
      </span>
    </div>
  );
}
