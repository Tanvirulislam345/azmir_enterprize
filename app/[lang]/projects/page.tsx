import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { projectRepository } from "@/lib/projects/project-repository";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { EnquiryCta } from "@/components/home/enquiry-cta";
import { ProjectsHeading } from "@/components/home/selected-projects";
import { PageHero } from "@/components/layout/page-hero";
import { formatNumber } from "@/components/products/catalogue/format";
import { ProjectShowcase } from "@/components/projects/project-showcase";
import { toShowcaseItems } from "@/components/projects/project-showcase-items";
import { PageContainer } from "@/components/ui/page-container";
import { photos } from "@/data/photos";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const { projectsPage } = await getDictionary(locale);
  return buildMetadata({
    locale,
    title: projectsPage.metaTitle,
    description: projectsPage.metaDescription,
    path: "/projects",
  });
}

/** Every selected project: a numbered list beside a photo of the one in focus. */
export default async function ProjectsPage() {
  const locale = await resolveLocale();
  const [dictionary, projects] = await Promise.all([
    getDictionary(locale),
    projectRepository.getSelectedProjects(),
  ]);
  const { projectsPage: copy } = dictionary;

  return (
    <>
      <PageHero
        photo={photos.bholaganj}
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        breadcrumbs={[
          { href: routes.home(locale), label: dictionary.common.home },
          { href: routes.projects(locale), label: dictionary.nav.projects },
        ]}
      />

      {/* 56px above and below the list on desktop; the enquiry banner follows with no extra gap. */}
      <section className="py-10 lg:py-14">
        <PageContainer className="space-y-8 sm:space-y-10">
          <ProjectsHeading
            total={projects.length}
            locale={locale}
            dictionary={dictionary}
          />
          <ProjectShowcase
            items={toShowcaseItems(projects, locale)}
            total={`${formatNumber(projects.length, locale)}+`}
            nextLabel={copy.scrollHint}
            prevLabel={copy.scrollHintUp}
            listLabel={copy.listLabel}
            previewLabel={copy.previewLabel}
          />
        </PageContainer>
      </section>

      <EnquiryCta locale={locale} dictionary={dictionary} className="" />
    </>
  );
}
