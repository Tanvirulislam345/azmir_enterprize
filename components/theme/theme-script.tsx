"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useRef } from "react";
import { themeInitScript } from "@/lib/theme/theme-store";

/**
 * Injects the theme init script into the initial HTML without rendering a <script>
 * inside the React tree (which React warns about and never executes on the client).
 */
export function ThemeScript() {
  const inserted = useRef(false);

  useServerInsertedHTML(() => {
    if (inserted.current) return null;
    inserted.current = true;
    return <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />;
  });

  return null;
}
