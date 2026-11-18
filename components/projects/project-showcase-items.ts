import type { Locale } from "@/lib/i18n/config";
import type { Project } from "@/types/project";
import { formatIndex } from "@/components/products/catalogue/format";
import type { ProjectShowcaseItem } from "./project-showcase";

/** Flattens projects into the serializable rows `ProjectShowcase` renders. */
export const toShowcaseItems = (projects: Project[], locale: Locale): ProjectShowcaseItem[] =>
  projects.map((project, index) => ({
    id: project.id,
    name: project.name[locale],
    monogramName: project.name.en,
    index: formatIndex(index + 1, locale),
    image: project.photo.src,
  }));
