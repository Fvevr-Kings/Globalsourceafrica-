import type { PriceTier } from "./types";

/**
 * Pricing rule (build spec §4): for a product and quantity `q`, the unit price
 * is the `unit_price_usd` of the highest tier whose `min_qty <= q`; if no tier
 * matches, use `retail_price_usd`.
 *
 * Used in two places:
 *  - client cart (display only — never trusted)
 *  - server order placement (authoritative — resolved against the DB)
 */
export function resolveUnitPrice(
  retailPriceUsd: number,
  tiers: PriceTier[],
  qty: number
): number {
  let price = retailPriceUsd;
  let bestMin = 0;
  for (const tier of tiers) {
    if (tier.min_qty <= qty && tier.min_qty >= bestMin) {
      bestMin = tier.min_qty;
      price = tier.unit_price_usd;
    }
  }
  return price;
}

export function lineTotal(
  retailPriceUsd: number,
  tiers: PriceTier[],
  qty: number
): number {
  return resolveUnitPrice(retailPriceUsd, tiers, qty) * qty;
}
