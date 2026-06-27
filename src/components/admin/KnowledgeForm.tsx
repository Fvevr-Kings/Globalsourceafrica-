"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";
import { updateChatbotKnowledge } from "@/lib/admin/actions";

export function KnowledgeForm({ initial }: { initial: string }) {
  const [content, setContent] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    setSaved(false);
    const res = await updateChatbotKnowledge(content);
    setBusy(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setSaved(false);
        }}
        rows={18}
        placeholder={`Add anything the assistant should know, e.g.\n\n- We ship worldwide; typical lead time is 2–4 weeks.\n- Minimum order for export is 1 tonne.\n- We accept bank transfer and card; large orders are invoiced.\n- Cocoa is sourced from Ghana and is fully fermented.\n- Returns: contact us within 7 days of delivery.`}
        className="w-full rounded-xl border border-greenLine bg-white p-4 text-sm leading-relaxed text-ink focus:border-green focus:outline-none"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {busy ? "Saving…" : saved ? "Saved" : "Save knowledge"}
        </button>
        {error && <span className="text-sm text-orangeDark">{error}</span>}
      </div>
    </div>
  );
}
