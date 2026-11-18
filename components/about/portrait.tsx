import Image from "next/image";
import { cn } from "@/lib/utils";

type PortraitProps = {
  name: string;
  initials: string;
  photo?: string;
  /** Shown as a small chip while there is no photo. */
  pendingLabel?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Size of the initials; defaults to large, for full portraits. */
  initialsClassName?: string;
};

/**
 * A person's photo, or  until one is supplied  an initials portrait on a warm gradient with a faint grid,
 * so the layout looks finished either way.
 */
export function Portrait({
  name,
  initials,
  photo,
  pendingLabel,
  sizes = "(min-width: 1024px) 30vw, 80vw",
  priority,
  className,
  initialsClassName = "text-[clamp(4rem,12vw,9rem)]",
}: PortraitProps) {
  return (
    <div
      className={cn("relative isolate overflow-hidden bg-inverse", className)}
    >
      {photo ? (
        <Image
          src={photo}
          alt={name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <>
          <span
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_20%_10%,var(--accent),transparent_60%)] opacity-90"
          />
          <span
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.06)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]"
          />
          <span
            role="img"
            aria-label={name}
            className="absolute inset-0 grid place-items-center"
          >
            <span
              className={cn(
                "leading-none font-bold tracking-tighter text-white/95 drop-shadow-sm",
                initialsClassName,
              )}
            >
              {initials}
            </span>
          </span>
          {pendingLabel && (
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1 text-xs font-medium whitespace-nowrap text-white backdrop-blur-sm">
              {pendingLabel}
            </span>
          )}
        </>
      )}
    </div>
  );
}
