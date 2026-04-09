import type { ContactLine } from "@/lib/store-types";
import { formatStorePrice } from "@/lib/format-store-price";

export type CartLineBrief = {
  title: string;
  quantity: number;
  unitPrice: number;
  currencySymbol: string;
};

/**
 * Primer enlace WhatsApp (wa.me) definido en el contacto de la tienda.
 */
export function resolveWhatsAppBaseHref(
  contactLines: ContactLine[],
): string | null {
  const line = contactLines.find(
    (l) => l.icon === "whatsapp" && typeof l.href === "string" && l.href.length > 0,
  );
  return line?.href ?? null;
}

/**
 * Añade ?text= al enlace wa.me con el mensaje del pedido.
 */
export function whatsAppUrlWithPrefill(baseHref: string, message: string): string {
  const digits = baseHref.replace(/\D/g, "");
  if (digits.length < 10) {
    return baseHref;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppOrderMessage(input: {
  storeName: string;
  lines: CartLineBrief[];
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  intro?: string;
}): string {
  const parts: string[] = [];

  if (input.intro) {
    parts.push(input.intro);
    parts.push("");
  }

  parts.push(`Hola, quiero hacer un pedido en *${input.storeName}*:`);
  parts.push("");

  for (const line of input.lines) {
    const sub = line.unitPrice * line.quantity;
    parts.push(
      `• ${line.quantity}× ${line.title} — ${formatStorePrice(sub, line.currencySymbol)}`,
    );
  }

  const total = input.lines.reduce(
    (s, l) => s + l.unitPrice * l.quantity,
    0,
  );
  const sym = input.lines[0]?.currencySymbol ?? "$";
  parts.push("");
  parts.push(`*Total aproximado:* ${formatStorePrice(total, sym)}`);
  parts.push("");

  if (input.customerName?.trim()) {
    parts.push(`Nombre: ${input.customerName.trim()}`);
  }
  if (input.customerEmail?.trim()) {
    parts.push(`Correo: ${input.customerEmail.trim()}`);
  }
  if (input.customerPhone?.trim()) {
    parts.push(`Tel: ${input.customerPhone.trim()}`);
  }

  return parts.join("\n").trim();
}
