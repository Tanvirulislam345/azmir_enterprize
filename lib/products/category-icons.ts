import { BrickWall, Construction, Flame, LayoutGrid, Mountain, Shovel, type LucideIcon } from "lucide-react";
import type { ProductCategory } from "@/types/product";

/** Icon for each category `icon` key. Add a key here (and to `CategoryIconName`) for a new kind of material. */
const CATEGORY_ICONS = {
  stone: Mountain,
  sand: Shovel,
  bricks: BrickWall,
  coal: Flame,
  iron: Construction,
} satisfies Record<string, LucideIcon>;

export type CategoryIconName = keyof typeof CATEGORY_ICONS;

export const getCategoryIcon = (category: Pick<ProductCategory, "icon">): LucideIcon =>
  (category.icon && CATEGORY_ICONS[category.icon]) || LayoutGrid;
