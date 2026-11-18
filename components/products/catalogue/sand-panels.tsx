import { ExpandingPanels, type ExpandingPanelItem } from "./expanding-panels";

export type SandPanelItem = ExpandingPanelItem;

type SandPanelsProps = {
  items: SandPanelItem[];
  viewDetails: string;
};

/** `panels` layout: tall photo panels that open on hover, entering right to left. */
export function SandPanels({ items, viewDetails }: SandPanelsProps) {
  return <ExpandingPanels items={items} ctaLabel={viewDetails} />;
}
