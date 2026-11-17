import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";

type EnquiryCtaProps = {
  locale: Locale;
  dictionary: Dictionary;
  /** Overrides the default CTA title, e.g. "Enquire about this product". */
  title?: string;
};

export function EnquiryCta({ locale, dictionary, title }: EnquiryCtaProps) {
  const { cta } = dictionary;

  return (
    <section className="py-20 sm:py-24">
      <PageContainer>
        <Reveal variant="scale">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-accent px-6 py-14 text-accent-foreground sm:px-12 sm:py-16">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl space-y-3">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title ?? cta.title}</h2>
                <p className="text-lg text-accent-foreground/85">{cta.description}</p>
              </div>
              <ButtonLink
                href={routes.contact(locale)}
                size="lg"
                withArrow
                className="bg-inverse text-inverse-foreground shadow-lift hover:brightness-125"
              >
                {cta.button}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
