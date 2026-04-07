export const STORE_THEME_STORAGE_KEY = "store-theme";

export type StoreColorMode = "light" | "dark";

/** Inyectar en <head> para evitar parpadeo antes de React */
export const themeInitScriptContent = `(function(){
  try {
    var k = ${JSON.stringify(STORE_THEME_STORAGE_KEY)};
    var s = localStorage.getItem(k);
    if (s === 'light' || s === 'dark') {
      document.documentElement.setAttribute('data-theme', s);
      return;
    }
    document.documentElement.setAttribute('data-theme', 'light');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();`;

export function setStoredTheme(mode: StoreColorMode) {
  try {
    localStorage.setItem(STORE_THEME_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}

export function readDocumentTheme(): StoreColorMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export function applyDocumentTheme(mode: StoreColorMode) {
  document.documentElement.setAttribute("data-theme", mode);
}
