"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { approveApplication, rejectApplication } from "@/lib/admin/actions";

export function ApplicationActions({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run(action: "approve" | "reject") {
    if (action === "reject" && !confirm("Reject this application?")) return;
    setBusy(true);
    const res =
      action === "approve"
        ? await approveApplication(id)
        : await rejectApplication(id);
    setBusy(false);
    if (!res.ok) {
      alert(res.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => run("approve")}
        className="inline-flex items-center gap-1 rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
      >
        <Check className="h-4 w-4" /> Approve
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => run("reject")}
        className="inline-flex items-center gap-1 rounded-full border border-greenLine bg-white px-4 py-2 text-sm font-medium text-ink hover:border-orange disabled:opacity-50"
      >
        <X className="h-4 w-4" /> Reject
      </button>
    </div>
  );
}
