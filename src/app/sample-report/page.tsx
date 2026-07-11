import type { Metadata } from "next";
import { MapPin, Building2, FileCheck2, Camera, Phone } from "lucide-react";
import { MonoLabel } from "@/components/v2/MonoLabel";
import { LeadGate } from "@/components/v2/LeadGate";

export const metadata: Metadata = {
  title: "Sample verification report — GlobalSource Africa",
  description:
    "See exactly what you get: a real-format, fully redacted supplier verification report — registry findings, license checks, site photos, references, risk rating and recommendation.",
};

// Redacted text bar.
function Redact({ w = "100%" }: { w?: string }) {
  return <span className="inline-block h-2.5 rounded bg-navy/15 align-middle" style={{ width: w }} />;
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-steel/15 py-5">
      <div className="flex items-center gap-2 text-navy">
        <Icon className="h-4 w-4 text-container" />
        <MonoLabel className="text-steel">{title}</MonoLabel>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function SampleReportPage() {
  return (
    <>
      <section className="gsa-corrugation bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <MonoLabel className="text-container">SAMPLE REPORT</MonoLabel>
          <h1 className="gsa-heading mt-3 text-4xl font-extrabold sm:text-5xl">
            See exactly what you get before you pay
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            A real-format verification report, fully redacted. This is the
            deliverable — no surprises about what lands in your inbox.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 lg:grid-cols-[1fr_20rem]">
          {/* The report document */}
          <article className="rounded-2xl border border-steel/20 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <MonoLabel className="text-container">GSA-2026-0147 · VERIFICATION</MonoLabel>
                <h2 className="gsa-heading mt-1 text-2xl font-bold text-navy">Supplier Verification Report</h2>
              </div>
              <span className="-rotate-2 rounded border-2 border-cleared px-3 py-1 font-mono text-xs uppercase tracking-widest text-cleared">
                Low Risk
              </span>
            </div>

            <Section icon={Building2} title="Company registry">
              <div className="space-y-2">
                <p className="text-sm text-navy/80">Registered entity: <Redact w="42%" /></p>
                <p className="text-sm text-navy/80">Registration no.: <Redact w="30%" /> · Status: <span className="text-cleared">Active</span></p>
                <p className="text-sm text-navy/80">Directors on file: <Redact w="55%" /></p>
              </div>
            </Section>

            <Section icon={FileCheck2} title="License & permits">
              <ul className="space-y-1.5 text-sm text-navy/80">
                <li>Export license — <span className="text-cleared">Verified</span> · <Redact w="24%" /></li>
                <li>Product certifications — <span className="text-cleared">Verified</span> · <Redact w="30%" /></li>
              </ul>
            </Section>

            <Section icon={Camera} title="Site visit">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex aspect-[4/3] items-center justify-center rounded bg-navy/5 text-navy/30">
                    <Camera className="h-6 w-6" />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-navy/80">Visited <MapPin className="inline h-3.5 w-3.5 text-container" /> <Redact w="30%" /> on <Redact w="18%" />. Warehouse and processing observed.</p>
            </Section>

            <Section icon={Phone} title="References">
              <p className="text-sm text-navy/80">3 trade references contacted · <Redact w="60%" /></p>
            </Section>

            <div className="mt-6 rounded-xl bg-navy p-5 text-white">
              <MonoLabel className="text-white/50">RECOMMENDATION</MonoLabel>
              <p className="mt-1.5 text-sm">
                Supplier is a registered, licensed exporter with verified capacity.
                Proceed with standard trade safeguards and coordinated inspection at
                loading. Full detail in the complete report.
              </p>
            </div>
          </article>

          {/* Gate */}
          <aside className="lg:pt-2">
            <div className="lg:sticky lg:top-24">
              <LeadGate />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
