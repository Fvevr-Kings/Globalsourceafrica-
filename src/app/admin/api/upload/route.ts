import { NextResponse } from "next/server";
import { getStaff } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Staff-gated media upload → Supabase Storage 'product-media' bucket (public
// read). Returns the public URL to store in image_urls / batch_photo_urls /
// the banner. Service role bypasses storage RLS.
export async function POST(request: Request) {
  const staff = await getStaff();
  if (!staff) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Max 10MB" }, { status: 400 });
  }

  const folder = (form.get("folder") as string) || "products";
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const db = createSupabaseAdminClient();
  const { error } = await db.storage
    .from("product-media")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = db.storage.from("product-media").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
