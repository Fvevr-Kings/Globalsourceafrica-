import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Admin reads use the service role (full access incl. supplier identity). These
// are only ever called from inside the staff-gated /admin panel layout.

export type AdminProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  origin_country: string;
  retail_price_usd: number;
  base_unit: string;
  in_stock: boolean;
  approval_status: string;
  rejection_reason: string | null;
  supplier_id: string | null;
  supplier_name: string | null;
};

const ADMIN_PRODUCT_SELECT =
  "id, slug, name, category, origin_country, retail_price_usd, base_unit, in_stock, approval_status, rejection_reason, supplier_id, suppliers(business_name)";

function mapAdminProduct(p: any): AdminProductRow {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    origin_country: p.origin_country,
    retail_price_usd: p.retail_price_usd,
    base_unit: p.base_unit,
    in_stock: p.in_stock,
    approval_status: p.approval_status,
    rejection_reason: p.rejection_reason,
    supplier_id: p.supplier_id,
    supplier_name: p.suppliers?.business_name ?? null,
  };
}

export async function listAdminProducts(): Promise<AdminProductRow[]> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapAdminProduct);
}

export async function listPendingProducts(): Promise<AdminProductRow[]> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .eq("approval_status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapAdminProduct);
}

export async function getAdminProduct(id: string) {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("id", id)
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

export async function listSuppliers() {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("suppliers")
    .select("id, business_name, country, verified")
    .order("business_name");
  if (error) throw error;
  return data ?? [];
}

export async function listAdminOrders() {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("orders")
    .select("id, status, subtotal_usd, shipping_name, created_at, buyers(contact)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((o: any) => ({
    id: o.id,
    status: o.status,
    subtotal_usd: o.subtotal_usd,
    shipping_name: o.shipping_name,
    created_at: o.created_at,
    buyer_contact: o.buyers?.contact ?? null,
  }));
}

export async function getAdminOrder(id: string) {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("orders")
    .select(
      "id, status, currency, subtotal_usd, shipping_name, shipping_address, created_at, buyers(contact)"
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { data: items } = await db
    .from("order_items")
    .select("id, product_name, qty, unit_price_usd, line_total_usd")
    .eq("order_id", id);
  return { ...data, items: items ?? [] };
}

export async function listApplications() {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("supplier_applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listBanners() {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("banners")
    .select("id, media_url, media_type, headline, subtitle, link_url, cta_label, sort, active, created_at")
    .order("sort", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function listQuotes() {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getQuote(id: string) {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("quote_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Resilient so the dashboard never 500s if migration 0005 isn't applied yet.
export async function getNewQuoteCount(): Promise<number> {
  try {
    const db = createSupabaseAdminClient();
    const { count } = await db
      .from("quote_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getDashboardCounts() {
  const db = createSupabaseAdminClient();
  const [products, outOfStock, orders, pendingApps, suppliers, pendingProducts] =
    await Promise.all([
      db.from("products").select("id", { count: "exact", head: true }),
      db
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("in_stock", false),
      db.from("orders").select("status"),
      db
        .from("supplier_applications")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      db.from("suppliers").select("id", { count: "exact", head: true }),
      db
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("approval_status", "pending"),
    ]);

  const ordersByStatus: Record<string, number> = {};
  for (const o of orders.data ?? []) {
    ordersByStatus[o.status] = (ordersByStatus[o.status] ?? 0) + 1;
  }

  return {
    products: products.count ?? 0,
    outOfStock: outOfStock.count ?? 0,
    orders: (orders.data ?? []).length,
    ordersByStatus,
    pendingApplications: pendingApps.count ?? 0,
    suppliers: suppliers.count ?? 0,
    pendingProducts: pendingProducts.count ?? 0,
  };
}
