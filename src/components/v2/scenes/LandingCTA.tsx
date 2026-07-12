"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MonoLabel } from "../MonoLabel";
import { SceneImg } from "./SceneImg";

gsap.registerPlugin(ScrollTrigger);

// PRD §4.3 — the closing scene. A real flatbed truck waits; as the user scrolls
// to the end of the page a real container image descends on crane cables and
// settles onto the trailer (feathered landing, settle bounce, suspension dip,
// cables slacken). Copy reveals during the descent. Uses transparent PNGs at
// /scenes/flatbed.png and /scenes/container.png. Reduced-motion: static landed.
export function LandingCTA() {
  const band = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);      // descending container
  const truck = useRef<HTMLDivElement>(null);    // waiting flatbed
  const cables = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const ctas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: band.current,
          start: "top 80%",
          end: "bottom 90%",
          scrub: 1.2,
        },
      });

      // Descent (0 → 0.75): fast early, feathered final metres.
      tl.from(box.current, { yPercent: -420, ease: "power3.out", duration: 0.75 }, 0);
      // Touchdown (0.75): settle bounce + suspension dip.
      tl.to(box.current, { y: 5, duration: 0.07, ease: "power2.in" }, 0.75)
        .to(box.current, { y: 0, duration: 0.08, ease: "power2.out" }, 0.82)
        .to(truck.current, { y: 4, duration: 0.07, ease: "power2.in" }, 0.75)
        .to(truck.current, { y: 0, duration: 0.08, ease: "power2.out" }, 0.82)
        .to(cables.current, { opacity: 0, duration: 0.12 }, 0.8);

      tl.from(copy.current, { opacity: 0, y: 24, duration: 0.5, ease: "power2.out" }, 0.1);
      tl.from(ctas.current, { opacity: 0, y: 12, duration: 0.15, ease: "power2.out" }, 0.82);
    }, band);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={band} className="gsa-corrugation overflow-hidden bg-navy text-white">
      <div className="mx-auto max-w-5xl px-4 pb-6 pt-20 text-center sm:pt-24">
        <div ref={copy}>
          <MonoLabel className="text-container">THE DEAL, DELIVERED</MonoLabel>
          <h2 className="gsa-heading mx-auto mt-4 max-w-3xl text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Ready to source from Africa without the risk?
          </h2>
        </div>

        <div ref={ctas} className="mt-8">
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/services/verification" className="rounded-full bg-container px-6 py-3 font-semibold text-white hover:bg-container/90">
              Verify a Supplier — from $400
            </Link>
            <Link href="/request" className="rounded-full border border-white/25 px-6 py-3 font-semibold text-white hover:bg-white/5">
              Talk to a Sourcing Specialist
            </Link>
          </div>
          <MonoLabel as="p" className="mt-5 text-center text-white/50">
            RESPONSE WITHIN 48 HOURS · ACCRA, GHANA (GMT)
          </MonoLabel>
        </div>

        {/* Landing scene */}
        <div className="relative mx-auto mt-10 h-[380px] w-full max-w-3xl sm:h-[460px]">
          {/* waiting flatbed truck */}
          <div ref={truck} className="absolute bottom-4 left-1/2 w-[92%] max-w-2xl -translate-x-1/2">
            <SceneImg
              src="/scenes/flatbed.webp"
              alt="Flatbed truck waiting"
              className="h-auto w-full"
              label="MISSING: /public/scenes/flatbed.webp"
            />
          </div>

          {/* descending container — the image carries its own crane spreader;
              one hoist line continues from its top up out of the scene */}
          <div ref={box} className="absolute bottom-[74px] left-1/2 w-[46%] max-w-sm -translate-x-[58%]">
            <div ref={cables}>
              <span className="absolute bottom-full left-1/2 h-[420px] w-0.5 -translate-x-1/2 bg-steel/60" />
            </div>
            <SceneImg
              src="/scenes/container.webp"
              alt="GlobalSource Africa container on crane spreader"
              className="h-auto w-full drop-shadow-2xl"
              label="MISSING: /public/scenes/container.webp"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
