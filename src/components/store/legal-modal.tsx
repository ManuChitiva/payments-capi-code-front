"use client";

import { useEffect, useId } from "react";
import { IconClose } from "@/components/store/icons";
import type { ReactNode } from "react";

export type LegalModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Bloque opcional a renderizar entre el título y el contenido principal. */
  intro?: ReactNode;
  children: ReactNode;
};

/**
 * Modal genérico para los documentos legales del footer
 * (privacidad, términos, tratamiento de datos).
 *
 * Convenciones del storefront:
 *  - Overlay con backdrop-blur y click-to-close.
 *  - Cierre por Escape.
 *  - Lock del scroll del body mientras está abierto.
 *  - Header con título + botón cerrar.
 *  - Contenido scrollable si excede la altura.
 */
export function LegalModal({
  open,
  onClose,
  title,
  intro,
  children,
}: LegalModalProps) {
  const titleId = useId();

  // Lock del scroll del body cuando el modal está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Cierre con tecla Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop — un button para que sea accesible por teclado */}
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="relative z-10 flex max-h-[85dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[var(--store-border)] bg-[var(--store-surface)] shadow-2xl shadow-black/40">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--store-border)] px-6 py-4 sm:px-8 sm:py-5">
          <h2
            id={titleId}
            className="font-display text-xl leading-tight tracking-tight text-[var(--store-text)] sm:text-2xl"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--store-border)] text-[var(--store-text-soft)] transition hover:border-[var(--store-primary)]/60 hover:text-[var(--store-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-surface)]"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          {intro ? <div className="mb-6">{intro}</div> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
