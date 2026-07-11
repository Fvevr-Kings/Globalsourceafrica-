import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MonoLabel } from "./MonoLabel";
import type { Service } from "@/lib/v2/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group flex flex-col rounded-xl border border-steel/20 bg-white p-6 transition-colors hover:border-container">
      <MonoLabel className="text-container">{service.code}</MonoLabel>
      <h3 className="gsa-heading mt-3 text-xl font-bold text-navy">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-steel">{service.tagline}</p>

      <dl className="mt-4 flex items-end justify-between border-t border-steel/15 pt-4">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">Fee</dt>
          <dd className="gsa-heading text-lg font-bold text-navy">{service.priceLabel}</dd>
        </div>
        <div className="text-right">
          <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">Timeline</dt>
          <dd className="text-sm font-medium text-navy">{service.timeline}</dd>
        </div>
      </dl>

      <Link
        href={`/services/${service.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-container hover:gap-2.5"
      >
        See scope <ArrowRight className="h-4 w-4 transition-all" />
      </Link>
    </div>
  );
}
