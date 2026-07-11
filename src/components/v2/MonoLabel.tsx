import type { ReactNode } from "react";

// Shipping-manifest style label: IBM Plex Mono, uppercase, wide tracking, steel.
// e.g. <MonoLabel>REQ-2026-0147 · VERIFICATION</MonoLabel>
export function MonoLabel({
  children,
  className = "",
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "div";
}) {
  return (
    <Tag
      className={`font-mono text-[11px] uppercase tracking-[0.18em] text-steel ${className}`}
    >
      {children}
    </Tag>
  );
}
