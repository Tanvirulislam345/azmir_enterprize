import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { aboutRepository } from "@/lib/about/about-repository";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { ContinueReading } from "@/components/about/continue-reading";
import { LeaderMessageView } from "@/components/about/leader-message";
import { TeamView } from "@/components/about/team-page";
import { EnquiryCta } from "@/components/home/enquiry-cta";
import { formatIndex } from "@/components/products/catalogue/format";
import { CategorySwitcher } from "@/components/products/category-switcher";

type AboutSubPageProps = PageProps<"/[lang]/about/[slug]">;

export async function generateStaticParams() {
  const pages = await aboutRepository.getAboutPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: AboutSubPageProps): Promise<Metadata> {
  const locale = await resolveLocale();
  const page = await aboutRepository.getAboutPage((await params).slug);
  if (!page) return {};
  return buildMetadata({ locale, title: page.title[locale], description: page.summary[locale], path: `/about/${page.slug}` });
}

/** An About sub-page (Managing Director, IT Support Team, …), rendered by its `kind`. */
export default async function AboutSubPage({ params }: AboutSubPageProps) {
  const locale = await resolveLocale();
  const { slug } = await params;
  const [dictionary, pages] = await Promise.all([getDictionary(locale), aboutRepository.getAboutPages()]);
  const index = pages.findIndex((page) => page.slug === slug);
  const page = pages[index];
  if (!page) notFound();

  const copy = dictionary.aboutSection;
  const breadcrumbs = [
    { href: routes.home(locale), label: dictionary.common.home },
    { href: routes.about(locale), label: dictionary.nav.about },
    { href: routes.aboutPage(locale, page.slug), label: page.title[locale] },
  ];
  // Sticky switcher under the hero: the overview plus every About page, numbered in menu order.
  const subNav = (
    <CategorySwitcher
      label={copy.switcherLabel}
      allLabel={dictionary.nav.overview}
      allHref={routes.about(locale)}
      activeId={page.id}
      items={pages.map((item, position) => ({
        id: item.id,
        href: routes.aboutPage(locale, item.slug),
        number: formatIndex(position + 1, locale),
        label: item.title[locale],
        shortLabel: item.title[locale],
      }))}
    />
  );
  const link = (target: (typeof pages)[number] | undefined) =>
    target && { href: routes.aboutPage(locale, target.slug), title: target.title[locale], summary: target.summary[locale] };

  return (
    <>
      {page.kind === "message" ? (
        <LeaderMessageView message={await aboutRepository.getManagingDirector()} locale={locale} dictionary={dictionary} breadcrumbs={breadcrumbs} subNav={subNav} />
      ) : (
        <TeamView team={await aboutRepository.getItSupportTeam()} title={page.title[locale]} locale={locale} dictionary={dictionary} breadcrumbs={breadcrumbs} subNav={subNav} />
      )}

      <ContinueReading
        title={copy.continueReading}
        allLabel={copy.allAboutPages}
        allHref={routes.about(locale)}
        previous={link(pages[index - 1])}
        next={link(pages[index + 1])}
        labels={{ previous: copy.previous, next: copy.next }}
      />

      <EnquiryCta locale={locale} dictionary={dictionary} />
    </>
  );
}
