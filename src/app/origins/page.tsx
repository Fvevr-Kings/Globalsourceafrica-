import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { MonoLabel } from "@/components/v2/MonoLabel";

export const metadata: Metadata = {
  title: "Origins — GlobalSource Africa",
  description:
    "Where our ground presence is deepest. Ghana first — cocoa, shea and cashew — with Egypt and Nigeria next as clients demand them.",
};

const ORIGINS = [
  {
    slug: "ghana",
    name: "Ghana",
    status: "Live",
    live: true,
    blurb: "English-speaking, politically stable, and a long-established exporter of cocoa, shea and cashew. Our deepest ground presence.",
    regions: ["Ashanti — cocoa, processing & export", "Northern — shea & botanicals", "Bono — cashew"],
  },
  {
    slug: "egypt",
    name: "Egypt",
    status: "Next",
    live: false,
    blurb: "Herbs, botanicals and Nile Delta crops. On our roadmap as buyer demand grows.",
    regions: ["Fayoum — herbs & botanicals", "Nile Delta — crops", "Cairo — processing & export"],
  },
  {
    slug: "nigeria",
    name: "Nigeria",
    status: "Next",
    live: false,
    blurb: "Sesame, hibiscus, cashew and more. Planned as our network expands.",
    regions: ["Kano — sesame & hibiscus", "Benue — sesame", "Southern belt — cashew"],
  },
];

export default function OriginsPage() {
  return (
    <>
      <section className="gsa-corrugation bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 py-20">
          <MonoLabel className="text-container">ORIGINS</MonoLabel>
          <h1 className="gsa-heading mt-3 text-4xl font-extrabold sm:text-5xl">
            Where we&apos;re on the ground
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            We&apos;d rather be honest about where we&apos;re strong than claim a whole
            continent. Ghana today; more origins as clients demand them.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {ORIGINS.map((o) => (
              <div key={o.slug} className={`rounded-xl border bg-white p-6 ${o.live ? "border-container" : "border-steel/20"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-container" />
                    <h2 className="gsa-heading text-xl font-bold text-navy">{o.name}</h2>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${o.live ? "bg-cleared/10 text-cleared" : "bg-steel/10 text-steel"}`}>
                    {o.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-steel">{o.blurb}</p>
                <ul className="mt-4 space-y-1.5 font-mono text-xs uppercase tracking-wide text-navy/70">
                  {o.regions.map((r) => (
                    <li key={r}>· {r}</li>
                  ))}
                </ul>
                {o.live && (
                  <Link href={`/origins/${o.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-container hover:gap-2.5">
                    What we verify in {o.name} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
