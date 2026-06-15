import Link from "next/link";
import { listQuotes } from "@/lib/admin/data";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  new: "bg-orange/10 text-orangeDark",
  reviewing: "bg-greenSoft text-green",
  quoted: "bg-green text-white",
  closed: "bg-greenSoft text-sub",
};

export default async function AdminQuotesPage() {
  const quotes = (await listQuotes()) as any[];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Quote requests
      </h1>
      <p className="mt-1 text-sm text-sub">
        Bulk-buy quotes and product-sourcing requests from customers.
      </p>

      <div className="mt-5 overflow-hidden rounded-2xl border border-greenLine bg-white">
        <table className="w-full text-sm">
          <thead className="bg-greenSoft text-left text-ink">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-greenLine">
            {quotes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sub">
                  No quote requests yet.
                </td>
              </tr>
            )}
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-cream">
                <td className="px-4 py-3">
                  <Link href={`/admin/quotes/${q.id}`} className="font-medium text-ink hover:text-green">
                    {q.contact_name}
                  </Link>
                  <div className="text-xs text-sub">{q.company ?? q.country ?? ""}</div>
                </td>
                <td className="px-4 py-3 text-sub">
                  {q.request_type === "sourcing" ? "Sourcing" : "Quote"}
                </td>
                <td className="px-4 py-3 text-ink">{q.product_name ?? "—"}</td>
                <td className="px-4 py-3 text-sub">{q.quantity ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLE[q.status] ?? "bg-greenSoft text-sub"}`}>
                    {q.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sub">
                  {new Date(q.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
