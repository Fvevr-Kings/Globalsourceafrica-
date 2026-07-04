"use client";

import { useState } from "react";
import { CheckCircle2, Star } from "lucide-react";
import { submitTestimonial } from "@/lib/admin/actions";

export function TestimonialForm() {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState(0);

  const [f, setF] = useState({
    customer_name: "",
    location: "",
    rating: 5,
    comment: "",
  });
  const set = (k: keyof typeof f, v: string | number) =>
    setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await submitTestimonial({
      customer_name: f.customer_name.trim(),
      location: f.location.trim() || null,
      rating: f.rating,
      comment: f.comment.trim(),
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
          Thank you!
        </h2>
        <p className="mt-2 text-sub">
          Your review has been received. Once our team approves it, it&apos;ll
          appear in the testimonials on our site.
        </p>
      </div>
    );
  }

  const inputCls =
    "mt-1 w-full rounded-lg border border-greenLine bg-white px-4 py-2.5 text-ink focus:border-green focus:outline-none";

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-greenLine bg-white p-6">
      <div>
        <span className="text-sm font-medium text-ink">How satisfied were you? *</span>
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i} star${i > 1 ? "s" : ""}`}
              onClick={() => set("rating", i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              className="text-green"
            >
              <Star
                className="h-8 w-8"
                fill={i <= (hover || f.rating) ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-ink">Your review *</span>
        <textarea
          value={f.comment}
          onChange={(e) => set("comment", e.target.value)}
          rows={4}
          required
          className={inputCls}
          placeholder="Tell us about the products, quality, and your experience buying from GlobalSource Africa…"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">Your name *</span>
          <input
            value={f.customer_name}
            onChange={(e) => set("customer_name", e.target.value)}
            required
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Location (optional)</span>
          <input
            value={f.location}
            onChange={(e) => set("location", e.target.value)}
            className={inputCls}
            placeholder="e.g. Lagos, Nigeria"
          />
        </label>
      </div>

      {error && <p className="text-sm text-orangeDark">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-orange px-6 py-3 font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
      >
        {busy ? "Sending…" : "Submit review"}
      </button>
    </form>
  );
}
