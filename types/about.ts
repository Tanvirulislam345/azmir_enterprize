import type { PhoneNumber } from "./company";
import type { LocalizedText } from "./i18n";

export type AboutPageKind = "message" | "team";

/** One entry in the About menu, the about sub-nav and the sitemap. */
export type AboutPage = {
  id: string;
  slug: string;
  kind: AboutPageKind;
  /** Key in `lib/about/about-icons.ts`. */
  icon: string;
  title: LocalizedText;
  /** One line, shown in the menu and on overview cards. */
  summary: LocalizedText;
  sortOrder: number;
};

export type Person = {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  /** Path under /public; when missing an initials portrait is shown. */
  photo?: string;
  /** Latin initials for the placeholder portrait, e.g. "RH". */
  initials: string;
};

export type LeaderMessage = {
  person: Person;
  greeting: LocalizedText;
  paragraphs: LocalizedText[];
  quote: LocalizedText;
  closing: LocalizedText;
  vision: LocalizedText;
  mission: LocalizedText;
  goals: { title: LocalizedText; text: LocalizedText }[];
};

type IconCard = { icon: string; title: LocalizedText; text: LocalizedText };

export type Team = {
  intro: LocalizedText;
  /** Services the team provides ("What we handle"). */
  responsibilities: IconCard[];
  /** Kinds of projects the team builds ("What we build"). */
  capabilities: IconCard[];
  members: Person[];
  /** The team's own contact, separate from the company's sales numbers. */
  contact: { phone: PhoneNumber; email: string };
};
