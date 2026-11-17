import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Use `h1` for page heros; sections default to `h2`. */
  as?: "h1" | "h2";
  inverse?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  inverse = false,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          <span aria-hidden className="h-px w-8 bg-accent" />
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "font-bold tracking-tight",
          Heading === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl",
          inverse ? "text-inverse-foreground" : "text-foreground",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className={cn("mt-4 text-base sm:text-lg", inverse ? "text-inverse-muted" : "text-muted")}>{description}</p>
      )}
    </Reveal>
  );
}
