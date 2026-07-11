import type { Metadata } from "next";
import { MonoLabel } from "@/components/v2/MonoLabel";
import { ServiceCard } from "@/components/v2/ServiceCard";
import { SERVICES } from "@/lib/v2/services";

export const metadata: Metadata = {
  title: "Services — GlobalSource Africa",
  description:
    "Supplier verification, discovery, inspection coordination and full sourcing management — published, flat fees. Sourcing from Africa without the risk.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="gsa-corrugation bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <MonoLabel className="text-container">SERVICES</MonoLabel>
          <h1 className="gsa-heading mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Everything you need to buy from Africa with confidence
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            Pick a single check or hand us the whole deal. Fees are published and
            flat — you always know the cost before anything starts.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
