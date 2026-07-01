"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePost, type PostInput } from "@/lib/admin/actions";
import { MediaUploader } from "./MediaUploader";

type Initial = Partial<PostInput> & { id?: string };

const inputCls =
  "mt-1 w-full rounded-lg border border-greenLine bg-white px-4 py-2.5 text-ink focus:border-green focus:outline-none";

export function PostForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [kind, setKind] = useState(initial?.kind ?? "news");
  const [eventDate, setEventDate] = useState(initial?.event_date ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [images, setImages] = useState<string[]>(initial?.image_urls ?? []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError("Title is required.");
    setBusy(true);
    const input: PostInput = {
      id: initial?.id,
      title: title.trim(),
      body: body.trim() || null,
      image_urls: images,
      kind,
      event_date: eventDate || null,
      published,
    };
    const res = await savePost(input);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="rounded-2xl border border-greenLine bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-ink">Title *</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Type</span>
            <select value={kind} onChange={(e) => setKind(e.target.value)} className={inputCls}>
              <option value="news">News</option>
              <option value="event">Event</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Event date (optional)</span>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={inputCls}
            />
          </label>
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-ink">Body</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Tell the story — a shipment delivered, an event attended, a milestone reached…"
            className={inputCls}
          />
        </label>
        <label className="mt-4 flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Published (visible on the About page)
        </label>
      </section>

      <section className="rounded-2xl border border-greenLine bg-white p-5">
        <MediaUploader label="Photos" folder="posts" value={images} onChange={setImages} />
      </section>

      {error && <p className="text-sm text-orangeDark">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-orange px-6 py-3 font-semibold text-white hover:bg-orangeDark disabled:opacity-50"
        >
          {busy ? "Saving…" : initial?.id ? "Save changes" : "Publish post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="rounded-full border border-greenLine bg-white px-6 py-3 font-medium text-ink hover:border-green"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
