import Link from "next/link";
import { cacheLife } from "next/cache";
import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { formatPhone, getOfficePhone, mailtoHref, telHref } from "@/lib/contact";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { getNavCategories, getPrimaryLinks } from "@/lib/navigation";
import { routes } from "@/lib/routes";
import { Reveal } from "@/components/motion/reveal";
import { PageContainer } from "@/components/ui/page-container";
import { Wordmark } from "./wordmark";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export async function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const categories = await getNavCategories(locale);
  const links = Object.values(getPrimaryLinks(locale, dictionary.nav));
  const contactItems = getContactItems(locale);

  return (
    <footer className="relative overflow-hidden bg-inverse text-inverse-foreground">
      <PageContainer className="relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <Reveal className="space-y-4 lg:col-span-1">
          <Wordmark href={routes.home(locale)} />
          <p className="max-w-xs text-sm text-inverse-muted">{dictionary.footer.tagline}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <FooterHeading>{dictionary.footer.quickLinks}</FooterHeading>
          <FooterLinks items={links} />
        </Reveal>

        {categories.length > 0 && (
          <Reveal delay={0.16}>
            <FooterHeading>{dictionary.footer.products}</FooterHeading>
            <FooterLinks items={categories} />
          </Reveal>
        )}

        <Reveal delay={0.24}>
          <FooterHeading>{dictionary.footer.contact}</FooterHeading>
          <ul className="space-y-3 text-sm">
            {contactItems.map(({ icon: Icon, label, detail, href }) => (
              <li key={href ?? label} className="flex items-start gap-3 text-inverse-muted">
                <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                {href ? (
                  <a href={href} className="break-all transition-colors hover:text-accent">
                    {label}
                  </a>
                ) : (
                  <span>
                    <span className="block font-medium text-inverse-foreground">{label}</span>
                    {detail}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </PageContainer>

      <div className="relative border-t border-inverse-foreground/10">
        <PageContainer className="py-6 text-xs text-inverse-muted">
          © {await getCurrentYear()} {siteConfig.name}. {dictionary.footer.rights}
        </PageContainer>
      </div>
    </footer>
  );
}

type ContactItem = { icon: LucideIcon; label: string; detail?: string; href?: string };

/** Each office with its number, then the shared email, from the client-confirmed config. */
function getContactItems(locale: Locale): ContactItem[] {
  const { email, offices } = siteConfig.contact;
  return [
    // Each office, followed by its own number.
    ...offices.flatMap((office) => {
      const phone = getOfficePhone(office);
      return [
        { icon: MapPin, label: office.name[locale], detail: office.address[locale] },
        { icon: Phone, label: formatPhone(phone, locale), href: telHref(phone) },
      ];
    }),
    { icon: Mail, label: email, href: mailtoHref(email) },
  ];
}

async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

function FooterHeading({ children }: { children: string }) {
  return <h2 className="mb-4 font-semibold">{children}</h2>;
}

function FooterLinks({ items }: { items: { href: string; label: string }[] }) {
  return (
    <ul className="space-y-2.5 text-sm">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="text-inverse-muted transition-colors hover:text-accent">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
