/**
 * Single indirection for ALL price display (build spec §4b).
 * Phase 1 ships USD/en-US, but no component hardcodes "$" or "USD". Later this
 * is where FX conversion + locale formatting drop in — a config change, not a
 * refactor. Do not format money anywhere else.
 */
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en-US";
const DEFAULT_CURRENCY = process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD";

export function formatPrice(
  amountUsd: number,
  locale: string = DEFAULT_LOCALE,
  currency: string = DEFAULT_CURRENCY
): string {
  // Phase 1: prices are stored in USD and displayed as-is. When multi-currency
  // arrives, convert amountUsd -> target currency here before formatting.
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amountUsd);
}

/** "$X / 5kg" style helper used on cards and tiers. */
export function formatUnitPrice(
  amountUsd: number,
  baseUnit: string,
  locale?: string,
  currency?: string
): string {
  return `${formatPrice(amountUsd, locale, currency)} / ${baseUnit}`;
}
