import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MonoLabel } from "@/components/v2/MonoLabel";
import { ARTICLES } from "@/lib/v2/articles";

export const metadata: Metadata = {
  title: "Resources — GlobalSource Africa",
  description:
    "Buyer guides from the ground: verifying suppliers, avoiding EU rejections, export documentation, shea sourcing, and Letters of Credit.",
};

export default function ResourcesPage() {
  return (
    <>
      <section className="gsa-corrugation bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <MonoLabel className="text-container">RESOURCES</MonoLabel>
          <h1 className="gsa-heading mt-3 text-4xl font-extrabold sm:text-5xl">
            Buyer guides from the ground
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            Practical guides for sourcing from Africa safely — written from what we
            see doing this work every day.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid gap-5 md:grid-cols-2">
            {ARTICLES.map((a) => (
              <Link
                key={a.slug}
                href={`/resources/${a.slug}`}
                className="group flex flex-col rounded-xl border border-steel/20 bg-white p-6 transition-colors hover:border-container"
              >
                <MonoLabel className="text-steel">GUIDE · {a.readMins} MIN</MonoLabel>
                <h2 className="gsa-heading mt-3 text-xl font-bold leading-snug text-navy group-hover:text-container">
                  {a.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-steel">{a.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-container">
                  Read <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
