import type { ReactNode } from "react";

// "Customs stamp" treatment (PRD §3.2): cleared-green border, slight rotation,
// mono heading. Used for the "What this protects you from" callouts.
export function StampBox({
  title = "What this protects you from",
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative -rotate-2 rounded-md border-2 border-cleared bg-paper/60 px-5 py-4 ${className}`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cleared">
        {title}
      </p>
      <div className="mt-2 text-sm leading-relaxed text-navy">{children}</div>
    </div>
  );
}
