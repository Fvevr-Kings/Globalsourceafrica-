import { createSupabaseServerClient } from "./supabase/server";
import type { Product, ProductWithTiers, PriceTier } from "./types";
import { demoProducts, demoSearch } from "./demo";

// Demo mode renders bundled sample data with NO backend. On automatically when
// Supabase env is missing, or forced via NEXT_PUBLIC_DEMO_MODE=true. This keeps
// the storefront viewable before a Supabase project is wired up.
export function isDemoMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// All product reads go through public_products (supplier identity stripped) and
// product_price_tiers. Nothing here can leak a supplier_id or supplier name.

const PRODUCT_COLUMNS =
  "id, slug, name, category, origin_country, origin_flag, blurb, description, base_unit, retail_price_usd, image_urls, in_stock, origin_region, harvest_date, moisture_pct, grade, certifications, quality_report_url, batch_photo_urls, name_i18n, blurb_i18n, description_i18n, created_at";

export async function getAllProducts(): Promise<Product[]> {
  if (isDemoMode()) return demoProducts;
  const db = createSupabaseServerClient();
  const { data, error } = await db
    .from("public_products")
    .select(PRODUCT_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getCategories(): Promise<string[]> {
  const products = await getAllProducts();
  return Array.from(new Set(products.map((p) => p.category))).sort();
}

async function getTiers(productId: string): Promise<PriceTier[]> {
  const db = createSupabaseServerClient();
  const { data, error } = await db
    .from("product_price_tiers")
    .select("id, min_qty, unit_price_usd")
    .eq("product_id", productId)
    .order("min_qty", { ascending: true });
  if (error) throw error;
  return (data ?? []) as PriceTier[];
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithTiers | null> {
  if (isDemoMode()) {
    return demoProducts.find((p) => p.slug === slug) ?? null;
  }
  const db = createSupabaseServerClient();
  const { data, error } = await db
    .from("public_products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const product = data as Product;
  const tiers = await getTiers(product.id);
  return { ...product, tiers };
}

/** Real Postgres full-text search with trigram fallback (build spec §4a). */
export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return getAllProducts();
  if (isDemoMode()) return demoSearch(q);
  const db = createSupabaseServerClient();
  const { data, error } = await db.rpc("search_products", { q });
  if (error) throw error;
  return (data ?? []) as Product[];
}
