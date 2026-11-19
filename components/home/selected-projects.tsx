import { Plus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import type { Project } from "@/types/project";
import { Reveal } from "@/components/motion/reveal";
import { formatNumber } from "@/components/products/catalogue/format";
import { ProjectShowcase } from "@/components/projects/project-showcase";
import { toShowcaseItems } from "@/components/projects/project-showcase-items";
import { SecondaryButton } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

type SelectedProjectsProps = {
  /** The projects to show here; the full set lives on the projects page. */
  projects: Project[];
  /** Total number of selected projects, for the headline figure. */
  total: number;
  locale: Locale;
  dictionary: Dictionary;
};

/** "Our clients" heading with the headline "10+" count; shared by the home section and the projects page. */
export function ProjectsHeading({ total, locale, dictionary }: Pick<SelectedProjectsProps, "total" | "locale" | "dictionary">) {
  const copy = dictionary.projects;

  return (
    <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
      <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <Reveal variant="right">
        <p className="flex items-end gap-3 lg:flex-col lg:items-end lg:gap-1">
          <span className="flex items-start text-6xl leading-none font-bold tracking-tight text-accent tabular-nums sm:text-7xl">
            {formatNumber(total, locale)}
            <Plus aria-hidden strokeWidth={3.5} className="-ml-0.5 size-8 sm:size-10" />
            <span className="sr-only">+</span>
          </span>
          <span className="max-w-32 pb-1 text-sm text-muted lg:max-w-none lg:text-right">{copy.countLabel}</span>
        </p>
      </Reveal>
    </div>
  );
}

/** Home "Selected projects": a headline count, the scroll-driven showcase for a few projects, and a link to all of them. */
export function SelectedProjects({ projects, total, locale, dictionary }: SelectedProjectsProps) {
  if (projects.length === 0) return null;
  const copy = dictionary.projects;

  return (
    // No bottom padding: the enquiry banner that follows brings its own spacing.
    <section className="overflow-x-clip pt-20 sm:pt-28">
      <PageContainer className="space-y-8 sm:space-y-10">
        <ProjectsHeading total={total} locale={locale} dictionary={dictionary} />

        <div className="space-y-8">
          <ProjectShowcase
            items={toShowcaseItems(projects, locale)}
            total={`${formatNumber(total, locale)}+`}
            listLabel={copy.listLabel}
            previewLabel={dictionary.projectsPage.previewLabel}
            variant="compact"
          />
          <Reveal>
            <SecondaryButton href={routes.projects(locale)} withArrow>
              {copy.seeAll}
            </SecondaryButton>
          </Reveal>
        </div>
      </PageContainer>
    </section>
  );
}
