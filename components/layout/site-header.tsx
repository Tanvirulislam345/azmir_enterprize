import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { getNavAboutPages, getNavCategories, getPrimaryLinks } from "@/lib/navigation";
import { routes } from "@/lib/routes";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { DesktopNavigation } from "./desktop-navigation";
import { HeaderShell } from "./header-shell";
import { LanguageMenu } from "./language-menu";
import { MobileNavigation } from "./mobile-navigation";
import { NavigationProvider } from "./navigation-context";
// Theme switching is disabled for now (see THEME_SWITCHING_ENABLED in lib/theme/theme-store.ts).
// import { ThemeMenu } from "./theme-menu";
import { Wordmark } from "./wordmark";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export async function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const [categories, aboutPages] = await Promise.all([getNavCategories(locale), getNavAboutPages(locale)]);
  const links = getPrimaryLinks(locale, dictionary.nav);

  return (
    <NavigationProvider>
      <HeaderShell>
        <PageContainer className="relative flex h-18 items-center justify-between gap-4 lg:h-20">
          <Wordmark href={routes.home(locale)} />
          <DesktopNavigation links={links} categories={categories} aboutPages={aboutPages} labels={dictionary.nav} />
          {/* Right side, read from the edge inwards: language, quote request. */}
          <div className="flex items-center gap-2">
            <ButtonLink href={links.contact.href} className="hidden lg:inline-flex">
              {dictionary.nav.requestQuote}
            </ButtonLink>
            {/* <ThemeMenu labels={dictionary.theme} /> */}
            <LanguageMenu locale={locale} labels={dictionary.language} />
            <MobileNavigation links={links} categories={categories} aboutPages={aboutPages} labels={dictionary.nav} />
          </div>
        </PageContainer>
      </HeaderShell>
    </NavigationProvider>
  );
}
