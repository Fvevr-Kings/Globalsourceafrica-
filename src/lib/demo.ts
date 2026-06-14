import type { ProductWithTiers } from "./types";

// Demo dataset — lets the storefront render WITHOUT a live Supabase project, so
// the look and flow can be visualized immediately. Used automatically when
// Supabase env is absent, or when NEXT_PUBLIC_DEMO_MODE=true. Mirrors the seed
// data in scripts/seed.ts. Images use picsum (swap for real photos later).
function img(slug: string) {
  return [`https://picsum.photos/seed/${slug}/800/600`];
}

function make(
  p: Partial<ProductWithTiers> &
    Pick<
      ProductWithTiers,
      | "slug"
      | "name"
      | "category"
      | "origin_country"
      | "origin_flag"
      | "base_unit"
      | "retail_price_usd"
    >
): ProductWithTiers {
  return {
    id: p.slug,
    blurb: null,
    description: null,
    image_urls: img(p.slug),
    in_stock: true,
    origin_region: null,
    harvest_date: null,
    moisture_pct: null,
    grade: null,
    certifications: [],
    quality_report_url: null,
    batch_photo_urls: [],
    name_i18n: {},
    blurb_i18n: {},
    description_i18n: {},
    created_at: new Date().toISOString(),
    tiers: [],
    ...p,
  };
}

export const demoProducts: ProductWithTiers[] = [
  make({
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
    origin_region: "Ondo State",
    harvest_date: "2025-11-02",
    moisture_pct: 12.5,
    grade: "Grade 1",
    certifications: ["non-gmo"],
    tiers: [
      { id: "t1", min_qty: 10, unit_price_usd: 11.0 },
      { id: "t2", min_qty: 50, unit_price_usd: 9.75 },
    ],
  }),
  make({
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
    origin_region: "Kano State",
    harvest_date: "2025-10-18",
    moisture_pct: 11.0,
    grade: "Grade 1",
    tiers: [{ id: "t3", min_qty: 10, unit_price_usd: 14.25 }],
  }),
  make({
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
    origin_region: "Bono Region",
    harvest_date: "2025-12-05",
    moisture_pct: 5.0,
    grade: "W320",
    certifications: ["organic"],
    tiers: [
      { id: "t4", min_qty: 10, unit_price_usd: 25.5 },
      { id: "t5", min_qty: 40, unit_price_usd: 23.0 },
    ],
  }),
  make({
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
    origin_region: "Kebbi State",
    harvest_date: "2025-11-20",
    moisture_pct: 8.0,
    grade: "Grade A",
    certifications: ["organic"],
    tiers: [{ id: "t6", min_qty: 20, unit_price_usd: 7.9 }],
  }),
  make({
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
    origin_region: "Ashanti Region",
    harvest_date: "2025-10-30",
    moisture_pct: 7.0,
    grade: "Grade 1",
    certifications: ["fairtrade"],
    tiers: [
      { id: "t7", min_qty: 5, unit_price_usd: 60.0 },
      { id: "t8", min_qty: 20, unit_price_usd: 54.0 },
    ],
  }),
  make({
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
    origin_region: "Sidama",
    harvest_date: "2025-12-12",
    moisture_pct: 10.5,
    grade: "Grade 2",
    certifications: ["organic", "fairtrade"],
    tiers: [
      { id: "t9", min_qty: 10, unit_price_usd: 16.0 },
      { id: "t10", min_qty: 30, unit_price_usd: 14.25 },
    ],
  }),
  make({
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
    origin_region: "Northern Region",
    harvest_date: "2025-09-15",
    moisture_pct: 0.2,
    grade: "Grade A",
    certifications: ["organic"],
    tiers: [{ id: "t11", min_qty: 8, unit_price_usd: 30.0 }],
  }),
  make({
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
    origin_region: "Benue State",
    harvest_date: "2025-11-08",
    moisture_pct: 6.0,
    grade: "99% purity",
    tiers: [
      { id: "t12", min_qty: 10, unit_price_usd: 19.0 },
      { id: "t13", min_qty: 40, unit_price_usd: 17.0 },
    ],
  }),
];

// Synonyms so demo search behaves like the real FTS (groundnut→peanut, etc).
const demoSynonyms: Record<string, string[]> = {
  "premium-white-maize-5kg": ["corn", "maize", "white corn"],
  "brown-cowpeas-5kg": ["beans", "cowpea", "black-eyed peas", "ewa"],
  "raw-cashew-nuts-w320-2kg": ["cashew", "cashewnut", "kaju", "groundnut", "peanut"],
  "dried-hibiscus-zobo-1kg": ["zobo", "roselle", "hibiscus", "sorrel"],
  "raw-cocoa-beans-10kg": ["cacao", "cocoa", "chocolate beans"],
  "green-arabica-coffee-1kg": ["coffee", "arabica", "green beans", "buna"],
  "unrefined-shea-butter-5kg": ["shea", "karite", "shea butter", "ori"],
  "raw-sesame-seeds-5kg": ["sesame", "beniseed", "benne", "til", "sim sim"],
};

export function demoSearch(query: string): ProductWithTiers[] {
  const q = query.trim().toLowerCase();
  if (!q) return demoProducts;
  return demoProducts.filter((p) => {
    const hay = [
      p.name,
      p.category,
      p.origin_country,
      p.origin_region ?? "",
      p.blurb ?? "",
      ...(demoSynonyms[p.slug] ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).some((term) => hay.includes(term));
  });
}
