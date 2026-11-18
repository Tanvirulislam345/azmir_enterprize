import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Office, PhoneNumber } from "@/types/company";

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

/** "01761116614" → "01761-116614", in Bangla digits for `bn`. Links always keep the ASCII number. */
export function formatPhone(phone: PhoneNumber, locale: Locale) {
  const grouped = phone.number.replace(/^(\d{5})(\d+)$/, "$1-$2");
  return locale === "bn" ? grouped.replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)]) : grouped;
}

export const telHref = (phone: PhoneNumber) => `tel:${phone.international}`;

/** Opens a WhatsApp chat with the number, optionally with a pre-written first message. */
export const whatsappHref = (phone: PhoneNumber, text?: string) =>
  `https://wa.me/${phone.international.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const mailtoHref = (email: string) => `mailto:${email}`;

export const mapEmbedSrc = (office: Office) => `https://www.google.com/maps?q=${encodeURIComponent(office.mapQuery)}&output=embed`;

export const directionsHref = (office: Office) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery)}`;

/** The phone number that belongs to an office. */
export function getOfficePhone(office: Office): PhoneNumber {
  const phone = siteConfig.contact.phones.find((candidate) => candidate.id === office.phoneId);
  if (!phone) throw new Error(`No phone "${office.phoneId}" configured for office "${office.id}".`);
  return phone;
}
