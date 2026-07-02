/**
 * Catalog seed — inserts the 16 session products (+ suppliers & bulk tiers).
 * Usage: ensure .env / .env.local point at the target project, then:
 *   npx tsx scripts/seed-catalog.ts
 *
 * Uses the SERVICE ROLE key (server-only) to bypass RLS for writes.
 * Idempotent: suppliers matched by business_name, products upserted on slug,
 * tiers reset per product. Prices/units are PLACEHOLDERS — adjust in Admin.
 * Image slugs match folders under scripts/images/<slug>/ for upload-images.ts.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env(.local)");
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
  section: string;
  origin_country: string;
  origin_flag: string;
  blurb: string;
  description: string;
  base_unit: string;
  retail_price_usd: number;
  origin_region: string;
  moisture_pct: number | null;
  grade: string;
  certifications: string[];
  synonyms: string[];
  tiers: TierSeed[];
};

const suppliers = [
  { business_name: "Ondo Highlands Cooperative", country: "Nigeria", verified: true },
  { business_name: "Ashanti Gold Farms", country: "Ghana", verified: true },
  { business_name: "Rift Valley Growers", country: "Ethiopia", verified: true },
];

const NG = { origin_country: "Nigeria", origin_flag: "🇳🇬" };
const GH = { origin_country: "Ghana", origin_flag: "🇬🇭" };

const products: ProductSeed[] = [
  {
    slug: "white-long-grain-rice", name: "White Long-Grain Rice", category: "Grains", section: "farm", ...NG,
    blurb: "Premium polished long-grain white rice, sorted and export-ready.",
    description: "Long, uniform grains with high milling quality and low moisture content. Thoroughly sorted to eliminate impurities — ideal for wholesalers and distributors.",
    base_unit: "25kg", retail_price_usd: 32.0, origin_region: "Kebbi State", moisture_pct: 13.0,
    grade: "Grade 1", certifications: [], synonyms: ["rice", "white rice", "long grain", "polished rice"],
    tiers: [{ min_qty: 10, unit_price_usd: 29.0 }, { min_qty: 40, unit_price_usd: 26.0 }],
  },
  {
    slug: "brown-speckled-beans", name: "Brown Speckled Beans", category: "Pulses", section: "farm", ...NG,
    blurb: "High-fiber brown speckled beans (pinto), sorted with minimal splits.",
    description: "Distinct natural speckled pattern, high protein and fiber content, excellent sorting with minimal split beans. Whole pulses for global export.",
    base_unit: "25kg", retail_price_usd: 40.0, origin_region: "Kano State", moisture_pct: 12.0,
    grade: "Grade 1", certifications: [], synonyms: ["beans", "pinto", "speckled beans", "brown beans", "pulses"],
    tiers: [{ min_qty: 10, unit_price_usd: 37.0 }, { min_qty: 40, unit_price_usd: 34.0 }],
  },
  {
    slug: "raw-cashew-nuts-w320-2kg", name: "Raw Cashew Nuts", category: "Nuts", section: "farm", ...GH,
    blurb: "Premium large-size raw cashew kernels, evenly sized and creamy.",
    description: "Large-grade unprocessed cashews with excellent moisture retention for processing. Rich, creamy potential and strict quality controls.",
    base_unit: "2kg", retail_price_usd: 28.0, origin_region: "Bono Region", moisture_pct: 5.0,
    grade: "W320", certifications: ["organic"], synonyms: ["cashew", "cashewnut", "kaju", "cashew kernels"],
    tiers: [{ min_qty: 10, unit_price_usd: 25.5 }, { min_qty: 40, unit_price_usd: 23.0 }],
  },
  {
    slug: "dried-red-chili-peppers", name: "Dried Whole Red Chili Peppers", category: "Spices", section: "farm", ...NG,
    blurb: "Vivid-red dried whole chilies with a uniform high-heat profile.",
    description: "Intact stems, deep red colour retention, well-dried to prevent mold, and spice-quality sorted. Uniform heat profile for spice companies.",
    base_unit: "5kg", retail_price_usd: 22.0, origin_region: "Kaduna State", moisture_pct: 10.0,
    grade: "Grade A", certifications: [], synonyms: ["chili", "chilli", "pepper", "dried pepper", "hot pepper", "cayenne"],
    tiers: [{ min_qty: 10, unit_price_usd: 19.5 }, { min_qty: 40, unit_price_usd: 17.0 }],
  },
  {
    slug: "raw-cocoa-beans", name: "Raw Cocoa Beans", category: "Cocoa", section: "farm", ...GH,
    blurb: "Naturally fermented and sun-dried high-grade cocoa beans.",
    description: "Deep chocolate aroma, optimal bean count per 100g, low defect rate, properly fermented and thoroughly sun-dried. For chocolate manufacturers.",
    base_unit: "10kg", retail_price_usd: 65.0, origin_region: "Ashanti Region", moisture_pct: 7.0,
    grade: "Grade 1", certifications: ["fairtrade"], synonyms: ["cacao", "cocoa", "chocolate beans"],
    tiers: [{ min_qty: 5, unit_price_usd: 60.0 }, { min_qty: 20, unit_price_usd: 54.0 }],
  },
  {
    slug: "raw-shea-nuts", name: "Raw Shea Nuts", category: "Shea", section: "farm", ...GH,
    blurb: "Wild-harvested raw shea kernels with high oil yield.",
    description: "High free-fatty-acid quality control, rich kernel oil content, thoroughly dried and strictly sorted. For cosmetics processors and wholesalers.",
    base_unit: "25kg", retail_price_usd: 30.0, origin_region: "Northern Region", moisture_pct: 7.0,
    grade: "Grade A", certifications: ["organic"], synonyms: ["shea", "shea nuts", "karite", "shea kernels", "ori"],
    tiers: [{ min_qty: 10, unit_price_usd: 27.0 }, { min_qty: 40, unit_price_usd: 24.0 }],
  },
  {
    slug: "dried-tiger-nuts", name: "Dried Tiger Nuts", category: "Nuts", section: "farm", ...NG,
    blurb: "Naturally sweet, high-fiber dried tiger nuts (chufa).",
    description: "Wrinkled authentic texture, sweet earthy flavour, nutrient-dense and allergen-free. Expertly cleaned of grit. For snacks and plant-milk manufacturers.",
    base_unit: "10kg", retail_price_usd: 28.0, origin_region: "Kano State", moisture_pct: 9.0,
    grade: "Grade A", certifications: [], synonyms: ["tiger nuts", "chufa", "aya", "tigernut"],
    tiers: [{ min_qty: 10, unit_price_usd: 25.0 }, { min_qty: 40, unit_price_usd: 22.0 }],
  },
  {
    slug: "white-egusi-seeds", name: "White Egusi Melon Seeds", category: "Seeds", section: "farm", ...NG,
    blurb: "Premium shelled white egusi seeds, high protein and oil.",
    description: "Uniform creamy-white colour, whole unbroken kernels, high natural oil and protein content, machine-sorted for purity. For food and culinary distributors.",
    base_unit: "5kg", retail_price_usd: 34.0, origin_region: "Benue State", moisture_pct: 8.0,
    grade: "Grade 1", certifications: [], synonyms: ["egusi", "melon seeds", "egusi seeds", "white egusi"],
    tiers: [{ min_qty: 10, unit_price_usd: 31.0 }, { min_qty: 40, unit_price_usd: 28.0 }],
  },
  {
    slug: "bambara-groundnuts", name: "Bambara Groundnuts", category: "Pulses", section: "farm", ...NG,
    blurb: "Nutrient-rich indigenous Bambara groundnuts, drought-resilient.",
    description: "Multi-coloured earthy varieties (red, brown, cream) with an exceptionally high protein and amino-acid profile. Well-sorted pods for health-food distributors.",
    base_unit: "10kg", retail_price_usd: 26.0, origin_region: "Bauchi State", moisture_pct: 11.0,
    grade: "Grade 1", certifications: [], synonyms: ["bambara", "bambara nuts", "okpa", "bambara beans", "groundnut"],
    tiers: [{ min_qty: 10, unit_price_usd: 23.0 }, { min_qty: 40, unit_price_usd: 20.0 }],
  },
  {
    slug: "raw-unshelled-peanuts", name: "Raw Unshelled Peanuts", category: "Nuts", section: "farm", ...NG,
    blurb: "Groundnuts in whole pods, sun-dried with rigid intact shells.",
    description: "Rigid intact shells, minimal blank pods, rich seed-oil potential, thoroughly sun-dried to maintain kernel safety. For snack processors and wholesalers.",
    base_unit: "25kg", retail_price_usd: 30.0, origin_region: "Kano State", moisture_pct: 8.0,
    grade: "Grade 1", certifications: [], synonyms: ["peanuts", "groundnuts", "unshelled peanuts", "monkey nuts"],
    tiers: [{ min_qty: 10, unit_price_usd: 27.0 }, { min_qty: 40, unit_price_usd: 24.0 }],
  },
  {
    slug: "dried-hibiscus-flowers", name: "Dried Deep-Red Hibiscus Flowers", category: "Spices", section: "farm", ...NG,
    blurb: "Premium deep-crimson hibiscus calyces (zobo / sorrel).",
    description: "Intact deep-crimson calyces with a sharp tart flavour profile, high water-soluble extract yield, free from dark/burnt petals. For beverage and tea blenders.",
    base_unit: "5kg", retail_price_usd: 24.0, origin_region: "Kebbi State", moisture_pct: 8.0,
    grade: "Grade A", certifications: ["organic"], synonyms: ["zobo", "roselle", "hibiscus", "sorrel", "flor de jamaica"],
    tiers: [{ min_qty: 10, unit_price_usd: 21.0 }, { min_qty: 40, unit_price_usd: 18.0 }],
  },
  {
    slug: "baobab-fruit-powder", name: "Organic Baobab Fruit Powder", category: "Powders", section: "farm", ...GH,
    blurb: "Nutrient-dense soluble baobab fruit pulp powder, pale beige.",
    description: "Naturally dehydrated inside the fruit, fine soluble texture with minimal clumping, rich in Vitamin C and fiber. For supplement and health-food brands.",
    base_unit: "5kg", retail_price_usd: 45.0, origin_region: "Northern Region", moisture_pct: 6.0,
    grade: "Superfood grade", certifications: ["organic"], synonyms: ["baobab", "baobab powder", "fruit powder", "superfood"],
    tiers: [{ min_qty: 5, unit_price_usd: 41.0 }, { min_qty: 20, unit_price_usd: 37.0 }],
  },
  {
    slug: "kola-nuts", name: "Fresh Reddish-Brown Kola Nuts", category: "Nuts", section: "farm", ...NG,
    blurb: "Traditional caffeine-rich kola nuts, plump split lobes.",
    description: "Bold reddish-brown colour, plump split lobes, high natural caffeine and theobromine content, packed to preserve freshness. For cultural and beverage buyers.",
    base_unit: "5kg", retail_price_usd: 28.0, origin_region: "Osun State", moisture_pct: null,
    grade: "Grade A", certifications: [], synonyms: ["kola", "kola nuts", "cola", "goro", "obi"],
    tiers: [{ min_qty: 10, unit_price_usd: 25.0 }, { min_qty: 40, unit_price_usd: 22.0 }],
  },
  {
    slug: "moringa-leaf-powder", name: "Pure Moringa Leaf Powder", category: "Powders", section: "farm", ...GH,
    blurb: "Superfood-grade vivid green moringa leaf powder.",
    description: "Exceptionally fine milling, vibrant chlorophyll-rich green, low-temperature dried to retain maximum vitamins, 100% pure leaf content. For supplement brands.",
    base_unit: "5kg", retail_price_usd: 40.0, origin_region: "Volta Region", moisture_pct: 6.0,
    grade: "Superfood grade", certifications: ["organic"], synonyms: ["moringa", "moringa powder", "drumstick tree", "superfood"],
    tiers: [{ min_qty: 5, unit_price_usd: 36.0 }, { min_qty: 20, unit_price_usd: 32.0 }],
  },
  {
    slug: "golden-millet-grains", name: "Golden Millet Grains", category: "Grains", section: "farm", ...NG,
    blurb: "Premium gluten-free ancient grain, brilliant golden hue.",
    description: "Tiny uniform spherical grains, thoroughly hulled and polished, high nutritional density. Gluten-free ancient grain for cereal brands and distributors.",
    base_unit: "25kg", retail_price_usd: 28.0, origin_region: "Sokoto State", moisture_pct: 12.0,
    grade: "Grade 1", certifications: [], synonyms: ["millet", "gero", "pearl millet", "ancient grain"],
    tiers: [{ min_qty: 10, unit_price_usd: 25.0 }, { min_qty: 40, unit_price_usd: 22.0 }],
  },
  {
    slug: "dried-tamarind-pods", name: "Dried Tamarind Pods", category: "Spices", section: "farm", ...GH,
    blurb: "Sweet-and-sour tamarind pods, cured for shelf-stable shipping.",
    description: "Brittle dark-brown outer shells, thick sticky interior pulp, long intact pod structures, properly cured. For spice companies and paste manufacturers.",
    base_unit: "10kg", retail_price_usd: 30.0, origin_region: "Upper East Region", moisture_pct: 12.0,
    grade: "Grade A", certifications: [], synonyms: ["tamarind", "tsamiya", "tamarind pods", "imli"],
    tiers: [{ min_qty: 10, unit_price_usd: 27.0 }, { min_qty: 40, unit_price_usd: 24.0 }],
  },
];

async function main() {
  console.log("Seeding suppliers…");
  const { data: existing, error: existErr } = await db
    .from("suppliers").select("id, business_name, country");
  if (existErr) throw existErr;

  const existingNames = new Set((existing ?? []).map((s) => s.business_name));
  const toInsert = suppliers.filter((s) => !existingNames.has(s.business_name));
  let inserted: { id: string; business_name: string; country: string }[] = [];
  if (toInsert.length) {
    const { data, error: supErr } = await db.from("suppliers").insert(toInsert).select();
    if (supErr) throw supErr;
    inserted = data ?? [];
  }
  const supplierRows = [...(existing ?? []), ...inserted];
  const byCountry = new Map<string, string>();
  for (const s of supplierRows) byCountry.set(s.country, s.id);

  for (const p of products) {
    const { tiers, ...prod } = p;
    const supplier_id = byCountry.get(prod.origin_country) ?? supplierRows[0].id;

    console.log(`Seeding product: ${prod.name}`);
    const { data: insertedProd, error: prodErr } = await db
      .from("products")
      .upsert({ ...prod, supplier_id }, { onConflict: "slug" })
      .select().single();
    if (prodErr) throw prodErr;

    await db.from("product_price_tiers").delete().eq("product_id", insertedProd.id);
    const tierRows = tiers.map((t) => ({ ...t, product_id: insertedProd.id }));
    const { error: tierErr } = await db.from("product_price_tiers").insert(tierRows);
    if (tierErr) throw tierErr;
  }

  console.log("✅ Catalog seed complete:", products.length, "products.");
}

main().catch((e) => { console.error("Seed failed:", e); process.exit(1); });
