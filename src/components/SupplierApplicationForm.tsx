"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitApplication } from "@/lib/admin/actions";

const CATEGORIES = ["Grains", "Pulses", "Nuts", "Spices", "Cocoa", "Coffee", "Shea"];

export function SupplierApplicationForm() {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState({
    business_name: "",
    country: "",
    contact_email: "",
    contact_phone: "",
    message: "",
  });
  const [categories, setCategories] = useState<string[]>([]);

  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  function toggleCat(c: string) {
    setCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await submitApplication({
      business_name: f.business_name.trim(),
      country: f.country.trim(),
      contact_email: f.contact_email.trim() || null,
      contact_phone: f.contact_phone.trim() || null,
      categories,
      message: f.message.trim() || null,
    });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-greenLine bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-green" />
        <h2 className="mt-3 font-display text-xl font-semibold text-ink">
          Application received
        </h2>
        <p className="mt-2 text-sub">
          Thank you. Our team will review your details and reach out. Approved
          suppliers are onboarded behind the GlobalSource Africa brand.
        </p>
      </div>
    );
  }

  const inputCls =
    "mt-1 w-full rounded-lg border border-greenLine bg-white px-4 py-2.5 text-ink focus:border-green focus:outline-none";

  return (
    <form onSubmit={submit} className="rounded-2xl border border-greenLine bg-white p-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">Business name *</span>
          <input value={f.business_name} onChange={(e) => set("business_name", e.target.value)} className={inputCls} required />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Country *</span>
          <input value={f.country} onChange={(e) => set("country", e.target.value)} className={inputCls} required />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Email</span>
          <input type="email" value={f.contact_email} onChange={(e) => set("contact_email", e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Phone</span>
          <input value={f.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} className={inputCls} />
        </label>
      </div>

      <div>
        <span className="text-sm font-medium text-ink">What do you supply?</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const on = categories.includes(c);
            return (
              <button
                type="button"
                key={c}
                onClick={() => toggleCat(c)}
                aria-pressed={on}
                className={
                  on
                    ? "rounded-full bg-green px-3 py-1.5 text-sm font-medium text-white"
                    : "rounded-full border border-greenLine bg-white px-3 py-1.5 text-sm text-ink hover:border-green"
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-ink">Tell us about your products</span>
        <textarea value={f.message} onChange={(e) => set("message", e.target.value)} rows={4} className={inputCls} />
      </label>

      {error && <p className="text-sm text-orangeDark">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-orange px-6 py-3 font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
      >
        {busy ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
