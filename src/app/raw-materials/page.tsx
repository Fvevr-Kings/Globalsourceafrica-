import type { Metadata } from "next";
import { getAllProducts, getCategories } from "@/lib/products";
import { Storefront } from "@/components/Storefront";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "African Raw Materials — GlobalSource Africa",
  description:
    "Source African raw materials from verified origins. Sold and backed by GlobalSource Africa.",
};

// A second storefront for raw materials — same catalog engine, no hero banner.
export default async function RawMaterialsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts("raw"),
    getCategories("raw"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-green sm:text-3xl">
          African Raw Materials
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-sub">
          Source raw materials from verified African origins — sold and backed by
          GlobalSource Africa.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-greenLine bg-white p-10 text-center text-sub">
          We’re adding raw materials soon. Check back shortly — or{" "}
          <a href="/request-quote" className="font-medium text-green hover:underline">
            request a quote
          </a>{" "}
          for what you need.
        </div>
      ) : (
        <Storefront
          initialProducts={products}
          categories={categories}
          section="raw"
        />
      )}
    </div>
  );
}
