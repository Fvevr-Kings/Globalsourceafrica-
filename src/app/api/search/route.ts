import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/products";

// The homepage search bar hits THIS endpoint, which runs the Postgres FTS RPC
// (with trigram fallback) — never a client-side LIKE filter (build spec §4a).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  try {
    const products = await searchProducts(q);
    return NextResponse.json({ products });
  } catch (err) {
    console.error("search failed", err);
    return NextResponse.json(
      { products: [], error: "search_failed" },
      { status: 500 }
    );
  }
}
