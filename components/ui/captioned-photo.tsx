import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Photo } from "@/types/photo";
import { cn } from "@/lib/utils";

type CaptionedPhotoProps = {
  photo: Photo;
  locale: Locale;
  sizes: string;
  className?: string;
};

/** A content photo with its place caption overlaid in the corner. Parent sets the box size. */
export function CaptionedPhoto({ photo, locale, sizes, className }: CaptionedPhotoProps) {
  return (
    <figure className={cn("relative overflow-hidden", className)}>
      <Image src={photo.src} alt={photo.alt[locale]} fill sizes={sizes} className="object-cover" />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-4 pt-10 pb-3 text-right text-sm font-medium text-white">
        {photo.caption[locale]}
      </figcaption>
    </figure>
  );
}
