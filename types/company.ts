import type { LocalizedText } from "./i18n";

export type ContactChannel = "call" | "whatsapp" | "imo";

export type PhoneNumber = {
  id: string;
  /** Local format without separators, e.g. "01761116614". */
  number: string;
  /** E.164 format, e.g. "+8801761116614", used for tel: and WhatsApp links. */
  international: string;
  /** Apps the number can be reached on. */
  channels: ContactChannel[];
};

export type Office = {
  id: string;
  name: LocalizedText;
  address: LocalizedText;
  /** English address used to look the office up on Google Maps. */
  mapQuery: string;
  /** Id of this office's number in `ContactDetails.phones`. */
  phoneId: string;
};

export type ContactDetails = {
  phones: PhoneNumber[];
  email: string;
  offices: Office[];
};

export type SocialLinks = {
  facebook: string;
  linkedin: string;
};
