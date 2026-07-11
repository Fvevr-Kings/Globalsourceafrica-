import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MonoLabel } from "@/components/v2/MonoLabel";

export const metadata: Metadata = {
  title: "Ghana — GlobalSource Africa",
  description:
    "What we verify in Ghana: cocoa, shea and cashew exporters across Ashanti, Northern and Bono regions. Registry, licenses, site visits and inspection.",
};

const PRODUCTS = ["Cocoa beans & products", "Shea nuts & butter", "Raw cashew nuts", "Dried botanicals & herbs"];
const VERIFY = [
  "Registrar-General company registration & status",
  "Ghana Export Promotion Authority / COCOBOD licensing where relevant",
  "Physical site and warehouse visits with dated photos",
  "Capacity and trade-history references",
  "Inspection coordination at sampling and loading",
];

export default function GhanaPage() {
  return (
    <>
      <section className="gsa-corrugation bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 py-20">
          <MonoLabel className="text-container">ORIGINS · GHANA</MonoLabel>
          <h1 className="gsa-heading mt-3 text-4xl font-extrabold sm:text-5xl">
            Africa&apos;s lowest-friction origin
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            English-speaking, politically stable, and a long-established exporter.
            Ghana is where our people are and where our verification is deepest.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <MonoLabel className="text-steel">PRODUCT FAMILIES</MonoLabel>
              <ul className="mt-4 space-y-2">
                {PRODUCTS.map((p) => (
                  <li key={p} className="flex gap-2.5 text-navy/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cleared" /> {p}
                  </li>
                ))}
              </ul>
              <MonoLabel className="mt-8 text-steel">REGIONS</MonoLabel>
              <ul className="mt-4 space-y-2 font-mono text-sm uppercase tracking-wide text-navy/70">
                <li>· Ashanti — cocoa, processing & export</li>
                <li>· Northern — shea & botanicals</li>
                <li>· Bono — cashew</li>
              </ul>
            </div>
            <div>
              <MonoLabel className="text-steel">WHAT WE VERIFY</MonoLabel>
              <ul className="mt-4 space-y-2">
                {VERIFY.map((v) => (
                  <li key={v} className="flex gap-2.5 text-navy/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cleared" /> {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 rounded-2xl bg-navy p-8 text-center text-white">
            <h2 className="gsa-heading text-2xl font-bold">Buying from Ghana?</h2>
            <p className="mx-auto mt-2 max-w-md text-white/70">Verify a supplier or ask us to source for you.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/services/verification" className="rounded-full bg-container px-6 py-3 font-semibold text-white hover:bg-container/90">Verify a Supplier</Link>
              <Link href="/request" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-semibold text-white hover:bg-white/5">Request Sourcing <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
