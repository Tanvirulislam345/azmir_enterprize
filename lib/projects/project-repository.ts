import { projects } from "@/data/projects";
import type { Project } from "@/types/project";

/** Data access for the projects we have supplied; swapping in an API later only touches this file. */
export const projectRepository = {
  async getSelectedProjects(): Promise<Project[]> {
    return projects.filter((project) => project.isPublished).sort((a, b) => a.sortOrder - b.sortOrder);
  },
};
