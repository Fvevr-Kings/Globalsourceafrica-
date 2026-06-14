import type { PriceTier } from "@/lib/types";
import { formatPrice } from "@/lib/format";

// Shows retail price + bulk breakpoints clearly (build spec §6).
export function PriceTierTable({
  retailPriceUsd,
  baseUnit,
  tiers,
}: {
  retailPriceUsd: number;
  baseUnit: string;
  tiers: PriceTier[];
}) {
  const ordered = [...tiers].sort((a, b) => a.min_qty - b.min_qty);
  return (
    <div className="overflow-hidden rounded-xl border border-greenLine">
      <table className="w-full text-sm">
        <thead className="bg-greenSoft text-left text-ink">
          <tr>
            <th className="px-4 py-2 font-medium">Quantity</th>
            <th className="px-4 py-2 font-medium">Price / {baseUnit}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-greenLine">
          <tr>
            <td className="px-4 py-2 text-sub">1 – {ordered[0] ? ordered[0].min_qty - 1 : "any"} (retail)</td>
            <td className="px-4 py-2 font-medium text-ink">
              {formatPrice(retailPriceUsd)}
            </td>
          </tr>
          {ordered.map((tier, i) => {
            const next = ordered[i + 1];
            const range = next
              ? `${tier.min_qty} – ${next.min_qty - 1}`
              : `${tier.min_qty}+`;
            return (
              <tr key={tier.id}>
                <td className="px-4 py-2 text-sub">{range} (bulk)</td>
                <td className="px-4 py-2 font-medium text-green">
                  {formatPrice(tier.unit_price_usd)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
