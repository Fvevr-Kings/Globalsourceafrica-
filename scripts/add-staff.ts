/**
 * Add a staff member to the admin allowlist.
 * Usage:
 *   npm run staff:add -- you@email.com "Your Name" admin
 *   npm run staff:add -- +2348012345678 "Ops User" ops
 * The contact MUST match exactly what they'll enter at /admin/login (the OTP
 * identity). Email is lowercased; phone should be E.164 (+countrycode…).
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const [rawContact, name, role = "admin"] = process.argv.slice(2);
if (!rawContact) {
  console.error('Usage: npm run staff:add -- <email-or-phone> "<name>" [admin|ops]');
  process.exit(1);
}
const contact = rawContact.includes("@") ? rawContact.toLowerCase() : rawContact;

const db = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { error } = await db
    .from("staff")
    .upsert({ contact, name: name ?? null, role }, { onConflict: "contact" });
  if (error) throw error;
  console.log(`✅ Staff allowlisted: ${contact} (${role})`);
}

main().catch((e) => {
  console.error("Failed:", e.message ?? e);
  process.exit(1);
});
