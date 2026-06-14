import Link from "next/link";
import { requireMerchant } from "@/lib/merchant/auth";
import { listMerchantProducts } from "@/lib/merchant/data";
import { formatPrice } from "@/lib/format";
import { DeleteMerchantProductButton } from "@/components/merchant/DeleteMerchantProductButton";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  approved: "bg-green text-white",
  pending: "bg-orange/10 text-orangeDark",
  rejected: "bg-greenSoft text-sub",
};

export default async function MerchantProductsPage() {
  const merchant = await requireMerchant();
  const products = await listMerchantProducts(merchant.supplierId);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">My products</h1>
        <Link
          href="/merchant/products/new"
          className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orangeDark"
        >
          Submit a product
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {products.length === 0 && (
          <p className="rounded-2xl border border-greenLine bg-white p-6 text-center text-sub">
            You haven’t submitted any products yet.
          </p>
        )}
        {products.map((p: any) => (
          <div key={p.id} className="rounded-2xl border border-greenLine bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-ink">{p.name}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[p.approval_status] ?? "bg-greenSoft text-sub"}`}>
                    {p.approval_status === "approved" ? "live" : p.approval_status}
                  </span>
                </div>
                <p className="text-sm text-sub">
                  {p.category} · {formatPrice(p.retail_price_usd)} / {p.base_unit} ·{" "}
                  {p.in_stock ? "in stock" : "out of stock"}
                </p>
                {p.approval_status === "rejected" && p.rejection_reason && (
                  <p className="mt-1 text-sm text-orangeDark">
                    Reason: {p.rejection_reason}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/merchant/products/${p.id}`} className="text-sm font-medium text-green hover:underline">
                  Edit
                </Link>
                <DeleteMerchantProductButton id={p.id} name={p.name} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
