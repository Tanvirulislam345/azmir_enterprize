import Link from "next/link";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { PageContainer } from "@/components/ui/page-container";

type PageLink = { href: string; title: string; summary: string };

type ContinueReadingProps = {
  title: string;
  allLabel: string;
  allHref: string;
  previous?: PageLink;
  next?: PageLink;
  labels: { previous: string; next: string };
};

/** End-of-page navigation between About pages: previous, all pages, and next (like "Next message"). */
export function ContinueReading({ title, allLabel, allHref, previous, next, labels }: ContinueReadingProps) {
  return (
    <section className="border-t border-border py-16 sm:py-20">
      <PageContainer className="space-y-8">
        <Reveal className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          <Link
            href={allHref}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            <LayoutGrid aria-hidden className="size-4 text-accent" />
            {allLabel}
          </Link>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          {previous ? <NeighbourCard link={previous} label={labels.previous} direction="previous" /> : <span className="hidden md:block" />}
          {next && <NeighbourCard link={next} label={labels.next} direction="next" />}
        </div>
      </PageContainer>
    </section>
  );
}

function NeighbourCard({ link, label, direction }: { link: PageLink; label: string; direction: "previous" | "next" }) {
  const isNext = direction === "next";
  const Arrow = isNext ? ArrowRight : ArrowLeft;

  return (
    <Reveal variant={isNext ? "right" : "left"}>
      <Link
        href={link.href}
        className={cn(
          "group relative isolate flex h-full items-center gap-5 overflow-hidden rounded-[1.5rem] border border-border bg-surface p-6 shadow-soft transition-all duration-500 ease-out-expo hover:border-accent/60 hover:shadow-lift motion-safe:hover:-translate-y-1 sm:p-7",
          isNext ? "flex-row text-left" : "flex-row-reverse text-right",
        )}
      >
        <span aria-hidden className="absolute inset-0 -z-10 bg-accent/0 transition-colors duration-500 group-hover:bg-accent/5" />
        <span className="min-w-0 flex-1 space-y-1">
          <span className="block text-xs font-semibold tracking-wide text-accent">{label}</span>
          <span className="block text-xl font-semibold tracking-tight">{link.title}</span>
          <span className="block text-sm text-muted">{link.summary}</span>
        </span>
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground transition-transform duration-500 ease-out-expo motion-safe:group-hover:scale-110">
          <Arrow aria-hidden className={cn("size-5 transition-transform duration-300", isNext ? "group-hover:translate-x-0.5" : "group-hover:-translate-x-0.5")} />
        </span>
      </Link>
    </Reveal>
  );
}
