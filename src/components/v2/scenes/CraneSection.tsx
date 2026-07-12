"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MonoLabel } from "../MonoLabel";
import { ContainerArt, TruckArt } from "./art";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { n: "01", t: "Submit your request", d: "Tell us the product, quantity, destination and specs — or name a supplier you want checked." },
  { n: "02", t: "We scope and quote our fee", d: "Flat fee confirmed upfront. You know the cost before anything starts." },
  { n: "03", t: "Ground work begins", d: "Registry checks, license verification, physical or video audit, reference calls." },
  { n: "04", t: "Inspection coordinated", d: "SGS or equivalent at sampling and loading. You never ship blind." },
  { n: "05", t: "You receive the report / verified deal", d: "A decision-ready document, or a supplier you can transact with confidently." },
];

// PRD §4.2 — crane-suspended container lowers + sways as the section enters;
// the 5 steps reveal in sequence; the truck is DRIVEN BY SCROLL from off-screen
// left to its parked spot, wheels rolling. Reduced-motion: static rest state.
export function CraneSection() {
  const section = useRef<HTMLElement>(null);
  const craneBox = useRef<SVGGElement>(null);
  const truckWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // Container lowers on its cables as the section scrolls in.
      gsap.from(craneBox.current, {
        y: -40,
        scrollTrigger: {
          trigger: section.current,
          start: "top 85%",
          end: "top 30%",
          scrub: 0.8,
        },
      });

      // Gentle sway while on screen (paused off-screen for perf).
      const sway = gsap.fromTo(
        craneBox.current,
        { rotation: -1.5, transformOrigin: "50% 0%" },
        { rotation: 1.5, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true }
      );
      ScrollTrigger.create({
        trigger: section.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? sway.play() : sway.pause()),
      });

      // Steps reveal sequentially, each at its own scroll position.
      gsap.utils.toArray<HTMLElement>(".gsa-step").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: `top ${92 - i * 2}%` },
        });
      });

      // The user drives the truck in by scrolling (scrubbed), wheels rolling.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: truckWrap.current,
          start: "top 95%",
          end: "top 45%",
          scrub: 1,
        },
      });
      tl.from(truckWrap.current, { xPercent: -130, ease: "none" }, 0).from(
        ".gsa-wheel",
        { rotation: -720, ease: "none" },
        0
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

        {/* Crane + hanging container */}
        <div className="mt-10 flex justify-center">
          <svg viewBox="0 0 480 330" className="w-full max-w-md" aria-hidden>
            {/* gantry beam + trolley */}
            <rect x="0" y="10" width="480" height="14" fill="#1c242e" />
            <rect x="200" y="24" width="80" height="14" rx="2" fill="#16202b" />
            <circle cx="240" cy="38" r="5" fill="#E8622C" />
            {/* hanging group: cables + spreader + container */}
            <g ref={craneBox}>
              <line x1="140" y1="-160" x2="140" y2="152" stroke="#6B7683" strokeWidth="2.5" />
              <line x1="340" y1="-160" x2="340" y2="152" stroke="#6B7683" strokeWidth="2.5" />
              <rect x="128" y="142" width="224" height="8" rx="2" fill="#16202b" />
              <g transform="translate(90,150)">
                <ContainerArt />
              </g>
            </g>
          </svg>
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

        {/* Scroll-driven truck */}
        <div className="mt-14">
          <div ref={truckWrap} className="mx-auto max-w-2xl">
            <svg viewBox="0 0 620 200" className="w-full" aria-hidden>
              <TruckArt withContainer />
              {/* road line */}
              <rect x="-40" y="184" width="700" height="4" rx="2" fill="#6B7683" opacity="0.35" />
            </svg>
          </div>
        </div>

        <div className="mt-8 text-center">
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
