"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useCart } from "@/components/store/cart-context";
import { formatStorePrice } from "@/lib/format-store-price";
import {
  checkoutAndStartPayu,
  type PayuStatus,
} from "@/lib/store-checkout";
import { trackStoreEvent } from "@/lib/store-analytics";
import { submitPayuWebCheckout } from "@/lib/submit-payu-form";
import {
  buildWhatsAppOrderMessage,
  whatsAppUrlWithPrefill,
} from "@/lib/whatsapp-order-fallback";

export type CartPageViewProps = {
  storeId?: number;
  storeName: string;
  payuStatus: PayuStatus | null;
  /** True si se llamó a la API de estado PayU (solo entonces un null indica fallo red/API). */
  payuStatusFetchAttempted?: boolean;
  whatsappBaseHref: string | null;
};

export function CartPageView({
  storeId,
  storeName,
  payuStatus,
  payuStatusFetchAttempted = false,
  whatsappBaseHref,
}: CartPageViewProps) {
  const router = useRouter();
  const { items, totalQuantity, setQuantity, removeItem, clear } = useCart();
  const purchaseIntentSent = useRef(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPostPayModal, setShowPostPayModal] = useState(false);
  const [pending, startTransition] = useTransition();

  const subtotal = items.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const currencySymbol = items[0]?.currencySymbol ?? "$";

  const apiConfigured = typeof storeId === "number";
  const canPayWithPayu =
    apiConfigured && payuStatus?.payuActive === true && items.length > 0;

  function whatsAppUrl(intro?: string) {
    if (!whatsappBaseHref) return null;
    const lines = items.map((i) => ({
      title: i.title,
      quantity: i.quantity,
      unitPrice: i.price,
      currencySymbol: i.currencySymbol,
    }));
    const message = buildWhatsAppOrderMessage({
      storeName,
      lines,
      customerName: name.trim() || undefined,
      customerEmail: email.trim() || undefined,
      customerPhone: phone.trim() || undefined,
      intro,
    });
    return whatsAppUrlWithPrefill(whatsappBaseHref, message);
  }

  function goToWhatsApp(intro?: string) {
    const url = whatsAppUrl(intro);
    if (url) window.location.assign(url);
  }

  useEffect(() => {
    if (items.length === 0 || purchaseIntentSent.current) return;
    purchaseIntentSent.current = true;
    trackStoreEvent({
      eventType: "PURCHASE_INTENT",
      source: "cart-page",
    });
  }, [items.length]);

  function onPay() {
    setError(null);
    if (!storeId) {
      setError("Configura NEXT_PUBLIC_API_BASE_URL y datos de tienda para pagar.");
      return;
    }
    if (!payuStatus?.payuActive) {
      setError("Esta tienda no tiene PayU activo.");
      return;
    }
    if (!name.trim() || !email.trim()) {
      setError("Indica nombre y correo para el pedido.");
      return;
    }

    startTransition(async () => {
      const result = await checkoutAndStartPayu(
        storeId,
        name.trim(),
        email.trim(),
        phone.trim(),
        items.map((i) => ({ id: i.id, quantity: i.quantity })),
      );

      if (!result.ok) {
        setError(result.message);
        if (whatsappBaseHref) {
          goToWhatsApp(
            `Intenté pagar en la web pero falló el sistema (${result.message}). ¿Me ayudas a completar el pedido?`,
          );
        }
        return;
      }

      submitPayuWebCheckout(result.actionUrl, result.fields, "_blank");
      setShowPostPayModal(true);
    });
  }

  function onAcknowledgePostPayModal() {
    clear();
    setShowPostPayModal(false);
    router.push("/#productos");
  }

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

      <section className="rounded-xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] p-6 shadow-[var(--store-shadow-soft)]">
        <h2 className="font-display text-lg text-[var(--store-text)]">
          Datos para el pedido
        </h2>
        <p className="mt-1 text-xs text-[var(--store-text-soft)]">
          Los usamos en PayU o en el mensaje de WhatsApp si pagas con la tienda
          por chat.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--store-text-soft)]">
            Nombre completo
            <input
              type="text"
              name="customerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="mt-1.5 w-full border border-[var(--store-border-subtle)] bg-[var(--store-page-bg)] px-3 py-2 text-sm text-[var(--store-text)]"
            />
          </label>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--store-text-soft)]">
            Correo
            <input
              type="email"
              name="customerEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-1.5 w-full border border-[var(--store-border-subtle)] bg-[var(--store-page-bg)] px-3 py-2 text-sm text-[var(--store-text)]"
            />
          </label>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--store-text-soft)] sm:col-span-2">
            Teléfono (opcional)
            <input
              type="tel"
              name="customerPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className="mt-1.5 w-full border border-[var(--store-border-subtle)] bg-[var(--store-page-bg)] px-3 py-2 text-sm text-[var(--store-text)]"
            />
          </label>
        </div>
        {!apiConfigured ? (
          <p className="mt-4 text-xs text-[var(--store-text-soft)]">
            Define{" "}
            <code className="text-[10px]">NEXT_PUBLIC_API_BASE_URL</code> y{" "}
            <code className="text-[10px]">NEXT_PUBLIC_STORE_API_SLUG</code> en{" "}
            <code className="text-[10px]">.env.local</code> para enlazar esta
            vitrina con tu API Java y habilitar el cobro.
          </p>
        ) : null}
        {apiConfigured && payuStatus && !payuStatus.payuActive ? (
          <p className="mt-4 text-xs text-amber-800 dark:text-amber-200">
            No hay pago en línea activo ahora. Puedes enviar el pedido por
            WhatsApp con el botón de abajo.
          </p>
        ) : null}
        {apiConfigured && payuStatusFetchAttempted && payuStatus === null ? (
          <p className="mt-4 text-xs text-amber-800 dark:text-amber-200">
            No pudimos consultar la pasarela. Puedes pedir por WhatsApp; si el
            pago en línea falla, te redirigimos allí con el resumen.
          </p>
        ) : null}
        {payuStatus?.payuActive && payuStatus.sandbox ? (
          <p className="mt-3 text-xs text-[var(--store-text-soft)]">
            Modo{" "}
            <span className="font-semibold text-[var(--store-primary)]">
              sandbox
            </span>
            : tras pulsar el botón irás al checkout de prueba de PayU.
          </p>
        ) : null}
        {error ? (
          <p
            className="mt-4 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </section>

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
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
            <Link
              href="/#productos"
              className="inline-flex min-h-[2.75rem] items-center justify-center border border-[var(--store-primary)]/55 px-5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)] transition hover:bg-[var(--store-muted)]/60"
            >
              Seguir comprando
            </Link>
            {whatsappBaseHref ? (
              <a
                href={whatsAppUrl() ?? "#"}
                className={`inline-flex min-h-[2.75rem] items-center justify-center px-5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
                  !canPayWithPayu
                    ? "border border-[var(--store-primary)] bg-[var(--store-primary)] text-white shadow-[var(--store-shadow-soft)] hover:opacity-[0.92]"
                    : "border border-[var(--store-border-subtle)] bg-[var(--store-surface)] text-[var(--store-text)] shadow-[var(--store-shadow-soft)] hover:border-[var(--store-primary)]/45 hover:bg-[var(--store-muted)]/35 hover:text-[var(--store-primary)]"
                }`}
              >
                {!canPayWithPayu
                  ? "Pedir por WhatsApp"
                  : "O pedir por WhatsApp"}
              </a>
            ) : null}
            <button
              type="button"
              disabled={!canPayWithPayu || pending}
              onClick={() => onPay()}
              className="inline-flex min-h-[2.75rem] items-center justify-center border border-[var(--store-primary)] bg-[var(--store-primary)] px-5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              title={
                canPayWithPayu
                  ? "Crear pedido y abrir PayU"
                  : "Activa PayU en el backend o usa WhatsApp"
              }
            >
              {pending ? "Preparando pago…" : "Pagar con PayU"}
            </button>
          </div>
        </div>
      </footer>

      {showPostPayModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-label="Instrucciones de pago y envío de comprobante"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] p-6 shadow-2xl sm:p-7">
            <div className="mb-4 inline-flex items-center rounded-full border border-[var(--store-primary)]/30 bg-[var(--store-primary)]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)]">
              Pago iniciado
            </div>
            <h3 className="font-display text-2xl text-[var(--store-text)]">
              Completa el pago en PayU
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--store-text-soft)]">
              Abrimos PayU en una nueva pestaña para que finalices tu pago de
              forma segura. Cuando tengas el comprobante, envíalo al negocio por
              WhatsApp para agilizar la validación.
            </p>
            <div className="mt-5 rounded-xl border border-[var(--store-border-subtle)] bg-[var(--store-page-bg)] p-4 text-sm text-[var(--store-text-soft)]">
              <p className="font-semibold text-[var(--store-text)]">
                Recomendado:
              </p>
              <p className="mt-1">
                1) Finaliza PayU en la pestaña nueva.
                <br />
                2) Vuelve aquí y comparte el comprobante por WhatsApp.
              </p>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onAcknowledgePostPayModal}
                className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-[var(--store-border-subtle)] px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--store-text)] transition hover:bg-[var(--store-muted)]/45"
              >
                Entendido
              </button>
              {whatsappBaseHref ? (
                <a
                  href={
                    whatsAppUrl(
                      "Ya realicé el pago en PayU. Te comparto el comprobante para validar mi pedido.",
                    ) ?? "#"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-[var(--store-primary)] bg-[var(--store-primary)] px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[var(--store-shadow-soft)] transition hover:opacity-90"
                >
                  Ir a WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
