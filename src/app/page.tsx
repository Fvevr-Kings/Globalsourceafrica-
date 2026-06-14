import { getAllProducts, getCategories } from "@/lib/products";
import { Storefront } from "@/components/Storefront";
import { WhyUsToggle } from "@/components/WhyUsToggle";
import { HeroBanner } from "@/components/HeroBanner";

// SSR for speed + SEO (build spec §3). No signup wall, no modal, no gate — the
// search and product grid are on the first screen.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <HeroBanner />
      </div>

      <Storefront initialProducts={products} categories={categories} />

      <div className="mt-10">
        <WhyUsToggle />
      </div>
    </div>
  );
}
