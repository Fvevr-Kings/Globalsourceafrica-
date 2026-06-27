import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/products";

// The homepage search bar hits THIS endpoint, which runs the Postgres FTS RPC
// (with trigram fallback) — never a client-side LIKE filter (build spec §4a).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const section = searchParams.get("section") ?? "";
  try {
    let products = await searchProducts(q);
    if (section) {
      // Rows carry `section` at runtime once migration 0008 is applied. Only
      // filter when it's present, so pre-migration search still returns results.
      const hasSection = products.some((p) => (p as any).section !== undefined);
      if (hasSection) {
        products = products.filter((p) => (p as any).section === section);
      }
    }
    return NextResponse.json({ products });
  } catch (err) {
    console.error("search failed", err);
    return NextResponse.json(
      { products: [], error: "search_failed" },
      { status: 500 }
    );
  }
}
