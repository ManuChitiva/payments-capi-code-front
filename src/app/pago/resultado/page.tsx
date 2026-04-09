import Link from "next/link";
import { StoreNavbar } from "@/components/store/navbar";
import { defaultStoreConfig } from "@/config/store-defaults";
import { describePayuTransactionState } from "@/lib/payu-response-url";
import { themeToStyle } from "@/lib/store-types";

export const metadata = {
  title: "Resultado del pago",
};

type Search = Record<string, string | string[] | undefined>;

export default async function PagoResultadoPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const transactionState = first(sp.transactionState);
  const lapTransactionState = first(sp.lapTransactionState);
  const message = first(sp.message);
  const referenceCode = first(sp.referenceCode);
  const referencePol = first(sp.reference_pol);
  const txValue = first(sp.TX_VALUE);
  const currency = first(sp.currency);

  const ui = describePayuTransactionState(
    transactionState,
    lapTransactionState,
    message,
  );

  const store = defaultStoreConfig;
  const toneClass =
    ui.tone === "success"
      ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-100"
      : ui.tone === "warning"
        ? "border-amber-500/40 bg-amber-950/20 text-amber-50"
        : ui.tone === "error"
          ? "border-red-500/40 bg-red-950/20 text-red-50"
          : "border-[var(--store-border-subtle)] bg-[var(--store-surface)] text-[var(--store-text)]";

  return (
    <div
      className="store-page-shell flex min-h-[100dvh] w-full flex-col text-[var(--store-text)]"
      style={store.theme ? themeToStyle(store.theme) : undefined}
    >
      <StoreNavbar brand={store.brand} links={store.navLinks} sticky />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-12 sm:px-6">
        <div
          className={`rounded-2xl border px-6 py-8 shadow-[var(--store-shadow-soft)] ${toneClass}`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
            PayU
          </p>
          <h1 className="mt-2 font-display text-2xl tracking-tight">{ui.title}</h1>
          <p className="mt-3 text-sm leading-relaxed opacity-95">{ui.description}</p>

          {(referenceCode || referencePol || txValue) ? (
            <dl className="mt-6 space-y-2 border-t border-white/10 pt-6 text-xs">
              {referenceCode ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--store-text-soft)]">Referencia</dt>
                  <dd className="font-mono text-right">{referenceCode}</dd>
                </div>
              ) : null}
              {referencePol ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--store-text-soft)]">Transacción PayU</dt>
                  <dd className="font-mono text-right">{referencePol}</dd>
                </div>
              ) : null}
              {txValue ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--store-text-soft)]">Valor</dt>
                  <dd className="tabular-nums">
                    {currency ? `${currency} ` : ""}
                    {txValue}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <p className="mt-6 text-[11px] leading-relaxed opacity-75">
            El comercio confirma inventario y facturación por su cuenta. Si el
            pago fue aprobado, también recibirás la notificación en el{" "}
            <strong>webhook</strong> del servidor (no solo en esta pantalla).
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex min-h-11 items-center justify-center border border-[var(--store-primary)]/55 px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)] transition hover:bg-[var(--store-muted)]/60"
          >
            Volver a la tienda
          </Link>
        </div>
      </main>
    </div>
  );
}

function first(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}
