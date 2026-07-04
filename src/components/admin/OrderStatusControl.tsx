"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/admin/actions";

const STATUSES = ["placed", "confirmed", "processing", "shipped", "delivered", "refunded"];

export function OrderStatusControl({
  orderId,
  status,
  note = null,
}: {
  orderId: string;
  status: string;
  note?: string | null;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [noteValue, setNoteValue] = useState(note ?? "");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(nextStatus: string) {
    setBusy(true);
    setSaved(false);
    const res = await updateOrderStatus(orderId, nextStatus, noteValue.trim() || null);
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
    <div className="flex flex-col items-stretch gap-2 sm:w-72">
      <div className="flex items-center gap-3">
        <select
          value={value}
          disabled={busy}
          onChange={(e) => {
            setValue(e.target.value);
            save(e.target.value);
          }}
          className="flex-1 rounded-lg border border-greenLine bg-white px-3 py-2 text-sm capitalize text-ink focus:border-green focus:outline-none"
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
      <textarea
        value={noteValue}
        onChange={(e) => setNoteValue(e.target.value)}
        rows={2}
        placeholder="Tracking note shown to the customer (optional), e.g. 'Left our warehouse, ETA 3 days'"
        className="rounded-lg border border-greenLine bg-white px-3 py-2 text-sm text-ink focus:border-green focus:outline-none"
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => save(value)}
        className="self-end rounded-full bg-green px-4 py-1.5 text-xs font-semibold text-white hover:bg-green/90 disabled:opacity-50"
      >
        Save note
      </button>
    </div>
  );
}
