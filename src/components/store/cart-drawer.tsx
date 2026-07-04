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
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Cerrar carrito"
        onClick={closeDrawer}
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[var(--store-border)] bg-[var(--store-surface)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--store-border)] px-5 py-4">
          <div>
            <h2
              id="cart-drawer-title"
              className="text-[17px] font-semibold text-[var(--store-text)]"
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
            className="grid h-9 w-9 place-items-center rounded-md text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)]"
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
                className="mt-4 rounded-md border border-[var(--store-primary)] px-5 py-2 text-[13px] font-medium text-[var(--store-primary)] transition hover:bg-[var(--store-primary)]/5"
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
                  className="flex gap-3 rounded-xl border border-[var(--store-border)] bg-[var(--store-surface)] p-3"
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
                    <h3 className="line-clamp-2 text-[14px] font-medium leading-snug text-[var(--store-text)]">
                      {line.title}
                    </h3>
                    {line.variantTitle ? (
                      <p className="inline-flex items-center rounded-full bg-[var(--store-muted)] px-2 py-0.5 text-[11px] font-normal text-[var(--store-text-soft)]">
                        {line.variantTitle}
                      </p>
                    ) : null}
                    <p className="text-xs tabular-nums text-[var(--store-text-soft)]">
                      {formatStorePrice(line.price, line.currencySymbol)} c/u
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center rounded-md border border-[var(--store-border)]">
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
                        <span className="min-w-[1.5rem] text-center text-xs font-medium tabular-nums">
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
                      <span className="text-xs font-medium tabular-nums text-[var(--store-text)]">
                        {formatStorePrice(
                          line.price * line.quantity,
                          line.currencySymbol,
                        )}
                      </span>
                      <button
                        type="button"
                        className="ml-auto text-[12px] font-normal text-[var(--store-text-soft)] hover:text-[var(--store-primary)]"
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
          <footer className="shrink-0 border-t border-[var(--store-border)] bg-[var(--store-surface)] px-5 py-4">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-[13px] font-normal text-[var(--store-text-soft)]">
                Total
              </span>
              <span className="text-[20px] font-semibold tabular-nums text-[var(--store-text)]">
                {formatStorePrice(subtotal, currencySymbol)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href={FULL_CART_HREF}
                onClick={closeDrawer}
                className="flex min-h-[2.75rem] items-center justify-center rounded-md border border-[var(--store-primary)] text-center text-[13px] font-medium text-[var(--store-primary)] transition hover:bg-[var(--store-primary)]/5"
              >
                Ver carrito completo
              </Link>
              <Link
                href={FULL_CART_HREF}
                onClick={closeDrawer}
                className="flex min-h-[2.75rem] items-center justify-center rounded-md bg-[var(--store-primary)] text-center text-[13px] font-medium text-[var(--store-on-primary)] transition hover:bg-[var(--store-primary-hover)]"
              >
                Finalizar y pagar
              </Link>
              <button
                type="button"
                className="pt-1 text-center text-[12px] font-normal text-[var(--store-text-soft)] hover:text-[var(--store-primary)]"
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
