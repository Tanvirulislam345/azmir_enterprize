/** Infinite ticker of published product names; pauses on hover and for reduced motion. */
export function MaterialMarquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  // Rendered twice so the -50% translate loops seamlessly.
  const track = [...items, ...items];

  return (
    <div aria-hidden className="group overflow-hidden border-y border-border bg-surface-muted py-5">
      <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-12 group-hover:[animation-play-state:paused]">
        {track.map((item, index) => (
          <span key={index} className="flex items-center gap-12 text-2xl font-bold whitespace-nowrap text-foreground/80">
            {item}
            <span className="size-2 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
