"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getMerchant } from "./auth";

// Every action re-verifies the merchant and scopes writes to THEIR supplier.
async function assertMerchant() {
  const merchant = await getMerchant();
  if (!merchant) throw new Error("Not authorized");
  return merchant;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export type MerchantTierInput = { min_qty: number; unit_price_usd: number };
export type MerchantProductInput = {
  id?: string;
  name: string;
  category: string;
  origin_country: string;
  origin_flag: string | null;
  blurb: string | null;
  description: string | null;
  base_unit: string;
  retail_price_usd: number;
  in_stock: boolean;
  image_urls: string[];
  origin_region: string | null;
  harvest_date: string | null;
  moisture_pct: number | null;
  grade: string | null;
  certifications: string[];
  quality_report_url: string | null;
  batch_photo_urls: string[];
  synonyms: string[];
  tiers: MerchantTierInput[];
};

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/**
 * Create/update a product owned by the merchant. Submitting always sets
 * approval_status='pending' — it won't appear on the storefront until an admin
 * approves it. supplier_id is forced to the caller's own supplier.
 */
export async function submitMerchantProduct(
  input: MerchantProductInput
): Promise<ActionResult> {
  try {
    const merchant = await assertMerchant();
    const db = createSupabaseAdminClient();
    const { tiers, id, ...rest } = input;

    // Ownership guard on edit: the product must already belong to this supplier.
    if (id) {
      const { data: owned } = await db
        .from("products")
        .select("id")
        .eq("id", id)
        .eq("supplier_id", merchant.supplierId)
        .maybeSingle();
      if (!owned) return { ok: false, error: "Product not found." };
    }

    const slug = `${slugify(input.name)}-${Date.now().toString(36).slice(-4)}`;
    const row = {
      ...rest,
      supplier_id: merchant.supplierId,
      approval_status: "pending", // re-submission re-enters the queue
      rejection_reason: null,
    };

    let productId = id;
    if (id) {
      const { error } = await db.from("products").update(row).eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { data, error } = await db
        .from("products")
        .insert({ ...row, slug })
        .select("id")
        .single();
      if (error) return { ok: false, error: error.message };
      productId = data.id;
    }

    await db.from("product_price_tiers").delete().eq("product_id", productId!);
    const valid = tiers.filter((t) => t.min_qty > 0 && t.unit_price_usd > 0);
    if (valid.length) {
      const { error } = await db
        .from("product_price_tiers")
        .insert(valid.map((t) => ({ ...t, product_id: productId! })));
      if (error) return { ok: false, error: error.message };
    }

    revalidatePath("/merchant/products");
    revalidatePath("/admin/products");
    return { ok: true, id: productId! };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to save product" };
  }
}

export async function deleteMerchantProduct(id: string): Promise<ActionResult> {
  try {
    const merchant = await assertMerchant();
    const db = createSupabaseAdminClient();
    const { error } = await db
      .from("products")
      .delete()
      .eq("id", id)
      .eq("supplier_id", merchant.supplierId); // can only delete own
    if (error) return { ok: false, error: error.message };
    revalidatePath("/merchant/products");
    return { ok: true, id };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to delete" };
  }
}
