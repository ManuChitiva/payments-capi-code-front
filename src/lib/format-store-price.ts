export function formatStorePrice(
  amount: number,
  currencySymbol: string,
  locale: string = "es-CO",
): string {
  // COP no usa centavos en la práctica, así que cuando el monto es entero
  // mostramos el número sin ",00". Si en el futuro hay precios con centavos
  // (p. ej. USD) el formateador los respeta.
  const fractionDigits = Number.isInteger(amount) ? 0 : 2;
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
  return `${currencySymbol} ${formatted}`;
}
