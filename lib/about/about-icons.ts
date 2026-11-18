import { Database, Globe, Headset, LayoutGrid, MessagesSquare, MonitorSmartphone, UserRound, type LucideIcon } from "lucide-react";

/** Icons referenced by key from `data/about.ts`, so the data stays serialisable for client components. */
const ABOUT_ICONS: Record<string, LucideIcon> = {
  user: UserRound,
  headset: Headset,
  globe: Globe,
  messages: MessagesSquare,
  devices: MonitorSmartphone,
  data: Database,
};

export const getAboutIcon = (key: string): LucideIcon => ABOUT_ICONS[key] ?? LayoutGrid;
