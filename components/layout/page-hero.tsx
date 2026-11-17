import Image from "next/image";
import type { NavLink } from "@/types/navigation";
import type { Photo } from "@/types/photo";
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
  photo: Photo;
};

/** Title band shared by every inner page — a dimmed photo behind the page's single h1. */
export function PageHero({ eyebrow, title, description, breadcrumbs, photo }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-inverse py-16 text-inverse-foreground sm:py-24">
      <Parallax className="absolute inset-0 -z-10" distance={25}>
        <Image src={photo.src} alt="" fill priority sizes="100vw" className="scale-110 object-cover" />
      </Parallax>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(15_17_18/0.8),rgb(15_17_18/0.5)_55%,rgb(15_17_18/0.3))]" />
      <PageContainer className="space-y-8">
        <Reveal variant="fade">
          <Breadcrumbs items={breadcrumbs} />
        </Reveal>
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} inverse />
      </PageContainer>
    </section>
  );
}
