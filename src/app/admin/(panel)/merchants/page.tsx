import { listApplications, listSuppliers } from "@/lib/admin/data";
import { ApplicationActions } from "@/components/admin/ApplicationActions";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-orange/10 text-orangeDark",
  approved: "bg-green text-white",
  rejected: "bg-greenSoft text-sub",
};

export default async function AdminMerchantsPage() {
  const [applications, suppliers] = await Promise.all([
    listApplications(),
    listSuppliers(),
  ]);
  const pending = applications.filter((a: any) => a.status === "pending");
  const reviewed = applications.filter((a: any) => a.status !== "pending");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Merchants</h1>
        <p className="mt-1 text-sm text-sub">
          Approve supplier applications. Approved merchants become verified
          suppliers — kept behind the brand, never shown to buyers.
        </p>
      </div>

      <section>
        <h2 className="font-display text-lg font-semibold text-ink">
          Pending applications ({pending.length})
        </h2>
        <div className="mt-3 space-y-3">
          {pending.length === 0 && (
            <p className="rounded-2xl border border-greenLine bg-white p-5 text-sm text-sub">
              No pending applications.
            </p>
          )}
          {pending.map((a: any) => (
            <div key={a.id} className="rounded-2xl border border-greenLine bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">
                    {a.business_name}
                  </h3>
                  <p className="text-sm text-sub">
                    {a.country}
                    {a.categories?.length ? ` · ${a.categories.join(", ")}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-sub">
                    {a.contact_email ?? ""} {a.contact_phone ?? ""}
                  </p>
                  {a.message && (
                    <p className="mt-2 max-w-xl text-sm text-ink">“{a.message}”</p>
                  )}
                  <p className="mt-1 text-xs text-sub">
                    Applied {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <ApplicationActions id={a.id} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-ink">
          Verified suppliers ({suppliers.filter((s: any) => s.verified).length})
        </h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-greenLine bg-white">
          <table className="w-full text-sm">
            <thead className="bg-greenSoft text-left text-ink">
              <tr>
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-greenLine">
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-sub">
                    No suppliers yet.
                  </td>
                </tr>
              )}
              {suppliers.map((s: any) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-medium text-ink">{s.business_name}</td>
                  <td className="px-4 py-3 text-sub">{s.country}</td>
                  <td className="px-4 py-3">
                    {s.verified ? (
                      <span className="text-green">Verified</span>
                    ) : (
                      <span className="text-sub">Unverified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {reviewed.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            Reviewed applications
          </h2>
          <div className="mt-3 space-y-2">
            {reviewed.map((a: any) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-xl border border-greenLine bg-white px-4 py-3 text-sm"
              >
                <span className="text-ink">{a.business_name}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLE[a.status]}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
