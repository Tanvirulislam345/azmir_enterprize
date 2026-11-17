import type { ContactDetails, SocialLinks } from "@/types/company";

/**
 * Central company configuration.
 * Empty contact/social fields are intentional — fill them only with client-confirmed values.
 */
export const siteConfig = {
  name: "M/S. AZMIR ENTERPRIZE",
  shortName: "AZMIR ENTERPRIZE",
  /** Production origin, e.g. "https://azmirenterprize.com". Leave empty until the domain is confirmed. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  contact: {
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
  } satisfies ContactDetails,
  social: {
    facebook: "",
    linkedin: "",
  } satisfies SocialLinks,
} as const;
