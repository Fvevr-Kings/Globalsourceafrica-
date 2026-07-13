"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MonoLabel } from "../MonoLabel";
import { SceneImg } from "./SceneImg";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { n: "01", t: "Submit your request", d: "Tell us the product, quantity, destination and specs — or name a supplier you want checked." },
  { n: "02", t: "We scope and quote our fee", d: "Flat fee confirmed upfront. You know the cost before anything starts." },
  { n: "03", t: "Ground work begins", d: "Registry checks, license verification, physical or video audit, reference calls." },
  { n: "04", t: "Inspection coordinated", d: "SGS or equivalent at sampling and loading. You never ship blind." },
  { n: "05", t: "You receive the report / verified deal", d: "A decision-ready document, or a supplier you can transact with confidently." },
];

// How It Works — 5 steps reveal in sequence, then a REAL truck image drives
// across the section as you scroll (PRD §4.2, LogiCart-style delight). Uses a
// transparent PNG at /scenes/truck.webp. Reduced-motion: static.
export function CraneSection() {
  const section = useRef<HTMLElement>(null);
  const truckWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gsa-step").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: `top ${92 - i * 2}%` },
        });
      });

      // The user drives the truck across by scrolling (scrubbed).
      gsap.fromTo(
        truckWrap.current,
        { xPercent: -120 },
        {
          xPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: truckWrap.current,
            start: "top 92%",
            end: "top 40%",
            scrub: 1,
          },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="overflow-hidden bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center">
          <MonoLabel className="text-container">HOW IT WORKS</MonoLabel>
          <h2 className="gsa-heading mt-3 text-3xl font-bold text-navy sm:text-4xl">
            From request to verified deal
          </h2>
        </div>

        {/* Steps with dotted connector */}
        <div className="relative mt-12">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-steel/30 lg:block"
          />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s) => (
              <li key={s.n} className="gsa-step relative rounded-xl border border-steel/20 bg-white p-5">
                <span className="gsa-heading relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-container font-mono text-sm font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-navy">{s.t}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-steel">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Real truck drives across on scroll */}
        <div className="relative mt-16 h-40 sm:h-56">
          <div ref={truckWrap} className="absolute bottom-6 left-0 w-[70%] max-w-xl sm:w-[52%]">
            <SceneImg
              src="/scenes/truck.webp"
              alt="GlobalSource Africa container truck"
              className="h-auto w-full drop-shadow-xl"
              label="MISSING: /public/scenes/truck.webp"
            />
          </div>
          {/* road */}
          <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-steel/25" />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-container hover:gap-2.5"
          >
            See the full process <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
