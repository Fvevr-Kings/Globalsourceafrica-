/**
 * Create a Supabase Auth user (email + password) for admin login, and
 * allowlist them in the `staff` table in the same step.
 * Usage:
 *   npm run admin:create -- you@email.com "your-password" "Your Name" admin
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

const [rawEmail, password, name, role = "admin"] = process.argv.slice(2);
if (!rawEmail || !password) {
  console.error(
    'Usage: npm run admin:create -- <email> "<password>" "<name>" [admin|ops]'
  );
  process.exit(1);
}
const email = rawEmail.toLowerCase();

const db = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data, error } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;

  const { error: staffError } = await db
    .from("staff")
    .upsert({ contact: email, name: name ?? null, role }, { onConflict: "contact" });
  if (staffError) throw staffError;

  console.log(`Created Supabase Auth user + staff allowlist entry for ${email} (${role}).`);
  console.log(`User id: ${data.user?.id}`);
}

main().catch((e) => {
  console.error("Failed:", e.message ?? e);
  process.exit(1);
});
