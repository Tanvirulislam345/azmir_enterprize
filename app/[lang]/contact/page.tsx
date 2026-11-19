import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  directionsHref,
  formatPhone,
  getOfficePhone,
  mailtoHref,
  mapEmbedSrc,
  telHref,
  whatsappTarget,
} from "@/lib/contact";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { routes } from "@/lib/routes";
import { buildMetadata, getBaseUrl } from "@/lib/seo/metadata";
import { OfficeSwitcher } from "@/components/contact/office-switcher";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { photos } from "@/data/photos";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const { contact } = await getDictionary(locale);
  return buildMetadata({
    locale,
    title: contact.metaTitle,
    description: contact.metaDescription,
    path: "/contact",
  });
}

/** Contact: both offices on a live map, each card carrying the numbers and email. No form; every action is a direct handoff. */
export default async function ContactPage() {
  const locale = await resolveLocale();
  const dictionary = await getDictionary(locale);
  const { contact: copy } = dictionary;
  const { email, offices } = siteConfig.contact;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd(locale)),
        }}
      />

      <PageHero
        photo={photos.tipperTruck}
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        breadcrumbs={[
          { href: routes.home(locale), label: dictionary.common.home },
          { href: routes.contact(locale), label: dictionary.nav.contact },
        ]}
      />

      <section className="py-20 sm:py-28">
        <PageContainer className="space-y-12">
          <SectionHeading
            title={copy.officesTitle}
            description={copy.officesDescription}
          />
          <Reveal>
            <OfficeSwitcher
              offices={offices.map((office) => ({
                id: office.id,
                name: office.name[locale],
                address: office.address[locale],
                mapSrc: mapEmbedSrc(office),
                directionsHref: directionsHref(office),
                mapTitle: copy.mapTitle.replace(
                  "{office}",
                  office.name[locale],
                ),
                phone: (() => {
                  const phone = getOfficePhone(office);
                  return {
                    display: formatPhone(phone, locale),
                    copyValue: phone.number,
                    telHref: telHref(phone),
                    whatsapp: whatsappTarget(phone, copy.whatsappGreeting),
                  };
                })(),
              }))}
              email={{ value: email, href: mailtoHref(email) }}
              labels={{
                group: copy.officesLabel,
                directions: copy.directions,
                copied: copy.copied,
                copyValue: copy.copyValue,
                callValue: copy.callValue,
                whatsappValue: copy.whatsappValue,
                emailValue: copy.emailValue,
              }}
            />
          </Reveal>
        </PageContainer>
      </section>
    </>
  );
}

/** Structured data so search engines can show the offices, numbers and email. */
function localBusinessJsonLd(locale: Locale) {
  const { email, offices } = siteConfig.contact;
  const url = `${getBaseUrl()}/${locale}`;
  return {
    "@context": "https://schema.org",
    "@graph": offices.map((office) => ({
      "@type": "LocalBusiness",
      "@id": `${url}/contact#${office.id}`,
      name: `${siteConfig.name}  ${office.name.en}`,
      url,
      email,
      telephone: getOfficePhone(office).international,
      address: {
        "@type": "PostalAddress",
        streetAddress: office.address.en,
        addressCountry: "BD",
      },
    })),
  };
}
