"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/store/cart-context";
import { trackStoreEvent } from "@/lib/store-analytics";
import type { StoreProduct } from "@/lib/store-types";

export type AddToCartButtonProps = {
  product: StoreProduct;
  /** Cuadrícula: botón a ancho completo; lista: ancho automático */
  layout?: "grid" | "list";
  /**
   * Si se pasa, el botón del card no añade directo: lo tratamos como
   * "abrir selector" (lo usan productos con variantes desde la cuadrícula/lista).
   * El evento de click sigue siendo del propio botón y se hace stopPropagation
   * fuera para no abrir el modal dos veces.
   */
  onCardAddClick?: (e: React.MouseEvent) => void;
  /** Etiqueta alternativa cuando el botón abre el selector en vez de añadir al carrito. */
  cardLabel?: string;
};

export function AddToCartButton({
  product,
  layout = "grid",
  onCardAddClick,
  cardLabel,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const resetTimer = useRef<number | null>(null);
  const isOutOfStock = (product.availableQuantity ?? 1) <= 0;
  const hasVariants = (product.variants?.length ?? 0) > 0;

  const isGrid = layout === "grid";
  const label = isOutOfStock
    ? "Sin stock"
    : hasVariants
      ? (cardLabel ?? "Elegir opciones")
      : justAdded
        ? "Agregado"
        : "Añadir al carrito";

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={(e) => {
        // El card ya gestiona stopPropagation si quiere abrir el detalle.
        onCardAddClick?.(e);
        if (hasVariants || onCardAddClick) return;
        if (isOutOfStock) return;
        addItem(product);
        trackStoreEvent({
          eventType: "ADD_TO_CART",
          productId: Number(product.id),
          source: `add-to-cart-${layout}`,
        });
        setJustAdded(true);
        if (resetTimer.current) {
          window.clearTimeout(resetTimer.current);
        }
        resetTimer.current = window.setTimeout(() => {
          setJustAdded(false);
        }, 1200);
      }}
      aria-live="polite"
      disabled={isOutOfStock}
      className={`text-[12px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-surface)] ${
        isGrid ? "w-full rounded-md py-2" : "shrink-0 rounded-md px-4 py-2"
      } ${
        justAdded
          ? "bg-[var(--store-primary)] text-[var(--store-on-primary)]"
          : isOutOfStock
            ? "cursor-not-allowed bg-[var(--store-muted)] text-[var(--store-text-soft)]"
            : hasVariants
              ? "bg-[var(--store-primary)] text-[var(--store-on-primary)] hover:bg-[var(--store-primary-hover)]"
              : "bg-[var(--store-primary)] text-[var(--store-on-primary)] hover:bg-[var(--store-primary-hover)]"
      }`}
    >
      {label}
    </button>
  );
}
