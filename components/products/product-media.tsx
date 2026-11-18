import Image from "next/image";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { cn } from "@/lib/utils";

type ProductMediaProps = {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Approved photo when available, otherwise neutral placeholder artwork. Parent must size the box.
 * Hover effects react to the nearest `group` ancestor (the card link): a slow zoom with a slight tilt,
 * a colour lift, a soft bottom vignette and a single light sheen sweeping across the photo.
 * Movement is limited to `motion-safe`, so reduced-motion visitors only get the colour and vignette fade.
 */
export function ProductMedia({ src, alt, sizes, priority, className }: ProductMediaProps) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-surface-muted", className)}>
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              "object-cover saturate-[0.92] transition-[transform,filter] duration-[1200ms] ease-out-expo will-change-transform",
              "group-hover:brightness-105 group-hover:saturate-[1.12]",
              "motion-safe:group-hover:scale-110 motion-safe:group-hover:rotate-1",
            )}
          />
          {/* Bottom vignette adds depth and keeps the frame grounded while zoomed. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent opacity-0 transition-opacity duration-700 ease-out-expo group-hover:opacity-100"
          />
          {/* Light sheen: parked off the left edge, sweeps across once on hover. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/30 to-transparent opacity-0 motion-safe:transition-[translate,opacity] motion-safe:duration-1000 motion-safe:ease-out-expo motion-safe:group-hover:translate-x-[450%] motion-safe:group-hover:opacity-100"
          />
        </>
      ) : (
        <PlaceholderMedia monogram={alt} className="absolute inset-0" />
      )}
    </div>
  );
}
