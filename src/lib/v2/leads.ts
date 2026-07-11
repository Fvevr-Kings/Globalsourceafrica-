"use server";

import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  source: z.string().trim().max(60).default("sample_report"),
});

export type LeadResult = { ok: true } | { ok: false; error: string };

// Captures an email for the gated sample report (Supabase `leads`). Writes via
// the service role so the table stays locked to anon.
export async function captureLead(raw: { email: string; source?: string }): Promise<LeadResult> {
  try {
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Enter a valid email." };
    }
    const db = createSupabaseAdminClient();
    const { error } = await db.from("leads").insert(parsed.data);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Something went wrong." };
  }
}
