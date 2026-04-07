"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/store/cart-context";
import { formatStorePrice } from "@/lib/format-store-price";

export function CartPageView() {
  const { items, totalQuantity, setQuantity, removeItem, clear } = useCart();

  const subtotal = items.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const currencySymbol = items[0]?.currencySymbol ?? "$";

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] px-6 py-16 text-center shadow-[var(--store-shadow-soft)]">
        <p className="font-display text-xl text-[var(--store-text)]">
          Tu carrito está vacío
        </p>
        <p className="mt-2 text-sm text-[var(--store-text-soft)]">
          Añade productos desde el catálogo.
        </p>
        <Link
          href="/#productos"
          className="mt-6 inline-block border border-[var(--store-primary)]/55 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--store-primary)] transition hover:bg-[var(--store-muted)]/60"
        >
          Ver colección
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--store-border-subtle)] pb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--store-primary)]">
            Resumen
          </p>
          <h1 className="mt-1 font-display text-3xl tracking-tight text-[var(--store-text)]">
            Carrito
          </h1>
        </div>
        <p className="text-sm tabular-nums text-[var(--store-text-soft)]">
          {totalQuantity}{" "}
          {totalQuantity === 1 ? "artículo" : "artículos"}
        </p>
      </header>

      <ul className="space-y-3">
        {items.map((line) => (
          <li
            key={line.id}
            className="flex gap-4 rounded-xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] p-4 shadow-[var(--store-shadow-soft)]"
          >
            <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-[var(--store-muted)] sm:h-24 sm:w-24">
              <Image
                src={line.imageSrc}
                alt={line.imageAlt}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="min-w-0 space-y-1">
                <h2 className="font-display text-base leading-snug text-[var(--store-text)] sm:text-lg">
                  {line.title}
                </h2>
                <p className="text-sm tabular-nums text-[var(--store-primary)]">
                  {formatStorePrice(line.price, line.currencySymbol)} c/u
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
                <div className="flex items-center gap-0 rounded-md border border-[var(--store-border-subtle)]">
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)]"
                    aria-label="Reducir cantidad"
                    onClick={() => setQuantity(line.id, line.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums text-[var(--store-text)]">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)]"
                    aria-label="Aumentar cantidad"
                    onClick={() => setQuantity(line.id, line.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-semibold tabular-nums text-[var(--store-text)] sm:min-w-[5.5rem] sm:text-right">
                  {formatStorePrice(
                    line.price * line.quantity,
                    line.currencySymbol,
                  )}
                </p>
                <button
                  type="button"
                  className="text-[11px] font-semibold uppercase tracking-wider text-[var(--store-text-soft)] underline-offset-4 transition hover:text-[var(--store-primary)] hover:underline"
                  onClick={() => removeItem(line.id)}
                >
                  Quitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <footer className="space-y-4 rounded-xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] p-6 shadow-[var(--store-shadow-soft)]">
        <div className="flex items-center justify-between border-b border-[var(--store-border-subtle)] pb-4">
          <span className="text-sm font-medium uppercase tracking-wider text-[var(--store-text-soft)]">
            Total estimado
          </span>
          <span className="font-display text-2xl tabular-nums text-[var(--store-primary)]">
            {formatStorePrice(subtotal, currencySymbol)}
          </span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--store-text-soft)] underline-offset-4 transition hover:text-[var(--store-primary)] hover:underline"
            onClick={() => clear()}
          >
            Vaciar carrito
          </button>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Link
              href="/#productos"
              className="inline-flex min-h-[2.75rem] items-center justify-center border border-[var(--store-primary)]/55 px-5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)] transition hover:bg-[var(--store-muted)]/60"
            >
              Seguir comprando
            </Link>
            <button
              type="button"
              disabled
              className="inline-flex min-h-[2.75rem] cursor-not-allowed items-center justify-center border border-[var(--store-border-subtle)] bg-[var(--store-muted)]/40 px-5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--store-text-soft)] opacity-80"
              title="Conecta tu pasarela de pago"
            >
              Finalizar pedido
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
