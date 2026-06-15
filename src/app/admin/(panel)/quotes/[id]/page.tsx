import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import { getQuote } from "@/lib/admin/data";
import { formatPrice } from "@/lib/format";
import { QuoteStatusControl } from "@/components/admin/QuoteStatusControl";

export const dynamic = "force-dynamic";

export default async function AdminQuotePage({
  params,
}: {
  params: { id: string };
}) {
  const q = (await getQuote(params.id)) as any;
  if (!q) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/quotes" className="inline-flex items-center gap-1 text-sm text-sub hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Quote requests
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {q.request_type === "sourcing" ? "Sourcing request" : "Quote request"}
          </h1>
          <p className="text-sm text-sub">
            {new Date(q.created_at).toLocaleString()}
          </p>
        </div>
        <QuoteStatusControl quoteId={q.id} status={q.status} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card title="Customer">
          <Row label="Name" value={q.contact_name} />
          {q.company && <Row label="Company" value={q.company} />}
          {q.country && <Row label="Country" value={q.country} />}
          {q.contact_email && (
            <a href={`mailto:${q.contact_email}`} className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-green hover:underline">
              <Mail className="h-4 w-4" /> {q.contact_email}
            </a>
          )}
          {q.contact_phone && (
            <a href={`tel:${q.contact_phone}`} className="mt-1 flex items-center gap-2 text-sm font-medium text-green hover:underline">
              <Phone className="h-4 w-4" /> {q.contact_phone}
            </a>
          )}
        </Card>

        <Card title="Request">
          <Row label="Product" value={q.product_name ?? "—"} />
          {q.quantity && <Row label="Quantity" value={q.quantity} />}
          {q.target_price_usd != null && (
            <Row label="Target price" value={formatPrice(q.target_price_usd)} />
          )}
          {q.destination && <Row label="Destination" value={q.destination} />}
        </Card>
      </div>

      {q.message && (
        <div className="mt-4 rounded-2xl border border-greenLine bg-white p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Details</h2>
          <p className="mt-2 whitespace-pre-line text-sub">{q.message}</p>
        </div>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-greenLine bg-white p-5">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-sub">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}
