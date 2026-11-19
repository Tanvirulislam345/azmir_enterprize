import { ExpandingPanels, type ExpandingPanelItem } from "./expanding-panels";

export type SandPanelItem = ExpandingPanelItem;

type SandPanelsProps = {
  items: SandPanelItem[];
  viewDetails: string;
  /** Smaller row for compact categories. */
  compact?: boolean;
};

/** `panels` layout: tall photo panels that open on hover, entering right to left. */
export function SandPanels({ items, viewDetails, compact = false }: SandPanelsProps) {
  return <ExpandingPanels items={items} ctaLabel={viewDetails} size={compact ? "sm" : "md"} />;
}
