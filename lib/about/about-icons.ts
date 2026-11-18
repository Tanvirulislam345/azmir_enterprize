import { Boxes, Cloud, Code2, Database, Globe, Headset, LayoutGrid, Server, Sparkles, UserRound, Wrench, type LucideIcon } from "lucide-react";

/** Icons referenced by key from `data/about.ts`, so the data stays serialisable for client components. */
const ABOUT_ICONS: Record<string, LucideIcon> = {
  user: UserRound,
  headset: Headset,
  globe: Globe,
  wrench: Wrench,
  server: Server,
  data: Database,
  cloud: Cloud,
  boxes: Boxes,
  sparkles: Sparkles,
  code: Code2,
};

export const getAboutIcon = (key: string): LucideIcon => ABOUT_ICONS[key] ?? LayoutGrid;
