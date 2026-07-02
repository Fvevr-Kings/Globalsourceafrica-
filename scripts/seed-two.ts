/**
 * Minimal seed — inserts just 2 products (+ their suppliers & bulk tiers).
 * Usage: ensure .env / .env.local point at the target project, then:
 *   npx tsx scripts/seed-two.ts
 * Uses the SERVICE ROLE key (server-only) to bypass RLS for writes.
 * Idempotent: suppliers matched by business_name, products upserted on slug.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env(.local)"
  );
  process.exit(1);
}

const db = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type TierSeed = { min_qty: number; unit_price_usd: number };
type ProductSeed = {
  slug: string;
  name: string;
  category: string;
  origin_country: string;
  origin_flag: string;
  blurb: string;
  description: string;
  base_unit: string;
  retail_price_usd: number;
  image_urls: string[];
  origin_region: string;
  harvest_date: string;
  moisture_pct: number;
  grade: string;
  certifications: string[];
  quality_report_url: string | null;
  batch_photo_urls: string[];
  synonyms: string[];
  tiers: TierSeed[];
};

const suppliers = [
  { business_name: "Ondo Highlands Cooperative", country: "Nigeria", verified: true },
  { business_name: "Ashanti Gold Farms", country: "Ghana", verified: true },
];

const products: ProductSeed[] = [
  {
    slug: "premium-white-maize-5kg",
    name: "Premium White Maize",
    category: "Grains",
    origin_country: "Nigeria",
    origin_flag: "🇳🇬",
    blurb: "Clean, sun-dried white maize from the Ondo highlands.",
    description:
      "Carefully sorted and sun-dried to a low moisture content for long shelf life. Ideal for milling, pap, and animal feed.",
    base_unit: "5kg",
    retail_price_usd: 12.5,
    image_urls: [],
    origin_region: "Ondo State",
    harvest_date: "2025-11-02",
    moisture_pct: 12.5,
    grade: "Grade 1",
    certifications: ["non-gmo"],
    quality_report_url: null,
    batch_photo_urls: [],
    synonyms: ["corn", "maize", "white corn"],
    tiers: [
      { min_qty: 10, unit_price_usd: 11.0 },
      { min_qty: 50, unit_price_usd: 9.75 },
    ],
  },
  {
    slug: "raw-cashew-nuts-w320-2kg",
    name: "Raw Cashew Nuts W320",
    category: "Nuts",
    origin_country: "Ghana",
    origin_flag: "🇬🇭",
    blurb: "Grade W320 raw cashew kernels, evenly sized and creamy.",
    description:
      "Premium W320 grade kernels with low breakage. Vacuum-friendly and ready for roasting or retail packing.",
    base_unit: "2kg",
    retail_price_usd: 28.0,
    image_urls: [],
    origin_region: "Bono Region",
    harvest_date: "2025-12-05",
    moisture_pct: 5.0,
    grade: "W320",
    certifications: ["organic"],
    quality_report_url: null,
    batch_photo_urls: [],
    synonyms: ["cashew", "cashewnut", "kaju"],
    tiers: [
      { min_qty: 10, unit_price_usd: 25.5 },
      { min_qty: 40, unit_price_usd: 23.0 },
    ],
  },
];

async function main() {
  console.log("Seeding suppliers…");
  const { data: existing, error: existErr } = await db
    .from("suppliers")
    .select("id, business_name, country");
  if (existErr) throw existErr;

  const existingNames = new Set((existing ?? []).map((s) => s.business_name));
  const toInsert = suppliers.filter((s) => !existingNames.has(s.business_name));
  let inserted: { id: string; business_name: string; country: string }[] = [];
  if (toInsert.length) {
    const { data, error: supErr } = await db
      .from("suppliers")
      .insert(toInsert)
      .select();
    if (supErr) throw supErr;
    inserted = data ?? [];
  }
  const supplierRows = [...(existing ?? []), ...inserted];

  const byCountry = new Map<string, string>();
  for (const s of supplierRows) byCountry.set(s.country, s.id);

  for (const p of products) {
    const { tiers, ...prod } = p;
    const supplier_id =
      byCountry.get(prod.origin_country) ?? supplierRows[0].id;

    console.log(`Seeding product: ${prod.name}`);
    const { data: insertedProd, error: prodErr } = await db
      .from("products")
      .upsert({ ...prod, supplier_id }, { onConflict: "slug" })
      .select()
      .single();
    if (prodErr) throw prodErr;

    await db.from("product_price_tiers").delete().eq("product_id", insertedProd.id);
    const tierRows = tiers.map((t) => ({ ...t, product_id: insertedProd.id }));
    const { error: tierErr } = await db
      .from("product_price_tiers")
      .insert(tierRows);
    if (tierErr) throw tierErr;
  }

  console.log("✅ Seed complete:", products.length, "products,", supplierRows.length, "suppliers total.");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
