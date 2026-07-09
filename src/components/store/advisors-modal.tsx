"use client";

import Image from "next/image";
import { useEffect, useId } from "react";
import {
  IconAlert,
  IconClose,
  IconPhone,
  IconWhatsApp,
} from "@/components/store/icons";
import type { AdvisorsFetchState } from "@/components/store/advisors-launcher";
import type { StoreAdvisor } from "@/lib/store-types";

export type AdvisorsModalProps = {
  /** Si es false, el modal no se monta (no se renderiza nada). */
  open: boolean;
  /** Estado del fetch de asesores — controla loading/error/ready/empty. */
  state: AdvisorsFetchState;
  onClose: () => void;
  /** Reintento del fetch — solo se usa desde la vista de error. */
  onRetry?: () => void;
  /** Título del modal (opcional) */
  title?: string;
  /** Subtítulo del modal (opcional) */
  subtitle?: string;
};

/**
 * Modal con el listado de asesores comerciales de la tienda.
 *
 * - El fetch es **lazy**: lo dispara `AdvisorsModalProvider` al abrirse.
 * - Mientras el fetch está en curso, muestra un spinner.
 * - Si el fetch falla, ofrece un botón "Reintentar".
 * - Si la lista viene vacía, muestra un estado vacío claro (no un modal roto).
 * - Mantiene los patrones del resto de modales del storefront: overlay con
 *   backdrop-blur, dialog con role/aria, cierre por overlay o Escape, y
 *   lock del scroll del body mientras está abierto.
 */
export function AdvisorsModal({
  open,
  state,
  onClose,
  onRetry,
  title = "Habla con un asesor",
  subtitle = "Elige al asesor que prefieras y contáctalo directamente por WhatsApp o llamada.",
}: AdvisorsModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
      className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        aria-label="Cerrar listado de asesores"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] shadow-[var(--store-shadow-hover)] sm:max-h-[min(88dvh,720px)] sm:rounded-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--store-border-subtle)] px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--store-text-soft)]">
              Asesoría
            </p>
            <h2
              id={titleId}
              className="font-display text-xl leading-snug text-[var(--store-text)] sm:text-2xl"
            >
              {title}
            </h2>
            <p className="text-xs text-[var(--store-text-soft)] sm:text-sm">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)]"
            aria-label="Cerrar"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <AdvisorsBody state={state} onRetry={onRetry} />
        </div>
      </div>
    </div>
  );
}

function AdvisorsBody({
  state,
  onRetry,
}: {
  state: AdvisorsFetchState;
  onRetry?: () => void;
}) {
  if (state.kind === "loading" || state.kind === "idle") {
    return <LoadingState />;
  }

  if (state.kind === "error") {
    return <ErrorState message={state.message} onRetry={onRetry} />;
  }

  // ready
  if (state.advisors.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="divide-y divide-[var(--store-border-subtle)]">
      {state.advisors.map((advisor) => (
        <AdvisorRow key={advisor.id} advisor={advisor} />
      ))}
    </ul>
  );
}

function LoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <Spinner />
      <p className="text-sm font-medium text-[var(--store-text)]">
        Cargando asesores…
      </p>
      <p className="max-w-xs text-xs text-[var(--store-text-soft)]">
        Estamos trayendo el equipo comercial disponible para esta tienda.
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center"
      role="alert"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--store-primary)]/10 text-[var(--store-primary)]">
        <IconAlert className="h-6 w-6" />
      </span>
      <p className="text-sm font-semibold text-[var(--store-text)]">
        No pudimos cargar los asesores
      </p>
      <p className="max-w-xs text-xs text-[var(--store-text-soft)]">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex h-10 items-center justify-center rounded-lg border border-[var(--store-border)] bg-[var(--store-surface)] px-4 text-[13px] font-medium text-[var(--store-text)] transition hover:border-[var(--store-primary)]/45 hover:text-[var(--store-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)]"
        >
          Reintentar
        </button>
      ) : null}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <p className="text-sm font-semibold text-[var(--store-text)]">
        Aún no hay asesores publicados
      </p>
      <p className="max-w-xs text-xs text-[var(--store-text-soft)]">
        Vuelve pronto o contáctanos por los canales de la barra lateral.
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-9 w-9 animate-spin rounded-full border-2 border-[var(--store-border)] border-t-[var(--store-primary)]"
    />
  );
}

function AdvisorRow({ advisor }: { advisor: StoreAdvisor }) {
  const whatsappHref = advisor.whatsapp
    ? `https://wa.me/${digitsOnly(advisor.whatsapp)}`
    : null;
  const phoneHref = advisor.phone ? `tel:+${digitsOnly(advisor.phone)}` : null;

  return (
    <li className="flex items-center gap-4 px-4 py-4 sm:px-6 sm:py-5">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[var(--store-muted)] ring-1 ring-inset ring-[var(--store-border-subtle)] sm:h-16 sm:h-16">
        <Image
          src={advisor.photoSrc}
          alt={advisor.photoAlt ?? advisor.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-display text-[15px] leading-snug text-[var(--store-text)] sm:text-base">
          {advisor.name}
        </p>
        {advisor.role ? (
          <p className="mt-0.5 text-[12px] text-[var(--store-text-soft)] sm:text-[13px]">
            {advisor.role}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chatear con ${advisor.name} por WhatsApp`}
            className="grid h-10 w-10 place-items-center rounded-full bg-[var(--store-primary)]/10 text-[var(--store-primary)] transition hover:bg-[var(--store-primary)] hover:text-[var(--store-on-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)]"
          >
            <IconWhatsApp className="h-[18px] w-[18px]" />
          </a>
        ) : null}
        {phoneHref ? (
          <a
            href={phoneHref}
            aria-label={`Llamar a ${advisor.name}`}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-surface)] text-[var(--store-text)] transition hover:border-[var(--store-primary)]/55 hover:text-[var(--store-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)]"
          >
            <IconPhone className="h-[18px] w-[18px]" />
          </a>
        ) : null}
      </div>
    </li>
  );
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}