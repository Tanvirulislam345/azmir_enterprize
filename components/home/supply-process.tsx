import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ScrollLine } from "@/components/motion/scroll-line";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

export function SupplyProcess({ dictionary }: { dictionary: Dictionary }) {
  const { process } = dictionary;

  return (
    <section className="relative overflow-hidden bg-inverse py-20 text-inverse-foreground sm:py-28">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-30" />
      <PageContainer className="relative space-y-16">
        <SectionHeading eyebrow={process.eyebrow} title={process.title} inverse />

        <div className="relative">
          <ScrollLine className="absolute top-7 right-0 left-0 hidden h-0.5 bg-inverse-foreground/15 lg:block" />
          <ScrollLine orientation="vertical" className="absolute top-0 bottom-0 left-7 w-0.5 bg-inverse-foreground/15 lg:hidden" />
          <RevealGroup className="relative grid gap-10 lg:grid-cols-4 lg:gap-8" stagger={0.15}>
            {process.steps.map((step, index) => (
              <RevealItem key={step.title} className="flex gap-6 lg:flex-col">
                <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full border-2 border-accent bg-inverse text-lg font-bold text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                  <p className="text-inverse-muted">{step.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </PageContainer>
    </section>
  );
}
