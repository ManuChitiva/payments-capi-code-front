"use server";

export type CartLineForCheckout = { id: string; quantity: number };

export type PayuStatus = {
  payuActive: boolean;
  sandbox: boolean;
  displayName: string | null;
};

export async function fetchPayuStatus(slug: string): Promise<PayuStatus | null> {
  const base = process.env.STORE_API_BASE_URL?.replace(/\/$/, "");
  if (!base || !slug) return null;
  try {
    const res = await fetch(
      `${base}/stores/${encodeURIComponent(slug)}/payment-methods/payu/status`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as PayuStatus;
  } catch {
    return null;
  }
}

export type CheckoutPayuResult =
  | { ok: true; actionUrl: string; fields: Record<string, string> }
  | { ok: false; message: string };

export async function checkoutAndStartPayu(
  storeId: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  lines: CartLineForCheckout[],
): Promise<CheckoutPayuResult> {
  const base = process.env.STORE_API_BASE_URL?.replace(/\/$/, "");
  if (!base) {
    return { ok: false, message: "Falta STORE_API_BASE_URL en el servidor." };
  }

  const checkoutRes = await fetch(`${base}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      storeId,
      customerName,
      customerEmail,
      customerPhone: customerPhone.trim() === "" ? null : customerPhone.trim(),
      items: lines.map((l) => ({
        productId: Number(l.id),
        quantity: l.quantity,
      })),
    }),
  });

  if (!checkoutRes.ok) {
    const text = await checkoutRes.text();
    return {
      ok: false,
      message:
        text.trim() ||
        `No se pudo crear el pedido (${checkoutRes.status}). Revisa stock y productos.`,
    };
  }

  const checkoutJson = (await checkoutRes.json()) as { orderId: number };
  const orderId = checkoutJson.orderId;

  const payuRes = await fetch(`${base}/checkout/orders/${orderId}/payu`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      storeId,
      description: `Pedido #${orderId}`,
    }),
  });

  if (!payuRes.ok) {
    const text = await payuRes.text();
    return {
      ok: false,
      message:
        text.trim() ||
        `No se pudo iniciar PayU (${payuRes.status}). ¿Medio PayU activo para la tienda?`,
    };
  }

  const data = (await payuRes.json()) as {
    actionUrl: string;
    fields: Record<string, string | number | undefined | null>;
  };

  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries(data.fields)) {
    if (v === undefined || v === null) continue;
    fields[k] = String(v);
  }

  return { ok: true, actionUrl: data.actionUrl, fields };
}
