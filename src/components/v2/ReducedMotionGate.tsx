"use client";

import { useEffect, useState, type ReactNode } from "react";

// Returns true when the user prefers reduced motion (SSR-safe: false until
// mounted, so the static fallback is what renders on the server).
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

// Wraps a signature animation: renders `fallback` (a static composed image /
// simple markup) under reduced-motion, otherwise renders the animated children.
// All three PRD set pieces mount through this.
export function ReducedMotionGate({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  return <>{reduced ? fallback : children}</>;
}
