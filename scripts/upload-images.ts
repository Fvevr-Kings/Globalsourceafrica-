/**
 * Direct image uploader — pushes local image files to the public `product-media`
 * Supabase Storage bucket and sets each product's `image_urls` column.
 *
 * Usage:
 *   1. Drop image files into a folder named after the product slug:
 *        scripts/images/<product-slug>/photo1.jpg
 *        scripts/images/<product-slug>/photo2.jpg
 *      e.g. scripts/images/premium-white-maize-5kg/front.jpg
 *           scripts/images/raw-cashew-nuts-w320-2kg/bag.jpg
 *   2. Run:  npx tsx scripts/upload-images.ts
 *
 * Uses the SERVICE ROLE key (server-only). Idempotent-ish: re-running re-uploads
 * with fresh paths and OVERWRITES image_urls for each slug it finds a folder for.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env(.local)");
  process.exit(1);
}

const BUCKET = "product-media";
const IMAGES_DIR = join(process.cwd(), "scripts", "images");
const MIME: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".gif": "image/gif", ".avif": "image/avif",
};

const db = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  if (!existsSync(IMAGES_DIR)) {
    console.error(`No images dir found at ${IMAGES_DIR}. Create scripts/images/<slug>/ and add files.`);
    process.exit(1);
  }

  const slugs = readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (!slugs.length) {
    console.error("No per-slug folders inside scripts/images/. Nothing to upload.");
    process.exit(1);
  }

  for (const slug of slugs) {
    // Confirm the product exists before uploading anything for it.
    const { data: product, error: findErr } = await db
      .from("products").select("id, name").eq("slug", slug).single();
    if (findErr || !product) {
      console.warn(`⚠ Skipping "${slug}" — no product with that slug.`);
      continue;
    }

    const dir = join(IMAGES_DIR, slug);
    const files = readdirSync(dir).filter((f) => MIME[extname(f).toLowerCase()]);
    if (!files.length) {
      console.warn(`⚠ No image files in ${dir}`);
      continue;
    }

    const urls: string[] = [];
    for (const file of files) {
      const ext = extname(file).toLowerCase();
      const path = `products/${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      const body = readFileSync(join(dir, file));
      const { error: upErr } = await db.storage
        .from(BUCKET)
        .upload(path, body, { contentType: MIME[ext], upsert: true });
      if (upErr) throw new Error(`Upload failed for ${file}: ${upErr.message}`);
      const { data } = db.storage.from(BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
      console.log(`  ↑ ${file} → ${data.publicUrl}`);
    }

    const { error: updErr } = await db
      .from("products").update({ image_urls: urls }).eq("id", product.id);
    if (updErr) throw new Error(`Failed to set image_urls for ${slug}: ${updErr.message}`);
    console.log(`✅ ${product.name}: set ${urls.length} image(s).`);
  }

  console.log("Done.");
}

main().catch((e) => { console.error("Upload failed:", e); process.exit(1); });
