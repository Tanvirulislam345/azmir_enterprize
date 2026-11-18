import type { ContactDetails, SocialLinks } from "@/types/company";

/**
 * Central company configuration.
 * Empty social fields are intentional — fill them only with client-confirmed values.
 */
export const siteConfig = {
  name: "M/S. AZMIR ENTERPRIZE",
  shortName: "AZMIR ENTERPRIZE",
  /** Production origin, e.g. "https://azmirenterprize.com". Leave empty until the domain is confirmed. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  /** Client-confirmed contact details. Each office has its own number (calls, WhatsApp and imo); the email is shared. */
  contact: {
    phones: [
      { id: "primary", number: "01761116614", international: "+8801761116614", channels: ["call", "whatsapp", "imo"] },
      { id: "secondary", number: "01829577199", international: "+8801829577199", channels: ["call", "whatsapp", "imo"] },
    ],
    email: "ajmirenterprise123@gmail.com",
    offices: [
      {
        id: "sylhet",
        name: { bn: "সিলেট অফিস", en: "Sylhet office" },
        address: { bn: "ইদারা ভবন, সোবহানীঘাট, সিলেট-৩১০০", en: "Idara Bhaban, Sobhanighat, Sylhet-3100" },
        mapQuery: "Idara Bhaban, Sobhanighat, Sylhet 3100, Bangladesh",
        phoneId: "primary",
      },
      {
        id: "dhaka",
        name: { bn: "ঢাকা অফিস", en: "Dhaka office" },
        address: {
          bn: "ই/১৪, ৮ম তলা, শাহ আলী প্লাজা, মিরপুর ১০, ঢাকা-১২১৬",
          en: "E/14, 8th Floor, Shah Ali Plaza, Mirpur 10, Dhaka-1216",
        },
        mapQuery: "Shah Ali Plaza, Mirpur 10, Dhaka 1216, Bangladesh",
        phoneId: "secondary",
      },
    ],
  } satisfies ContactDetails,
  social: {
    facebook: "",
    linkedin: "",
  } satisfies SocialLinks,
} as const;
