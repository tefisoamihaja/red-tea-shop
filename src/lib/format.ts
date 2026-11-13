// Prices are always in euros. Whole amounts show no decimals ("€48"), others show two ("€48.50").
export function formatPrice(amount: number, { decimals }: { decimals?: boolean } = {}) {
  const showDecimals = decimals ?? !Number.isInteger(amount);
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

// "2024-06-08" → "Jun 8, 2024", or "Jun 08, 2024" with padDay (order lists in the Figma).
// UTC, so server and browser always agree.
export function formatDate(isoDate: string, { padDay = false }: { padDay?: boolean } = {}) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: padDay ? "2-digit" : "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}
