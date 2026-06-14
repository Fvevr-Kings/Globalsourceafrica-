import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

// Responsive: 4 cols desktop, 2 tablet, 1 mobile (build spec §6).
export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sub">
        No products match your search. Try a different term.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
