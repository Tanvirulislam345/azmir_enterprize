import type { NavLink } from "@/types/navigation";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Breadcrumbs } from "./breadcrumbs";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs: NavLink[];
};

/** Dark title band shared by every inner page — holds the page's single h1. */
export function PageHero({ eyebrow, title, description, breadcrumbs }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-inverse py-16 text-inverse-foreground sm:py-24">
      <Parallax className="absolute inset-0 -z-10" distance={30}>
        <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
        <div aria-hidden className="absolute -top-24 -right-24 size-96 rounded-full bg-accent/20 blur-3xl" />
      </Parallax>
      <PageContainer className="space-y-8">
        <Reveal variant="fade">
          <Breadcrumbs items={breadcrumbs} />
        </Reveal>
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} inverse />
      </PageContainer>
    </section>
  );
}
