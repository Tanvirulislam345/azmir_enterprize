import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";

/**
 * Rendered inside the locale layout. `not-found` receives no params,
 * so the copy is bilingual rather than guessing the locale.
 */
export default function NotFound() {
  return (
    <section className="py-28 sm:py-36">
      <PageContainer className="flex flex-col items-center gap-6 text-center">
        <p className="text-7xl font-black text-accent sm:text-9xl">404</p>
        <h1 className="text-3xl font-bold">
          পৃষ্ঠাটি পাওয়া যায়নি <span className="text-muted">· Page not found</span>
        </h1>
        <p className="max-w-lg text-muted">
          আপনি যে পৃষ্ঠাটি খুঁজছেন তা নেই অথবা এখনো উপলব্ধ নয়। The page you are looking for does not exist or is not available yet.
        </p>
        <Link href="/" className={buttonClassName("primary", "lg")}>
          হোম · Home
        </Link>
      </PageContainer>
    </section>
  );
}
