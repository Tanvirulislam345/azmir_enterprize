import type { ReactNode } from "react";
import { Globe, Headset, Mail, MonitorSmartphone, Phone, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getAboutIcon } from "@/lib/about/about-icons";
import { formatPhone, getOfficePhone, mailtoHref, telHref } from "@/lib/contact";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { cn } from "@/lib/utils";
import type { Team } from "@/types/about";
import type { NavLink } from "@/types/navigation";
import { CopyButton } from "@/components/contact/copy-button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Portrait } from "./portrait";

type TeamViewProps = {
  team: Team;
  title: string;
  locale: Locale;
  dictionary: Dictionary;
  breadcrumbs: NavLink[];
  /** About sub-nav, placed directly under the hero. */
  subNav: ReactNode;
};

/** Bento of service icons for the hero, staggered so it reads as a collage rather than a grid. */
const COLLAGE = [
  { icon: Headset, className: "row-span-2 bg-accent text-accent-foreground" },
  { icon: Globe, className: "bg-white/10" },
  { icon: ShieldCheck, className: "bg-white/5" },
  { icon: MonitorSmartphone, className: "col-span-2 bg-white/10" },
];

const ACTION =
  "grid size-10 place-items-center rounded-full border border-border bg-surface text-foreground transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";

/** A team page: intro on a dark band, what the team handles, the members, and how to reach them. */
export function TeamView({ team, title, locale, dictionary, breadcrumbs, subNav }: TeamViewProps) {
  const copy = dictionary.aboutSection;
  const contactCopy = dictionary.contact;
  const { email, offices } = siteConfig.contact;
  const phone = offices[0] ? getOfficePhone(offices[0]) : undefined;
  const fill = (template: string, value: string) => template.replace("{value}", value);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-inverse py-16 text-inverse-foreground sm:py-20 lg:py-24">
        <span aria-hidden className="absolute -top-40 left-1/3 -z-10 size-[32rem] rounded-full bg-accent/20 blur-[120px]" />
        <PageContainer className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div className="space-y-7">
            <Reveal variant="fade">
              <Breadcrumbs items={breadcrumbs} />
            </Reveal>
            <Reveal className="space-y-4">
              <p className="text-sm font-semibold text-accent">{copy.teamEyebrow}</p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-2xl text-lg leading-relaxed text-inverse-muted">{team.intro[locale]}</p>
            </Reveal>
          </div>

          <RevealGroup stagger={0.1} className="grid h-72 grid-cols-2 grid-rows-3 gap-3 sm:h-80 sm:gap-4">
            {COLLAGE.map(({ icon: Icon, className }, index) => (
              <RevealItem key={index} className={cn("grid place-items-center rounded-[1.5rem]", className)}>
                <Icon aria-hidden className="size-9 sm:size-10" />
              </RevealItem>
            ))}
          </RevealGroup>
        </PageContainer>
      </section>

      {subNav}

      <section className="py-20 sm:py-28">
        <PageContainer className="space-y-12">
          <SectionHeading title={copy.responsibilitiesTitle} />
          <RevealGroup stagger={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.responsibilities.map((item, index) => {
              const Icon = getAboutIcon(item.icon);
              return (
                <RevealItem key={index}>
                  <div className="group h-full rounded-[1.5rem] border border-border bg-surface p-6 transition-all duration-500 ease-out-expo hover:border-accent/50 hover:shadow-lift motion-safe:hover:-translate-y-1">
                    <span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-accent-foreground">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <h3 className="mt-6 text-lg font-semibold">{item.title[locale]}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.text[locale]}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </PageContainer>
      </section>

      <section className="bg-surface-muted/60 py-20 sm:py-28">
        <PageContainer className="space-y-12">
          <SectionHeading title={copy.membersTitle} />
          <RevealGroup stagger={0.1} className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),19rem))] justify-center gap-6">
            {team.members.map((member) => (
              <RevealItem key={member.id}>
                <div className="group h-full overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft transition-all duration-500 ease-out-expo hover:border-accent/50 hover:shadow-lift motion-safe:hover:-translate-y-1">
                  <Portrait
                    name={member.name[locale]}
                    initials={member.initials}
                    photo={member.photo}
                    sizes="(min-width: 1024px) 25vw, 90vw"
                    initialsClassName="text-6xl"
                    className="aspect-[5/4]"
                  />
                  <div className="space-y-1 p-6">
                    <p className="text-lg font-semibold">{member.name[locale]}</p>
                    <p className="text-sm font-medium text-accent">{member.role[locale]}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </PageContainer>
      </section>

      <section className="py-20 sm:py-24">
        <PageContainer>
          <Reveal variant="scale">
            <div className="flex flex-col gap-8 rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl space-y-2">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{copy.needHelpTitle}</h2>
                <p className="text-muted">{copy.needHelpDescription}</p>
              </div>
              <div className="flex flex-col gap-3 sm:min-w-[22rem]">
                <HelpRow icon={<Mail aria-hidden className="size-4" />} value={email}>
                  <CopyButton value={email} label={fill(contactCopy.copyValue, email)} copiedLabel={contactCopy.copied} className={ACTION} />
                  <a href={mailtoHref(email)} aria-label={fill(contactCopy.emailValue, email)} title={fill(contactCopy.emailValue, email)} className={ACTION}>
                    <Mail aria-hidden className="size-4" />
                  </a>
                </HelpRow>
                {phone && (
                  <HelpRow icon={<Phone aria-hidden className="size-4" />} value={formatPhone(phone, locale)}>
                    <CopyButton
                      value={phone.number}
                      label={fill(contactCopy.copyValue, formatPhone(phone, locale))}
                      copiedLabel={contactCopy.copied}
                      className={ACTION}
                    />
                    <a
                      href={telHref(phone)}
                      aria-label={fill(contactCopy.callValue, formatPhone(phone, locale))}
                      title={fill(contactCopy.callValue, formatPhone(phone, locale))}
                      className={ACTION}
                    >
                      <Phone aria-hidden className="size-4" />
                    </a>
                  </HelpRow>
                )}
              </div>
            </div>
          </Reveal>
        </PageContainer>
      </section>
    </>
  );
}

function HelpRow({ icon, value, children }: { icon: ReactNode; value: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface-muted/70 p-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">{icon}</span>
      <span className="min-w-0 flex-1 font-semibold break-all">{value}</span>
      <span className="flex shrink-0 items-center gap-2">{children}</span>
    </div>
  );
}
