"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2, Pencil } from "lucide-react";
import {
  saveBanner,
  toggleBanner,
  deleteBanner,
  type BannerInput,
} from "@/lib/admin/actions";

type Banner = BannerInput & { id: string; created_at?: string };

const empty: BannerInput = {
  media_url: "",
  media_type: "image",
  headline: "",
  subtitle: "",
  link_url: "",
  cta_label: "",
  sort: 0,
  active: true,
};

export function BannerManager({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [form, setForm] = useState<BannerInput>(empty);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editing = !!form.id;
  const set = (k: keyof BannerInput, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function upload(file: File) {
    setError(null);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "banners");
    try {
      const res = await fetch("/admin/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setForm((p) => ({
        ...p,
        media_url: data.url,
        media_type: file.type.startsWith("video") ? "video" : "image",
      }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setError(null);
    setBusy(true);
    const res = await saveBanner({
      ...form,
      headline: form.headline || null,
      subtitle: form.subtitle || null,
      link_url: form.link_url || null,
      cta_label: form.cta_label || null,
    });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setForm(empty);
    router.refresh();
  }

  const inputCls =
    "mt-1 w-full rounded-lg border border-greenLine bg-white px-3 py-2 text-ink focus:border-green focus:outline-none";

  return (
    <div className="space-y-8">
      {/* Editor */}
      <section className="rounded-2xl border border-greenLine bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-ink">
          {editing ? "Edit banner" : "Add a billboard banner"}
        </h2>
        <p className="mt-1 text-sm text-sub">
          Upload an animated GIF or a short looping video (MP4/WebM) to make the
          hero feel alive. Add a link to run it as an ad. Multiple active banners
          rotate automatically.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
          {/* Media + preview */}
          <div>
            <div className="relative flex aspect-[16/6] items-center justify-center overflow-hidden rounded-xl border border-dashed border-greenLine bg-greenSoft">
              {form.media_url ? (
                form.media_type === "video" ? (
                  <video src={form.media_url} className="h-full w-full object-cover" autoPlay muted loop playsInline />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.media_url} alt="" className="h-full w-full object-cover" />
                )
              ) : (
                <span className="text-xs text-sub">No media yet</span>
              )}
            </div>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-greenLine bg-white px-4 py-2 text-sm font-medium text-ink hover:border-green">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading…" : "Upload GIF / image / video"}
              <input
                type="file"
                accept="image/*,video/mp4,video/webm"
                className="hidden"
                disabled={uploading}
                onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
              />
            </label>
          </div>

          {/* Fields */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-ink">Headline (optional)</span>
              <input value={form.headline ?? ""} onChange={(e) => set("headline", e.target.value)} className={inputCls} />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-ink">Subtitle (optional)</span>
              <input value={form.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Link URL (ad click-through)</span>
              <input value={form.link_url ?? ""} onChange={(e) => set("link_url", e.target.value)} placeholder="https://…" className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Button label (optional)</span>
              <input value={form.cta_label ?? ""} onChange={(e) => set("cta_label", e.target.value)} placeholder="Shop now" className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Sort order</span>
              <input type="number" value={form.sort} onChange={(e) => set("sort", parseInt(e.target.value || "0", 10))} className={inputCls} />
            </label>
            <label className="mt-6 flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
              Active (shown on the homepage)
            </label>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-orangeDark">{error}</p>}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={save}
            disabled={busy || !form.media_url}
            className="rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
          >
            {busy ? "Saving…" : editing ? "Save banner" : "Add banner"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => setForm(empty)}
              className="rounded-full border border-greenLine bg-white px-6 py-2.5 text-sm font-medium text-ink hover:border-green"
            >
              Cancel
            </button>
          )}
        </div>
      </section>

      {/* Existing banners */}
      <section>
        <h2 className="font-display text-lg font-semibold text-ink">
          Banners ({banners.length})
        </h2>
        <div className="mt-3 space-y-3">
          {banners.length === 0 && (
            <p className="rounded-2xl border border-greenLine bg-white p-5 text-sm text-sub">
              No banners yet — the homepage shows the built-in animated graphic
              until you add one.
            </p>
          )}
          {banners.map((b) => (
            <div key={b.id} className="flex items-center gap-4 rounded-2xl border border-greenLine bg-white p-3">
              <div className="relative h-16 w-40 shrink-0 overflow-hidden rounded-lg bg-greenSoft">
                {b.media_type === "video" ? (
                  <video src={b.media_url} className="h-full w-full object-cover" muted loop playsInline />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.media_url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">
                  {b.headline || <span className="text-sub">(no headline)</span>}
                </p>
                <p className="text-xs text-sub">
                  {b.media_type} · sort {b.sort} {b.link_url ? "· linked" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await toggleBanner(b.id, !b.active);
                  router.refresh();
                }}
                className={
                  b.active
                    ? "rounded-full bg-green px-3 py-1.5 text-xs font-medium text-white"
                    : "rounded-full border border-greenLine px-3 py-1.5 text-xs text-sub"
                }
              >
                {b.active ? "Active" : "Hidden"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({
                    id: b.id,
                    media_url: b.media_url,
                    media_type: b.media_type,
                    headline: b.headline ?? "",
                    subtitle: b.subtitle ?? "",
                    link_url: b.link_url ?? "",
                    cta_label: b.cta_label ?? "",
                    sort: b.sort,
                    active: b.active,
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-sub hover:text-green"
                aria-label="Edit banner"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!confirm("Delete this banner?")) return;
                  await deleteBanner(b.id);
                  router.refresh();
                }}
                className="text-sub hover:text-orangeDark"
                aria-label="Delete banner"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
