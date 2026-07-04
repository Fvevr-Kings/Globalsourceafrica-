"use client";

import { useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { trackOrder, type TrackedOrder } from "@/lib/tracking";
import { OrderTimeline } from "./OrderTimeline";
import { formatPrice } from "@/lib/format";

export function TrackForm({ initialOrder = "" }: { initialOrder?: string }) {
  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    setOrder(null);
    const res = await trackOrder({ orderNumber, contact });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setOrder(res.order);
  }

  const inputCls =
    "mt-1 w-full rounded-lg border border-greenLine bg-white px-4 py-2.5 text-ink focus:border-green focus:outline-none";

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="rounded-2xl border border-greenLine bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-ink">Order number *</span>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
              placeholder="e.g. 3f9a2c11"
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Email or phone used *</span>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              placeholder="The email or phone from checkout"
              className={inputCls}
            />
          </label>
        </div>
        {error && <p className="mt-3 text-sm text-orangeDark">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          {busy ? "Tracking…" : "Track order"}
        </button>
      </form>

      {order && (
        <div className="rounded-2xl border border-greenLine bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-greenLine pb-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                Order #{order.id.slice(0, 8)}
              </h2>
              <p className="text-sm text-sub">
                Placed {new Date(order.created_at).toLocaleDateString()} ·{" "}
                {formatPrice(order.subtotal_usd)}
              </p>
            </div>
            <span className="rounded-full bg-greenSoft px-3 py-1 text-sm font-medium capitalize text-green">
              {order.status}
            </span>
          </div>

          {order.items.length > 0 && (
            <p className="mt-4 text-sm text-sub">
              {order.items.map((it) => `${it.product_name} × ${it.qty}`).join(", ")}
            </p>
          )}

          <div className="mt-6">
            <OrderTimeline
              status={order.status}
              statusUpdatedAt={order.status_updated_at}
              trackingNote={order.tracking_note}
            />
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-xl bg-greenSoft p-4 text-sm text-green">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p>Every order is fulfilled and backed by GlobalSource Africa — we manage it from your order to your door.</p>
          </div>
        </div>
      )}
    </div>
  );
}
