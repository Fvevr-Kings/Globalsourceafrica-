"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteMerchantProduct } from "@/lib/merchant/actions";

export function DeleteMerchantProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`Delete "${name}"?`)) return;
    setBusy(true);
    const res = await deleteMerchantProduct(id);
    setBusy(false);
    if (!res.ok) return alert(res.error);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      className="inline-flex items-center gap-1 text-sm text-sub hover:text-orangeDark disabled:opacity-50"
      aria-label={`Delete ${name}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
