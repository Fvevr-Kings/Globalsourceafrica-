"use client";

import { useState } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { captureLead } from "@/lib/v2/leads";

// Email gate for the sample report PDF. Captures the lead, then reveals the
// download. (Drop the branded PDF at /public/sample-report.pdf; until then the
// link 404s gracefully and the lead is still captured.)
export function LeadGate() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await captureLead({ email, source: "sample_report" });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-cleared/40 bg-cleared/5 p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-cleared" />
        <p className="mt-2 font-semibold text-navy">You&apos;re in.</p>
        <a
          href="/sample-report.pdf"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-container px-6 py-3 font-semibold text-white hover:bg-container/90"
        >
          <Download className="h-4 w-4" /> Download the PDF
        </a>
        <p className="mt-3 text-xs text-steel">A copy is on its way to your inbox too.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-steel/20 bg-white p-6">
      <p className="gsa-heading text-lg font-bold text-navy">Get the full report as a PDF</p>
      <p className="mt-1 text-sm text-steel">Enter your email to download the complete redacted sample.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 rounded-lg border border-steel/25 bg-white px-4 py-2.5 text-navy focus:border-container focus:outline-none"
        />
        <button type="submit" disabled={busy} className="rounded-full bg-container px-6 py-2.5 font-semibold text-white hover:bg-container/90 disabled:opacity-50">
          {busy ? "…" : "Get the PDF"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-container">{error}</p>}
    </form>
  );
}
