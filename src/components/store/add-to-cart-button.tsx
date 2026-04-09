"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/store/cart-context";
import { trackStoreEvent } from "@/lib/store-analytics";
import type { StoreProduct } from "@/lib/store-types";

export type AddToCartButtonProps = {
  product: StoreProduct;
  /** Cuadrícula: botón a ancho completo; lista: ancho automático */
  layout?: "grid" | "list";
};

export function AddToCartButton({
  product,
  layout = "grid",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const resetTimer = useRef<number | null>(null);
  const isOutOfStock = (product.availableQuantity ?? 1) <= 0;

  const isGrid = layout === "grid";

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
        e.stopPropagation();
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
        }, 850);
      }}
      aria-live="polite"
      disabled={isOutOfStock}
      className={`border text-[10px] font-semibold uppercase tracking-[0.22em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-surface)] ${
        justAdded
          ? "scale-[1.02] border-[var(--store-primary)] bg-[var(--store-primary)]/12 text-[var(--store-text)] shadow-[0_0_0_3px_rgba(197,157,95,0.2)]"
          : isOutOfStock
            ? "cursor-not-allowed border-[var(--store-border-subtle)] bg-[var(--store-muted)]/40 text-[var(--store-text-soft)] opacity-70"
            : "border-[var(--store-primary)]/55 bg-transparent text-[var(--store-primary)]"
      } ${
        isGrid
          ? "w-full rounded-md py-2.5"
          : "shrink-0 rounded-md px-4 py-2"
      } ${
        isOutOfStock ? "" : "hover:bg-[var(--store-muted)]/60"
      } `}
    >
      {isOutOfStock ? "Sin stock" : justAdded ? "Agregado" : "Añadir al carrito"}
    </button>
  );
}
