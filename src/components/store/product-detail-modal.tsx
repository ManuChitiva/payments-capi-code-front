"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import { useCart } from "@/components/store/cart-context";
import { formatStorePrice } from "@/lib/format-store-price";
import { trackStoreEvent } from "@/lib/store-analytics";
import type {
  StoreProduct,
  StoreProductVariant,
} from "@/lib/store-types";

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
  const { addItem } = useCart();

  const variants = product?.variants ?? [];
  const hasVariants = variants.length > 0;

  // Selección de variante: si hay, por defecto la primera; si no, undefined.
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );

  // Cap visual de variantes: si el producto tiene más de N opciones,
  // mostramos las primeras N + un botón "Ver más" para revelar el resto.
  // Evita que la lista de variantes desplace la imagen, descripción y CTA
  // cuando hay productos con muchos tonos/tallas.
  const MAX_VISIBLE_VARIANTS = 8;
  const [showAllVariants, setShowAllVariants] = useState(false);
  const variantToggleClass =
    "inline-flex items-center gap-1.5 rounded-full border border-dashed border-[var(--store-border-subtle)] bg-transparent px-3.5 py-2 text-[12px] font-semibold text-[var(--store-text-soft)] transition hover:border-[var(--store-primary)]/55 hover:bg-[var(--store-muted)]/40 hover:text-[var(--store-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-surface)]";

  // Reset selección y expansión cada vez que cambia el producto abierto
  useEffect(() => {
    setSelectedVariantId(variants[0]?.id ?? null);
    setShowAllVariants(false);
  }, [product?.id, variants]);

  const selectedVariant: StoreProductVariant | undefined = useMemo(() => {
    if (!hasVariants) return undefined;
    return variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  }, [hasVariants, variants, selectedVariantId]);

  // Variantes renderizadas en el modal: capadas cuando el producto
  // supera MAX_VISIBLE_VARIANTS, completas cuando el usuario expandió.
  const visibleVariants = showAllVariants
    ? variants
    : variants.slice(0, MAX_VISIBLE_VARIANTS);
  const hiddenVariantCount = variants.length - visibleVariants.length;
  const canCollapse = variants.length > MAX_VISIBLE_VARIANTS;

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

  useEffect(() => {
    if (!product) return;
    trackStoreEvent({
      eventType: "PRODUCT_VIEW",
      productId: Number(product.id),
      source: "product-detail-modal",
    });
  }, [product]);

  if (!product) return null;

  // Datos efectivos mostrados (variante si hay, si no el producto)
  const effectivePrice = selectedVariant?.price ?? product.price;
  const effectiveCurrency =
    selectedVariant?.currencySymbol || product.currencySymbol;
  const effectiveImageSrc =
    selectedVariant?.imageSrc || product.imageSrc;
  const effectiveImageAlt =
    selectedVariant?.imageAlt || product.imageAlt;
  const effectiveAvailable = selectedVariant?.availableQuantity;

  const price = formatStorePrice(
    effectivePrice,
    effectiveCurrency,
    locale,
  );
  const refLabel = product.ref ?? `REF-${product.id}`;
  const isVariantOutOfStock =
    typeof effectiveAvailable === "number" && effectiveAvailable <= 0;

  const addButtonLabel = isVariantOutOfStock
    ? "Sin stock"
    : hasVariants && selectedVariant
      ? `Añadir · ${selectedVariant.title}`
      : "Añadir al carrito";

  function handleAddToCart() {
    if (!product) return;
    if (isVariantOutOfStock) return;
    // Si hay variantes y por algún motivo no hay selección, usamos la primera
    // que sí tenga stock; si ninguna tiene stock, no hacemos nada.
    const variantToAdd =
      selectedVariant ??
      (hasVariants
        ? variants.find((v) => v.availableQuantity > 0) ?? variants[0]
        : undefined);
    if (hasVariants && !variantToAdd) return;
    addItem(product, variantToAdd);
    trackStoreEvent({
      eventType: "ADD_TO_CART",
      productId: Number(product.id),
      variantId: variantToAdd ? Number(variantToAdd.id) : undefined,
      source: "product-detail-modal",
    });
    onClose();
  }

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
            <p className="text-xs text-[var(--store-text-soft)]">
              {selectedVariant ? `SKU ${selectedVariant.sku}` : refLabel}
            </p>
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
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-[var(--store-muted)] ring-1 ring-inset ring-white/10 sm:max-w-[min(100%,320px)]">
              <Image
                src={effectiveImageSrc}
                alt={effectiveImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 320px"
                priority
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="space-y-1">
                <p className="font-display text-2xl tabular-nums text-[var(--store-primary)] sm:text-3xl">
                  {price}
                </p>
                {typeof effectiveAvailable === "number" ? (
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--store-text-soft)]">
                    {isVariantOutOfStock
                      ? "Sin unidades disponibles"
                      : effectiveAvailable > 0
                        ? `Disponibles: ${effectiveAvailable}`
                        : ""}
                  </p>
                ) : null}
              </div>

              {/* Selector de variantes */}
              {hasVariants ? (
                <div className="space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--store-text-soft)]">
                      Opciones
                    </p>
                    {selectedVariant ? (
                      <p className="text-[11px] font-medium text-[var(--store-text)]">
                        {selectedVariant.title}
                      </p>
                    ) : null}
                  </div>
                  <div
                    className="flex flex-wrap gap-2"
                    role="radiogroup"
                    aria-label="Selecciona una opción"
                  >
                    {visibleVariants.map((v) => {
                      const active = v.id === selectedVariant?.id;
                      const outOfStock = v.availableQuantity <= 0;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          aria-label={`${v.title}${outOfStock ? " (sin stock)" : ""}`}
                          disabled={outOfStock}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`group relative inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-surface)] ${
                            active
                              ? "border-[var(--store-primary)] bg-[var(--store-primary)] text-[var(--store-on-primary)] shadow-[0_4px_14px_-4px_rgba(0,113,227,0.35)]"
                              : outOfStock
                                ? "cursor-not-allowed border-[var(--store-border-subtle)] bg-[var(--store-muted)]/40 text-[var(--store-text-soft)] opacity-60 line-through"
                                : "border-[var(--store-border-subtle)] bg-[var(--store-surface)] text-[var(--store-text)] hover:border-[var(--store-primary)]/45 hover:bg-[var(--store-muted)]/35"
                          }`}
                        >
                          <span
                            className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] ${
                              active
                                ? "bg-[var(--store-on-primary)]/20 text-[var(--store-on-primary)]"
                                : "bg-[var(--store-primary)]/10 text-[var(--store-primary)]"
                            }`}
                            aria-hidden
                          >
                            {active ? "●" : "○"}
                          </span>
                          <span>{v.title}</span>
                          {!outOfStock && v.price !== product.price ? (
                            <span
                              className={`text-[10px] tabular-nums ${
                                active
                                  ? "text-[var(--store-on-primary)]/85"
                                  : "text-[var(--store-text-soft)]"
                              }`}
                            >
                              {formatStorePrice(v.price, effectiveCurrency, locale)}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}

                    {hiddenVariantCount > 0 ? (
                      <button
                        type="button"
                        onClick={() => setShowAllVariants(true)}
                        className={variantToggleClass}
                        aria-label={`Ver ${hiddenVariantCount} opciones más`}
                      >
                        <span aria-hidden>+</span>
                        <span>{hiddenVariantCount} más</span>
                      </button>
                    ) : null}

                    {showAllVariants && canCollapse ? (
                      <button
                        type="button"
                        onClick={() => setShowAllVariants(false)}
                        className={variantToggleClass}
                      >
                        Ver menos
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <p className="text-sm leading-relaxed text-[var(--store-text-soft)]">
                {product.description?.trim() || DEFAULT_COPY}
              </p>
            </div>
          </div>
        </div>

        {/* Footer sticky con CTA — siempre visible aunque el contenido haga scroll */}
        <footer className="shrink-0 border-t border-[var(--store-border-subtle)] bg-[var(--store-surface)] px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isVariantOutOfStock}
              className={`order-1 inline-flex min-h-[2.75rem] flex-1 items-center justify-center rounded-md border px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.22em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-surface)] ${
                isVariantOutOfStock
                  ? "cursor-not-allowed border-[var(--store-border-subtle)] bg-[var(--store-muted)]/40 text-[var(--store-text-soft)] opacity-70"
                  : "border-[var(--store-primary)] bg-[var(--store-primary)] text-[var(--store-on-primary)] hover:opacity-90"
              }`}
            >
              {addButtonLabel}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="order-2 inline-flex min-h-[2.75rem] items-center justify-center border border-[var(--store-border-subtle)] px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--store-text-soft)] transition hover:border-[var(--store-primary)]/40 hover:text-[var(--store-text)]"
            >
              Seguir comprando
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}