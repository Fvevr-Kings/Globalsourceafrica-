import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// All reads are scoped to the caller's supplierId (resolved from the session in
// the merchant panel layout). A merchant can never see another supplier's data.

export async function listMerchantProducts(supplierId: string) {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("products")
    .select(
      "id, slug, name, category, retail_price_usd, base_unit, in_stock, approval_status, rejection_reason, created_at"
    )
    .eq("supplier_id", supplierId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getMerchantProduct(supplierId: string, id: string) {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("supplier_id", supplierId) // ownership guard
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { data: tiers } = await db
    .from("product_price_tiers")
    .select("id, min_qty, unit_price_usd")
    .eq("product_id", id)
    .order("min_qty", { ascending: true });
  return { ...data, tiers: tiers ?? [] };
}

export async function getMerchantCounts(supplierId: string) {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("products")
    .select("approval_status, in_stock")
    .eq("supplier_id", supplierId);
  if (error) throw error;
  const rows = data ?? [];
  const byStatus: Record<string, number> = {};
  let outOfStock = 0;
  for (const r of rows) {
    byStatus[r.approval_status] = (byStatus[r.approval_status] ?? 0) + 1;
    if (!r.in_stock) outOfStock += 1;
  }
  return { total: rows.length, byStatus, outOfStock };
}
