import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getAdminProduct, listSuppliers } from "@/lib/admin/data";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, suppliers] = await Promise.all([
    getAdminProduct(params.id),
    listSuppliers(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-sub hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Products
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
        Edit: {product.name}
      </h1>
      <div className="mt-5">
        <ProductForm initial={product} suppliers={suppliers} />
      </div>
    </div>
  );
}
