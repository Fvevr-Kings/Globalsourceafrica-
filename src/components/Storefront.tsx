"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { SearchBar } from "./SearchBar";
import { CategoryChips } from "./CategoryChips";
import { ProductGrid } from "./ProductGrid";

/**
 * Homepage orchestrator. SSR provides the initial product set; this component:
 *  - sends the search query to the FTS endpoint (/api/search) — real Postgres
 *    full-text, debounced — and swaps the grid with the results (§4a),
 *  - filters the loaded grid live by category client-side (§3 allows this).
 */
export function Storefront({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>(initialProducts);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const reqId = useRef(0);

  // Debounced FTS search. Empty query restores the initial set.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults(initialProducts);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = ++reqId.current;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = (await res.json()) as { products: Product[] };
        if (id === reqId.current) setResults(data.products ?? []);
      } catch {
        if (id === reqId.current) setResults([]);
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query, initialProducts]);

  const visible = useMemo(
    () =>
      category === "All"
        ? results
        : results.filter((p) => p.category === category),
    [results, category]
  );

  return (
    <div className="space-y-6">
      <SearchBar value={query} onChange={setQuery} loading={loading} />
      <CategoryChips
        categories={categories}
        active={category}
        onSelect={setCategory}
      />
      <ProductGrid products={visible} />
    </div>
  );
}
