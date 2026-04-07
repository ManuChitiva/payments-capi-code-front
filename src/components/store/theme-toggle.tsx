"use client";

import { useCallback, useSyncExternalStore } from "react";
import { IconMoon, IconSun } from "@/components/store/icons";
import {
  applyDocumentTheme,
  readDocumentTheme,
  setStoredTheme,
  type StoreColorMode,
} from "@/lib/theme-storage";

function subscribeThemeAttribute(onChange: () => void) {
  const el = document.documentElement;
  const mo = new MutationObserver(onChange);
  mo.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(
    subscribeThemeAttribute,
    () => readDocumentTheme(),
    (): StoreColorMode => "light",
  );

  const isDark = mode === "dark";

  const toggle = useCallback(() => {
    const next: StoreColorMode = isDark ? "light" : "dark";
    applyDocumentTheme(next);
    setStoredTheme(next);
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-muted)]"
      aria-label={isDark ? "Activar tema claro" : "Activar tema oscuro"}
    >
      {isDark ? (
        <IconSun className="h-[22px] w-[22px]" />
      ) : (
        <IconMoon className="h-[22px] w-[22px]" />
      )}
    </button>
  );
}
