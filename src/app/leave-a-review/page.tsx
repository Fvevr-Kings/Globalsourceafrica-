import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TestimonialForm } from "@/components/TestimonialForm";

export const metadata: Metadata = {
  title: "Leave a review — GlobalSource Africa",
  description:
    "Bought from GlobalSource Africa? Share your experience and a satisfaction rating.",
};

export default function LeaveAReviewPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-sub hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Back to storefront
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
        Share your experience
      </h1>
      <p className="mt-2 text-sub">
        Tell other buyers what it was like sourcing from GlobalSource Africa.
        Approved reviews appear in the testimonials across our site.
      </p>
      <div className="mt-6">
        <TestimonialForm />
      </div>
    </div>
  );
}
