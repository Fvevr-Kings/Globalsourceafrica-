import Link from "next/link";
import { ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { MonoLabel } from "@/components/v2/MonoLabel";
import { TrustStrip } from "@/components/v2/TrustStrip";
import { HeroVisual } from "@/components/v2/hero/HeroVisual";
import { ServiceCard } from "@/components/v2/ServiceCard";
import { CraneSection } from "@/components/v2/scenes/CraneSection";
import { LandingCTA } from "@/components/v2/scenes/LandingCTA";
import { SERVICES } from "@/lib/v2/services";

export const metadata = {
  title: "GlobalSource Africa — supplier verification & sourcing in Africa",
};

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
      {/* 1 · HERO — single column on every screen: H1 on top, container below */}
      <section className="gsa-corrugation relative overflow-hidden bg-white text-navy">
        {/* Earth backdrop — transparent-sky PNG, globe anchored low and
            stretched full-bleed edge to edge, so the falling container reads
            as tumbling down toward the planet. Wider than the viewport on
            phones (so the globe is a real planet, not a thin band) and sunk
            below the copy so its bright rim never fights the trust strip.
            aria-hidden: pure decoration. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/scenes/earth.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-0 max-w-none -translate-x-1/2 select-none -bottom-8 w-[145%] sm:-bottom-16 sm:w-[135%] lg:-bottom-40 lg:w-[108%]"
        />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 pb-0 pt-16 text-center lg:pt-20">
          <MonoLabel className="text-container">ON-GROUND SINCE 2026 · GHANA</MonoLabel>
          <h1 className="gsa-heading mt-5 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-6xl">
            Your verification and sourcing partner on the ground in Africa
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel">
            We help international buyers find, verify and buy from African
            suppliers safely — before you send a single dollar.
          </p>
          {/* Side by side on every screen (kept on one row on phones) */}
          <div className="mt-8 flex justify-center gap-2 sm:gap-3">
            <Link href="/request" className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-container px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand sm:px-6 sm:py-3 sm:text-base">
              Request Sourcing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/services/verification" className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-navy/20 px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-paper sm:px-6 sm:py-3 sm:text-base">
              <ShieldCheck className="h-4 w-4" /> Verify a Supplier
            </Link>
          </div>
          <TrustStrip className="mt-8 justify-center text-steel" items={["SGS-COORDINATED", "ACCRA / KUMASI", "48H RESPONSE", "FLAT-FEE REPORTS"]} />

          {/* Container under the headline — fixed pose rolls in place, so the
              column stays tight instead of reserving sweep room */}
          <div className="mt-2 w-full max-w-md sm:max-w-lg lg:max-w-3xl">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* 2 · PROBLEM STRIP — tight top padding: the hero container above sits
          almost directly on these headings */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8">
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
          <p className="gsa-heading mt-6 text-center text-3xl font-extrabold text-container sm:text-4xl">
            This is why we exist.
          </p>
        </div>
      </section>

      {/* 3 · SERVICES GRID */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-12">
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

      {/* 4 · HOW IT WORKS — crane + scroll-driven truck set piece (PRD §4.2) */}
      <CraneSection />

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
            <MonoLabel className="text-gold">ORIGINS</MonoLabel>
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
            <Link href="/origins" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:gap-2.5">
              Explore origins <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3">
            {REGIONS.map((r) => (
              <div key={r.name} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <MapPin className="h-5 w-5 shrink-0 text-gold" />
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

      {/* 9 · CTA BAND — container lands on the waiting trailer (PRD §4.3) */}
      <LandingCTA />
    </>
  );
}
