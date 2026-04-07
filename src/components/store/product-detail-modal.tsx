"use client";

import Image from "next/image";
import { useEffect, useId } from "react";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { formatStorePrice } from "@/lib/format-store-price";
import type { StoreProduct } from "@/lib/store-types";

const DEFAULT_COPY =
  "Producto sujeto a disponibilidad. Si necesitas medidas, compatibilidad o plazos de entrega, contáctanos y te ayudamos.";

export type ProductDetailModalProps = {
  product: StoreProduct | null;
  onClose: () => void;
  locale?: string;
};

export function ProductDetailModal({
  product,
  onClose,
  locale = "es-CO",
}: ProductDetailModalProps) {
  const titleId = useId();
  const open = product !== null;

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

  if (!product) return null;

  const price = formatStorePrice(
    product.price,
    product.currencySymbol,
    locale,
  );
  const refLabel = product.ref ?? `REF-${product.id}`;
  const available = product.availableQuantity;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        aria-label="Cerrar detalle del producto"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] shadow-[var(--store-shadow-hover)] sm:max-h-[min(88dvh,720px)] sm:rounded-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--store-border-subtle)] px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--store-text-soft)]">
              Detalle del producto
            </p>
            <h2
              id={titleId}
              className="font-display text-xl leading-snug text-[var(--store-text)] sm:text-2xl"
            >
              {product.title}
            </h2>
            <p className="text-xs text-[var(--store-text-soft)]">{refLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)]"
            aria-label="Cerrar"
          >
            <span className="text-2xl leading-none" aria-hidden>
              ×
            </span>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-4 sm:flex-row sm:gap-8 sm:p-6">
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-[var(--store-muted)] sm:max-w-[min(100%,320px)]">
              <Image
                src={product.imageSrc}
                alt={product.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 320px"
                priority
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <p className="font-display text-2xl tabular-nums text-[var(--store-primary)] sm:text-3xl">
                {price}
              </p>
              {typeof available === "number" ? (
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--store-text-soft)]">
                  {available > 0
                    ? `Disponibles: ${available}`
                    : "Sin unidades disponibles"}
                </p>
              ) : null}
              <p className="text-sm leading-relaxed text-[var(--store-text-soft)]">
                {product.description?.trim() || DEFAULT_COPY}
              </p>
              <div className="mt-auto flex flex-col gap-3 border-t border-[var(--store-border-subtle)] pt-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1 sm:max-w-xs">
                  <AddToCartButton product={product} layout="grid" />
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-[var(--store-border-subtle)] px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--store-text-soft)] transition hover:border-[var(--store-primary)]/40 hover:text-[var(--store-text)]"
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
