import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { MonoLabel } from "@/components/v2/MonoLabel";
import { TrustStrip } from "@/components/v2/TrustStrip";
import { HeroContainerStatic } from "@/components/v2/HeroContainerStatic";

export const metadata = {
  title: "GlobalSource Africa — supplier verification & sourcing in Africa",
};

// v2 home. Phase 1 ships the static hero shell; sections 2–9 (problem strip,
// services, how-it-works, sample-report, origins, founder, resources, CTA) and
// the three signature animations arrive in Phases 2–3.
export default function HomePage() {
  return (
    <>
      <section className="gsa-corrugation relative overflow-hidden bg-navy text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <MonoLabel className="text-container">
              ON-GROUND SINCE 2026 · GHANA
            </MonoLabel>
            <h1 className="gsa-heading mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Your verification and sourcing partner on the ground in Africa
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              We help international buyers find, verify and buy from African
              suppliers safely — before you send a single dollar.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/request"
                className="inline-flex items-center gap-2 rounded-full bg-container px-6 py-3 font-semibold text-white transition-colors hover:bg-container/90"
              >
                Request Sourcing <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services/verification"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/5"
              >
                <ShieldCheck className="h-4 w-4" /> Verify a Supplier
              </Link>
            </div>

            <TrustStrip
              className="mt-10 text-white/55"
              items={[
                "SGS-COORDINATED",
                "ACCRA / KUMASI",
                "48H RESPONSE",
                "FLAT-FEE REPORTS",
              ]}
            />
          </div>

          <div className="lg:pl-8">
            <HeroContainerStatic />
          </div>
        </div>
      </section>

      {/* Placeholder band — full home sections land in Phase 2. */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <MonoLabel className="text-steel">BUILD IN PROGRESS</MonoLabel>
          <p className="mt-3 text-navy/70">
            Services, how-it-works, sample report, origins and resources are
            coming next. In the meantime,{" "}
            <Link href="/request" className="font-semibold text-container hover:underline">
              request sourcing
            </Link>{" "}
            or{" "}
            <Link href="/services/verification" className="font-semibold text-container hover:underline">
              verify a supplier
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
