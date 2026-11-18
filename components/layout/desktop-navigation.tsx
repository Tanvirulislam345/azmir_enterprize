"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { cn } from "@/lib/utils";
import type { NavAboutPage, NavCategory, NavLink } from "@/types/navigation";
import { AboutDropdown } from "./about-dropdown";
import { ProductsDropdown } from "./products-dropdown";

type DesktopNavigationProps = {
  links: { home: NavLink; products: NavLink; transportation: NavLink; about: NavLink; contact: NavLink };
  categories: NavCategory[];
  aboutPages: NavAboutPage[];
  labels: Dictionary["nav"];
};

export const isActivePath = (pathname: string, href: string, exact = false) =>
  exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

export function DesktopNavigation({
  links,
  categories,
  aboutPages,
  labels,
}: DesktopNavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={labels.label} className="hidden self-stretch lg:flex">
      <ul className="flex items-stretch">
        <NavItem
          link={links.home}
          active={isActivePath(pathname, links.home.href, true)}
        />

        {categories.length > 0 ? (
          <ProductsDropdown
            categories={categories}
            allProducts={{
              href: links.products.href,
              label: labels.allProducts,
            }}
            transportation={links.transportation}
            labels={labels}
            active={isActivePath(pathname, links.products.href)}
          />
        ) : (
          <NavItem
            link={links.products}
            active={isActivePath(pathname, links.products.href)}
          />
        )}
        <NavItem
          link={links.transportation}
          active={isActivePath(pathname, links.transportation.href)}
        />
        {aboutPages.length > 0 ? (
          <AboutDropdown
            overview={links.about}
            pages={aboutPages}
            labels={labels}
            active={isActivePath(pathname, links.about.href)}
          />
        ) : (
          <NavItem
            link={links.about}
            active={isActivePath(pathname, links.about.href)}
          />
        )}
        <NavItem
          link={links.contact}
          active={isActivePath(pathname, links.contact.href)}
        />
      </ul>
    </nav>
  );
}

function NavItem({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <li className="flex">
      <Link
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex items-center px-2.5 text-sm font-medium whitespace-nowrap transition-colors hover:text-accent xl:px-3",
          "after:absolute after:inset-x-2.5 xl:after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100",
          active && "text-accent after:scale-x-100",
        )}
      >
        {link.label}
      </Link>
    </li>
  );
}
