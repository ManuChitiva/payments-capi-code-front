"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconGrid,
  IconList,
  IconSearch,
} from "@/components/store/icons";
import { ProductDetailModal } from "@/components/store/product-detail-modal";
import { ProductCard } from "@/components/store/product-card";
import type { StoreProduct, StoreSortOption } from "@/lib/store-types";

const DEFAULT_PAGE_SIZE = 12;

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
  const [page, setPage] = useState(1);
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

  // Reset to first page whenever the visible set changes (search / sort).
  useEffect(() => {
    setPage(1);
  }, [query, sortId]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / DEFAULT_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = sorted.length === 0 ? 0 : (safePage - 1) * DEFAULT_PAGE_SIZE + 1;
  const pageEnd = Math.min(sorted.length, safePage * DEFAULT_PAGE_SIZE);
  const pageItems = useMemo(
    () => sorted.slice(pageStart - 1, pageEnd),
    [sorted, pageStart, pageEnd],
  );

  const currentSortLabel =
    sortOptions.find((o) => o.id === sortId)?.label ?? sortLabel;

  const countLabel =
    sorted.length === 0
      ? "0 artículos"
      : sorted.length === 1
        ? "1 artículo"
        : `Mostrando ${pageStart}–${pageEnd} de ${sorted.length} artículos`;

  // Ventana de páginas a mostrar: siempre primera, última, actual y sus
  // vecinas; el resto se reemplaza por elipsis para no desbordar el control.
  const pageWindow = useMemo<(number | "ellipsis")[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const window = new Set<number>([1, totalPages, safePage]);
    window.add(safePage - 1);
    window.add(safePage + 1);
    const ordered = [...window]
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);
    const result: (number | "ellipsis")[] = [];
    let prev = 0;
    for (const p of ordered) {
      if (prev && p - prev > 1) result.push("ellipsis");
      result.push(p);
      prev = p;
    }
    return result;
  }, [safePage, totalPages]);

  return (
    <div className="min-w-0 space-y-10">
      <header className="space-y-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)]">
          {eyebrow}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl tracking-tight text-[var(--store-text)] sm:text-5xl">
              {headline}
            </h1>
            {subline ? (
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--store-text-soft)] sm:text-[17px]">
                {subline}
              </p>
            ) : null}
          </div>
          <p className="shrink-0 text-sm font-normal tabular-nums text-[var(--store-text-soft)]">
            {countLabel}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg border border-[var(--store-border)] bg-[var(--store-surface)] px-4 transition focus-within:border-[var(--store-primary)] focus-within:ring-2 focus-within:ring-[var(--store-ring-focus)]">
          <IconSearch className="h-[18px] w-[18px] shrink-0 text-[var(--store-text-soft)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en la colección…"
            className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-[14px] text-[var(--store-text)] outline-none placeholder:text-[var(--store-text-soft)]"
            aria-label="Buscar productos"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          <div className="relative min-w-0 flex-1 sm:min-w-[11rem] sm:flex-initial">
            <select
              value={sortId}
              onChange={(e) => setSortId(e.target.value)}
              className="h-11 w-full min-w-[10.5rem] cursor-pointer appearance-none rounded-lg border border-[var(--store-border)] bg-[var(--store-surface)] py-2 pl-3.5 pr-10 text-[13px] text-[var(--store-text)] outline-none transition hover:border-[var(--store-primary)]/45 focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-ring-focus)]"
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
            className="flex rounded-lg border border-[var(--store-border)] bg-[var(--store-surface)] p-1"
            role="group"
            aria-label="Vista de catálogo"
          >
            <button
              type="button"
              className={`grid h-9 w-9 place-items-center rounded-md transition ${
                view === "grid"
                  ? "bg-[var(--store-muted)] text-[var(--store-primary)]"
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
              className={`grid h-9 w-9 place-items-center rounded-md transition ${
                view === "list"
                  ? "bg-[var(--store-muted)] text-[var(--store-primary)]"
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
            ? "grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4"
            : "flex flex-col gap-3"
        }
      >
        {pageItems.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            layout={view}
            onOpenDetail={setDetailProduct}
          />
        ))}
      </div>

      {totalPages > 1 ? (
        <nav
          aria-label="Paginación del catálogo"
          className="flex flex-wrap items-center justify-center gap-1.5 pt-2"
        >
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[var(--store-border)] bg-[var(--store-surface)] px-3 text-[13px] font-medium text-[var(--store-text)] transition hover:border-[var(--store-primary)]/45 hover:text-[var(--store-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--store-border)] disabled:hover:text-[var(--store-text)]"
          >
            <IconChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {pageWindow.map((entry, idx) =>
            entry === "ellipsis" ? (
              <span
                key={`ellipsis-${idx}`}
                aria-hidden
                className="grid h-10 w-10 place-items-center text-[var(--store-text-soft)]"
              >
                …
              </span>
            ) : (
              <button
                key={entry}
                type="button"
                onClick={() => setPage(entry)}
                aria-current={entry === safePage ? "page" : undefined}
                aria-label={`Ir a la página ${entry}`}
                className={
                  entry === safePage
                    ? "grid h-10 w-10 place-items-center rounded-lg bg-[var(--store-primary)] text-[13px] font-semibold text-[var(--store-primary-contrast)] shadow-[var(--store-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)]"
                    : "grid h-10 w-10 place-items-center rounded-lg border border-[var(--store-border)] bg-[var(--store-surface)] text-[13px] font-medium text-[var(--store-text)] transition hover:border-[var(--store-primary)]/45 hover:text-[var(--store-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)]"
                }
              >
                {entry}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[var(--store-border)] bg-[var(--store-surface)] px-3 text-[13px] font-medium text-[var(--store-text)] transition hover:border-[var(--store-primary)]/45 hover:text-[var(--store-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--store-border)] disabled:hover:text-[var(--store-text)]"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <IconChevronRight className="h-4 w-4" />
          </button>
        </nav>
      ) : null}

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--store-border)] bg-[var(--store-muted)]/30 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-[var(--store-text)]">
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
