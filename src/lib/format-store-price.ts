export function formatStorePrice(
  amount: number,
  currencySymbol: string,
  locale: string = "es-CO",
): string {
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${currencySymbol} ${formatted}`;
}
