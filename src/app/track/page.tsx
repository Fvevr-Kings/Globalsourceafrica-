import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TrackForm } from "@/components/TrackForm";

export const metadata: Metadata = {
  title: "Track your order — GlobalSource Africa",
  description:
    "Track the status of your GlobalSource Africa order with your order number and the email or phone you used at checkout.",
};

export const dynamic = "force-dynamic";

export default function TrackPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-sub hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Back to storefront
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
        Track your order
      </h1>
      <p className="mt-2 text-sub">
        Enter your order number and the email or phone you used at checkout to
        see exactly where your order is — no login needed.
      </p>
      <div className="mt-6">
        <TrackForm initialOrder={searchParams.order ?? ""} />
      </div>
    </div>
  );
}
