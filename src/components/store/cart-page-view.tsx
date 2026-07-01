"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useCart } from "@/components/store/cart-context";
import {
  IconAlert,
  IconClose,
  IconInfo,
  IconLock,
  IconSearch,
  IconTrash,
} from "@/components/store/icons";
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

/**
 * Los line ids de variantes tienen el formato `${productId}::${variantId}`.
 * Esta función extrae el variantId para enviarlo al backend de checkout.
 */
function extractVariantId(lineId: string): string | null {
  const sep = "::";
  const idx = lineId.indexOf(sep);
  if (idx < 0) return null;
  return lineId.slice(idx + sep.length);
}

export type CartPageViewProps = {
  storeId?: number;
  storeName: string;
  payuStatus: PayuStatus | null;
  /** True si se llamó a la API de estado PayU (solo entonces un null indica fallo red/API). */
  payuStatusFetchAttempted?: boolean;
  whatsappBaseHref: string | null;
};

/** Mostramos el buscador en el modal cuando el carrito empieza a tener varias líneas. */
const SEARCH_VISIBLE_FROM = 4;
/** En la vista previa inline mostramos los primeros N productos; el resto se ve en el modal. */
const PREVIEW_ITEM_COUNT = 3;

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
  const [query, setQuery] = useState("");
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);

  const productsDialogRef = useRef<HTMLDialogElement>(null);

  const subtotal = items.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const currencySymbol = items[0]?.currencySymbol ?? "$";

  /** Filtrado por buscador — pensado para carritos largos. */
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((line) => {
      if (line.title.toLowerCase().includes(q)) return true;
      if (line.variantTitle.toLowerCase().includes(q)) return true;
      if (line.variantSku.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [items, query]);

  const showSearch = items.length >= SEARCH_VISIBLE_FROM;
  const previewItems = useMemo(
    () => items.slice(0, PREVIEW_ITEM_COUNT),
    [items],
  );
  const hiddenItemCount = Math.max(0, items.length - previewItems.length);

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
      variantTitle: i.variantTitle || undefined,
      variantSku: i.variantSku || undefined,
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

  const openProductsModal = useCallback(() => {
    setQuery("");
    productsDialogRef.current?.showModal();
    setIsProductsModalOpen(true);
  }, []);

  const closeProductsModal = useCallback(() => {
    productsDialogRef.current?.close();
    setIsProductsModalOpen(false);
  }, []);

  useEffect(() => {
    if (items.length === 0 || purchaseIntentSent.current) return;
    purchaseIntentSent.current = true;
    trackStoreEvent({
      eventType: "PURCHASE_INTENT",
      source: "cart-page",
    });
  }, [items.length]);

  useEffect(() => {
    // Si el carrito queda vacío tras vaciarlo desde el modal, cerramos.
    if (items.length === 0 && isProductsModalOpen) {
      closeProductsModal();
    }
  }, [items.length, isProductsModalOpen, closeProductsModal]);

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
        items.map((i) => ({
          id: i.productId,
          quantity: i.quantity,
          variantId: i.variantSku ? extractVariantId(i.id) : null,
        })),
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
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--store-muted)] text-[var(--store-text-soft)]">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="9" cy="20" r="1" />
            <circle cx="16" cy="20" r="1" />
            <path d="M3 3h2l1.5 12.5a1 1 0 0 0 1 .9h9.7a1 1 0 0 0 1-.76L21 7H6" />
          </svg>
        </div>
        <h1 className="mt-6 font-display text-3xl tracking-tight text-[var(--store-text)] sm:text-4xl">
          Tu carrito está vacío
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--store-text-soft)]">
          Aún no has añadido productos. Explora la colección y guarda los que
          quieras llevar.
        </p>
        <Link
          href="/#productos"
          className="mt-8 inline-flex min-h-[2.85rem] items-center justify-center rounded-md bg-[var(--store-primary)] px-7 text-[13px] font-medium text-[var(--store-on-primary)] transition hover:bg-[var(--store-primary-hover)]"
        >
          Explorar la colección
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <header className="space-y-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)]">
          Resumen
        </p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-3xl tracking-tight text-[var(--store-text)] sm:text-4xl">
            Tu carrito
          </h1>
          <p className="text-sm tabular-nums text-[var(--store-text-soft)]">
            <span className="font-medium text-[var(--store-text)]">
              {totalQuantity}
            </span>{" "}
            {totalQuantity === 1 ? "artículo" : "artículos"}
            <span className="mx-1.5 text-[var(--store-border)]">·</span>
            <span>
              {items.length}{" "}
              {items.length === 1 ? "producto" : "productos"}
            </span>
          </p>
        </div>
      </header>

      <div className="space-y-8 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-10">
        {/* —— Columna izquierda: vista previa de productos —— */}
        <section
          aria-labelledby="cart-products-heading"
          className="min-w-0 overflow-hidden rounded-xl border border-[var(--store-border)] bg-[var(--store-surface)]"
        >
          <header className="flex items-baseline justify-between gap-3 px-5 py-4 sm:px-6">
            <div>
              <h2
                id="cart-products-heading"
                className="text-base font-semibold text-[var(--store-text)] sm:text-lg"
              >
                Tus productos
              </h2>
              <p className="mt-0.5 text-xs tabular-nums text-[var(--store-text-soft)]">
                {previewItems.length} de {items.length}{" "}
                {items.length === 1 ? "mostrado" : "mostrados"}
              </p>
            </div>
            <button
              type="button"
              onClick={openProductsModal}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-[var(--store-primary)] transition hover:bg-[var(--store-primary)]/10"
            >
              Ver y editar
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </header>

          <ul className="divide-y divide-[var(--store-border)] border-t border-[var(--store-border)]">
            {previewItems.map((line) => (
              <li
                key={line.id}
                className="flex items-center gap-3 px-5 py-4 sm:gap-4 sm:px-6"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--store-muted)] sm:h-20 sm:w-20">
                  <Image
                    src={line.imageSrc}
                    alt={line.imageAlt}
                    fill
                    sizes="(max-width: 640px) 64px, 80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-1 text-[14px] font-medium leading-snug text-[var(--store-text)] sm:text-[15px]">
                    {line.title}
                  </h3>
                  {line.variantTitle ? (
                    <p className="mt-0.5 line-clamp-1 text-[12px] text-[var(--store-text-soft)]">
                      {line.variantTitle}
                    </p>
                  ) : null}
                  <p className="mt-1 text-[12px] tabular-nums text-[var(--store-text-soft)]">
                    {line.quantity} ×{" "}
                    {formatStorePrice(line.price, line.currencySymbol)}
                  </p>
                </div>
                <p className="shrink-0 text-[14px] font-semibold tabular-nums text-[var(--store-text)] sm:text-[15px]">
                  {formatStorePrice(
                    line.price * line.quantity,
                    line.currencySymbol,
                  )}
                </p>
              </li>
            ))}
          </ul>

          {hiddenItemCount > 0 ? (
            <div className="border-t border-[var(--store-border)] px-5 py-3 sm:px-6">
              <p className="text-[12px] text-[var(--store-text-soft)]">
                + {hiddenItemCount}{" "}
                {hiddenItemCount === 1 ? "producto más" : "productos más"} en tu
                carrito
              </p>
            </div>
          ) : null}

          <footer className="border-t border-[var(--store-border)] bg-[var(--store-muted)]/40 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={openProductsModal}
              className="inline-flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-md border border-[var(--store-border)] bg-[var(--store-surface)] px-5 text-[13px] font-medium text-[var(--store-text)] transition hover:border-[var(--store-primary)]/45 hover:text-[var(--store-primary)]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 6h16M4 12h10M4 18h16" />
              </svg>
              Abrir lista completa ({items.length})
            </button>
          </footer>
        </section>

        {/* —— Columna derecha: resumen sticky del pedido —— */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-[var(--store-border)] bg-[var(--store-surface)] p-5 shadow-[var(--store-shadow-soft)] sm:p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-semibold text-[var(--store-text)]">
                Resumen del pedido
              </h2>
              <span className="text-[11px] tabular-nums text-[var(--store-text-soft)]">
                {items.length}{" "}
                {items.length === 1 ? "producto" : "productos"}
              </span>
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-[var(--store-text-soft)]">Artículos</dt>
                <dd className="tabular-nums text-[var(--store-text)]">
                  {totalQuantity}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-[var(--store-text-soft)]">Subtotal</dt>
                <dd className="tabular-nums text-[var(--store-text)]">
                  {formatStorePrice(subtotal, currencySymbol)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-[var(--store-text-soft)]">Envío</dt>
                <dd className="text-[12px] text-[var(--store-text-soft)]">
                  Se calcula al pagar
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex items-baseline justify-between border-t border-[var(--store-border)] pt-4">
              <span className="text-sm text-[var(--store-text)]">Total</span>
              <span className="text-2xl font-semibold tabular-nums text-[var(--store-text)] sm:text-[26px]">
                {formatStorePrice(subtotal, currencySymbol)}
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                disabled={!canPayWithPayu || pending}
                onClick={() => onPay()}
                className="inline-flex min-h-[2.85rem] items-center justify-center rounded-md bg-[var(--store-primary)] px-5 text-[13px] font-medium text-[var(--store-on-primary)] transition hover:bg-[var(--store-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                title={
                  canPayWithPayu
                    ? "Crear pedido y abrir PayU"
                    : "Activa PayU en el backend o usa WhatsApp"
                }
              >
                {pending ? "Preparando pago…" : "Pagar con PayU"}
              </button>
              {whatsappBaseHref ? (
                <a
                  href={whatsAppUrl() ?? "#"}
                  className={`inline-flex min-h-[2.85rem] items-center justify-center rounded-md px-5 text-[13px] font-medium transition ${
                    !canPayWithPayu
                      ? "bg-[var(--store-primary)] text-[var(--store-on-primary)] hover:bg-[var(--store-primary-hover)]"
                      : "border border-[var(--store-border)] bg-[var(--store-surface)] text-[var(--store-text)] hover:border-[var(--store-primary)]/45 hover:text-[var(--store-primary)]"
                  }`}
                >
                  {!canPayWithPayu
                    ? "Pedir por WhatsApp"
                    : "O pedir por WhatsApp"}
                </a>
              ) : null}
              <Link
                href="/#productos"
                className="inline-flex min-h-[2.85rem] items-center justify-center rounded-md px-5 text-[13px] font-medium text-[var(--store-primary)] transition hover:bg-[var(--store-primary)]/5"
              >
                Seguir comprando
              </Link>
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-lg bg-[var(--store-muted)]/60 px-3 py-2.5 text-[12px] leading-snug text-[var(--store-text-soft)]">
              <IconLock className="mt-0.5 shrink-0 text-[var(--store-primary)]" />
              <p>
                Pago seguro procesado por PayU. Tus datos solo se usan para
                gestionar este pedido.
              </p>
            </div>

            <button
              type="button"
              onClick={() => clear()}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 py-1 text-[12px] text-[var(--store-text-soft)] transition hover:text-red-600"
            >
              <IconTrash />
              Vaciar carrito
            </button>
          </div>
        </aside>
      </div>

      {/* —— Datos de contacto (ancho completo) —— */}
      <section className="rounded-xl border border-[var(--store-border)] bg-[var(--store-surface)] p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-base font-semibold text-[var(--store-text)] sm:text-lg">
            Datos de contacto
          </h2>
          <span className="text-[11px] uppercase tracking-wider text-[var(--store-text-soft)]/80">
            Paso 2 de 2
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--store-text-soft)]">
          Los usamos en PayU o en el mensaje de WhatsApp si pagas con la tienda
          por chat.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-[12px] font-medium text-[var(--store-text-soft)]">
            Nombre completo
            <input
              type="text"
              name="customerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="mt-1.5 w-full rounded-md border border-[var(--store-border)] bg-[var(--store-surface)] px-3 py-2 text-sm text-[var(--store-text)] outline-none transition focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-ring-focus)]"
            />
          </label>
          <label className="block text-[12px] font-medium text-[var(--store-text-soft)]">
            Correo
            <input
              type="email"
              name="customerEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-1.5 w-full rounded-md border border-[var(--store-border)] bg-[var(--store-surface)] px-3 py-2 text-sm text-[var(--store-text)] outline-none transition focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-ring-focus)]"
            />
          </label>
          <label className="block text-[12px] font-medium text-[var(--store-text-soft)] sm:col-span-2">
            Teléfono (opcional)
            <input
              type="tel"
              name="customerPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className="mt-1.5 w-full rounded-md border border-[var(--store-border)] bg-[var(--store-surface)] px-3 py-2 text-sm text-[var(--store-text)] outline-none transition focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-ring-focus)]"
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
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200/70 bg-amber-50 px-3 py-2.5 text-xs leading-snug text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-100/90">
            <IconInfo className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" />
            <p>
              No hay pago en línea activo ahora. Puedes enviar el pedido por
              WhatsApp con el botón de abajo.
            </p>
          </div>
        ) : null}
        {apiConfigured && payuStatusFetchAttempted && payuStatus === null ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200/70 bg-amber-50 px-3 py-2.5 text-xs leading-snug text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-100/90">
            <IconAlert className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" />
            <p>
              No pudimos consultar la pasarela. Puedes pedir por WhatsApp; si el
              pago en línea falla, te redirigimos allí con el resumen.
            </p>
          </div>
        ) : null}
        {payuStatus?.payuActive && payuStatus.sandbox ? (
          <p className="mt-3 text-xs text-[var(--store-text-soft)]">
            Modo{" "}
            <span className="font-medium text-[var(--store-primary)]">
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

      {/* —— Barra inferior fija solo en móvil —— */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--store-border)] bg-[var(--store-surface)]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-[var(--store-text-soft)]">
              Total
            </p>
            <p className="text-lg font-semibold tabular-nums text-[var(--store-text)]">
              {formatStorePrice(subtotal, currencySymbol)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {whatsappBaseHref ? (
              <a
                href={whatsAppUrl() ?? "#"}
                className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--store-border)] px-4 text-[13px] font-medium text-[var(--store-text)]"
              >
                WhatsApp
              </a>
            ) : null}
            <button
              type="button"
              disabled={!canPayWithPayu || pending}
              onClick={() => onPay()}
              className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--store-primary)] px-5 text-[13px] font-medium text-[var(--store-on-primary)] transition hover:bg-[var(--store-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Preparando…" : "Pagar"}
            </button>
          </div>
        </div>
      </div>

      {/* —— Modal de productos (scroll interno) —— */}
      <dialog
        ref={productsDialogRef}
        onClose={() => setIsProductsModalOpen(false)}
        onClick={(e) => {
          // Cerrar al hacer click fuera del contenido (en el backdrop nativo).
          if (e.target === e.currentTarget) closeProductsModal();
        }}
        aria-labelledby="cart-products-modal-title"
        className="m-0 max-h-[100dvh] w-full max-w-3xl rounded-none bg-transparent p-0 [&::backdrop]:bg-black/40 sm:m-auto sm:max-h-[88vh] sm:rounded-2xl"
      >
        <div className="flex max-h-[100dvh] flex-col overflow-hidden border border-[var(--store-border)] bg-[var(--store-surface)] shadow-[var(--store-shadow-hover)] sm:max-h-[88vh] sm:rounded-2xl">
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--store-border)] px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <h2
                id="cart-products-modal-title"
                className="text-[17px] font-semibold text-[var(--store-text)] sm:text-lg"
              >
                Productos en tu carrito
              </h2>
              <p className="mt-0.5 text-xs tabular-nums text-[var(--store-text-soft)]">
                {items.length}{" "}
                {items.length === 1 ? "producto" : "productos"} ·{" "}
                {totalQuantity}{" "}
                {totalQuantity === 1 ? "artículo" : "artículos"}
              </p>
            </div>
            <button
              type="button"
              onClick={closeProductsModal}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)]"
              aria-label="Cerrar"
            >
              <IconClose />
            </button>
          </header>

          {showSearch ? (
            <div className="shrink-0 border-b border-[var(--store-border)] px-5 py-3 sm:px-6">
              <div className="flex min-h-11 min-w-0 items-center gap-3 rounded-lg border border-[var(--store-border)] bg-[var(--store-surface)] px-4 transition focus-within:border-[var(--store-primary)] focus-within:ring-2 focus-within:ring-[var(--store-ring-focus)]">
                <IconSearch className="h-[18px] w-[18px] shrink-0 text-[var(--store-text-soft)]" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Buscar en tu carrito (${items.length} productos)…`}
                  className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-[14px] text-[var(--store-text)] outline-none placeholder:text-[var(--store-text-soft)]"
                  aria-label="Buscar productos en el carrito"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="grid h-7 w-7 place-items-center rounded-md text-[var(--store-text-soft)] transition hover:bg-[var(--store-hover-overlay)] hover:text-[var(--store-text)]"
                    aria-label="Limpiar búsqueda"
                  >
                    <IconClose />
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <p className="text-base font-semibold text-[var(--store-text)]">
                  Sin coincidencias
                </p>
                <p className="mt-2 max-w-sm text-sm text-[var(--store-text-soft)]">
                  No hay productos que coincidan con “{query}”.
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-4 text-[13px] font-medium text-[var(--store-primary)] underline-offset-2 hover:underline"
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--store-border)]">
                {filteredItems.map((line) => (
                  <li
                    key={line.id}
                    className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-5 sm:p-5"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--store-muted)] sm:h-28 sm:w-28">
                      <Image
                        src={line.imageSrc}
                        alt={line.imageAlt}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1.5">
                          <h3 className="text-[15px] font-medium leading-snug text-[var(--store-text)] sm:text-base">
                            {line.title}
                          </h3>
                          {line.variantTitle || line.variantSku ? (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {line.variantTitle ? (
                                <span className="inline-flex items-center rounded-full bg-[var(--store-muted)] px-2.5 py-0.5 text-[11px] font-normal text-[var(--store-text-soft)]">
                                  {line.variantTitle}
                                </span>
                              ) : null}
                              {line.variantSku ? (
                                <span className="text-[11px] tabular-nums text-[var(--store-text-soft)]/80">
                                  Ref. {line.variantSku}
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                          <p className="text-[13px] tabular-nums text-[var(--store-text-soft)]">
                            {formatStorePrice(
                              line.price,
                              line.currencySymbol,
                            )}{" "}
                            <span className="text-[var(--store-text-soft)]/70">
                              · precio unitario
                            </span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(line.id)}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-[var(--store-text-soft)] transition hover:bg-red-500/10 hover:text-red-600"
                          aria-label={`Quitar ${line.title}`}
                          title="Quitar del carrito"
                        >
                          <IconTrash />
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="inline-flex items-center overflow-hidden rounded-md border border-[var(--store-border)]">
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(line.id, line.quantity - 1)
                            }
                            disabled={line.quantity <= 1}
                            className="grid h-9 w-9 place-items-center text-[15px] text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)] disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label={`Reducir cantidad de ${line.title}`}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            value={line.quantity}
                            onChange={(e) => {
                              const next = Number.parseInt(e.target.value, 10);
                              if (!Number.isFinite(next)) return;
                              setQuantity(line.id, Math.max(1, next));
                            }}
                            className="h-9 w-12 border-0 bg-transparent text-center text-[14px] font-medium tabular-nums text-[var(--store-text)] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            aria-label={`Cantidad de ${line.title}`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(line.id, line.quantity + 1)
                            }
                            className="grid h-9 w-9 place-items-center text-[15px] text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)]"
                            aria-label={`Aumentar cantidad de ${line.title}`}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] uppercase tracking-wider text-[var(--store-text-soft)]/80">
                            Subtotal
                          </p>
                          <p className="mt-0.5 text-[15px] font-semibold tabular-nums text-[var(--store-text)] sm:text-base">
                            {formatStorePrice(
                              line.price * line.quantity,
                              line.currencySymbol,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <footer className="flex shrink-0 flex-col gap-3 border-t border-[var(--store-border)] bg-[var(--store-muted)]/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => clear()}
                className="inline-flex items-center gap-1.5 text-[12px] text-[var(--store-text-soft)] transition hover:text-red-600"
              >
                <IconTrash />
                Vaciar carrito
              </button>
              {showSearch && filteredItems.length !== items.length ? (
                <span className="text-[11px] tabular-nums text-[var(--store-text-soft)]">
                  Mostrando {filteredItems.length} de {items.length}
                </span>
              ) : null}
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="text-left sm:text-right">
                <p className="text-[11px] uppercase tracking-wider text-[var(--store-text-soft)]">
                  Total
                </p>
                <p className="text-lg font-semibold tabular-nums text-[var(--store-text)]">
                  {formatStorePrice(subtotal, currencySymbol)}
                </p>
              </div>
              <button
                type="button"
                onClick={closeProductsModal}
                className="inline-flex min-h-[2.75rem] items-center justify-center rounded-md bg-[var(--store-primary)] px-5 text-[13px] font-medium text-[var(--store-on-primary)] transition hover:bg-[var(--store-primary-hover)]"
              >
                Listo
              </button>
            </div>
          </footer>
        </div>
      </dialog>

      {showPostPayModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Instrucciones de pago y envío de comprobante"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[var(--store-border)] bg-[var(--store-surface)] p-6 sm:p-7">
            <div className="mb-4 inline-flex items-center rounded-full bg-[var(--store-primary)]/10 px-3 py-1 text-[12px] font-medium text-[var(--store-primary)]">
              Pago iniciado
            </div>
            <h3 className="text-2xl font-semibold text-[var(--store-text)]">
              Completa el pago en PayU
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--store-text-soft)]">
              Abrimos PayU en una nueva pestaña para que finalices tu pago de
              forma segura. Cuando tengas el comprobante, envíalo al negocio por
              WhatsApp para agilizar la validación.
            </p>
            <div className="mt-5 rounded-xl border border-[var(--store-border)] bg-[var(--store-muted)]/40 p-4 text-sm text-[var(--store-text-soft)]">
              <p className="font-medium text-[var(--store-text)]">
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
                className="inline-flex min-h-[2.75rem] items-center justify-center rounded-md border border-[var(--store-border)] px-5 text-[13px] font-medium text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)]"
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
                  className="inline-flex min-h-[2.75rem] items-center justify-center rounded-md bg-[var(--store-primary)] px-5 text-[13px] font-medium text-[var(--store-on-primary)] transition hover:bg-[var(--store-primary-hover)]"
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