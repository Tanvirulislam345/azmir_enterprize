import { cn } from "@/lib/utils";

/** Up to two initials from a Latin name, skipping joiners like "&". */
export const projectInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter((word) => /^[A-Za-z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

/** Accent circle with a project's initials, standing in for a client logo. */
export function ProjectMonogram({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground sm:size-12",
        className,
      )}
    >
      {projectInitials(name)}
    </span>
  );
}
