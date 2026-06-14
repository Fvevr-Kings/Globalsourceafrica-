import Link from "next/link";
import { listAdminOrders } from "@/lib/admin/data";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  placed: "bg-greenSoft text-green",
  confirmed: "bg-greenSoft text-green",
  shipped: "bg-greenSoft text-green",
  delivered: "bg-green text-white",
  refunded: "bg-orange/10 text-orangeDark",
};

export default async function AdminOrdersPage() {
  const orders = await listAdminOrders();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Orders</h1>

      <div className="mt-5 overflow-hidden rounded-2xl border border-greenLine bg-white">
        <table className="w-full text-sm">
          <thead className="bg-greenSoft text-left text-ink">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Buyer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-greenLine">
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sub">
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-cream">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-ink hover:text-green">
                    #{o.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sub">{o.buyer_contact ?? "—"}</td>
                <td className="px-4 py-3 text-ink">{formatPrice(o.subtotal_usd)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLE[o.status] ?? "bg-greenSoft text-green"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sub">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
