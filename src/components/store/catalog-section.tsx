"use client";

import { useMemo, useState } from "react";
import {
  IconChevronDown,
  IconGrid,
  IconList,
  IconSearch,
} from "@/components/store/icons";
import { ProductDetailModal } from "@/components/store/product-detail-modal";
import { ProductCard } from "@/components/store/product-card";
import type { StoreProduct, StoreSortOption } from "@/lib/store-types";

export type CatalogSectionProps = {
  eyebrow?: string;
  headline?: string;
  subline?: string;
  sortLabel: string;
  sortOptions: StoreSortOption[];
  products: StoreProduct[];
};

export function CatalogSection({
  eyebrow = "Tienda online",
  headline = "Productos",
  subline,
  sortLabel,
  sortOptions,
  products,
}: CatalogSectionProps) {
  const [query, setQuery] = useState("");
  const [sortId, setSortId] = useState(sortOptions[0]?.id ?? "relevant");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [detailProduct, setDetailProduct] = useState<StoreProduct | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.title.toLowerCase().includes(q));
  }, [products, query]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortId === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortId === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [filtered, sortId]);

  const currentSortLabel =
    sortOptions.find((o) => o.id === sortId)?.label ?? sortLabel;

  const countLabel =
    sorted.length === 1 ? "1 artículo" : `${sorted.length} artículos`;

  return (
    <div className="min-w-0 space-y-8">
      <header className="space-y-3 border-b border-[var(--store-border-subtle)] pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--store-primary)]">
          {eyebrow}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <h1 className="font-display text-3xl tracking-tight text-[var(--store-text)] sm:text-4xl">
              {headline}
            </h1>
            {subline ? (
              <p className="text-base leading-relaxed text-[var(--store-text-soft)] sm:text-[17px]">
                {subline}
              </p>
            ) : null}
          </div>
          <p className="shrink-0 text-sm font-medium tabular-nums text-[var(--store-text-soft)]">
            {countLabel}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] p-2 shadow-[var(--store-shadow-soft)] sm:flex-row sm:items-center sm:gap-3 sm:p-2.5">
        <div className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-xl bg-[var(--store-muted)]/55 px-4 py-2.5">
          <IconSearch className="h-[18px] w-[18px] shrink-0 text-[var(--store-text-soft)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en la colección…"
            className="min-w-0 flex-1 border-0 bg-transparent text-[14px] font-medium text-[var(--store-text)] outline-none placeholder:text-[var(--store-text-soft)] placeholder:font-normal"
            aria-label="Buscar productos"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:pr-1">
          <div className="relative min-w-0 flex-1 sm:min-w-[11rem] sm:flex-initial">
            <select
              value={sortId}
              onChange={(e) => setSortId(e.target.value)}
              className="h-11 w-full min-w-[10.5rem] cursor-pointer appearance-none rounded-xl border border-[var(--store-border-subtle)] bg-[var(--store-muted)]/55 py-2 pl-3.5 pr-10 text-[13px] font-semibold text-[var(--store-text)] outline-none transition focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-ring-focus)]"
              aria-label="Ordenar por"
            >
              {sortOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--store-text-soft)]" />
            <span className="sr-only">Orden: {currentSortLabel}</span>
          </div>

          <div
            className="flex rounded-xl border border-[var(--store-border-subtle)] bg-[var(--store-muted)]/40 p-1"
            role="group"
            aria-label="Vista de catálogo"
          >
            <button
              type="button"
              className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                view === "grid"
                  ? "bg-[var(--store-surface)] text-[var(--store-primary)] shadow-sm"
                  : "text-[var(--store-text-soft)] hover:text-[var(--store-text)]"
              }`}
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              aria-label="Vista cuadrícula"
            >
              <IconGrid />
            </button>
            <button
              type="button"
              className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                view === "list"
                  ? "bg-[var(--store-surface)] text-[var(--store-primary)] shadow-sm"
                  : "text-[var(--store-text-soft)] hover:text-[var(--store-text)]"
              }`}
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              aria-label="Vista lista"
            >
              <IconList />
            </button>
          </div>
        </div>
      </div>

      <div
        className={
          view === "grid"
            ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4"
            : "flex flex-col gap-3"
        }
      >
        {sorted.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            layout={view}
            onOpenDetail={setDetailProduct}
          />
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--store-border)] bg-[var(--store-muted)]/30 px-6 py-16 text-center">
          <p className="font-display text-lg text-[var(--store-text)]">
            Sin coincidencias
          </p>
          <p className="mt-2 text-sm text-[var(--store-text-soft)]">
            Prueba con otras palabras o restablece el buscador.
          </p>
        </div>
      ) : null}

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
      />
    </div>
  );
}
