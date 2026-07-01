"use client";

import { ProductCard } from "@/components/store/product-card";
import { ProductDetailModal } from "@/components/store/product-detail-modal";
import type { StoreProduct } from "@/lib/store-types";
import { useState } from "react";

export type FeaturedProductsProps = {
  eyebrow?: string;
  headline?: string;
  subline?: string;
  products: StoreProduct[];
  /** How many products to highlight. Defaults to 4. */
  limit?: number;
  badgeLabel?: string;
};

export function FeaturedProducts({
  eyebrow = "Selección de la casa",
  headline = "Productos destacados",
  subline = "Nuestra elección editorial: piezas versátiles que se convierten en favoritas desde el primer uso.",
  products,
  limit = 4,
  badgeLabel = "Destacado",
}: FeaturedProductsProps) {
  const [detailProduct, setDetailProduct] = useState<StoreProduct | null>(null);
  const featured = products.slice(0, limit);

  if (featured.length === 0) return null;

  return (
    <section
      aria-labelledby="featured-heading"
      className="space-y-8 sm:space-y-10"
    >
      <header className="space-y-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)]">
          {eyebrow}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2
              id="featured-heading"
              className="font-display text-3xl tracking-tight text-[var(--store-text)] sm:text-4xl"
            >
              {headline}
            </h2>
            {subline ? (
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--store-text-soft)]">
                {subline}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {featured.map((product) => (
          <div key={product.id} className="relative">
            <span
              className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-[var(--store-surface)]/90 px-2.5 py-1 text-[10px] font-medium text-[var(--store-text)] backdrop-blur"
              aria-hidden
            >
              {badgeLabel}
            </span>
            <ProductCard
              product={product}
              layout="grid"
              onOpenDetail={setDetailProduct}
            />
          </div>
        ))}
      </div>

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
      />
    </section>
  );
}
