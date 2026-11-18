import { PageContainer } from "@/components/ui/page-container";

/** Instant navigation shell for catalogue routes while params resolve. */
export default function CatalogueLoading() {
  return (
    <div aria-busy="true" className="animate-pulse">
      <section className="bg-inverse py-16 sm:py-24">
        <PageContainer className="space-y-6">
          <div className="h-4 w-48 rounded-full bg-inverse-foreground/10" />
          <div className="h-12 w-2/3 max-w-xl rounded-xl bg-inverse-foreground/10" />
          <div className="h-5 w-1/2 max-w-md rounded-full bg-inverse-foreground/10" />
        </PageContainer>
      </section>
      <div className="border-y border-border">
        <PageContainer className="flex gap-2 py-3">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-9 flex-1 rounded-full bg-surface-muted lg:w-36 lg:flex-none" />
          ))}
        </PageContainer>
      </div>
      <PageContainer className="space-y-6 py-20">
        <div className="aspect-[4/5] rounded-[1.75rem] bg-surface-muted sm:aspect-[16/9] lg:aspect-[21/9]" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="aspect-[3/4] rounded-[1.75rem] bg-surface-muted" />
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
