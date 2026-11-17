import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type WordmarkProps = {
  href: string;
  className?: string;
};

/** Text wordmark used until the client supplies an approved logo. */
export function Wordmark({ href, className }: WordmarkProps) {
  return (
    <Link href={href} className={cn("group flex items-center gap-3", className)} aria-label={siteConfig.name}>
      <span
        aria-hidden
        className="grid size-9 shrink-0 sm:size-10 place-items-center rounded-xl bg-accent text-lg font-black text-accent-foreground transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg] group-hover:scale-105"
      >
        A
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[0.65rem] font-semibold tracking-[0.25em] opacity-70">M/S.</span>
        <span className="text-sm font-extrabold tracking-tight whitespace-nowrap sm:text-lg">{siteConfig.shortName}</span>
      </span>
    </Link>
  );
}
