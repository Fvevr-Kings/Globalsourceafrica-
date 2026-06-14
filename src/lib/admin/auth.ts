import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type Staff = {
  id: string;
  contact: string;
  name: string | null;
  role: "admin" | "ops";
};

/**
 * Returns the staff record for the current OTP session, or null. Access control
 * = "is the verified contact on the staff allowlist?" The lookup uses the
 * service role (bypasses RLS) AFTER reading the authenticated contact, so a
 * random buyer who OTPs in is simply not staff and gets nothing.
 */
export async function getStaff(): Promise<Staff | null> {
  // DEV-ONLY bypass: view/use the admin without email login (handy when
  // Supabase's free-tier email is rate-limited). Hard-gated so it can NEVER be
  // active in a production build. Enable with ADMIN_DEV_BYPASS=true in .env.
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.ADMIN_DEV_BYPASS === "true"
  ) {
    return { id: "dev-bypass", contact: "dev@local", name: "Dev Admin", role: "admin" };
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const contact = user.email ?? user.phone;
  if (!contact) return null;

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("staff")
    .select("id, contact, name, role")
    .eq("contact", contact)
    .maybeSingle();

  return (data as Staff) ?? null;
}

/** Gate a server component: redirect non-staff to the admin login. */
export async function requireStaff(): Promise<Staff> {
  const staff = await getStaff();
  if (!staff) redirect("/admin/login");
  return staff;
}
