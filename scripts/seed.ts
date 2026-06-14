/**
 * Seed script — populates the storefront on a fresh project.
 * Usage: copy .env.example -> .env.local, fill keys, then `npm run seed`.
 * Uses the SERVICE ROLE key (server-only) to bypass RLS for writes.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
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
  { business_name: "Rift Valley Growers", country: "Ethiopia", verified: true },
];

// 8 products across categories, each with retail + at least one bulk tier.
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
    slug: "brown-cowpeas-5kg",
    name: "Brown Cowpeas (Beans)",
    category: "Pulses",
    origin_country: "Nigeria",
    origin_flag: "🇳🇬",
    blurb: "Protein-rich brown cowpeas, hand-sorted and stone-free.",
    description:
      "Traditional brown beans, cleaned and graded. Holds shape when cooked; perfect for moimoi, akara, and stews.",
    base_unit: "5kg",
    retail_price_usd: 16.0,
    image_urls: [],
    origin_region: "Kano State",
    harvest_date: "2025-10-18",
    moisture_pct: 11.0,
    grade: "Grade 1",
    certifications: [],
    quality_report_url: null,
    batch_photo_urls: [],
    synonyms: ["beans", "cowpea", "black-eyed peas", "ewa"],
    tiers: [{ min_qty: 10, unit_price_usd: 14.25 }],
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
  {
    slug: "dried-hibiscus-zobo-1kg",
    name: "Dried Hibiscus (Zobo) Flowers",
    category: "Spices",
    origin_country: "Nigeria",
    origin_flag: "🇳🇬",
    blurb: "Deep-red dried hibiscus calyces for tea and drinks.",
    description:
      "Sun-dried roselle calyces with vivid colour and tartness. For zobo, hibiscus tea, syrups, and natural colouring.",
    base_unit: "1kg",
    retail_price_usd: 9.5,
    image_urls: [],
    origin_region: "Kebbi State",
    harvest_date: "2025-11-20",
    moisture_pct: 8.0,
    grade: "Grade A",
    certifications: ["organic"],
    quality_report_url: null,
    batch_photo_urls: [],
    synonyms: ["zobo", "roselle", "hibiscus", "sorrel", "flor de jamaica"],
    tiers: [{ min_qty: 20, unit_price_usd: 7.9 }],
  },
  {
    slug: "raw-cocoa-beans-10kg",
    name: "Fermented Raw Cocoa Beans",
    category: "Cocoa",
    origin_country: "Ghana",
    origin_flag: "🇬🇭",
    blurb: "Well-fermented Ghanaian cocoa beans, rich aroma.",
    description:
      "Fully fermented and sun-dried cocoa beans with a balanced flavour profile. Suited to craft chocolate and cocoa butter.",
    base_unit: "10kg",
    retail_price_usd: 65.0,
    image_urls: [],
    origin_region: "Ashanti Region",
    harvest_date: "2025-10-30",
    moisture_pct: 7.0,
    grade: "Grade 1",
    certifications: ["fairtrade"],
    quality_report_url: null,
    batch_photo_urls: [],
    synonyms: ["cacao", "cocoa", "chocolate beans"],
    tiers: [
      { min_qty: 5, unit_price_usd: 60.0 },
      { min_qty: 20, unit_price_usd: 54.0 },
    ],
  },
  {
    slug: "green-arabica-coffee-1kg",
    name: "Green Arabica Coffee Beans",
    category: "Coffee",
    origin_country: "Ethiopia",
    origin_flag: "🇪🇹",
    blurb: "Highland-grown green Arabica, floral and bright.",
    description:
      "Washed Arabica green beans from the Ethiopian highlands. Floral, citrus-forward cup; roast to your preference.",
    base_unit: "1kg",
    retail_price_usd: 18.0,
    image_urls: [],
    origin_region: "Sidama",
    harvest_date: "2025-12-12",
    moisture_pct: 10.5,
    grade: "Grade 2",
    certifications: ["organic", "fairtrade"],
    quality_report_url: null,
    batch_photo_urls: [],
    synonyms: ["coffee", "arabica", "green beans", "buna"],
    tiers: [
      { min_qty: 10, unit_price_usd: 16.0 },
      { min_qty: 30, unit_price_usd: 14.25 },
    ],
  },
  {
    slug: "unrefined-shea-butter-5kg",
    name: "Unrefined Shea Butter",
    category: "Shea",
    origin_country: "Ghana",
    origin_flag: "🇬🇭",
    blurb: "Ivory, hand-processed raw shea butter.",
    description:
      "Cold-processed unrefined shea butter with a natural nutty scent. For cosmetics, soap, and skincare formulation.",
    base_unit: "5kg",
    retail_price_usd: 34.0,
    image_urls: [],
    origin_region: "Northern Region",
    harvest_date: "2025-09-15",
    moisture_pct: 0.2,
    grade: "Grade A",
    certifications: ["organic"],
    quality_report_url: null,
    batch_photo_urls: [],
    synonyms: ["shea", "karite", "shea butter", "ori"],
    tiers: [{ min_qty: 8, unit_price_usd: 30.0 }],
  },
  {
    slug: "raw-sesame-seeds-5kg",
    name: "Raw Sesame Seeds (Beniseed)",
    category: "Grains",
    origin_country: "Nigeria",
    origin_flag: "🇳🇬",
    blurb: "Cleaned white sesame seeds, 99% purity.",
    description:
      "Machine-cleaned white sesame at 99% purity, low FFA. For tahini, oil pressing, baking, and export.",
    base_unit: "5kg",
    retail_price_usd: 21.0,
    image_urls: [],
    origin_region: "Benue State",
    harvest_date: "2025-11-08",
    moisture_pct: 6.0,
    grade: "99% purity",
    certifications: [],
    quality_report_url: null,
    batch_photo_urls: [],
    synonyms: ["sesame", "beniseed", "benne", "til", "sim sim"],
    tiers: [
      { min_qty: 10, unit_price_usd: 19.0 },
      { min_qty: 40, unit_price_usd: 17.0 },
    ],
  },
];

async function main() {
  console.log("Seeding suppliers…");
  // Idempotent without relying on a DB unique constraint: insert only the
  // suppliers that aren't already present (matched by business_name).
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
    const { data: inserted, error: prodErr } = await db
      .from("products")
      .upsert({ ...prod, supplier_id }, { onConflict: "slug" })
      .select()
      .single();
    if (prodErr) throw prodErr;

    // Reset tiers for idempotency, then insert.
    await db.from("product_price_tiers").delete().eq("product_id", inserted.id);
    const tierRows = tiers.map((t) => ({ ...t, product_id: inserted.id }));
    const { error: tierErr } = await db
      .from("product_price_tiers")
      .insert(tierRows);
    if (tierErr) throw tierErr;
  }

  console.log("✅ Seed complete:", products.length, "products,", suppliers.length, "suppliers.");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
