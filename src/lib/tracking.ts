"use server";

import { createSupabaseAdminClient } from "./supabase/admin";

export type TrackedOrder = {
  id: string;
  status: string;
  created_at: string;
  status_updated_at: string | null;
  tracking_note: string | null;
  subtotal_usd: number;
  items: { product_name: string; qty: number }[];
};

export type TrackResult =
  | { ok: true; order: TrackedOrder }
  | { ok: false; error: string };

// PUBLIC guest tracking: match an order number to the email/phone used at
// checkout — no login. Uses the service role (bypasses RLS) but only ever
// returns an order that belongs to the supplied contact. Order number may be
// the full id or the short 8-char prefix shown on the confirmation page.
export async function trackOrder(input: {
  orderNumber: string;
  contact: string;
}): Promise<TrackResult> {
  try {
    const orderNumber = input.orderNumber?.trim().toLowerCase();
    const contact = input.contact?.trim().toLowerCase();
    if (!orderNumber || !contact) {
      return { ok: false, error: "Enter your order number and the email or phone you used." };
    }

    const db = createSupabaseAdminClient();

    const { data: buyer } = await db
      .from("buyers")
      .select("id")
      .eq("contact", contact)
      .maybeSingle();
    if (!buyer) {
      return { ok: false, error: "We couldn't find an order matching those details." };
    }

    const { data: orders, error } = await db
      .from("orders")
      .select("*")
      .eq("buyer_id", buyer.id)
      .order("created_at", { ascending: false });
    if (error) return { ok: false, error: "We couldn't find an order matching those details." };

    const match = (orders ?? []).find(
      (o: any) =>
        String(o.id).toLowerCase() === orderNumber ||
        String(o.id).toLowerCase().startsWith(orderNumber)
    );
    if (!match) {
      return { ok: false, error: "We couldn't find an order matching those details." };
    }

    const { data: items } = await db
      .from("order_items")
      .select("product_name, qty")
      .eq("order_id", match.id);

    return {
      ok: true,
      order: {
        id: match.id,
        status: match.status,
        created_at: match.created_at,
        status_updated_at: match.status_updated_at ?? null,
        tracking_note: match.tracking_note ?? null,
        subtotal_usd: match.subtotal_usd,
        items: (items ?? []).map((it: any) => ({ product_name: it.product_name, qty: it.qty })),
      },
    };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Tracking failed. Please try again." };
  }
}
