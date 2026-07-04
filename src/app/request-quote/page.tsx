import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getProductBySlug, getAllProducts } from "@/lib/products";
import { localized } from "@/lib/i18n";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";

export const metadata: Metadata = {
  title: "Request a quote — GlobalSource Africa",
  description:
    "Request a bulk quote on a listed product, or ask us to source a non-perishable African farm product for you.",
};

export const dynamic = "force-dynamic";

export default async function RequestQuotePage({
  searchParams,
}: {
  searchParams: { product?: string; type?: string };
}) {
  // If launched from a product page, pre-fill and link the product.
  const product = searchParams.product
    ? await getProductBySlug(searchParams.product)
    : null;
  const initialType = searchParams.type === "sourcing" ? "sourcing" : "quote";

  // All listed products power the "Get a quote" product dropdown.
  const allProducts = await getAllProducts();
  const productOptions = allProducts.map((p) => ({
    id: p.id,
    name: localized(p.name, p.name_i18n),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-sub hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Back to storefront
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
        Request a quote
      </h1>
      <p className="mt-2 max-w-2xl text-sub">
        Buying in volume, or looking for something we don’t list yet? Tell us
        what you need and we’ll come back with a quote — sold and backed by
        GlobalSource Africa.
      </p>
      <div className="mt-6">
        <QuoteRequestForm
          initialProductId={product?.id ?? null}
          initialProductName={product ? localized(product.name, product.name_i18n) : null}
          initialType={product ? "quote" : initialType}
          products={productOptions}
        />
      </div>
    </div>
  );
}
