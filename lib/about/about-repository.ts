import { aboutPages, itSupportTeam, managingDirector } from "@/data/about";
import type { AboutPage } from "@/types/about";

const sorted = () => [...aboutPages].sort((a, b) => a.sortOrder - b.sortOrder);

/** Data access for the About section; swapping in a CMS later only touches this file. */
export const aboutRepository = {
  async getAboutPages(): Promise<AboutPage[]> {
    return sorted();
  },
  async getAboutPage(slug: string): Promise<AboutPage | null> {
    return sorted().find((page) => page.slug === slug) ?? null;
  },
  async getManagingDirector() {
    return managingDirector;
  },
  async getItSupportTeam() {
    return itSupportTeam;
  },
};
