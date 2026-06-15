"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitQuoteRequest } from "@/lib/quotes";

export function QuoteRequestForm({
  initialProductId,
  initialProductName,
  initialType = "quote",
}: {
  initialProductId?: string | null;
  initialProductName?: string | null;
  initialType?: "quote" | "sourcing";
}) {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"quote" | "sourcing">(initialType);

  const [f, setF] = useState({
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    company: "",
    country: "",
    product_name: initialProductName ?? "",
    quantity: "",
    destination: "",
    target_price_usd: "",
    message: "",
  });
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await submitQuoteRequest({
      request_type: type,
      contact_name: f.contact_name.trim(),
      contact_email: f.contact_email.trim() || null,
      contact_phone: f.contact_phone.trim() || null,
      company: f.company.trim() || null,
      country: f.country.trim() || null,
      // A listed-product quote keeps the link; sourcing is free-text only.
      product_id: type === "quote" ? initialProductId ?? null : null,
      product_name: f.product_name.trim() || null,
      quantity: f.quantity.trim() || null,
      target_price_usd: f.target_price_usd ? parseFloat(f.target_price_usd) : null,
      destination: f.destination.trim() || null,
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
          Request received
        </h2>
        <p className="mt-2 text-sub">
          Thanks — our team will review your request and get back to you with a
          quote, usually within one business day.
        </p>
      </div>
    );
  }

  const inputCls =
    "mt-1 w-full rounded-lg border border-greenLine bg-white px-4 py-2.5 text-ink focus:border-green focus:outline-none";

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Mode toggle */}
      <div className="flex flex-wrap gap-2">
        <Toggle active={type === "quote"} onClick={() => setType("quote")} label="Get a quote" hint="On a listed product" />
        <Toggle active={type === "sourcing"} onClick={() => setType("sourcing")} label="Source a product" hint="Something not listed yet" />
      </div>

      <section className="rounded-2xl border border-greenLine bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-ink">
          {type === "quote" ? "What you'd like to buy" : "What you'd like us to source"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-ink">
              {type === "quote" ? "Product *" : "Product / commodity you need *"}
            </span>
            <input value={f.product_name} onChange={(e) => set("product_name", e.target.value)} className={inputCls} required placeholder={type === "sourcing" ? "e.g. Dried ginger, Grade A" : ""} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Quantity / volume</span>
            <input value={f.quantity} onChange={(e) => set("quantity", e.target.value)} className={inputCls} placeholder="e.g. 20 tonnes, 100 x 5kg" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Target price (USD, optional)</span>
            <input type="number" step="0.01" value={f.target_price_usd} onChange={(e) => set("target_price_usd", e.target.value)} className={inputCls} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-ink">Delivery destination</span>
            <input value={f.destination} onChange={(e) => set("destination", e.target.value)} className={inputCls} placeholder="City, country / port" />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-ink">Details</span>
            <textarea value={f.message} onChange={(e) => set("message", e.target.value)} rows={4} className={inputCls} placeholder="Specs, packaging, certifications, timelines…" />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-greenLine bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Your details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-ink">Full name *</span>
            <input value={f.contact_name} onChange={(e) => set("contact_name", e.target.value)} className={inputCls} required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Company (optional)</span>
            <input value={f.company} onChange={(e) => set("company", e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Email</span>
            <input type="email" value={f.contact_email} onChange={(e) => set("contact_email", e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Phone</span>
            <input value={f.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} className={inputCls} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-ink">Country</span>
            <input value={f.country} onChange={(e) => set("country", e.target.value)} className={inputCls} />
          </label>
        </div>
        <p className="mt-2 text-xs text-sub">Provide at least an email or phone so we can reach you.</p>
      </section>

      {error && <p className="text-sm text-orangeDark">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-orange px-6 py-3 font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
      >
        {busy ? "Sending…" : "Submit request"}
      </button>
    </form>
  );
}

function Toggle({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "rounded-xl border border-green bg-greenSoft px-4 py-3 text-left"
          : "rounded-xl border border-greenLine bg-white px-4 py-3 text-left hover:border-green"
      }
    >
      <span className="block text-sm font-semibold text-ink">{label}</span>
      <span className="block text-xs text-sub">{hint}</span>
    </button>
  );
}
