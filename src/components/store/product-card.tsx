"use client";

import Image from "next/image";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { formatStorePrice } from "@/lib/format-store-price";
import { trackStoreEvent } from "@/lib/store-analytics";
import type { StoreProduct } from "@/lib/store-types";

export type ProductCardProps = {
  product: StoreProduct;
  layout?: "grid" | "list";
  locale?: string;
  onOpenDetail?: (product: StoreProduct) => void;
};

export function ProductCard({
  product,
  layout = "grid",
  locale = "es-CO",
  onOpenDetail,
}: ProductCardProps) {
  const price = formatStorePrice(
    product.price,
    product.currencySymbol,
    locale,
  );

  const openDetail = () => {
    trackStoreEvent({
      eventType: "PRODUCT_CLICK",
      productId: Number(product.id),
      source: `catalog-${layout}`,
    });
    onOpenDetail?.(product);
  };
  const available = product.availableQuantity;

  if (layout === "list") {
    return (
      <article className="group flex w-full overflow-hidden rounded-xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] shadow-[var(--store-shadow-soft)] transition duration-300 hover:shadow-[var(--store-shadow-hover)]">
        <button
          type="button"
          onClick={openDetail}
          className="flex min-w-0 flex-1 gap-3 p-3 text-left transition hover:bg-[var(--store-hover-overlay)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--store-ring-focus)] sm:gap-4 sm:py-3 sm:pl-3 sm:pr-2"
        >
          <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-lg bg-[var(--store-muted)] sm:h-[96px] sm:w-[96px]">
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              fill
              className="object-cover transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 88px, 96px"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-1 self-center">
            <h3 className="font-display text-[15px] leading-snug text-[var(--store-text)] sm:text-base">
              {product.title}
            </h3>
            <p className="text-[15px] font-semibold tabular-nums tracking-tight text-[var(--store-primary)] sm:text-base">
              {price}
            </p>
            <p className="text-[11px] text-[var(--store-text-soft)]">
              Ver detalle
            </p>
            {typeof available === "number" ? (
              <p className="text-[10px] font-medium text-[var(--store-text-soft)]">
                {available > 0 ? `${available} disponibles` : "Sin stock"}
              </p>
            ) : null}
          </div>
        </button>
        <div className="flex shrink-0 items-center border-l border-[var(--store-border-subtle)] p-3">
          <AddToCartButton product={product} layout="list" />
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] shadow-[var(--store-shadow-soft)] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[var(--store-shadow-hover)]">
      <button
        type="button"
        onClick={openDetail}
        className="flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--store-ring-focus)]"
      >
        <div className="relative h-[7.5rem] w-full shrink-0 overflow-hidden bg-[var(--store-muted)] sm:h-36">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--store-text)]/[0.06] to-transparent opacity-0 transition duration-500 group-hover:opacity-100"
            aria-hidden
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3 sm:p-3.5">
          <div className="space-y-1">
            <h3 className="font-display line-clamp-2 text-[13px] leading-snug text-[var(--store-text)] sm:text-sm">
              {product.title}
            </h3>
            <p className="text-base font-semibold tabular-nums tracking-tight text-[var(--store-primary)] sm:text-[1.05rem]">
              {price}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--store-text-soft)]">
              Ver detalle
            </p>
            {typeof available === "number" ? (
              <p className="text-[10px] font-medium text-[var(--store-text-soft)]">
                {available > 0 ? `${available} disponibles` : "Sin stock"}
              </p>
            ) : null}
          </div>
        </div>
      </button>
      <div className="border-t border-[var(--store-border-subtle)] px-3 pb-3 pt-2 sm:px-3.5 sm:pb-3.5">
        <AddToCartButton product={product} layout="grid" />
      </div>
    </article>
  );
}
