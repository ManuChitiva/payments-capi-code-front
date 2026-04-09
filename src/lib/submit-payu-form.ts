/**
 * Envía un POST clásico (como formulario HTML) a la pasarela PayU Web Checkout.
 * Debe ejecutarse solo en el cliente.
 */
export function submitPayuWebCheckout(
  actionUrl: string,
  fields: Record<string, string>,
  target: "_self" | "_blank" = "_self",
): void {
  if (typeof document === "undefined") return;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = actionUrl;
  form.acceptCharset = "UTF-8";
  form.target = target;

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.append(input);
  }

  document.body.append(form);
  form.submit();
  form.remove();
}
