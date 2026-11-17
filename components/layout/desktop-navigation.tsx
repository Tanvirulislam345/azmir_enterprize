"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { cn } from "@/lib/utils";
import type { NavCategory, NavLink } from "@/types/navigation";
import { ProductsDropdown } from "./products-dropdown";

type DesktopNavigationProps = {
  links: { home: NavLink; about: NavLink; products: NavLink; contact: NavLink };
  categories: NavCategory[];
  labels: Dictionary["nav"];
};

export const isActivePath = (pathname: string, href: string, exact = false) =>
  exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

export function DesktopNavigation({
  links,
  categories,
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
          link={links.about}
          active={isActivePath(pathname, links.about.href)}
        />
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
          "relative flex items-center px-3 text-sm font-medium transition-colors hover:text-accent",
          "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100",
          active && "text-accent after:scale-x-100",
        )}
      >
        {link.label}
      </Link>
    </li>
  );
}
