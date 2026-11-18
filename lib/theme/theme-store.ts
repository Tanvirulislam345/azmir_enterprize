export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/**
 * While false the site is light-only: the header toggle is hidden and the init script
 * ignores both the OS preference and any previously saved choice. Flip to re-enable dark mode.
 */
export const THEME_SWITCHING_ENABLED = false;

const DARK_QUERY = "(prefers-color-scheme: dark)";

const listeners = new Set<() => void>();

const hasSavedTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
};

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  listeners.forEach((listener) => listener());
}

/**
 * External store consumed with `useSyncExternalStore`.
 * The `data-theme` attribute (set before paint by the init script) is the single source of truth.
 */
export const themeStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    if (!THEME_SWITCHING_ENABLED) {
      return () => {
        listeners.delete(listener);
      };
    }

    const media = matchMedia(DARK_QUERY);
    // Follow the OS setting only until the visitor picks a theme themselves.
    const onSystemChange = (event: MediaQueryListEvent) => {
      if (!hasSavedTheme()) applyTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", onSystemChange);

    return () => {
      listeners.delete(listener);
      media.removeEventListener("change", onSystemChange);
    };
  },
  getSnapshot: (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
  getServerSnapshot: (): Theme => "light",
  set(theme: Theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
    applyTheme(theme);
  },
};

/** Runs before first paint to prevent a flash of the wrong theme. */
export const themeInitScript = THEME_SWITCHING_ENABLED
  ? `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("${DARK_QUERY}").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})();`
  : `document.documentElement.dataset.theme="light";`;
