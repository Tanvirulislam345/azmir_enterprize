import { FileText, MessagesSquare, ReceiptText } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

// Order matches dictionary `why.items`.
const ICONS = [FileText, MessagesSquare, ReceiptText];

export function WhyChooseUs({ dictionary }: { dictionary: Dictionary }) {
  const { why } = dictionary;

  return (
    <section className="py-20 sm:py-28">
      <PageContainer className="space-y-12">
        <SectionHeading eyebrow={why.eyebrow} title={why.title} align="center" />
        <RevealGroup className="grid gap-6 md:grid-cols-3" stagger={0.12}>
          {why.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <RevealItem key={item.title}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lift">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"
                  />
                  <span className="mb-6 grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent transition-all duration-500 group-hover:rotate-6 group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                  <p className="text-muted">{item.description}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
