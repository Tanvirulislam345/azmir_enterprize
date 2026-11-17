import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { getNavCategories, getPrimaryLinks } from "@/lib/navigation";
import { routes } from "@/lib/routes";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { DesktopNavigation } from "./desktop-navigation";
import { HeaderShell } from "./header-shell";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNavigation } from "./mobile-navigation";
import { NavigationProvider } from "./navigation-context";
import { ThemeToggle } from "./theme-toggle";
import { Wordmark } from "./wordmark";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export async function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const categories = await getNavCategories(locale);
  const links = getPrimaryLinks(locale, dictionary.nav);

  return (
    <NavigationProvider>
      <HeaderShell>
        <PageContainer className="relative flex h-18 items-center justify-between gap-4 lg:h-20">
          <Wordmark href={routes.home(locale)} />
          <DesktopNavigation links={links} categories={categories} labels={dictionary.nav} />
          <div className="flex items-center gap-2">
            <LanguageSwitcher locale={locale} labels={dictionary.language} className="hidden sm:inline-flex" />
            <ThemeToggle labels={dictionary.theme} />
            <ButtonLink href={links.contact.href} withArrow className="hidden lg:inline-flex">
              {dictionary.nav.requestQuote}
            </ButtonLink>
            <MobileNavigation
              links={links}
              categories={categories}
              labels={dictionary.nav}
              footer={<LanguageSwitcher locale={locale} labels={dictionary.language} className="w-full justify-center sm:hidden" />}
            />
          </div>
        </PageContainer>
      </HeaderShell>
    </NavigationProvider>
  );
}
