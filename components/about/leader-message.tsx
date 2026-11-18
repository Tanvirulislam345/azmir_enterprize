import type { ReactNode } from "react";
import { Eye, Quote, Target } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { LeaderMessage } from "@/types/about";
import type { NavLink } from "@/types/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { formatIndex } from "@/components/products/catalogue/format";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Portrait } from "./portrait";

type LeaderMessageViewProps = {
  message: LeaderMessage;
  locale: Locale;
  dictionary: Dictionary;
  breadcrumbs: NavLink[];
  /** About sub-nav, placed directly under the hero. */
  subNav: ReactNode;
};

/**
 * A leader's message page: portrait and name on a dark band, the letter in a reading column with a pull quote and
 * signature, then vision, mission and goals.
 */
export function LeaderMessageView({ message, locale, dictionary, breadcrumbs, subNav }: LeaderMessageViewProps) {
  const copy = dictionary.aboutSection;
  const { person } = message;
  const name = person.name[locale];
  const role = person.role[locale];
  const [lead, ...rest] = message.paragraphs;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-inverse py-16 text-inverse-foreground sm:py-20 lg:py-24">
        <span aria-hidden className="absolute -top-40 right-0 -z-10 size-[32rem] rounded-full bg-accent/20 blur-[120px]" />
        <PageContainer className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal variant="left" className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <span aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-accent/70" />
            <Portrait
              name={name}
              initials={person.initials}
              photo={person.photo}
              pendingLabel={copy.photoComingSoon}
              priority
              className="aspect-[4/5] rounded-[2rem] shadow-lift"
            />
          </Reveal>

          <div className="space-y-7">
            <Reveal variant="fade">
              <Breadcrumbs items={breadcrumbs} />
            </Reveal>
            <Reveal className="space-y-4">
              <p className="text-sm font-semibold text-accent">{copy.messageEyebrow}</p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{name}</h1>
              <p className="text-lg text-inverse-muted">
                {role}, {siteConfig.name}
              </p>
            </Reveal>
            {lead && (
              <Reveal delay={0.1}>
                <p className="max-w-2xl border-l-2 border-accent pl-5 text-lg leading-relaxed text-inverse-foreground/90">{lead[locale]}</p>
              </Reveal>
            )}
          </div>
        </PageContainer>
      </section>

      {subNav}

      <section aria-label={copy.letterLabel} className="py-20 sm:py-28">
        <PageContainer>
          <article className="mx-auto max-w-3xl space-y-7 text-lg leading-relaxed text-foreground/85">
            <Reveal>
              <p className="text-2xl font-semibold text-foreground">{message.greeting[locale]}</p>
            </Reveal>
            {/* The lead paragraph sits in the hero; the letter continues with the rest, quote after the first. */}
            {rest.map((paragraph, index) => (
              <div key={index} className="space-y-7">
                <Reveal>
                  <p>{paragraph[locale]}</p>
                </Reveal>
                {index === 0 && <PullQuote text={message.quote[locale]} />}
              </div>
            ))}
            <Reveal>
              <p className="font-semibold text-foreground">{message.closing[locale]}</p>
            </Reveal>

            <Reveal className="pt-4">
              <div className="flex items-center gap-5 border-t border-border pt-8">
                <Portrait name={name} initials={person.initials} photo={person.photo} sizes="64px" className="size-16 shrink-0 rounded-full" initialsClassName="text-xl" />
                <div>
                  {/* Bengali has no true italic (browsers just slant it), so only the Latin signature is set in italics. */}
                  <p className={cn("text-2xl font-semibold tracking-tight text-foreground", locale === "en" && "italic")}>{name}</p>
                  <p className="text-sm text-muted">
                    {role}, {siteConfig.name}
                  </p>
                </div>
              </div>
            </Reveal>
          </article>
        </PageContainer>
      </section>

      <section className="bg-surface-muted/60 py-20 sm:py-28">
        <PageContainer className="space-y-16">
          <RevealGroup stagger={0.12} className="grid gap-6 md:grid-cols-2">
            <RevealItem>
              <StatementCard icon={<Eye aria-hidden className="size-6" />} title={copy.vision} text={message.vision[locale]} tone="inverse" />
            </RevealItem>
            <RevealItem>
              <StatementCard icon={<Target aria-hidden className="size-6" />} title={copy.mission} text={message.mission[locale]} tone="surface" />
            </RevealItem>
          </RevealGroup>

          <div className="space-y-10">
            <SectionHeading eyebrow={copy.goalsEyebrow} title={copy.goalsTitle} />
            <RevealGroup stagger={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {message.goals.map((goal, index) => (
                <RevealItem key={index}>
                  <div className="group h-full rounded-[1.5rem] border border-border bg-surface p-6 transition-all duration-500 ease-out-expo hover:border-accent/50 hover:shadow-lift motion-safe:hover:-translate-y-1">
                    <span className="block text-4xl font-bold text-transparent tabular-nums transition-colors duration-500 [-webkit-text-stroke:1px_var(--accent)] group-hover:text-accent">
                      {formatIndex(index + 1, locale)}
                    </span>
                    <h3 className="mt-6 text-lg font-semibold">{goal.title[locale]}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{goal.text[locale]}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </PageContainer>
      </section>
    </>
  );
}

function PullQuote({ text }: { text: string }) {
  return (
    <Reveal variant="scale">
      <figure className="relative my-4 overflow-hidden rounded-[1.75rem] bg-accent/10 px-6 py-8 sm:px-10 sm:py-10">
        <Quote aria-hidden className="absolute -top-2 -left-2 size-24 rotate-180 text-accent/20" />
        <blockquote className="relative border-l-4 border-accent pl-5 text-xl leading-snug font-semibold text-foreground sm:text-2xl">
          {text}
        </blockquote>
      </figure>
    </Reveal>
  );
}

function StatementCard({ icon, title, text, tone }: { icon: ReactNode; title: string; text: string; tone: "inverse" | "surface" }) {
  const inverse = tone === "inverse";
  return (
    <div
      className={
        inverse
          ? "relative isolate h-full overflow-hidden rounded-[1.75rem] bg-inverse p-8 text-inverse-foreground shadow-lift sm:p-10"
          : "h-full rounded-[1.75rem] border border-border bg-surface p-8 shadow-soft sm:p-10"
      }
    >
      {inverse && <span aria-hidden className="absolute -right-16 -bottom-16 -z-10 size-56 rounded-full bg-accent/25 blur-3xl" />}
      <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">{icon}</span>
      <h2 className="mt-8 text-2xl font-bold tracking-tight">{title}</h2>
      <p className={inverse ? "mt-3 text-lg leading-relaxed text-inverse-muted" : "mt-3 text-lg leading-relaxed text-muted"}>{text}</p>
    </div>
  );
}
