import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { listSuppliers } from "@/lib/admin/data";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const suppliers = await listSuppliers();
  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-sub hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Products
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">New product</h1>
      <div className="mt-5">
        <ProductForm suppliers={suppliers} />
      </div>
    </div>
  );
}
