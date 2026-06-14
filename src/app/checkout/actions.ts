"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { resolveUnitPrice } from "@/lib/pricing";
import type { PriceTier } from "@/lib/types";

export type PlaceOrderInput = {
  items: { productId: string; qty: number }[];
  shippingName: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    region?: string;
    postalCode?: string;
    country: string;
  };
};

export type PlaceOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

/**
 * Places an order. Authoritative path (build spec §5):
 *  - identity comes from the passwordless session (OTP-verified), NOT the form,
 *  - prices are RESOLVED SERVER-SIDE from the DB tiers (client prices ignored),
 *  - a silent `buyers` row is upserted on the contact,
 *  - payment is STUBBED — the order is written with status 'placed'.
 */
export async function placeOrder(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Not authenticated. Verify your code first." };
  }
  if (!input.items.length) {
    return { ok: false, error: "Your cart is empty." };
  }

  const contact = user.email ?? user.phone;
  if (!contact) {
    return { ok: false, error: "No contact on the verified session." };
  }

  // Admin client: writes bypass RLS, and we trust ONLY server-resolved prices.
  const admin = createSupabaseAdminClient();

  // 1. Silently upsert the buyer (no "create account" language anywhere).
  const { data: buyer, error: buyerErr } = await admin
    .from("buyers")
    .upsert(
      { contact, auth_uid: user.id },
      { onConflict: "contact" }
    )
    .select("id")
    .single();
  if (buyerErr || !buyer) {
    return { ok: false, error: "Could not attach your account." };
  }

  // 2. Load the real products + tiers for the cart (never trust client prices).
  const productIds = Array.from(new Set(input.items.map((i) => i.productId)));
  const { data: products, error: prodErr } = await admin
    .from("products")
    .select("id, name, retail_price_usd, in_stock")
    .in("id", productIds);
  if (prodErr || !products) {
    return { ok: false, error: "Could not load products." };
  }

  const { data: tiers, error: tierErr } = await admin
    .from("product_price_tiers")
    .select("id, product_id, min_qty, unit_price_usd")
    .in("product_id", productIds);
  if (tierErr) {
    return { ok: false, error: "Could not load pricing." };
  }

  const tiersByProduct = new Map<string, PriceTier[]>();
  for (const t of tiers ?? []) {
    const arr = tiersByProduct.get(t.product_id) ?? [];
    arr.push({ id: t.id, min_qty: t.min_qty, unit_price_usd: t.unit_price_usd });
    tiersByProduct.set(t.product_id, arr);
  }
  const productById = new Map(products.map((p) => [p.id, p]));

  // 3. Resolve line items server-side.
  let subtotal = 0;
  const orderItems: {
    product_id: string;
    product_name: string;
    qty: number;
    unit_price_usd: number;
    line_total_usd: number;
  }[] = [];

  for (const item of input.items) {
    const product = productById.get(item.productId);
    if (!product || !product.in_stock) {
      return { ok: false, error: "An item is unavailable. Please review your cart." };
    }
    const qty = Math.max(1, Math.floor(item.qty));
    const unit = resolveUnitPrice(
      product.retail_price_usd,
      tiersByProduct.get(product.id) ?? [],
      qty
    );
    const line = unit * qty;
    subtotal += line;
    orderItems.push({
      product_id: product.id,
      product_name: product.name, // snapshot at purchase time
      qty,
      unit_price_usd: unit,
      line_total_usd: line,
    });
  }

  // 4. Create the order.
  // TODO: payment — Stripe (global) + Paystack (Africa). Charge here BEFORE
  //       writing the order; on success set status accordingly. Phase 1 stubs
  //       payment and records the order as 'placed'.
  const { data: order, error: orderErr } = await admin
    .from("orders")
    .insert({
      buyer_id: buyer.id,
      status: "placed",
      currency: "USD",
      subtotal_usd: subtotal,
      shipping_name: input.shippingName,
      shipping_address: input.shippingAddress,
    })
    .select("id")
    .single();
  if (orderErr || !order) {
    return { ok: false, error: "Could not create your order." };
  }

  const { error: itemsErr } = await admin.from("order_items").insert(
    orderItems.map((oi) => ({ ...oi, order_id: order.id }))
  );
  if (itemsErr) {
    return { ok: false, error: "Could not record order items." };
  }

  return { ok: true, orderId: order.id };
}
