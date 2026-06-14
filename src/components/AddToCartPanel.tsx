"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import type { ProductWithTiers } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { resolveUnitPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { localized } from "@/lib/i18n";

// Quantity picker that resolves the unit price live as qty crosses a tier
// breakpoint (build spec acceptance criteria).
export function AddToCartPanel({ product }: { product: ProductWithTiers }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const name = localized(product.name, product.name_i18n);

  const unit = resolveUnitPrice(product.retail_price_usd, product.tiers, qty);
  const isBulk = unit < product.retail_price_usd;

  return (
    <div className="rounded-2xl border border-greenLine bg-white p-5">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-semibold text-ink">
          {formatPrice(unit)}
        </span>
        <span className="text-sm text-sub">/ {product.base_unit}</span>
        {isBulk && (
          <span className="ml-1 rounded-full bg-greenSoft px-2 py-0.5 text-xs font-medium text-green">
            bulk price
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-greenLine">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-10 w-10 place-items-center rounded-l-full text-ink hover:bg-greenSoft"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) =>
              setQty(Math.max(1, parseInt(e.target.value || "1", 10)))
            }
            className="h-10 w-14 border-x border-greenLine text-center text-ink focus:outline-none"
            aria-label="Quantity"
          />
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="grid h-10 w-10 place-items-center rounded-r-full text-ink hover:bg-greenSoft"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <span className="text-sm text-sub">
          Subtotal:{" "}
          <span className="font-medium text-ink">{formatPrice(unit * qty)}</span>
        </span>
      </div>

      <button
        type="button"
        disabled={!product.in_stock}
        onClick={() => {
          add(
            {
              productId: product.id,
              slug: product.slug,
              name,
              baseUnit: product.base_unit,
              retailPriceUsd: product.retail_price_usd,
              imageUrl: product.image_urls?.[0] ?? null,
              originFlag: product.origin_flag,
              tiers: product.tiers,
            },
            qty
          );
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-5 py-3 font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
      >
        <ShoppingCart className="h-5 w-5" aria-hidden />
        {!product.in_stock ? "Sold out" : added ? "Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}
