"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "./supabase/admin";

export type QuoteRequestInput = {
  request_type: "quote" | "sourcing";
  contact_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  company: string | null;
  country: string | null;
  product_id: string | null;
  product_name: string | null;
  quantity: string | null;
  target_price_usd: number | null;
  destination: string | null;
  message: string | null;
};

export type QuoteResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

// PUBLIC — submitted from /request-quote. Writes via the service role so the
// table stays locked to anon otherwise (same pattern as supplier applications).
export async function submitQuoteRequest(
  input: QuoteRequestInput
): Promise<QuoteResult> {
  try {
    if (!input.contact_name?.trim()) {
      return { ok: false, error: "Please enter your name." };
    }
    if (!input.contact_email && !input.contact_phone) {
      return { ok: false, error: "Provide an email or phone so we can reach you." };
    }
    if (!input.product_name?.trim()) {
      return { ok: false, error: "Tell us which product you're interested in." };
    }
    const db = createSupabaseAdminClient();
    const { data, error } = await db
      .from("quote_requests")
      .insert({ ...input, status: "new" })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/quotes");
    return { ok: true, id: data.id };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Failed to submit request" };
  }
}
