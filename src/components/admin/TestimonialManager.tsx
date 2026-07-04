"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Check, X, Trash2, Plus } from "lucide-react";
import {
  saveTestimonial,
  setTestimonialStatus,
  deleteTestimonial,
} from "@/lib/admin/actions";

type Row = {
  id: string;
  customer_name: string;
  location: string | null;
  rating: number;
  comment: string;
  avatar_url: string | null;
  approval_status: string;
  source: string;
  sort: number;
  created_at: string;
};

const badge: Record<string, string> = {
  approved: "bg-greenSoft text-green",
  pending: "bg-orange/10 text-orangeDark",
  rejected: "bg-gray-100 text-gray-500",
};

export function TestimonialManager({ testimonials }: { testimonials: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ customer_name: "", location: "", rating: 5, comment: "", avatar_url: "" });

  async function act(fn: () => Promise<{ ok: boolean; error?: string }>, key: string) {
    setBusy(key);
    const res = await fn();
    setBusy(null);
    if (!res.ok) return alert(res.error);
    router.refresh();
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy("add");
    const res = await saveTestimonial({
      customer_name: form.customer_name.trim(),
      location: form.location.trim() || null,
      rating: form.rating,
      comment: form.comment.trim(),
      avatar_url: form.avatar_url.trim() || null,
      approval_status: "approved",
    });
    setBusy(null);
    if (!res.ok) return alert(res.error);
    setForm({ customer_name: "", location: "", rating: 5, comment: "", avatar_url: "" });
    setAdding(false);
    router.refresh();
  }

  const inputCls =
    "mt-1 w-full rounded-lg border border-greenLine bg-white px-3 py-2 text-sm text-ink focus:border-green focus:outline-none";

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setAdding((a) => !a)}
          className="inline-flex items-center gap-1 rounded-full bg-green px-4 py-2 text-sm font-semibold text-white hover:bg-green/90"
        >
          <Plus className="h-4 w-4" /> Add testimonial
        </button>
      </div>

      {adding && (
        <form onSubmit={add} className="mt-4 space-y-3 rounded-2xl border border-greenLine bg-white p-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} type="button" onClick={() => setForm((p) => ({ ...p, rating: i }))} className="text-green" aria-label={`${i} stars`}>
                <Star className="h-6 w-6" fill={i <= form.rating ? "currentColor" : "none"} strokeWidth={1.5} />
              </button>
            ))}
          </div>
          <textarea value={form.comment} onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))} rows={3} required placeholder="Review text" className={inputCls} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.customer_name} onChange={(e) => setForm((p) => ({ ...p, customer_name: e.target.value }))} required placeholder="Customer name" className={inputCls} />
            <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location (optional)" className={inputCls} />
          </div>
          <input value={form.avatar_url} onChange={(e) => setForm((p) => ({ ...p, avatar_url: e.target.value }))} placeholder="Photo URL (optional) — leave blank to use initials" className={inputCls} />
          <button type="submit" disabled={busy === "add"} className="rounded-full bg-orange px-5 py-2 text-sm font-semibold text-white hover:bg-orangeDark disabled:opacity-50">
            {busy === "add" ? "Saving…" : "Save (approved)"}
          </button>
        </form>
      )}

      {testimonials.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-greenLine bg-white p-10 text-center text-sub">
          No testimonials yet.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {testimonials.map((t) => (
            <li key={t.id} className="rounded-2xl border border-greenLine bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-0.5 text-green">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4" fill={i <= t.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                    ))}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${badge[t.approval_status] ?? ""}`}>
                    {t.approval_status}
                  </span>
                  <span className="text-xs text-sub">· {t.source}</span>
                </div>
                <div className="flex items-center gap-1">
                  {t.approval_status !== "approved" && (
                    <button type="button" disabled={busy === t.id} onClick={() => act(() => setTestimonialStatus(t.id, "approved"), t.id)} title="Approve" className="rounded-lg p-2 text-green hover:bg-greenSoft">
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {t.approval_status !== "rejected" && (
                    <button type="button" disabled={busy === t.id} onClick={() => act(() => setTestimonialStatus(t.id, "rejected"), t.id)} title="Reject / hide" className="rounded-lg p-2 text-sub hover:bg-greenSoft">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button type="button" disabled={busy === t.id} onClick={() => { if (confirm("Delete this testimonial?")) act(() => deleteTestimonial(t.id), t.id); }} title="Delete" className="rounded-lg p-2 text-orangeDark hover:bg-orange/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm italic text-ink">&ldquo;{t.comment}&rdquo;</p>
              <p className="mt-1 text-xs text-sub">
                {t.customer_name}
                {t.location ? ` · ${t.location}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
