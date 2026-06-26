import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SupplierApplicationForm } from "@/components/SupplierApplicationForm";

export const metadata: Metadata = {
  title: "Become a supplier — GlobalSource Africa",
  description:
    "Apply to supply non-perishable African farm products through GlobalSource Africa.",
};

export default function BecomeSupplierPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-sub hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" /> Back to storefront
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
        Become a supplier
      </h1>
      <p className="mt-2 max-w-2xl text-sub">
        We partner with verified farms and cooperatives across Africa. Tell us
        about your business — once approved, you supply through the
        GlobalSource Africa brand while we handle the global buyer relationship.
      </p>
      <div className="mt-6">
        <SupplierApplicationForm />
      </div>
    </div>
  );
}
