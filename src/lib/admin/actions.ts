"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStaff } from "./auth";

// Every mutating action re-verifies staff server-side — never trust that only
// the admin UI can reach these.
async function assertStaff() {
  const staff = await getStaff();
  if (!staff) throw new Error("Not authorized");
  return staff;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export type TierInput = { min_qty: number; unit_price_usd: number };
export type ProductInput = {
  id?: string;
  supplier_id: string | null;
  slug?: string;
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
  tiers: TierInput[];
};

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function saveProduct(input: ProductInput): Promise<ActionResult> {
  try {
    await assertStaff();
    const db = createSupabaseAdminClient();

    const { tiers, id, ...rest } = input;
    const slug = input.slug?.trim() || `${slugify(input.name)}-${Date.now().toString(36).slice(-4)}`;

    const row = { ...rest, slug };

    let productId = id;
    if (id) {
      const { error } = await db.from("products").update(row).eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { data, error } = await db
        .from("products")
        .insert(row)
        .select("id")
        .single();
      if (error) return { ok: false, error: error.message };
      productId = data.id;
    }

    // Replace tiers (simple + idempotent).
    await db.from("product_price_tiers").delete().eq("product_id", productId!);
    const validTiers = tiers.filter((t) => t.min_qty > 0 && t.unit_price_usd > 0);
    if (validTiers.length) {
      const { error } = await db
        .from("product_price_tiers")
        .insert(validTiers.map((t) => ({ ...t, product_id: productId! })));
      if (error) return { ok: false, error: error.message };
    }

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { ok: true, id: productId! };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to save product" };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    await assertStaff();
    const db = createSupabaseAdminClient();
    const { error } = await db.from("products").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { ok: true, id };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to delete" };
  }
}

const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "shipped",
  "delivered",
  "refunded",
];

export async function updateOrderStatus(
  id: string,
  status: string
): Promise<ActionResult> {
  try {
    await assertStaff();
    if (!ORDER_STATUSES.includes(status)) {
      return { ok: false, error: "Invalid status" };
    }
    const db = createSupabaseAdminClient();
    const { error } = await db.from("orders").update({ status }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin/orders");
    return { ok: true, id };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to update order" };
  }
}

// ---- Merchant applications -------------------------------------------------

export type ApplicationInput = {
  business_name: string;
  country: string;
  contact_email: string | null;
  contact_phone: string | null;
  categories: string[];
  message: string | null;
};

// PUBLIC — submitted from /become-a-supplier. No staff check; writes via the
// service role so the table stays locked to anon otherwise.
export async function submitApplication(
  input: ApplicationInput
): Promise<ActionResult> {
  try {
    if (!input.business_name?.trim() || !input.country?.trim()) {
      return { ok: false, error: "Business name and country are required." };
    }
    if (!input.contact_email && !input.contact_phone) {
      return { ok: false, error: "Provide an email or phone so we can reach you." };
    }
    const db = createSupabaseAdminClient();
    const { data, error } = await db
      .from("supplier_applications")
      .insert({ ...input, status: "pending" })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/merchants");
    return { ok: true, id: data.id };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to submit application" };
  }
}

export async function approveApplication(id: string): Promise<ActionResult> {
  try {
    await assertStaff();
    const db = createSupabaseAdminClient();
    const { data: app, error: appErr } = await db
      .from("supplier_applications")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (appErr || !app) return { ok: false, error: "Application not found" };
    if (app.status === "approved") return { ok: true, id };

    // Create the verified supplier behind the brand. `contact` becomes their
    // merchant-portal login identity (prefer email, fall back to phone).
    const contact = app.contact_email || app.contact_phone || null;
    const { data: supplier, error: supErr } = await db
      .from("suppliers")
      .insert({
        business_name: app.business_name,
        country: app.country,
        verified: true,
        contact: contact ? String(contact).toLowerCase() : null,
      })
      .select("id")
      .single();
    if (supErr) return { ok: false, error: supErr.message };

    const { error: updErr } = await db
      .from("supplier_applications")
      .update({
        status: "approved",
        supplier_id: supplier.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (updErr) return { ok: false, error: updErr.message };

    revalidatePath("/admin/merchants");
    return { ok: true, id };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to approve" };
  }
}

export async function rejectApplication(id: string): Promise<ActionResult> {
  try {
    await assertStaff();
    const db = createSupabaseAdminClient();
    const { error } = await db
      .from("supplier_applications")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/merchants");
    return { ok: true, id };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to reject" };
  }
}

// ---- Quote requests --------------------------------------------------------

const QUOTE_STATUSES = ["new", "reviewing", "quoted", "closed"];

export async function updateQuoteStatus(
  id: string,
  status: string
): Promise<ActionResult> {
  try {
    await assertStaff();
    if (!QUOTE_STATUSES.includes(status)) {
      return { ok: false, error: "Invalid status" };
    }
    const db = createSupabaseAdminClient();
    const { error } = await db
      .from("quote_requests")
      .update({ status })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/quotes");
    revalidatePath(`/admin/quotes/${id}`);
    return { ok: true, id };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to update quote" };
  }
}

// ---- Merchant product approval ---------------------------------------------

export async function approveProduct(id: string): Promise<ActionResult> {
  try {
    await assertStaff();
    const db = createSupabaseAdminClient();
    const { error } = await db
      .from("products")
      .update({ approval_status: "approved", rejection_reason: null })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { ok: true, id };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to approve product" };
  }
}

export async function rejectProduct(
  id: string,
  reason: string
): Promise<ActionResult> {
  try {
    await assertStaff();
    const db = createSupabaseAdminClient();
    const { error } = await db
      .from("products")
      .update({ approval_status: "rejected", rejection_reason: reason || null })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { ok: true, id };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to reject product" };
  }
}

// ---- Billboard banners -----------------------------------------------------

export type BannerInput = {
  id?: string;
  media_url: string;
  media_type: "image" | "video";
  headline: string | null;
  subtitle: string | null;
  link_url: string | null;
  cta_label: string | null;
  sort: number;
  active: boolean;
};

export async function saveBanner(input: BannerInput): Promise<ActionResult> {
  try {
    await assertStaff();
    if (!input.media_url) return { ok: false, error: "Upload a banner image or video first." };
    const db = createSupabaseAdminClient();
    const { id, ...row } = input;
    let bannerId = id;
    if (id) {
      const { error } = await db.from("banners").update(row).eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { data, error } = await db.from("banners").insert(row).select("id").single();
      if (error) return { ok: false, error: error.message };
      bannerId = data.id;
    }
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { ok: true, id: bannerId! };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to save banner" };
  }
}

export async function toggleBanner(id: string, active: boolean): Promise<ActionResult> {
  try {
    await assertStaff();
    const db = createSupabaseAdminClient();
    const { error } = await db.from("banners").update({ active }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { ok: true, id };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to update banner" };
  }
}

export async function deleteBanner(id: string): Promise<ActionResult> {
  try {
    await assertStaff();
    const db = createSupabaseAdminClient();
    const { error } = await db.from("banners").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { ok: true, id };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to delete banner" };
  }
}
