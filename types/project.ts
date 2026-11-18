import type { LocalizedText } from "./i18n";
import type { Photo } from "./photo";

export type Project = {
  id: string;
  name: LocalizedText;
  /** Shown on the projects page; the photo's own alt text is replaced by the project name. */
  photo: Photo;
  isPublished: boolean;
  sortOrder: number;
};
