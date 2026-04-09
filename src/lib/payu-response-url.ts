/**
 * Parámetros GET que envía PayU a la Response URL (retorno del navegador).
 * @see https://developers.payulatam.com/latam/en/docs/integrations/response-url.html
 */

export type PayuResponseUi = {
  title: string;
  description: string;
  tone: "success" | "warning" | "error" | "neutral";
};

/** transactionState numérico en la Response URL */
export function describePayuTransactionState(
  transactionState: string | undefined,
  lapTransactionState: string | undefined,
  message: string | undefined,
): PayuResponseUi {
  const code = transactionState?.trim() ?? "";
  const lap = lapTransactionState?.trim().toUpperCase() ?? "";
  const msg = message?.trim();

  switch (code) {
    case "4":
      return {
        title: "Pago aprobado",
        description:
          "PayU informó que la transacción fue aprobada. La tienda confirmará el pedido y, si aplica, te enviará la factura por correo o WhatsApp.",
        tone: "success",
      };
    case "6":
      return {
        title: "Pago no completado",
        description:
          msg ??
          "La transacción fue rechazada o no pudo completarse. Puedes intentar de nuevo o contactar a la tienda.",
        tone: "error",
      };
    case "7":
      return {
        title: "Pago pendiente",
        description:
          "El pago puede estar en validación o pendiente (por ejemplo efectivo o PSE). Te avisaremos cuando se confirme.",
        tone: "warning",
      };
    case "5":
      return {
        title: "Sesión expirada",
        description:
          "El tiempo para pagar expiró. Vuelve al carrito e inténtalo de nuevo.",
        tone: "warning",
      };
    case "104":
      return {
        title: "Error en el pago",
        description: msg ?? "Ocurrió un error al procesar el pago.",
        tone: "error",
      };
    default:
      if (lap === "APPROVED") {
        return {
          title: "Pago aprobado",
          description:
            "PayU indica aprobación. Conserva el comprobante y revisa tu correo.",
          tone: "success",
        };
      }
      if (lap === "DECLINED" || lap === "REJECTED") {
        return {
          title: "Pago no completado",
          description: msg ?? "La transacción no fue aprobada.",
          tone: "error",
        };
      }
      return {
        title: "Resultado del pago",
        description:
          code || msg
            ? `Estado reportado por PayU (${code || lap || "—"}). Si tienes dudas, escribe a la tienda.`
            : "No recibimos el detalle del estado. Si ya pagaste, guarda el comprobante y contacta a la tienda.",
        tone: "neutral",
      };
  }
}
