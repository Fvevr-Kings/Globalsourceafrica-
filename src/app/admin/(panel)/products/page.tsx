import Link from "next/link";
import { listAdminProducts, listPendingProducts } from "@/lib/admin/data";
import { formatPrice } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { ProductApprovalActions } from "@/components/admin/ProductApprovalActions";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  approved: "bg-green text-white",
  pending: "bg-orange/10 text-orangeDark",
  rejected: "bg-greenSoft text-sub",
};

export default async function AdminProductsPage() {
  const [products, pending] = await Promise.all([
    listAdminProducts(),
    listPendingProducts(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orangeDark"
        >
          Add product
        </Link>
      </div>

      {/* Merchant submissions awaiting review */}
      {pending.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            Awaiting approval ({pending.length})
          </h2>
          <p className="text-sm text-sub">
            Submitted by suppliers. Approved items go live on the storefront.
          </p>
          <div className="mt-3 space-y-3">
            {pending.map((p) => (
              <div key={p.id} className="rounded-2xl border border-orange/30 bg-orange/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Link href={`/admin/products/${p.id}`} className="font-display text-base font-semibold text-ink hover:text-green">
                      {p.name}
                    </Link>
                    <p className="text-sm text-sub">
                      {p.supplier_name ?? "—"} · {p.category} ·{" "}
                      {formatPrice(p.retail_price_usd)} / {p.base_unit}
                    </p>
                  </div>
                  <ProductApprovalActions id={p.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="overflow-hidden rounded-2xl border border-greenLine bg-white">
          <table className="w-full text-sm">
            <thead className="bg-greenSoft text-left text-ink">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Supplier</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-greenLine">
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sub">
                    No products yet. Add your first product.
                  </td>
                </tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-cream">
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.id}`} className="font-medium text-ink hover:text-green">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[p.approval_status] ?? "bg-greenSoft text-sub"}`}>
                      {p.approval_status === "approved" ? "live" : p.approval_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sub">{p.category}</td>
                  <td className="px-4 py-3 text-ink">
                    {formatPrice(p.retail_price_usd)} / {p.base_unit}
                  </td>
                  <td className="px-4 py-3">
                    {p.in_stock ? (
                      <span className="text-green">In stock</span>
                    ) : (
                      <span className="text-orangeDark">Out</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sub">{p.supplier_name ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/products/${p.id}`} className="text-sm text-green hover:underline">
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
