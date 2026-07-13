import type { Metadata } from "next";
import { MonoLabel } from "@/components/v2/MonoLabel";
import { BackToHome } from "@/components/v2/BackToHome";
import { IntakeForm } from "@/components/v2/IntakeForm";

export const metadata: Metadata = {
  title: "Request sourcing or verification — GlobalSource Africa",
  description:
    "Tell us what you need — supplier verification, discovery, inspection or full sourcing. We reply within 48 hours with scope and a flat fee.",
};

export const dynamic = "force-dynamic";

export default function RequestPage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  return (
    <>
      <section className="gsa-corrugation bg-navy text-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <BackToHome />
          <MonoLabel className="text-container">REQUEST</MonoLabel>
          <h1 className="gsa-heading mt-3 text-3xl font-extrabold sm:text-4xl">
            Tell us what you need
          </h1>
          <p className="mt-4 text-white/70">
            No login, no obligation. We confirm scope and a flat fee within 48
            hours — before any work begins.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <IntakeForm initialService={searchParams.service ?? ""} />
        </div>
      </section>
    </>
  );
}
