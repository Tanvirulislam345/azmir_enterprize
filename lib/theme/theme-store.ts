export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

const listeners = new Set<() => void>();

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function applyTheme(preference: ThemePreference) {
  const isDark = preference === "dark" || (preference === "system" && matchMedia(DARK_QUERY).matches);
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
}

/** External store consumed with `useSyncExternalStore` — no React state is needed for the theme. */
export const themeStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const media = matchMedia(DARK_QUERY);
    const onSystemChange = () => applyTheme(readPreference());
    media.addEventListener("change", onSystemChange);

    return () => {
      listeners.delete(listener);
      media.removeEventListener("change", onSystemChange);
    };
  },
  getSnapshot: readPreference,
  getServerSnapshot: (): ThemePreference => "system",
  set(preference: ThemePreference) {
    try {
      if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this page view.
    }
    applyTheme(preference);
    listeners.forEach((listener) => listener());
  },
};

/** Runs before first paint (inlined in <head>) to prevent a flash of the wrong theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("${DARK_QUERY}").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})();`;
