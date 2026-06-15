"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateQuoteStatus } from "@/lib/admin/actions";

const STATUSES = ["new", "reviewing", "quoted", "closed"];

export function QuoteStatusControl({
  quoteId,
  status,
}: {
  quoteId: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);

  async function onChange(next: string) {
    setValue(next);
    setBusy(true);
    const res = await updateQuoteStatus(quoteId, next);
    setBusy(false);
    if (!res.ok) {
      alert(res.error);
      setValue(status);
      return;
    }
    router.refresh();
  }

  return (
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
  );
}
