import Link from "next/link";
import { ArrowRight, ShieldCheck, FileSearch, ClipboardCheck, Truck, PackageCheck, MapPin } from "lucide-react";
import { MonoLabel } from "@/components/v2/MonoLabel";
import { TrustStrip } from "@/components/v2/TrustStrip";
import { HeroContainerStatic } from "@/components/v2/HeroContainerStatic";
import { ServiceCard } from "@/components/v2/ServiceCard";
import { SERVICES } from "@/lib/v2/services";

export const metadata = {
  title: "GlobalSource Africa — supplier verification & sourcing in Africa",
};

const STEPS = [
  { n: "01", t: "Submit your request", d: "Tell us the product, quantity, destination and specs — or name a supplier you want checked." },
  { n: "02", t: "We scope and quote our fee", d: "Flat fee confirmed upfront. You know the cost before anything starts." },
  { n: "03", t: "Ground work begins", d: "Registry checks, license verification, physical or video audit, reference calls." },
  { n: "04", t: "Inspection coordinated", d: "SGS or equivalent at sampling and loading. You never ship blind." },
  { n: "05", t: "You receive the report / verified deal", d: "A decision-ready document, or a supplier you can transact with confidently." },
];

const REGIONS = [
  { name: "Ashanti", note: "Cocoa · processing & export" },
  { name: "Northern", note: "Shea & botanicals" },
  { name: "Bono", note: "Cashew" },
];

const ARTICLES = [
  { slug: "verify-african-supplier-before-deposit", title: "How to verify an African supplier before paying a deposit" },
  { slug: "why-africa-shipments-rejected-eu", title: "Why shipments from Africa get rejected in the EU (and how to prevent it)" },
  { slug: "africa-export-documentation-buyers-guide", title: "Export documentation: what buyers should ask for" },
];

