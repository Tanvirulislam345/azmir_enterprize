import type { LocalizedText } from "./i18n";

export type PhotoCredit = {
  author: string;
  license: string;
  sourceUrl: string;
};

export type Photo = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: LocalizedText;
  /** Short place/subject caption shown with the photo. Describes only what the photo shows. */
  caption: LocalizedText;
  credit: PhotoCredit;
};
