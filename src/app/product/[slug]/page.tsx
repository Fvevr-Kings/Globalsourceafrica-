import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, ChevronLeft, ShieldCheck } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { localized } from "@/lib/i18n";
import { ProvenanceBlock } from "@/components/ProvenanceBlock";
import { PriceTierTable } from "@/components/PriceTierTable";
import { AddToCartPanel } from "@/components/AddToCartPanel";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const name = localized(product.name, product.name_i18n);
  const description = localized(product.description, product.description_i18n);
  const gallery = product.image_urls ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-sub hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-greenSoft">
            {gallery[0] ? (
              <Image
                src={gallery[0]}
                alt={name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center font-display text-6xl text-green/30">
                {product.origin_flag ?? "🌍"}
              </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.slice(1, 5).map((url, i) => (
                <div
                  key={url}
                  className="relative aspect-square overflow-hidden rounded-lg bg-greenSoft"
                >
                  <Image
                    src={url}
                    alt={`${name} ${i + 2}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary + buy */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-greenSoft px-3 py-1 text-sm font-medium text-green">
              <span aria-hidden>{product.origin_flag ?? "🌍"}</span>
              {product.origin_country}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-greenSoft px-3 py-1 text-sm font-medium text-green">
              <BadgeCheck className="h-4 w-4" aria-hidden /> Verified origin
            </span>
            <span className="rounded-full bg-greenSoft px-3 py-1 text-sm font-medium text-green">
              {product.category}
            </span>
          </div>

          <h1 className="font-display text-3xl font-semibold text-ink">{name}</h1>
          {product.blurb && <p className="text-sub">{localized(product.blurb, product.blurb_i18n)}</p>}

          <AddToCartPanel product={product} />

          {/* Trust note — sold by the business; supplier never shown. */}
          <div className="flex items-start gap-2 rounded-xl bg-greenSoft p-4 text-sm text-green">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p>
              Sold and backed by Global-Source Africa. You buy from the business —
              one accountable seller stands behind every order.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing tiers */}
      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Pricing</h2>
          <p className="mt-1 text-sm text-sub">
            Retail for single units; bulk pricing kicks in automatically at each
            breakpoint.
          </p>
          <div className="mt-4">
            <PriceTierTable
              retailPriceUsd={product.retail_price_usd}
              baseUnit={product.base_unit}
              tiers={product.tiers}
            />
          </div>
        </div>

        {description && (
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Description
            </h2>
            <p className="mt-3 whitespace-pre-line text-sub">{description}</p>
          </div>
        )}
      </section>

      {/* Provenance */}
      <div className="mt-10">
        <ProvenanceBlock product={product} />
      </div>
    </div>
  );
}
