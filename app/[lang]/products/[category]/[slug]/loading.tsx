import { PageContainer } from "@/components/ui/page-container";

/**
 * Suspense boundary for the product details segment: keeps the `params` read out of the shared App Shell and gives
 * an instant shell in the page's shape (hero, then photo beside the option and detail cards).
 */
export default function ProductLoading() {
  return (
    <div aria-busy="true" className="animate-pulse">
      <section className="bg-inverse py-16 sm:py-24">
        <PageContainer className="space-y-6">
          <div className="h-4 w-48 rounded-full bg-inverse-foreground/10" />
          <div className="h-12 w-2/3 max-w-xl rounded-xl bg-inverse-foreground/10" />
          <div className="h-5 w-1/2 max-w-md rounded-full bg-inverse-foreground/10" />
        </PageContainer>
      </section>
      <PageContainer className="grid gap-12 py-20 sm:py-24 lg:grid-cols-2">
        <div className="aspect-[4/3] rounded-2xl bg-surface-muted" />
        <div className="space-y-6">
          <div className="h-5 w-full rounded-full bg-surface-muted" />
          <div className="h-5 w-4/5 rounded-full bg-surface-muted" />
          <div className="h-36 rounded-2xl bg-surface-muted" />
          <div className="h-56 rounded-2xl bg-surface-muted" />
        </div>
      </PageContainer>
    </div>
  );
}
