"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { uploadFileDirect } from "@/lib/upload-client";

// Uploads files to the staff-gated /admin/api/upload route and tracks the
// resulting public URLs. Used for product images and batch photos.
export function MediaUploader({
  label,
  folder,
  value,
  onChange,
  max = 8,
  endpoint = "/admin/api/upload-url",
}: {
  label: string;
  folder: string;
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  endpoint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setBusy(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files).slice(0, max - value.length)) {
      try {
        const url = await uploadFileDirect(file, folder, endpoint);
        uploaded.push(url);
      } catch (e: any) {
        setError(e.message ?? "Upload failed");
      }
    }
    setBusy(false);
    if (uploaded.length) onChange([...value, ...uploaded]);
  }

  return (
    <div>
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="mt-2 flex flex-wrap gap-3">
        {value.map((url) => (
          <div
            key={url}
            className="relative h-20 w-20 overflow-hidden rounded-lg border border-greenLine bg-greenSoft"
          >
            <Image src={url} alt="" fill sizes="80px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-white/90 text-ink hover:bg-white"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {value.length < max && (
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-greenLine text-xs text-sub hover:border-green">
            <Upload className="h-4 w-4" />
            {busy ? "…" : "Upload"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={busy}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-orangeDark">{error}</p>}
    </div>
  );
}
