import type { Metadata } from "next";
import { MonoLabel } from "@/components/v2/MonoLabel";
import { BackToHome } from "@/components/v2/BackToHome";

export const metadata: Metadata = {
  title: "Terms — GlobalSource Africa",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <BackToHome />
        <MonoLabel className="text-steel">LEGAL · PLACEHOLDER</MonoLabel>
        <h1 className="gsa-heading mt-3 text-3xl font-bold text-navy">Terms of Service</h1>
        <p className="mt-4 text-sm text-steel">
          Placeholder terms — to be replaced with counsel-reviewed copy before launch.
        </p>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-navy/80">
          <p>
            GlobalSource Africa provides sourcing and verification services. We do
            not hold inventory, take title to goods, or act as a party to any sale
            between a buyer and a supplier. Our deliverable is information and
            coordination; commercial decisions remain the buyer&apos;s.
          </p>
          <p>
            Verification findings reflect information available at the time of the
            engagement and reasonable professional checks. They are not a guarantee
            of future performance. Fees are as quoted and agreed before work begins.
          </p>
          <p>Full terms, liability and governing law to be finalised with counsel.</p>
        </div>
      </div>
    </section>
  );
}
