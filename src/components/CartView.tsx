"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { resolveUnitPrice, lineTotal } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { items, setQty, remove, subtotal, ready } = useCart();

  if (!ready) {
    return <p className="py-16 text-center text-sub">Loading cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sub">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-4 inline-block font-medium text-green hover:underline"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* Cart lines */}
      <ul className="divide-y divide-greenLine rounded-2xl border border-greenLine bg-white">
        {items.map((it) => {
          const unit = resolveUnitPrice(it.retailPriceUsd, it.tiers, it.qty);
          const isBulk = unit < it.retailPriceUsd;
          return (
            <li key={it.productId} className="flex gap-4 p-4">
              <Link
                href={`/product/${it.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-greenSoft"
              >
                {it.imageUrl ? (
                  <Image
                    src={it.imageUrl}
                    alt={it.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid h-full place-items-center text-2xl">
                    {it.originFlag ?? "🌍"}
                  </span>
                )}
              </Link>

              <div className="flex flex-1 flex-col">
                <Link
                  href={`/product/${it.slug}`}
                  className="font-display font-semibold text-ink hover:text-green"
                >
                  {it.name}
                </Link>
                <span className="text-sm text-sub">
                  {formatPrice(unit)} / {it.baseUnit}
                  {isBulk && (
                    <span className="ml-2 rounded-full bg-greenSoft px-2 py-0.5 text-xs text-green">
                      bulk
                    </span>
                  )}
                </span>

                <div className="mt-auto flex items-center gap-3 pt-2">
                  <div className="inline-flex items-center rounded-full border border-greenLine">
                    <button
                      type="button"
                      onClick={() => setQty(it.productId, it.qty - 1)}
                      className="grid h-8 w-8 place-items-center rounded-l-full hover:bg-greenSoft"
                      aria-label={`Decrease ${it.name}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{it.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(it.productId, it.qty + 1)}
                      className="grid h-8 w-8 place-items-center rounded-r-full hover:bg-greenSoft"
                      aria-label={`Increase ${it.name}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(it.productId)}
                    className="inline-flex items-center gap-1 text-sm text-sub hover:text-ink"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>

              <div className="text-right font-medium text-ink">
                {formatPrice(lineTotal(it.retailPriceUsd, it.tiers, it.qty))}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Summary */}
      <aside className="h-fit rounded-2xl border border-greenLine bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Summary</h2>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-sub">Subtotal</span>
          <span className="font-medium text-ink">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-1 text-xs text-sub">
          Shipping calculated at the next step.
        </p>
        <Link
          href="/checkout"
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-orange px-5 py-3 font-semibold text-white hover:bg-orangeDark"
        >
          Checkout
        </Link>
        <p className="mt-3 text-center text-xs text-sub">
          No account needed to get here — identity is only asked at checkout.
        </p>
        <Link
          href="/request-quote"
          className="mt-3 block text-center text-sm font-medium text-green hover:underline"
        >
          Buying in volume? Request a quote
        </Link>
      </aside>
    </div>
  );
}
