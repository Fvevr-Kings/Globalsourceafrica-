import { NextResponse } from "next/server";
import { getMerchant } from "@/lib/merchant/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Merchant-gated signed upload URL (direct-to-Storage, bypasses Vercel's
// request-body limit). Files are namespaced under the merchant's supplier id.
export async function POST(request: Request) {
  const merchant = await getMerchant();
  if (!merchant) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  const { ext = "bin" } = await request.json().catch(() => ({}));
  const safeExt = String(ext).replace(/[^a-z0-9]/gi, "").slice(0, 5) || "bin";
  const path = `suppliers/${merchant.supplierId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${safeExt}`;

  const db = createSupabaseAdminClient();
  const { data, error } = await db.storage
    .from("product-media")
    .createSignedUploadUrl(path);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ path: data.path, token: data.token });
}
