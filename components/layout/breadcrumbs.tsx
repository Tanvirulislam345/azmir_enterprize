import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { NavLink } from "@/types/navigation";

/** Last item is the current page and is rendered without a link. */
export function Breadcrumbs({ items, label = "Breadcrumb" }: { items: NavLink[]; label?: string }) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-inverse-muted">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {isCurrent ? (
                <span aria-current="page" className="font-medium text-inverse-foreground">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="transition-colors hover:text-accent">
                    {item.label}
                  </Link>
                  <ChevronRight aria-hidden className="size-3.5" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
