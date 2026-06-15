"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET = "product-media";

/**
 * Uploads a file DIRECTLY from the browser to Supabase Storage, bypassing our
 * serverless function (Vercel caps request bodies at ~4.5MB, which GIFs/videos
 * exceed). Flow:
 *   1. ask the staff/merchant-gated route for a short-lived signed upload URL
 *      (tiny JSON request — no file, no size limit),
 *   2. upload the file straight to Supabase via that signed URL,
 *   3. return the public URL.
 */
export async function uploadFileDirect(
  file: File,
  folder: string,
  signUrlEndpoint: string
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";

  // 1. Authorize + get a signed upload URL from our server.
  const res = await fetch(signUrlEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, ext }),
  });
  if (!res.ok) {
    let msg = "Could not start upload";
    try {
      const data = await res.json();
      msg = data.error ?? msg;
    } catch {
      /* non-JSON error */
    }
    throw new Error(msg);
  }
  const { path, token } = (await res.json()) as { path: string; token: string };

  // 2. Upload the file directly to Supabase Storage (no Vercel size limit).
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .uploadToSignedUrl(path, token, file, { contentType: file.type });
  if (error) throw new Error(error.message);

  // 3. Public URL to store on the product/banner.
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
