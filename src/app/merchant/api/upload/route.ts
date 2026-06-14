import { NextResponse } from "next/server";
import { getMerchant } from "@/lib/merchant/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Merchant-gated media upload → 'product-media' bucket. Mirrors the admin upload
// route but authorizes on the merchant session.
export async function POST(request: Request) {
  const merchant = await getMerchant();
  if (!merchant) {
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

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `suppliers/${merchant.supplierId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

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
