/**
 * Seeds a few approved testimonials so the footer slideshow has content.
 * Run AFTER applying migration 0010 (creates the testimonials table).
 *   npx tsx scripts/seed-testimonials.ts
 * Idempotent-ish: skips inserting a row whose exact comment already exists.
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

const testimonials = [
  {
    customer_name: "Amara Okeke",
    location: "Lagos, Nigeria",
    rating: 5,
    comment:
      "Our cocoa order arrived exactly as described — clean, well-fermented, and on time. Dealing with one trusted business instead of chasing suppliers made everything simple.",
  },
  {
    customer_name: "David Mensah",
    location: "Accra, Ghana",
    rating: 5,
    comment:
      "The shea butter quality was outstanding and consistent across two shipments. GlobalSource handled the paperwork and logistics end to end.",
  },
  {
    customer_name: "Sarah Whitfield",
    location: "London, United Kingdom",
    rating: 4,
    comment:
      "Great communication and genuinely verified provenance. The bulk pricing tiers made scaling our orders straightforward.",
  },
  {
    customer_name: "Kwame Adjei",
    location: "Kumasi, Ghana",
    rating: 5,
    comment:
      "Raw cashew nuts were premium grade with very low breakage. I could track my order the whole way — no guessing.",
  },
  {
    customer_name: "Fatima Bello",
    location: "Abuja, Nigeria",
    rating: 5,
    comment:
      "I requested a quote for hibiscus and had a clear, fair offer the next business day. Professional from start to finish.",
  },
];

async function main() {
  const { data: existing, error: readErr } = await db
    .from("testimonials")
    .select("comment");
  if (readErr) {
    console.error(
      "Could not read testimonials — has migration 0010 been applied? Error:",
      readErr.message
    );
    process.exit(1);
  }
  const have = new Set((existing ?? []).map((t: any) => t.comment));
  const rows = testimonials
    .filter((t) => !have.has(t.comment))
    .map((t, i) => ({ ...t, approval_status: "approved", source: "admin", sort: i }));

  if (!rows.length) {
    console.log("All seed testimonials already present. Nothing to insert.");
    return;
  }
  const { error } = await db.from("testimonials").insert(rows);
  if (error) throw error;
  console.log(`✅ Inserted ${rows.length} approved testimonial(s).`);
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
