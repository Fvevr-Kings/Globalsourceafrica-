"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MonoLabel } from "../MonoLabel";
import { ContainerArt, TruckArt } from "./art";

gsap.registerPlugin(ScrollTrigger);

// PRD §4.3 — the closing scene. A flatbed waits; as the user scrolls to the end
// of the page a container descends on crane cables and settles onto the trailer
// — fast early, feathered landing, small settle bounce, cables slackening.
// Copy reveal syncs to the descent. Reduced-motion: static landed state.
export function LandingCTA() {
  const band = useRef<HTMLElement>(null);
  const box = useRef<SVGGElement>(null);      // descending container
  const cableL = useRef<SVGLineElement>(null);
  const cableR = useRef<SVGLineElement>(null);
  const truck = useRef<SVGGElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const ctas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: band.current,
          start: "top bottom",
          end: "top 20%",
          scrub: 1.2,
        },
      });

      // Descent (0 → 0.75): fast early, feathered final metres.
      tl.from(box.current, { y: -420, ease: "power3.out", duration: 0.75 }, 0);
      tl.from(cableL.current, { attr: { y2: -110 }, ease: "power3.out", duration: 0.75 }, 0);
      tl.from(cableR.current, { attr: { y2: -110 }, ease: "power3.out", duration: 0.75 }, 0);

      // Touchdown (0.75 → 0.9): settle bounce + trailer suspension dip.
      tl.to(box.current, { y: 4, duration: 0.07, ease: "power2.in" }, 0.75)
        .to(box.current, { y: 0, duration: 0.08, ease: "power2.out" }, 0.82)
        .to(truck.current, { y: 3, duration: 0.07, ease: "power2.in" }, 0.75)
        .to(truck.current, { y: 0, duration: 0.08, ease: "power2.out" }, 0.82)
        // cables slacken after touchdown
        .to([cableL.current, cableR.current], { opacity: 0.15, duration: 0.1 }, 0.8);

      // Copy reveal completes ~80%; CTAs land with the container.
      tl.from(copy.current, { opacity: 0, y: 24, duration: 0.5, ease: "power2.out" }, 0.15);
      tl.from(ctas.current, { opacity: 0, y: 12, duration: 0.15, ease: "power2.out" }, 0.82);
    }, band);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={band} className="gsa-corrugation overflow-hidden bg-navy text-white">
      <div className="mx-auto max-w-5xl px-4 pb-4 pt-20 text-center sm:pt-24">
        <div ref={copy}>
          <MonoLabel className="text-container">THE DEAL, DELIVERED</MonoLabel>
          <h2 className="gsa-heading mx-auto mt-4 max-w-3xl text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Ready to source from Africa without the risk?
          </h2>
        </div>

        <div ref={ctas} className="mt-8">
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/services/verification"
              className="rounded-full bg-container px-6 py-3 font-semibold text-white hover:bg-container/90"
            >
              Verify a Supplier — from $400
            </Link>
            <Link
              href="/request"
              className="rounded-full border border-white/25 px-6 py-3 font-semibold text-white hover:bg-white/5"
            >
              Talk to a Sourcing Specialist
            </Link>
          </div>
          <MonoLabel as="p" className="mt-5 text-center text-white/50">
            RESPONSE WITHIN 48 HOURS · ACCRA, GHANA (GMT)
          </MonoLabel>
        </div>

        {/* Landing scene */}
        <div className="mx-auto mt-10 max-w-3xl">
          <svg viewBox="0 0 800 480" className="w-full" aria-hidden>
            {/* cables from the sky to the container's top corners */}
            <line ref={cableL} x1="180" y1="-40" x2="180" y2="316" stroke="#6B7683" strokeWidth="2.5" />
            <line ref={cableR} x1="430" y1="-40" x2="430" y2="316" stroke="#6B7683" strokeWidth="2.5" />

            {/* descending container (rest pose authored on the bed) */}
            <g ref={box}>
              <rect x="147" y="302" width="316" height="8" rx="2" fill="#16202b" />
              <g transform="translate(155,310)">
                <ContainerArt />
              </g>
            </g>

            {/* waiting truck, empty flatbed */}
            <g ref={truck} transform="translate(90,300)">
              <TruckArt withContainer={false} />
            </g>
            {/* ground */}
            <rect x="0" y="472" width="800" height="4" fill="#ffffff" opacity="0.12" />
          </svg>
        </div>
      </div>
    </section>
  );
}
