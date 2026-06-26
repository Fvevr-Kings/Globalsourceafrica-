import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import type { Order, OrderItem } from "@/lib/types";

export const dynamic = "force-dynamic";

// SSR, auth-gated. RLS ensures a buyer can read ONLY their own order; an
// unauthenticated or mismatched session simply gets no row.
export default async function OrderPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, status, currency, subtotal_usd, shipping_name, shipping_address, created_at"
    )
    .eq("id", params.id)
    .maybeSingle();

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Order not available
        </h1>
        <p className="mt-3 text-sub">
          This order can only be viewed from the passwordless session that placed
          it. Enter your email or phone again at checkout to re-attach your
          account and order history.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block font-medium text-green hover:underline"
        >
          Back to products
        </Link>
      </div>
    );
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("id, product_name, qty, unit_price_usd, line_total_usd")
    .eq("order_id", order.id);

  const typedOrder = order as Order;
  const typedItems = (items ?? []) as OrderItem[];
  const address = typedOrder.shipping_address as
    | Record<string, string>
    | null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-8 w-8 text-green" aria-hidden />
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Order confirmed
          </h1>
          <p className="text-sm text-sub">
            Order #{typedOrder.id.slice(0, 8)} ·{" "}
            <span className="capitalize">{typedOrder.status}</span> ·{" "}
            {new Date(typedOrder.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-greenLine bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Items</h2>
        <ul className="mt-3 divide-y divide-greenLine">
          {typedItems.map((it) => (
            <li key={it.id} className="flex justify-between py-3 text-sm">
              <span className="text-sub">
                {it.product_name} × {it.qty} @ {formatPrice(it.unit_price_usd)}
              </span>
              <span className="font-medium text-ink">
                {formatPrice(it.line_total_usd)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-greenLine pt-3">
          <span className="font-medium text-ink">Total</span>
          <span className="font-semibold text-ink">
            {formatPrice(typedOrder.subtotal_usd)}
          </span>
        </div>
      </div>

      {(typedOrder.shipping_name || address) && (
        <div className="mt-4 rounded-2xl border border-greenLine bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Shipping to
          </h2>
          <p className="mt-2 text-sm text-sub">
            {typedOrder.shipping_name}
            {address && (
              <>
                <br />
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
                <br />
                {[address.city, address.region, address.postalCode]
                  .filter(Boolean)
                  .join(", ")}
                <br />
                {address.country}
              </>
            )}
          </p>
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-greenSoft p-4 text-sm text-green">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <p>Sold and backed by GlobalSource Africa.</p>
      </div>

      <Link
        href="/"
        className="mt-6 inline-block font-medium text-green hover:underline"
      >
        Continue shopping
      </Link>
    </div>
  );
}
