import Image from "next/image";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { cn } from "@/lib/utils";

type ProductMediaProps = {
  src?: string;
  alt: string;
  seed: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Approved photo when available, otherwise neutral placeholder artwork. Parent must size the box. */
export function ProductMedia({ src, alt, seed, sizes, priority, className }: ProductMediaProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
      ) : (
        <PlaceholderMedia seed={seed} className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-105" />
      )}
    </div>
  );
}
