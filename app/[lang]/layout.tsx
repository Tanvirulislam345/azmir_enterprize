import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import { siteConfig } from "@/config/site";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { buildMetadata, getBaseUrl } from "@/lib/seo/metadata";
import { themeInitScript } from "@/lib/theme/theme-store";
import { BackToTop } from "@/components/layout/back-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionProvider } from "@/components/motion/motion-provider";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#16191b" },
  ],
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dictionary = await getDictionary(locale);

  return {
    ...buildMetadata({ locale, description: dictionary.meta.description }),
    metadataBase: new URL(getBaseUrl()),
    title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
    applicationName: siteConfig.name,
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const locale = await resolveLocale(params);
  const dictionary = await getDictionary(locale);

  return (
    // The theme script sets data-theme before hydration, so the attribute mismatch is expected.
    <html lang={locale} className={`${inter.variable} ${notoBengali.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[70] rounded-full bg-accent px-4 py-2 font-semibold text-accent-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          {dictionary.common.skipToContent}
        </a>
        <MotionProvider>
          <ScrollProgress />
          <SiteHeader locale={locale} dictionary={dictionary} />
          <main id="main" className="flex-1 pt-18 lg:pt-20">
            {children}
          </main>
          <SiteFooter locale={locale} dictionary={dictionary} />
          <BackToTop label={dictionary.common.backToTop} />
        </MotionProvider>
      </body>
    </html>
  );
}
