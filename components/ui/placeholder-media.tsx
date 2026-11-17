import { cn } from "@/lib/utils";

type PlaceholderMediaProps = {
  /** Varies the composition so neighbouring placeholders don't look identical. */
  seed?: string;
  label?: string;
  className?: string;
};

const hashSeed = (seed: string) => [...seed].reduce((total, char) => total + char.charCodeAt(0), 0);

/**
 * Decorative, clearly-generic artwork shown until the client supplies approved photos.
 * It is intentionally abstract so it can never be mistaken for real company imagery.
 */
export function PlaceholderMedia({ seed = "azmir", label, className }: PlaceholderMediaProps) {
  const hash = hashSeed(seed);
  const rotate = (hash % 7) * 9 - 27;
  const offset = 20 + (hash % 5) * 8;

  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "relative isolate overflow-hidden bg-inverse bg-gradient-to-br from-inverse-foreground/15 to-transparent text-inverse-foreground",
        className,
      )}
    >
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div
        className="absolute size-[70%] rounded-full bg-accent/25 blur-3xl"
        style={{ left: `${offset}%`, top: `${100 - offset - 40}%` }}
      />
      <svg viewBox="0 0 200 200" className="absolute inset-0 m-auto h-3/5 w-3/5 opacity-80" style={{ rotate: `${rotate}deg` }}>
        <polygon points="40,150 80,70 120,130" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <polygon points="90,160 130,60 170,140" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.4" />
        <circle cx="60" cy="60" r="14" fill="var(--accent-soft)" fillOpacity="0.5" />
      </svg>
    </div>
  );
}
