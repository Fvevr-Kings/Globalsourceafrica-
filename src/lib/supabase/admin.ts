import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — SERVER ONLY. Bypasses RLS. Used exclusively by order
 * placement to resolve authoritative tier pricing and write orders/buyers.
 * Never import this into a client component.
 */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
