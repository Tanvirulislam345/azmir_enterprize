import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ScrollLine } from "@/components/motion/scroll-line";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

type ProcessContent = {
  eyebrow?: string;
  title: string;
  steps: { title: string; description: string }[];
};

type SupplyProcessProps = {
  dictionary: Dictionary;
  /** Override the default enquiry-to-supply steps, e.g. with the transportation flow. */
  content?: ProcessContent;
};

const COLUMNS: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

/** Numbered steps joined by a line that draws itself as the section scrolls into view. */
export function SupplyProcess({ dictionary, content }: SupplyProcessProps) {
  const process: ProcessContent = content ?? dictionary.process;

  return (
    <section className="relative overflow-hidden bg-inverse py-20 text-inverse-foreground sm:py-28">
      <PageContainer className="relative space-y-16">
        <SectionHeading eyebrow={process.eyebrow} title={process.title} inverse />

        <div className="relative">
          <ScrollLine className="absolute top-7 right-0 left-0 hidden h-0.5 bg-inverse-foreground/15 lg:block" />
          <ScrollLine orientation="vertical" className="absolute top-0 bottom-0 left-7 w-0.5 bg-inverse-foreground/15 lg:hidden" />
          <RevealGroup className={cn("relative grid gap-10 lg:gap-8", COLUMNS[process.steps.length] ?? "lg:grid-cols-4")} stagger={0.15}>
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