export default function HomePage() {
  return (
    <>
      {/* 1 · HERO */}
      <section className="gsa-corrugation relative overflow-hidden bg-navy text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <MonoLabel className="text-container">ON-GROUND SINCE 2026 · GHANA</MonoLabel>
            <h1 className="gsa-heading mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Your verification and sourcing partner on the ground in Africa
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              We help international buyers find, verify and buy from African
              suppliers safely — before you send a single dollar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/request" className="inline-flex items-center gap-2 rounded-full bg-container px-6 py-3 font-semibold text-white transition-colors hover:bg-container/90">
                Request Sourcing <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/services/verification" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/5">
                <ShieldCheck className="h-4 w-4" /> Verify a Supplier
              </Link>
            </div>
            <TrustStrip className="mt-10 text-white/55" items={["SGS-COORDINATED", "ACCRA / KUMASI", "48H RESPONSE", "FLAT-FEE REPORTS"]} />
          </div>
          <div className="lg:pl-8">
            <HeroContainerStatic />
          </div>
        </div>
      </section>

      {/* 2 · PROBLEM STRIP */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { h: "Fake exporters", d: "Companies that don't exist, or can't actually export, take your deposit and vanish." },
              { h: "Photoshopped documents", d: "Licenses, certificates and bank details that look real until your money is gone." },
              { h: "Shipments that never load", d: "Containers short-loaded, swapped, or never packed — discovered only on arrival." },
            ].map((c) => (
              <div key={c.h}>
                <h3 className="gsa-heading text-lg font-bold text-navy">{c.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{c.d}</p>
              </div>
            ))}
          </div>
          <p className="gsa-heading mt-10 text-center text-2xl font-bold text-container">
            This is why we exist.
          </p>
        </div>
      </section>

      {/* 3 · SERVICES GRID */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <MonoLabel className="text-steel">WHAT WE DO</MonoLabel>
          <h2 className="gsa-heading mt-3 text-3xl font-bold text-navy sm:text-4xl">
            Four ways we protect your Africa deal
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* 4 · HOW IT WORKS (static; motion in Phase 3) */}
      <section className="gsa-corrugation bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <MonoLabel className="text-container">HOW IT WORKS</MonoLabel>
          <h2 className="gsa-heading mt-3 text-3xl font-bold sm:text-4xl">
            From request to verified deal
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-5">
            {STEPS.map((s, i) => {
              const Icon = [FileSearch, ClipboardCheck, ShieldCheck, Truck, PackageCheck][i];
              return (
                <li key={s.n} className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-2 text-container">
                    <Icon className="h-5 w-5" />
                    <span className="font-mono text-xs tracking-widest">{s.n}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold">{s.t}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/60">{s.d}</p>
                </li>
              );
            })}
          </ol>
          <Link href="/how-it-works" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-container hover:gap-2.5">
            See the full process <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 5 · SAMPLE REPORT TEASER */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
          <div className="relative h-64 sm:h-80">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute h-full w-48 rounded-md border border-steel/20 bg-white shadow-lg sm:w-56"
                style={{ left: `${i * 3.5}rem`, top: `${i * 0.75}rem`, transform: `rotate(${(i - 1) * 3}deg)`, zIndex: 3 - i }}
              >
                <div className="border-b border-steel/15 p-3">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-steel">GSA-2026-0147 · VERIFICATION</div>
                  <div className="mt-1 h-2 w-3/4 rounded bg-navy/80" />
                </div>
                <div className="space-y-2 p-3">
                  {Array.from({ length: 6 }).map((_, r) => (
                    <div key={r} className="h-1.5 rounded bg-steel/15" style={{ width: `${90 - r * 8}%` }} />
                  ))}
                  <div className="mt-3 inline-block -rotate-2 rounded border-2 border-cleared px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-cleared">
                    Cleared
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <MonoLabel className="text-steel">BEFORE YOU PAY</MonoLabel>
            <h2 className="gsa-heading mt-3 text-3xl font-bold text-navy sm:text-4xl">
              See exactly what you get before you pay
            </h2>
            <p className="mt-4 max-w-lg text-steel">
              A real-format, fully redacted verification report — registry
              findings, license checks, site-visit photos, reference summary, a
              risk rating and our recommendation. No surprises about the
              deliverable.
            </p>
            <Link href="/sample-report" className="mt-6 inline-flex items-center gap-2 rounded-full bg-container px-6 py-3 font-semibold text-white hover:bg-container/90">
              View a sample report <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6 · ORIGINS — GHANA FIRST */}
      <section className="gsa-corrugation bg-navy text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <MonoLabel className="text-container">ORIGINS</MonoLabel>
            <h2 className="gsa-heading mt-3 text-3xl font-bold sm:text-4xl">
              Ghana first — where our ground presence is deepest
            </h2>
            <p className="mt-4 max-w-lg text-white/70">
              Ghana is one of Africa&apos;s lowest-friction origins: English-speaking,
              politically stable, and a long-established exporter of cocoa, shea
              and cashew. That&apos;s where our people are, and where our verification
              is strongest.
            </p>
            <p className="mt-3 max-w-lg text-white/60">
              More origins as clients demand them — <span className="text-white">Egypt and Nigeria next</span>. We&apos;d
              rather be honest about where we&apos;re strong than claim a whole continent.
            </p>
            <Link href="/origins" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-container hover:gap-2.5">
              Explore origins <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3">
            {REGIONS.map((r) => (
              <div key={r.name} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <MapPin className="h-5 w-5 shrink-0 text-container" />
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-white/50">{r.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 · WHO'S ON THE GROUND */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-20 sm:flex-row sm:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ceo.jpg"
            alt="Isreal Kingsley, founder of GlobalSource Africa"
            className="h-40 w-40 shrink-0 rounded-2xl object-cover object-top"
          />
          <div>
            <MonoLabel className="text-steel">WHO&apos;S ON THE GROUND</MonoLabel>
            <h2 className="gsa-heading mt-3 text-2xl font-bold text-navy">Isreal Kingsley</h2>
            <p className="font-mono text-xs uppercase tracking-wider text-steel">Founder · Accra / Kumasi, Ghana</p>
            <p className="mt-4 max-w-xl text-steel">
              Trust services can&apos;t be anonymous. GlobalSource Africa is run by
              real people, in-country, who put their name to every report. When we
              tell you a supplier checks out, we&apos;ve stood in front of it.
            </p>
            <Link href="/about" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-container hover:gap-2.5">
              About us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8 · RESOURCES TEASER */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="flex items-end justify-between">
            <div>
              <MonoLabel className="text-steel">RESOURCES</MonoLabel>
              <h2 className="gsa-heading mt-3 text-3xl font-bold text-navy sm:text-4xl">
                Buyer guides from the ground
              </h2>
            </div>
            <Link href="/resources" className="hidden text-sm font-semibold text-container hover:underline sm:block">
              All resources →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {ARTICLES.map((a) => (
              <Link key={a.slug} href={`/resources/${a.slug}`} className="group rounded-xl border border-steel/20 bg-white p-6 transition-colors hover:border-container">
                <MonoLabel className="text-steel">GUIDE</MonoLabel>
                <h3 className="gsa-heading mt-3 text-lg font-bold leading-snug text-navy group-hover:text-container">
                  {a.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9 · CTA BAND (static; landing animation in Phase 3) */}
      <section className="gsa-corrugation bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <h2 className="gsa-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Ready to source from Africa without the risk?
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/services/verification" className="rounded-full bg-container px-6 py-3 font-semibold text-white hover:bg-container/90">
              Verify a Supplier — from $400
            </Link>
            <Link href="/request" className="rounded-full border border-white/25 px-6 py-3 font-semibold text-white hover:bg-white/5">
              Talk to a Sourcing Specialist
            </Link>
          </div>
          <MonoLabel as="p" className="mt-6 text-center text-white/50">
            RESPONSE WITHIN 48 HOURS · ACCRA, GHANA (GMT)
          </MonoLabel>
        </div>
      </section>
    </>
  );
}
