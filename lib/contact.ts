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

/** A WhatsApp chat to open: the number in international digits only (e.g. "8801761116614") and an optional first message. */
export type WhatsAppTarget = { number: string; text?: string };

export const whatsappTarget = (phone: PhoneNumber, text?: string): WhatsAppTarget => ({
  number: phone.international.replace(/\D/g, ""),
  ...(text ? { text } : {}),
});

/**
 * The ways to open a WhatsApp chat with a number:
 * - `app`: the app's own scheme; opens the chat straight away on phones with WhatsApp installed.
 * - `web`: WhatsApp Web, which goes straight to the chat on computers.
 * - `universal`: WhatsApp's official send link, the fallback when neither of the above applies (no JS, app missing).
 */
export function whatsappLinks({ number, text }: WhatsAppTarget) {
  const query = `phone=${number}${text ? `&text=${encodeURIComponent(text)}` : ""}`;
  return {
    app: `whatsapp://send?${query}`,
    web: `https://web.whatsapp.com/send?${query}`,
    universal: `https://api.whatsapp.com/send?${query}`,
  };
}

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
