import { PageContainer } from "@/components/ui/page-container";

/**
 * Instant navigation shell for About sub-pages while `params` resolve. It also gives the page the Suspense boundary
 * Next.js needs around URL data, so navigations into these routes render immediately.
 */
export default function AboutPageLoading() {
  return (
    <div aria-busy="true" className="animate-pulse">
      <section className="bg-inverse py-16 sm:py-20 lg:py-24">
        <PageContainer className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="mx-auto aspect-[4/5] w-full max-w-sm rounded-[2rem] bg-inverse-foreground/10 lg:max-w-none" />
          <div className="space-y-6">
            <div className="h-4 w-56 rounded-full bg-inverse-foreground/10" />
            <div className="h-4 w-40 rounded-full bg-inverse-foreground/10" />
            <div className="h-14 w-3/4 max-w-xl rounded-xl bg-inverse-foreground/10" />
            <div className="h-5 w-1/2 max-w-sm rounded-full bg-inverse-foreground/10" />
            <div className="space-y-3 pt-2">
              <div className="h-4 w-full max-w-2xl rounded-full bg-inverse-foreground/10" />
              <div className="h-4 w-5/6 max-w-xl rounded-full bg-inverse-foreground/10" />
            </div>
          </div>
        </PageContainer>
      </section>
      <div className="border-y border-border">
        <PageContainer className="flex gap-2 py-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-9 flex-1 rounded-full bg-surface-muted lg:w-40 lg:flex-none" />
          ))}
        </PageContainer>
      </div>
      <PageContainer className="mx-auto max-w-3xl space-y-4 py-20">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-4 rounded-full bg-surface-muted" style={{ width: `${100 - (index % 3) * 12}%` }} />
        ))}
      </PageContainer>
    </div>
  );
}
