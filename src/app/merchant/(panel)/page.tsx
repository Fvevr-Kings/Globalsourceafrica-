import Link from "next/link";
import { Package, Clock, CheckCircle2, XCircle } from "lucide-react";
import { requireMerchant } from "@/lib/merchant/auth";
import { getMerchantCounts } from "@/lib/merchant/data";

export const dynamic = "force-dynamic";

export default async function MerchantDashboard() {
  const merchant = await requireMerchant();
  const c = await getMerchantCounts(merchant.supplierId);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Welcome, {merchant.businessName}
      </h1>
      <p className="mt-1 text-sm text-sub">
        Submit products for review. Approved items go live on the storefront —
        sold under the Global-Source Africa brand.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total products" value={c.total} icon={<Package className="h-5 w-5" />} />
        <Stat label="Pending review" value={c.byStatus["pending"] ?? 0} icon={<Clock className="h-5 w-5" />} highlight={(c.byStatus["pending"] ?? 0) > 0} />
        <Stat label="Approved (live)" value={c.byStatus["approved"] ?? 0} icon={<CheckCircle2 className="h-5 w-5" />} />
        <Stat label="Rejected" value={c.byStatus["rejected"] ?? 0} icon={<XCircle className="h-5 w-5" />} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/merchant/products/new"
          className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orangeDark"
        >
          Submit a product
        </Link>
        <Link
          href="/merchant/products"
          className="rounded-full border border-greenLine bg-white px-5 py-2.5 text-sm font-medium text-ink hover:border-green"
        >
          My products
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "rounded-2xl border border-orange/40 bg-orange/5 p-5"
          : "rounded-2xl border border-greenLine bg-white p-5"
      }
    >
      <div className="flex items-center gap-2 text-sub">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="mt-2 text-3xl font-semibold text-ink">{value}</div>
    </div>
  );
}
