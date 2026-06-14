"use client";

import { useState } from "react";
import { ChevronDown, ShieldCheck, Wallet, Clock } from "lucide-react";

// Quiet, collapsed-by-default trust panel (build spec §3, §6). Never a gate.
export function WhyUsToggle() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-greenLine bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-ink"
      >
        Why buy from us
        <ChevronDown
          className={`h-5 w-5 text-sub transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="grid gap-4 border-t border-greenLine bg-greenSoft px-5 py-5 sm:grid-cols-3">
          <Point
            icon={<ShieldCheck className="h-5 w-5 text-green" />}
            title="Verified origin"
            body="Every batch ships with region, harvest date, grade and a quality report."
          />
          <Point
            icon={<Wallet className="h-5 w-5 text-green" />}
            title="You pay us, not strangers"
            body="Global-Source Africa is the merchant of record. One business stands behind every order."
          />
          <Point
            icon={<Clock className="h-5 w-5 text-green" />}
            title="Long shelf life"
            body="Non-perishable, low-moisture goods graded and stored for reliable global shipping."
          />
        </div>
      )}
    </div>
  );
}

function Point({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <h4 className="font-display text-base font-semibold text-ink">{title}</h4>
        <p className="text-sm text-sub">{body}</p>
      </div>
    </div>
  );
}
