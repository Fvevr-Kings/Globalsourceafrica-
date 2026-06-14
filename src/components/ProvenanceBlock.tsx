import Image from "next/image";
import { FileText, MapPin, CalendarDays, Droplets, Award } from "lucide-react";
import type { ProductWithTiers } from "@/lib/types";

// Trust-by-evidence section (build spec §6). Shows structured provenance and
// batch photos when present. No supplier identity.
export function ProvenanceBlock({ product }: { product: ProductWithTiers }) {
  const facts: { icon: React.ReactNode; label: string; value: string }[] = [];
  if (product.origin_region)
    facts.push({
      icon: <MapPin className="h-4 w-4 text-green" />,
      label: "Region",
      value: `${product.origin_region}, ${product.origin_country}`,
    });
  if (product.harvest_date)
    facts.push({
      icon: <CalendarDays className="h-4 w-4 text-green" />,
      label: "Harvest date",
      value: new Date(product.harvest_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
  if (product.moisture_pct != null)
    facts.push({
      icon: <Droplets className="h-4 w-4 text-green" />,
      label: "Moisture",
      value: `${product.moisture_pct}%`,
    });
  if (product.grade)
    facts.push({
      icon: <Award className="h-4 w-4 text-green" />,
      label: "Grade",
      value: product.grade,
    });

  const hasContent =
    facts.length > 0 ||
    product.certifications.length > 0 ||
    product.quality_report_url ||
    product.batch_photo_urls.length > 0;

  if (!hasContent) return null;

  return (
    <section className="rounded-2xl border border-greenLine bg-white p-6">
      <h2 className="font-display text-xl font-semibold text-ink">
        Provenance &amp; quality
      </h2>
      <p className="mt-1 text-sm text-sub">
        Verified details for this batch — trust by evidence, not claims.
      </p>

      {facts.length > 0 && (
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="flex items-center gap-1.5 text-xs font-medium text-sub">
                {f.icon}
                {f.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {product.certifications.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {product.certifications.map((c) => (
            <span
              key={c}
              className="rounded-full bg-greenSoft px-3 py-1 text-xs font-medium capitalize text-green"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {product.quality_report_url && (
        <a
          href={product.quality_report_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-green underline-offset-2 hover:underline"
        >
          <FileText className="h-4 w-4" aria-hidden />
          View quality report
        </a>
      )}

      {product.batch_photo_urls.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-medium text-ink">Batch photos</h3>
          <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {product.batch_photo_urls.map((url, i) => (
              <div
                key={url}
                className="relative aspect-square overflow-hidden rounded-lg bg-greenSoft"
              >
                <Image
                  src={url}
                  alt={`Batch photo ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 200px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
