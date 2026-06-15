"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  submitMerchantProduct,
  type MerchantProductInput,
  type MerchantTierInput,
} from "@/lib/merchant/actions";
import { MediaUploader } from "@/components/admin/MediaUploader";

const CATEGORIES = ["Grains", "Pulses", "Nuts", "Spices", "Cocoa", "Coffee", "Shea"];

type Initial = Partial<MerchantProductInput> & { id?: string };

export function MerchantProductForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [f, setF] = useState({
    name: initial?.name ?? "",
    category: initial?.category ?? "Grains",
    origin_country: initial?.origin_country ?? "",
    origin_flag: initial?.origin_flag ?? "",
    blurb: initial?.blurb ?? "",
    description: initial?.description ?? "",
    base_unit: initial?.base_unit ?? "",
    retail_price_usd: initial?.retail_price_usd?.toString() ?? "",
    in_stock: initial?.in_stock ?? true,
    origin_region: initial?.origin_region ?? "",
    harvest_date: initial?.harvest_date ?? "",
    moisture_pct: initial?.moisture_pct?.toString() ?? "",
    grade: initial?.grade ?? "",
    quality_report_url: initial?.quality_report_url ?? "",
    certifications: (initial?.certifications ?? []).join(", "),
    synonyms: (initial?.synonyms ?? []).join(", "),
  });
  const [imageUrls, setImageUrls] = useState<string[]>(initial?.image_urls ?? []);
  const [batchPhotos, setBatchPhotos] = useState<string[]>(initial?.batch_photo_urls ?? []);
  const [tiers, setTiers] = useState<MerchantTierInput[]>(
    (initial?.tiers as MerchantTierInput[]) ?? []
  );

  const set = (k: keyof typeof f, v: string | boolean) =>
    setF((p) => ({ ...p, [k]: v }));
  const toList = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!f.name.trim() || !f.base_unit.trim() || !f.retail_price_usd) {
      return setError("Name, base unit, and retail price are required.");
    }
    setBusy(true);
    const input: MerchantProductInput = {
      id: initial?.id,
      name: f.name.trim(),
      category: f.category,
      origin_country: f.origin_country.trim(),
      origin_flag: f.origin_flag.trim() || null,
      blurb: f.blurb.trim() || null,
      description: f.description.trim() || null,
      base_unit: f.base_unit.trim(),
      retail_price_usd: parseFloat(f.retail_price_usd),
      in_stock: f.in_stock,
      image_urls: imageUrls,
      origin_region: f.origin_region.trim() || null,
      harvest_date: f.harvest_date || null,
      moisture_pct: f.moisture_pct ? parseFloat(f.moisture_pct) : null,
      grade: f.grade.trim() || null,
      certifications: toList(f.certifications),
      quality_report_url: f.quality_report_url.trim() || null,
      batch_photo_urls: batchPhotos,
      synonyms: toList(f.synonyms),
      tiers,
    };
    const res = await submitMerchantProduct(input);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    router.push("/merchant/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <p className="rounded-xl bg-greenSoft px-4 py-3 text-sm text-green">
        Submitting sends this product to Global-Source Africa for review. It goes
        live on the storefront only after an admin approves it.
      </p>

      <Section title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Name *" value={f.name} onChange={(v) => set("name", v)} />
          <label className="block">
            <span className="text-sm font-medium text-ink">Category</span>
            <input list="m-categories" value={f.category} onChange={(e) => set("category", e.target.value)} className={inputCls} />
            <datalist id="m-categories">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <Text label="Origin country" value={f.origin_country} onChange={(v) => set("origin_country", v)} />
          <Text label="Origin flag (emoji)" value={f.origin_flag} onChange={(v) => set("origin_flag", v)} />
          <Text label="Base unit (e.g. 5kg) *" value={f.base_unit} onChange={(v) => set("base_unit", v)} />
          <Text label="Retail price (USD) *" value={f.retail_price_usd} onChange={(v) => set("retail_price_usd", v)} type="number" />
        </div>
        <label className="mt-2 flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={f.in_stock} onChange={(e) => set("in_stock", e.target.checked)} />
          In stock
        </label>
        <Text label="Blurb (short)" value={f.blurb} onChange={(v) => set("blurb", v)} />
        <label className="block">
          <span className="text-sm font-medium text-ink">Description</span>
          <textarea value={f.description} onChange={(e) => set("description", e.target.value)} rows={4} className={inputCls} />
        </label>
      </Section>

      <Section title="Images">
        <MediaUploader label="Product images" folder="products" value={imageUrls} onChange={setImageUrls} endpoint="/merchant/api/upload-url" />
      </Section>

      <Section title="Provenance">
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Region" value={f.origin_region} onChange={(v) => set("origin_region", v)} />
          <label className="block">
            <span className="text-sm font-medium text-ink">Harvest date</span>
            <input type="date" value={f.harvest_date} onChange={(e) => set("harvest_date", e.target.value)} className={inputCls} />
          </label>
          <Text label="Moisture %" value={f.moisture_pct} onChange={(v) => set("moisture_pct", v)} type="number" />
          <Text label="Grade" value={f.grade} onChange={(v) => set("grade", v)} />
          <Text label="Certifications (comma-separated)" value={f.certifications} onChange={(v) => set("certifications", v)} />
          <Text label="Quality report URL" value={f.quality_report_url} onChange={(v) => set("quality_report_url", v)} />
        </div>
        <div className="mt-4">
          <MediaUploader label="Batch photos" folder="batches" value={batchPhotos} onChange={setBatchPhotos} endpoint="/merchant/api/upload-url" />
        </div>
      </Section>

      <Section title="Search synonyms">
        <Text label="Synonyms (comma-separated, e.g. groundnut, peanut)" value={f.synonyms} onChange={(v) => set("synonyms", v)} />
      </Section>

      <Section title="Bulk price tiers">
        <p className="text-sm text-sub">Per-unit price once quantity reaches the breakpoint. Optional.</p>
        <div className="mt-3 space-y-2">
          {tiers.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="number" value={t.min_qty || ""} placeholder="Min qty" onChange={(e) => setTiers((arr) => arr.map((x, j) => (j === i ? { ...x, min_qty: parseInt(e.target.value || "0", 10) } : x)))} className="w-32 rounded-lg border border-greenLine px-3 py-2 text-ink focus:border-green focus:outline-none" />
              <input type="number" step="0.01" value={t.unit_price_usd || ""} placeholder="Unit price USD" onChange={(e) => setTiers((arr) => arr.map((x, j) => (j === i ? { ...x, unit_price_usd: parseFloat(e.target.value || "0") } : x)))} className="w-40 rounded-lg border border-greenLine px-3 py-2 text-ink focus:border-green focus:outline-none" />
              <button type="button" onClick={() => setTiers((arr) => arr.filter((_, j) => j !== i))} className="text-sm text-sub hover:text-orangeDark">Remove</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setTiers((arr) => [...arr, { min_qty: 0, unit_price_usd: 0 }])} className="mt-3 rounded-full border border-greenLine bg-white px-4 py-2 text-sm font-medium text-ink hover:border-green">
          + Add tier
        </button>
      </Section>

      {error && <p className="text-sm text-orangeDark">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="rounded-full bg-orange px-6 py-3 font-semibold text-white hover:bg-orangeDark disabled:opacity-50">
          {busy ? "Submitting…" : initial?.id ? "Resubmit for approval" : "Submit for approval"}
        </button>
        <button type="button" onClick={() => router.push("/merchant/products")} className="rounded-full border border-greenLine bg-white px-6 py-3 font-medium text-ink hover:border-green">
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "mt-1 w-full rounded-lg border border-greenLine bg-white px-4 py-2.5 text-ink focus:border-green focus:outline-none";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-greenLine bg-white p-5">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Text({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input type={type} step={type === "number" ? "0.01" : undefined} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </label>
  );
}
