"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/admin/actions";

const STATUSES = ["placed", "confirmed", "shipped", "delivered", "refunded"];

export function OrderStatusControl({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onChange(next: string) {
    setValue(next);
    setBusy(true);
    setSaved(false);
    const res = await updateOrderStatus(orderId, next);
    setBusy(false);
    if (!res.ok) {
      alert(res.error);
      setValue(status);
      return;
    }
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={value}
        disabled={busy}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-greenLine bg-white px-3 py-2 text-sm capitalize text-ink focus:border-green focus:outline-none"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s}
          </option>
        ))}
      </select>
      {busy && <span className="text-xs text-sub">Saving…</span>}
      {saved && <span className="text-xs text-green">Saved</span>}
    </div>
  );
}
