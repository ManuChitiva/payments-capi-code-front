"use client";

import Image from "next/image";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { formatStorePrice } from "@/lib/format-store-price";
import type { StoreProduct } from "@/lib/store-types";

export type ProductCardProps = {
  product: StoreProduct;
  layout?: "grid" | "list";
  locale?: string;
};

export function ProductCard({
  product,
  layout = "grid",
  locale = "es-CO",
}: ProductCardProps) {
  const price = formatStorePrice(
    product.price,
    product.currencySymbol,
    locale,
  );

  if (layout === "list") {
    return (
      <article className="group flex w-full overflow-hidden rounded-xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] shadow-[var(--store-shadow-soft)] transition duration-300 hover:shadow-[var(--store-shadow-hover)]">
        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden bg-[var(--store-muted)] sm:h-[96px] sm:w-[96px]">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            className="object-cover transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 88px, 96px"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 p-3 sm:flex-row sm:items-center sm:gap-4 sm:py-3 sm:pr-4">
          <div className="min-w-0 space-y-1">
            <h3 className="font-display text-[15px] leading-snug text-[var(--store-text)] sm:text-base">
              {product.title}
            </h3>
            <p className="text-[15px] font-semibold tabular-nums tracking-tight text-[var(--store-primary)] sm:text-base">
              {price}
            </p>
          </div>
          <div className="flex shrink-0 justify-end sm:items-center">
            <AddToCartButton product={product} layout="list" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] shadow-[var(--store-shadow-soft)] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[var(--store-shadow-hover)]">
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
      <div className="flex flex-1 flex-col justify-between gap-3 p-3 sm:p-3.5">
        <div className="space-y-1">
          <h3 className="font-display line-clamp-2 text-[13px] leading-snug text-[var(--store-text)] sm:text-sm">
            {product.title}
          </h3>
          <p className="text-base font-semibold tabular-nums tracking-tight text-[var(--store-primary)] sm:text-[1.05rem]">
            {price}
          </p>
        </div>
        <div className="border-t border-[var(--store-border-subtle)] pt-3">
          <AddToCartButton product={product} layout="grid" />
        </div>
      </div>
    </article>
  );
}
