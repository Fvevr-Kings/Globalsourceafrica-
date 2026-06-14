import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { requireMerchant } from "@/lib/merchant/auth";
import { MerchantProductForm } from "@/components/merchant/MerchantProductForm";

export const dynamic = "force-dynamic";

export default async function NewMerchantProductPage() {
  await requireMerchant();
  return (
    <div>
      <Link href="/merchant/products" className="inline-flex items-center gap-1 text-sm text-sub hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> My products
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Submit a product</h1>
      <div className="mt-5">
        <MerchantProductForm />
      </div>
    </div>
  );
}
