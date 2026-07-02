/**
 * Converts local product images to web-optimized WebP, uploads them to the
 * public `product-media` bucket, and repoints each product's image_urls to the
 * lighter WebP — making the storefront much lighter than the source PNGs.
 *
 * Reads from scripts/images/<product-slug>/*  (same layout as upload-images.ts).
 * Usage:  npx tsx scripts/optimize-and-upload-images.ts
 *
 * Uses the SERVICE ROLE key (server-only). Re-running overwrites image_urls.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readdirSync, existsSync, statSync } from "node:fs";
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
const SRC_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const MAX_DIM = 1200;   // product cards/pages never need more than this
const QUALITY = 78;     // visually lossless-ish for photos, big size win

const db = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  if (!existsSync(IMAGES_DIR)) {
    console.error(`No images dir at ${IMAGES_DIR}.`);
    process.exit(1);
  }
  const slugs = readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory()).map((d) => d.name);

  let totalIn = 0, totalOut = 0;
  for (const slug of slugs) {
    const { data: product } = await db
      .from("products").select("id, name").eq("slug", slug).single();
    if (!product) { console.warn(`⚠ Skip "${slug}" — no matching product.`); continue; }

    const dir = join(IMAGES_DIR, slug);
    const files = readdirSync(dir).filter((f) => SRC_EXT.has(extname(f).toLowerCase()));
    if (!files.length) { console.warn(`⚠ No images in ${dir}`); continue; }

    const urls: string[] = [];
    for (const file of files) {
      const input = join(dir, file);
      const webp = await sharp(input)
        .rotate() // respect EXIF orientation
        .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();

      const inSize = statSync(input).size;
      totalIn += inSize; totalOut += webp.length;

      const path = `products/${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
      const { error: upErr } = await db.storage
        .from(BUCKET).upload(path, webp, { contentType: "image/webp", upsert: true });
      if (upErr) throw new Error(`Upload failed for ${file}: ${upErr.message}`);
      const { data } = db.storage.from(BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
      console.log(`  ${file} (${(inSize/1024).toFixed(0)}KB) → webp (${(webp.length/1024).toFixed(0)}KB)`);
    }

    const { error: updErr } = await db
      .from("products").update({ image_urls: urls }).eq("id", product.id);
    if (updErr) throw new Error(`Failed to set image_urls for ${slug}: ${updErr.message}`);
    console.log(`✅ ${product.name}: ${urls.length} WebP image(s).`);
  }

  console.log(`\nTotal: ${(totalIn/1048576).toFixed(2)}MB → ${(totalOut/1048576).toFixed(2)}MB (${Math.round((1-totalOut/totalIn)*100)}% smaller)`);
}

main().catch((e) => { console.error("Optimize failed:", e); process.exit(1); });
