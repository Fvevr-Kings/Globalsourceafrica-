import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type Merchant = {
  supplierId: string;
  businessName: string;
  country: string;
  contact: string;
  verified: boolean;
};

/**
 * The supplier record for the current OTP session, or null. A merchant can log
 * in only if their session contact matches a VERIFIED supplier's `contact`
 * (set when an admin approves their application). Lookup uses the service role
 * after reading the authenticated contact — same trusted pattern as staff.
 */
export async function getMerchant(): Promise<Merchant | null> {
  const admin = createSupabaseAdminClient();

  // DEV-ONLY: log in as a specific verified supplier without email. Set
  // MERCHANT_DEV_BYPASS to that supplier's contact in .env. Never active in prod.
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.MERCHANT_DEV_BYPASS
  ) {
    const bypassContact = process.env.MERCHANT_DEV_BYPASS.toLowerCase();
    const { data } = await admin
      .from("suppliers")
      .select("id, business_name, country, contact, verified")
      .eq("contact", bypassContact)
      .eq("verified", true)
      .maybeSingle();
    if (data) {
      return {
        supplierId: data.id,
        businessName: data.business_name,
        country: data.country,
        contact: data.contact,
        verified: data.verified,
      };
    }
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const raw = user.email ?? user.phone;
  if (!raw) return null;
  const contact = raw.includes("@") ? raw.toLowerCase() : raw;

  const { data } = await admin
    .from("suppliers")
    .select("id, business_name, country, contact, verified")
    .eq("contact", contact)
    .eq("verified", true)
    .maybeSingle();

  if (!data) return null;
  return {
    supplierId: data.id,
    businessName: data.business_name,
    country: data.country,
    contact: data.contact,
    verified: data.verified,
  };
}

export async function requireMerchant(): Promise<Merchant> {
  const merchant = await getMerchant();
  if (!merchant) redirect("/merchant/login");
  return merchant;
}
