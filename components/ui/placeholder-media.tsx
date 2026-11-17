import { cn } from "@/lib/utils";

type PlaceholderMediaProps = {
  /** Text whose first letter becomes the monogram, usually the product name. */
  monogram: string;
  className?: string;
};

/**
 * Neutral stand-in until the client supplies approved product photos.
 * A plain typographic panel, so it can never be mistaken for real imagery.
 */
export function PlaceholderMedia({ monogram, className }: PlaceholderMediaProps) {
  return (
    <div aria-hidden className={cn("relative grid place-items-center overflow-hidden bg-surface-muted", className)}>
      <span className="text-[clamp(5rem,14vw,9rem)] leading-none font-black text-foreground/[0.07] select-none">
        {[...monogram.trim()][0]}
      </span>
    </div>
  );
}
