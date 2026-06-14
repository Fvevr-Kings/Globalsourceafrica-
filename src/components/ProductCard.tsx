"use client";

import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatUnitPrice } from "@/lib/format";
import { localized } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

// NOTE: no supplier name anywhere — the card only ever receives buyer-safe
// fields from public_products.
export function ProductCard({
  product,
  tiers = [],
}: {
  product: Product;
  tiers?: { id: string; min_qty: number; unit_price_usd: number }[];
}) {
  const { add } = useCart();
  const name = localized(product.name, product.name_i18n);
  const blurb = localized(product.blurb, product.blurb_i18n);
  const image = product.image_urls?.[0] ?? null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-greenLine bg-white">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full bg-greenSoft">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-3xl text-green/40">
              {product.origin_flag ?? "🌍"}
            </div>
          )}
          {/* Origin pill with flag */}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ink">
            <span aria-hidden>{product.origin_flag ?? "🌍"}</span>
            {product.origin_country}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
        <div className="flex items-center gap-1 text-[11px] font-medium text-green sm:text-xs">
          <BadgeCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
          Verified origin
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-base font-semibold leading-snug text-ink hover:text-green sm:text-lg">
            {name}
          </h3>
        </Link>
        {blurb && <p className="line-clamp-2 text-xs text-sub sm:text-sm">{blurb}</p>}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <span className="text-xs font-medium text-ink sm:text-sm">
            {formatUnitPrice(product.retail_price_usd, product.base_unit)}
          </span>
          <button
            type="button"
            onClick={() =>
              add({
                productId: product.id,
                slug: product.slug,
                name,
                baseUnit: product.base_unit,
                retailPriceUsd: product.retail_price_usd,
                imageUrl: image,
                originFlag: product.origin_flag,
                tiers,
              })
            }
            className="inline-flex items-center gap-1 rounded-full bg-orange px-3 py-1.5 text-xs font-semibold text-white hover:bg-orangeDark disabled:opacity-50 sm:py-2 sm:text-sm"
            disabled={!product.in_stock}
            aria-label={`Add ${name} to cart`}
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
            {product.in_stock ? "Add" : "Sold out"}
          </button>
        </div>
      </div>
    </div>
  );
}
