"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AdvisorsModal } from "@/components/store/advisors-modal";
import {
  mapAdvisors,
  type AdvisorApiResponse,
} from "@/lib/store-advisor-mapper";
import type { StoreAdvisor } from "@/lib/store-types";

/**
 * Estado del fetch de asesores. La máquina sigue este orden:
 * `idle` → `loading` → (`ready` | `error`). Una vez en `ready` o
 * `error`, no se vuelve a `loading` salvo reintento explícito.
 */
export type AdvisorsFetchState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; advisors: StoreAdvisor[] }
  | { kind: "error"; message: string };

type AdvisorsModalContextValue = {
  /** Abre el modal y dispara el fetch si todavía no tenemos datos. */
  open: () => void;
  /** Cierra el modal (no limpia el estado del fetch). */
  close: () => void;
  /** True si ya tenemos datos cargados y la lista no está vacía. */
  hasAdvisors: boolean;
  /** Estado actual del fetch (idle / loading / ready / error). */
  state: AdvisorsFetchState;
};

const AdvisorsModalContext = createContext<AdvisorsModalContextValue | null>(
  null,
);

export type AdvisorsModalProviderProps = {
  /**
   * Slug de la tienda (ej. "makeup"). Se usa para armar la URL del endpoint
   * público `GET /stores/{slug}/personal`.
   */
  slug: string;
  /**
   * Base URL absoluta del backend SIN slash final (ej. "http://localhost:8094/store").
   * Si llega vacía, el modal mostrará un error al abrir.
   */
  apiBaseUrl: string;
  children: ReactNode;
};

/**
 * Provider que mantiene UNA sola instancia de `AdvisorsModal` en la página.
 * Cualquier CTA (navbar, hero carrusel, etc.) puede abrirlo vía
 * `useAdvisorsModal().open()`. El fetch a `/stores/{slug}/personal` se
 * dispara **solo cuando el usuario abre el modal por primera vez**, lo que
 * evita acoplar el SSR al endpoint y permite mostrar loading/error reales.
 */
export function AdvisorsModalProvider({
  slug,
  apiBaseUrl,
  children,
}: AdvisorsModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<AdvisorsFetchState>({ kind: "idle" });

  const fetchAdvisors = useCallback(async () => {
    if (!apiBaseUrl) {
      setState({
        kind: "error",
        message: "Falta la URL del API de tienda.",
      });
      return;
    }
    setState({ kind: "loading" });
    try {
      const endpoint = `${apiBaseUrl.replace(/\/$/, "")}/stores/${encodeURIComponent(slug)}/personal`;
      const res = await fetch(endpoint, { method: "GET", cache: "no-store" });
      if (!res.ok) {
        setState({
          kind: "error",
          message: `No se pudo cargar el equipo de asesores (HTTP ${res.status}).`,
        });
        return;
      }
      const data = (await res.json()) as AdvisorApiResponse[];
      setState({ kind: "ready", advisors: mapAdvisors(data) });
    } catch (err) {
      setState({
        kind: "error",
        message:
          err instanceof Error
            ? err.message
            : "Error de red al cargar asesores.",
      });
    }
  }, [apiBaseUrl, slug]);

  const open = useCallback(() => {
    setIsOpen(true);
    if (state.kind === "idle" || state.kind === "error") {
      void fetchAdvisors();
    }
  }, [state.kind, fetchAdvisors]);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<AdvisorsModalContextValue>(
    () => ({
      open,
      close,
      hasAdvisors: state.kind === "ready" && state.advisors.length > 0,
      state,
    }),
    [open, close, state],
  );

  // Si el provider se desmonta con el modal abierto, no pasa nada (el body
  // overflow se restaura en el useEffect interno del modal). No hace falta
  // cleanup adicional acá.

  // Opcional: precalentar la primera carga al montar (no rompe nada si
  // falla — solo acelera la primera apertura).
  useEffect(() => {
    if (state.kind === "idle" && apiBaseUrl && slug) {
      void fetchAdvisors();
    }
    // Solo al montar / cuando cambian las props; no en cada cambio de estado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl, slug]);

  return (
    <AdvisorsModalContext.Provider value={value}>
      {children}
      <AdvisorsModal
        open={isOpen}
        state={state}
        onClose={close}
        onRetry={fetchAdvisors}
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