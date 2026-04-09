"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/store/cart-context";
import { formatStorePrice } from "@/lib/format-store-price";

const FULL_CART_HREF = "/cart";

export function CartDrawer() {
  const {
    items,
    totalQuantity,
    isDrawerOpen,
    closeDrawer,
    setQuantity,
    removeItem,
    clear,
  } = useCart();

  const subtotal = items.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const currencySymbol = items[0]?.currencySymbol ?? "$";

  useEffect(() => {
    if (!isDrawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        aria-label="Cerrar carrito"
        onClick={closeDrawer}
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[var(--store-border-subtle)] bg-[var(--store-page-bg)] shadow-[-12px_0_48px_rgba(0,0,0,0.35)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--store-border-subtle)] px-5 py-4">
          <div>
            <h2
              id="cart-drawer-title"
              className="font-display text-xl text-[var(--store-text)]"
            >
              Carrito
            </h2>
            <p className="mt-0.5 text-xs tabular-nums text-[var(--store-text-soft)]">
              {totalQuantity}{" "}
              {totalQuantity === 1 ? "artículo" : "artículos"}
            </p>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)]"
            aria-label="Cerrar"
            onClick={closeDrawer}
          >
            <span className="text-xl leading-none" aria-hidden>
              ×
            </span>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-[var(--store-text-soft)]">
                Aún no has añadido productos.
              </p>
              <button
                type="button"
                className="mt-4 border border-[var(--store-primary)]/55 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)] transition hover:bg-[var(--store-muted)]/60"
                onClick={closeDrawer}
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((line) => (
                <li
                  key={line.id}
                  className="flex gap-3 rounded-xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] p-3 shadow-[var(--store-shadow-soft)]"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--store-muted)]">
                    <Image
                      src={line.imageSrc}
                      alt={line.imageAlt}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <h3 className="font-display text-sm leading-snug text-[var(--store-text)] line-clamp-2">
                      {line.title}
                    </h3>
                    <p className="text-xs tabular-nums text-[var(--store-primary)]">
                      {formatStorePrice(line.price, line.currencySymbol)} c/u
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center rounded-md border border-[var(--store-border-subtle)]">
                        <button
                          type="button"
                          className="grid h-8 w-8 place-items-center text-sm text-[var(--store-text)] hover:bg-[var(--store-hover-overlay)]"
                          aria-label="Menos"
                          onClick={() =>
                            setQuantity(line.id, line.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="min-w-[1.5rem] text-center text-xs font-semibold tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className="grid h-8 w-8 place-items-center text-sm text-[var(--store-text)] hover:bg-[var(--store-hover-overlay)]"
                          aria-label="Más"
                          onClick={() =>
                            setQuantity(line.id, line.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-[var(--store-text)]">
                        {formatStorePrice(
                          line.price * line.quantity,
                          line.currencySymbol,
                        )}
                      </span>
                      <button
                        type="button"
                        className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-[var(--store-text-soft)] underline-offset-2 hover:text-[var(--store-primary)] hover:underline"
                        onClick={() => removeItem(line.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <footer className="shrink-0 border-t border-[var(--store-border-subtle)] bg-[var(--store-surface)]/80 px-5 py-4 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--store-text-soft)]">
                Total
              </span>
              <span className="font-display text-lg tabular-nums text-[var(--store-primary)]">
                {formatStorePrice(subtotal, currencySymbol)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href={FULL_CART_HREF}
                onClick={closeDrawer}
                className="flex min-h-[2.75rem] items-center justify-center border border-[var(--store-primary)]/55 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--store-primary)] transition hover:bg-[var(--store-muted)]/60"
              >
                Ver carrito completo
              </Link>
              <Link
                href={FULL_CART_HREF}
                onClick={closeDrawer}
                className="flex min-h-[2.75rem] items-center justify-center border border-[var(--store-primary)] bg-[var(--store-primary)] text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90"
              >
                Finalizar y pagar
              </Link>
              <button
                type="button"
                className="pt-1 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--store-text-soft)] underline-offset-4 hover:text-[var(--store-primary)] hover:underline"
                onClick={() => clear()}
              >
                Vaciar carrito
              </button>
            </div>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
