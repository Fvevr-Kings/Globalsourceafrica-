import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getAdminOrder } from "@/lib/admin/data";
import { formatPrice } from "@/lib/format";
import { OrderStatusControl } from "@/components/admin/OrderStatusControl";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getAdminOrder(params.id);
  if (!order) notFound();

  const address = order.shipping_address as Record<string, string> | null;
  const buyerContact = (order as any).buyers?.contact ?? "—";

  return (
    <div className="max-w-3xl">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-sub hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Orders
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-sub">
            {buyerContact} · {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <OrderStatusControl
          orderId={order.id}
          status={order.status}
          note={(order as any).tracking_note ?? null}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-greenLine bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Items</h2>
        <ul className="mt-3 divide-y divide-greenLine">
          {order.items.map((it: any) => (
            <li key={it.id} className="flex justify-between py-3 text-sm">
              <span className="text-sub">
                {it.product_name} × {it.qty} @ {formatPrice(it.unit_price_usd)}
              </span>
              <span className="font-medium text-ink">{formatPrice(it.line_total_usd)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-greenLine pt-3">
          <span className="font-medium text-ink">Total</span>
          <span className="font-semibold text-ink">{formatPrice(order.subtotal_usd)}</span>
        </div>
      </div>

      {(order.shipping_name || address) && (
        <div className="mt-4 rounded-2xl border border-greenLine bg-white p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Shipping</h2>
          <p className="mt-2 text-sm text-sub">
            {order.shipping_name}
            {address && (
              <>
                <br />
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
                <br />
                {[address.city, address.region, address.postalCode].filter(Boolean).join(", ")}
                <br />
                {address.country}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
