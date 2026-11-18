/** Locale-resolved, serialisable menu data passed from the server header to client navigation. */
export type NavLink = {
  href: string;
  label: string;
};

export type NavCategory = NavLink & {
  id: string;
  variants: NavLink[];
};

export type NavAboutPage = NavLink & {
  id: string;
  summary: string;
  /** Key in `lib/about/about-icons.ts`. */
  icon: string;
};
