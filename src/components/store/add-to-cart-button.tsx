"use client";

import { useCart } from "@/components/store/cart-context";
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

  const isGrid = layout === "grid";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        addItem(product);
      }}
      className={`border border-[var(--store-primary)]/55 bg-transparent text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--store-primary)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-surface)] ${
        isGrid
          ? "w-full rounded-md py-2.5 hover:bg-[var(--store-muted)]/60"
          : "shrink-0 rounded-md px-4 py-2 hover:bg-[var(--store-muted)]/60"
      } `}
    >
      Añadir al carrito
    </button>
  );
}
