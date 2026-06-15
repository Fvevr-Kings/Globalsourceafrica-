import { NextResponse } from "next/server";
import { getStaff } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Staff-gated: returns a short-lived signed upload URL so the browser can upload
// large files (GIF/video) DIRECTLY to Supabase Storage, bypassing Vercel's
// ~4.5MB serverless request-body limit. No file passes through this route.
export async function POST(request: Request) {
  const staff = await getStaff();
  if (!staff) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  const { folder = "products", ext = "bin" } = await request.json().catch(() => ({}));
  const safeExt = String(ext).replace(/[^a-z0-9]/gi, "").slice(0, 5) || "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

  const db = createSupabaseAdminClient();
  const { data, error } = await db.storage
    .from("product-media")
    .createSignedUploadUrl(path);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ path: data.path, token: data.token });
}
