"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { approveProduct, rejectProduct } from "@/lib/admin/actions";

export function ProductApprovalActions({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function approve() {
    setBusy(true);
    const res = await approveProduct(id);
    setBusy(false);
    if (!res.ok) return alert(res.error);
    router.refresh();
  }

  async function reject() {
    const reason = prompt("Reason for rejection (shown to the supplier):");
    if (reason === null) return;
    setBusy(true);
    const res = await rejectProduct(id, reason);
    setBusy(false);
    if (!res.ok) return alert(res.error);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={approve}
        className="inline-flex items-center gap-1 rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
      >
        <Check className="h-4 w-4" /> Approve
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={reject}
        className="inline-flex items-center gap-1 rounded-full border border-greenLine bg-white px-4 py-2 text-sm font-medium text-ink hover:border-orange disabled:opacity-50"
      >
        <X className="h-4 w-4" /> Reject
      </button>
    </div>
  );
}
