// Shared domain types. The storefront ONLY ever sees buyer-safe product fields
// (no supplier_id / supplier identity — that is stripped by the public_products view).

export type PriceTier = {
  id: string;
  min_qty: number;
  unit_price_usd: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  origin_country: string;
  origin_flag: string | null;
  blurb: string | null;
  description: string | null;
  base_unit: string;
  retail_price_usd: number;
  image_urls: string[];
  in_stock: boolean;

  // Provenance (trust-by-evidence)
  origin_region: string | null;
  harvest_date: string | null;
  moisture_pct: number | null;
  grade: string | null;
  certifications: string[];
  quality_report_url: string | null;
  batch_photo_urls: string[];

  // i18n overrides (base columns populated in Phase 1)
  name_i18n: Record<string, string>;
  blurb_i18n: Record<string, string>;
  description_i18n: Record<string, string>;

  created_at: string;
};

export type ProductWithTiers = Product & { tiers: PriceTier[] };

// Cart lives client-side only until an order is placed.
export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  baseUnit: string;
  retailPriceUsd: number;
  imageUrl: string | null;
  originFlag: string | null;
  tiers: PriceTier[];
  qty: number;
};

export type Order = {
  id: string;
  status: string;
  currency: string;
  subtotal_usd: number;
  shipping_name: string | null;
  shipping_address: Record<string, unknown> | null;
  created_at: string;
  tracking_note?: string | null;
  status_updated_at?: string | null;
};

export type Testimonial = {
  id: string;
  customer_name: string;
  location: string | null;
  rating: number;
  comment: string;
  avatar_url?: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  product_name: string;
  qty: number;
  unit_price_usd: number;
  line_total_usd: number;
};
