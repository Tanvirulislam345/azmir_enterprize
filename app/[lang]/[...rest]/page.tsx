import { notFound } from "next/navigation";

// Always a 404 — there is nothing to render instantly.
export const instant = false;

/** Sends unknown localized URLs to the locale-aware not-found page. */
export default function CatchAllPage() {
  notFound();
}
