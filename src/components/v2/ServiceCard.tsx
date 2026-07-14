"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MonoLabel } from "./MonoLabel";
import type { Service } from "@/lib/v2/services";

const SPARK_MS = 1200;

/**
 * A gold spark that traces the card's frame once per trigger.
 *
 * The travelling dash is an SVG rounded-rect stroke with pathLength="100", which
 * renormalises the perimeter to 100 user units regardless of the card's real
 * pixel size — so one dasharray works for every card at every breakpoint, and the
 * spark keeps a constant *relative* length instead of stretching on wide cards.
 * The rect path starts at the top-left and runs clockwise, which is exactly the
 * requested top → right → bottom → left circuit.
 */
function useSpark() {
  const ref = useRef<SVGRectElement>(null);
  const anim = useRef<Animation | null>(null);

  const play = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion: the resting gold border is the whole signal, no trace.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Restart rather than stack — re-hovering re-runs the trace, it never loops.
    anim.current?.cancel();
    anim.current = el.animate(
      [
        { strokeDashoffset: 100, opacity: 0 },
        { opacity: 1, offset: 0.06 },
        { opacity: 1, offset: 0.82 },
        { strokeDashoffset: 0, opacity: 0 },
      ],
      { duration: SPARK_MS, easing: "ease-in-out", fill: "forwards" }
    );
  }, []);

  return { ref, play };
}

export function ServiceCard({ service }: { service: Service }) {
  const card = useRef<HTMLDivElement>(null);
  const { ref: sparkRef, play } = useSpark();

  // Touch/no-hover devices never fire mouseenter, so there the spark is driven by
  // scroll instead: it fires as the card reaches the middle of the viewport, which
  // is what walks the user's eye down the four cards. Guarded by the hover media
  // query so desktop doesn't get both triggers competing.
  useEffect(() => {
    const el = card.current;
    if (!el) return;
    if (window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let fired = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          play();
          io.unobserve(el); // once per card — not a loop
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  return (
    <div
      ref={card}
      onMouseEnter={play}
      onFocus={play}
      className="group relative flex flex-col rounded-xl border border-gold/25 bg-white p-6 shadow-[0_1px_2px_rgba(11,34,57,0.04),0_4px_12px_-4px_rgba(11,34,57,0.08)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_8px_16px_-4px_rgba(11,34,57,0.10),0_18px_36px_-12px_rgba(11,34,57,0.16)] focus-within:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
    >
      {/* The travelling spark. Purely decorative and never hit-testable, so it
          can sit above the card content without stealing clicks from the link. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Full-box rect with overflow-visible: the stroke centres on the card's
            own border line, so the spark rides the border rather than floating
            inside it. rx matches rounded-xl (12px). */}
        <rect
          ref={sparkRef}
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="12"
          ry="12"
          fill="none"
          stroke="#C9A227"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="9 91"
          strokeDashoffset="100"
          opacity="0"
          style={{ filter: "drop-shadow(0 0 3px rgba(201,162,39,0.9))" }}
        />
      </svg>

      <MonoLabel className="text-container">{service.code}</MonoLabel>
      <h3 className="gsa-heading mt-3 text-xl font-bold text-navy">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-steel">{service.tagline}</p>

      <dl className="mt-4 flex items-end justify-between border-t border-steel/15 pt-4">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">Fee</dt>
          <dd className="gsa-heading text-lg font-bold text-navy">{service.priceLabel}</dd>
        </div>
        <div className="text-right">
          <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">Timeline</dt>
          <dd className="text-sm font-medium text-navy">{service.timeline}</dd>
        </div>
      </dl>

      <Link
        href={`/services/${service.slug}`}
        className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-container hover:gap-2.5"
      >
        See scope <ArrowRight className="h-4 w-4 transition-all" />
      </Link>
    </div>
  );
}
