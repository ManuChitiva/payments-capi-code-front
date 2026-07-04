"use client";

import Image from "next/image";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { formatStorePrice } from "@/lib/format-store-price";
import { trackStoreEvent } from "@/lib/store-analytics";
import type {
  StoreProduct,
  StoreProductVariant,
} from "@/lib/store-types";

export type ProductCardProps = {
  product: StoreProduct;
  layout?: "grid" | "list";
  locale?: string;
  onOpenDetail?: (product: StoreProduct) => void;
};

/**
 * Si el producto tiene variantes activas, devuelve el precio más bajo entre
 * las variantes; si no, devuelve el precio del producto. `null` si no hay info.
 */
function resolveDisplayPrice(
  product: StoreProduct,
): { price: number; fromVariants: boolean } | null {
  const variants = product.variants ?? [];
  if (variants.length > 0) {
    const prices = variants.map((v) => v.price);
    const min = Math.min(...prices);
    return { price: min, fromVariants: true };
  }
  return { price: product.price, fromVariants: false };
}

export function ProductCard({
  product,
  layout = "grid",
  locale = "es-CO",
  onOpenDetail,
}: ProductCardProps) {
  const display = resolveDisplayPrice(product);
  const priceLabel = display
    ? formatStorePrice(display.price, product.currencySymbol, locale)
    : null;
  const variants = product.variants ?? [];
  const variantCount = variants.length;

  const openDetail = () => {
    trackStoreEvent({
      eventType: "PRODUCT_CLICK",
      productId: Number(product.id),
      source: `catalog-${layout}`,
    });
    onOpenDetail?.(product);
  };

  /**
   * Cuando el producto tiene variantes, el botón "Añadir" del card
   * siempre abre el detalle (no se puede elegir variante inline).
   * Si no tiene variantes, el botón añade directamente al carrito.
   */
  const handleAddClick: (e: React.MouseEvent) => void =
    variantCount > 0
      ? (e) => {
          e.stopPropagation();
          openDetail();
        }
      : (e) => e.stopPropagation();

  if (layout === "list") {
    return (
      <article className="group flex w-full overflow-hidden rounded-xl border border-[var(--store-border)] bg-[var(--store-surface)] transition-shadow hover:shadow-[var(--store-shadow-hover)]">
        <button
          type="button"
          onClick={openDetail}
          className="flex min-w-0 flex-1 gap-3 p-3 text-left transition hover:bg-[var(--store-hover-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--store-ring-focus)] sm:gap-4 sm:p-3.5"
        >
          <div className="relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-lg bg-[var(--store-muted)] sm:h-[96px] sm:w-[96px]">
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              fill
              className="object-cover transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 80px, 96px"
            />
          </div>
          <div className="min-w-0 flex-1 self-center">
            <h3 className="text-[15px] font-medium leading-snug text-[var(--store-text)] sm:text-base">
              {product.title}
            </h3>
            {priceLabel ? (
              <p className="mt-1 text-[14px] font-semibold tabular-nums text-[var(--store-text)] sm:text-[15px]">
                {display?.fromVariants ? "Desde " : ""}
                {priceLabel}
              </p>
            ) : null}
            {variantCount > 0 ? (
              <p className="mt-0.5 text-[11px] font-normal text-[var(--store-text-soft)]">
                {variantCount} {variantCount === 1 ? "opción" : "opciones"}
              </p>
            ) : null}
          </div>
        </button>
        <div className="flex shrink-0 items-center border-l border-[var(--store-border)] p-3">
          <AddToCartButton
            product={product}
            layout="list"
            onCardAddClick={variantCount > 0 ? handleAddClick : undefined}
          />
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--store-border)] bg-[var(--store-surface)] transition-shadow hover:shadow-[var(--store-shadow-hover)]">
      <button
        type="button"
        onClick={openDetail}
        className="relative flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--store-ring-focus)]"
      >
        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[var(--store-muted)]">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
          />

          {/* Variant count chip */}
          {variantCount > 0 ? (
            <span
              className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--store-surface)]/90 px-2.5 py-1 text-[10px] font-medium text-[var(--store-text)] backdrop-blur"
              aria-hidden
            >
              {variantCount} {variantCount === 1 ? "opción" : "opciones"}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <h3 className="line-clamp-2 text-[14px] font-medium leading-snug text-[var(--store-text)] sm:text-[15px]">
            {product.title}
          </h3>
          {priceLabel ? (
            <p className="text-[15px] font-semibold tabular-nums text-[var(--store-text)] sm:text-[16px]">
              {display?.fromVariants ? "Desde " : ""}
              {priceLabel}
            </p>
          ) : null}
        </div>
      </button>
      <div className="border-t border-[var(--store-border)] px-4 pb-4 pt-3">
        <AddToCartButton
          product={product}
          layout="grid"
          onCardAddClick={variantCount > 0 ? handleAddClick : undefined}
          cardLabel={variantCount > 0 ? "Elegir opciones" : undefined}
        />
      </div>
    </article>
  );
}
