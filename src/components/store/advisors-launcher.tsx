"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AdvisorsModal } from "@/components/store/advisors-modal";
import type { StoreAdvisor } from "@/lib/store-types";

type AdvisorsModalContextValue = {
  /** Abre el modal de asesores (no-op si no hay asesores). */
  open: () => void;
  /** Cierra el modal de asesores. */
  close: () => void;
  /** True si hay al menos un asesor cargado — los CTAs pueden usar esto
   *  para habilitar/deshabilitar su botón. */
  hasAdvisors: boolean;
};

const AdvisorsModalContext = createContext<AdvisorsModalContextValue | null>(
  null,
);

export type AdvisorsModalProviderProps = {
  advisors: StoreAdvisor[];
  children: ReactNode;
};

/**
 * Provider que mantiene UNA sola instancia de `AdvisorsModal` en la página.
 * Cualquier CTA (navbar, hero carrusel, etc.) puede abrirlo vía
 * `useAdvisorsModal().open()`.
 */
export function AdvisorsModalProvider({
  advisors,
  children,
}: AdvisorsModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    if (advisors.length === 0) return;
    setIsOpen(true);
  }, [advisors.length]);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<AdvisorsModalContextValue>(
    () => ({ open, close, hasAdvisors: advisors.length > 0 }),
    [open, close, advisors.length],
  );

  return (
    <AdvisorsModalContext.Provider value={value}>
      {children}
      <AdvisorsModal
        advisors={isOpen ? advisors : null}
        onClose={close}
      />
    </AdvisorsModalContext.Provider>
  );
}

/**
 * Hook para abrir/cerrar el modal de asesores desde cualquier cliente.
 * Devuelve `null` si se usa fuera del provider (caso server / SSR aislado).
 */
export function useAdvisorsModal(): AdvisorsModalContextValue | null {
  return useContext(AdvisorsModalContext);
}