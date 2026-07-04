import { Check, PackageCheck, Clock, Boxes, Truck, Home, RotateCcw } from "lucide-react";

// The order lifecycle every order flows through (us → merchant → buyer).
const STEPS = [
  { key: "placed", label: "Order placed", detail: "We received your order.", icon: PackageCheck },
  { key: "confirmed", label: "Confirmed", detail: "Payment confirmed and order accepted.", icon: Check },
  { key: "processing", label: "Processing", detail: "Being prepared with our supplier.", icon: Boxes },
  { key: "shipped", label: "Shipped", detail: "On its way to you.", icon: Truck },
  { key: "delivered", label: "Delivered", detail: "Arrived at its destination.", icon: Home },
] as const;

function fmt(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString();
}

export function OrderTimeline({
  status,
  statusUpdatedAt,
  trackingNote,
}: {
  status: string;
  statusUpdatedAt?: string | null;
  trackingNote?: string | null;
}) {
  // Refunded is off the linear track — show it plainly.
  if (status === "refunded") {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-orange/10 p-4 text-sm text-orangeDark">
        <RotateCcw className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold">Refunded</p>
          {trackingNote && <p className="mt-1">{trackingNote}</p>}
          {statusUpdatedAt && <p className="mt-1 text-xs opacity-80">Updated {fmt(statusUpdatedAt)}</p>}
        </div>
      </div>
    );
  }

  const currentIdx = Math.max(0, STEPS.findIndex((s) => s.key === status));

  return (
    <div>
      <ol className="relative space-y-6">
        {STEPS.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          const Icon = step.icon;
          return (
            <li key={step.key} className="relative flex gap-4">
              {idx < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5 ${
                    done ? "bg-green" : "bg-greenLine"
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                  done
                    ? "border-green bg-green text-white"
                    : active
                    ? "border-green bg-white text-green"
                    : "border-greenLine bg-white text-sub"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>
              <div className={active ? "pt-1" : "pt-1 opacity-70"}>
                <p className={`text-sm font-semibold ${active || done ? "text-ink" : "text-sub"}`}>
                  {step.label}
                  {active && <span className="ml-2 rounded-full bg-greenSoft px-2 py-0.5 text-xs font-medium text-green">Current</span>}
                </p>
                <p className="text-xs text-sub">
                  {active && trackingNote ? trackingNote : step.detail}
                </p>
                {active && statusUpdatedAt && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-sub">
                    <Clock className="h-3 w-3" aria-hidden /> Updated {fmt(statusUpdatedAt)}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
