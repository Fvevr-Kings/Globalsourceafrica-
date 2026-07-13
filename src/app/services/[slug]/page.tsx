import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowRight, FileCheck2, ClipboardList } from "lucide-react";
import { MonoLabel } from "@/components/v2/MonoLabel";
import { StampBox } from "@/components/v2/StampBox";
import { SERVICES, getService } from "@/lib/v2/services";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getService(params.slug);
  if (!s) return { title: "Service — GlobalSource Africa" };
  return {
    title: `${s.name} (${s.priceLabel}) — GlobalSource Africa`,
    description: s.tagline,
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) notFound();

  return (
    <>
      {/* Header band */}
      <section className="gsa-corrugation bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <MonoLabel className="text-container">{service.code}</MonoLabel>
          <h1 className="gsa-heading mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
            {service.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{service.tagline}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
            <div>
              <MonoLabel className="text-white/50">Fee</MonoLabel>
              <p className="gsa-heading text-2xl font-bold">{service.priceLabel}</p>
            </div>
            <div>
              <MonoLabel className="text-white/50">Timeline</MonoLabel>
              <p className="gsa-heading text-2xl font-bold">{service.timeline}</p>
            </div>
            <Link
              href={`/request?service=${service.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-container px-6 py-3 font-semibold text-white hover:bg-container/90"
            >
              Request this service <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <p className="text-lg leading-relaxed text-navy/80">{service.intro}</p>

          {/* Protects-from stamp */}
          <StampBox className="mt-8 max-w-xl">{service.protectsFrom}</StampBox>

          {/* What you get */}
          <div className="mt-12">
            <MonoLabel className="text-steel">WHAT YOU GET</MonoLabel>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.scope.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-navy/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-cleared" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverable + what we need */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-steel/20 bg-paper p-5">
              <div className="flex items-center gap-2 text-navy">
                <FileCheck2 className="h-5 w-5 text-container" />
                <MonoLabel className="text-steel">YOU RECEIVE</MonoLabel>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-navy/80">{service.deliverable}</p>
            </div>
            <div className="rounded-xl border border-steel/20 bg-paper p-5">
              <div className="flex items-center gap-2 text-navy">
                <ClipboardList className="h-5 w-5 text-container" />
                <MonoLabel className="text-steel">WHAT WE NEED FROM YOU</MonoLabel>
              </div>
              <ul className="mt-2 space-y-1.5 text-sm text-navy/80">
                {service.weNeed.map((w) => (
                  <li key={w} className="flex gap-2">
                    <span className="text-container">·</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <MonoLabel className="text-steel">FAQ</MonoLabel>
            <dl className="mt-4 divide-y divide-steel/15">
              {service.faq.map((f) => (
                <div key={f.q} className="py-4">
                  <dt className="font-semibold text-navy">{f.q}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-steel">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 rounded-2xl bg-navy p-8 text-center text-white">
            <h2 className="gsa-heading text-2xl font-bold">Ready to start?</h2>
            <p className="mx-auto mt-2 max-w-md text-white/70">
              Send the details and we&apos;ll confirm the flat fee and scope within 48 hours.
            </p>
            <Link
              href={`/request?service=${service.slug}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-container px-6 py-3 font-semibold text-white hover:bg-container/90"
            >
              Request {service.name} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
