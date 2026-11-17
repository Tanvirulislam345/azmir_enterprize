import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageContainer } from "@/components/ui/page-container";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { contact } = await getDictionary(locale);
  return buildMetadata({ locale, title: contact.metaTitle, description: contact.metaDescription, path: "/contact" });
}

type ContactChannel = { icon: LucideIcon; label: string; value: string; href?: string };

/** Builds handoff links (tel / WhatsApp / mailto) only from confirmed config values. */
function getContactChannels(copy: Dictionary["contact"]): ContactChannel[] {
  const { phone, whatsapp, email, address } = siteConfig.contact;
  const channels: ContactChannel[] = [];

  if (phone) channels.push({ icon: Phone, label: copy.phone, value: phone, href: `tel:${phone}` });
  if (whatsapp) {
    channels.push({ icon: MessageCircle, label: copy.whatsapp, value: whatsapp, href: `https://wa.me/${whatsapp.replace(/\D/g, "")}` });
  }
  if (email) channels.push({ icon: Mail, label: copy.email, value: email, href: `mailto:${email}` });
  if (address) channels.push({ icon: MapPin, label: copy.address, value: address });
  return channels;
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const locale = await resolveLocale(params);
  const dictionary = await getDictionary(locale);
  const { contact } = dictionary;
  const channels = getContactChannels(contact);

  return (
    <>
      <PageHero
        eyebrow={contact.eyebrow}
        title={contact.title}
        description={contact.description}
        breadcrumbs={[
          { href: routes.home(locale), label: dictionary.common.home },
          { href: routes.contact(locale), label: dictionary.nav.contact },
        ]}
      />

      <section className="py-20 sm:py-28">
        <PageContainer>
          {channels.length > 0 ? (
            <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {channels.map(({ icon: Icon, label, value, href }) => (
                <RevealItem key={label}>
                  <ChannelCard icon={Icon} label={label} value={value} href={href} />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-accent/10 text-accent">
                <Clock aria-hidden className="size-6" />
              </span>
              <h2 className="text-2xl font-bold">{contact.pendingTitle}</h2>
              <p className="text-muted">{contact.pendingDescription}</p>
            </Reveal>
          )}
        </PageContainer>
      </section>
    </>
  );
}

function ChannelCard({ icon: Icon, label, value, href }: ContactChannel) {
  const content = (
    <>
      <span className="mb-5 grid size-12 place-items-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
        <Icon aria-hidden className="size-5" />
      </span>
      <span className="block text-sm text-muted">{label}</span>
      <span className="mt-1 block font-semibold break-words">{value}</span>
    </>
  );
  const className =
    "group block h-full rounded-2xl border border-border bg-surface p-6 transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lift";

  return href ? (
    <a href={href} className={className} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}
