"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContainerScene } from "./ContainerScene";

gsap.registerPlugin(ScrollTrigger);

// Desktop 3D hero: the container rotates ~360°, rises and scales down as the
// hero scrolls past (PRD §4.1 choreography), scrubbed to scroll for weight.
export function ContainerHero3D() {
  const progress = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const section = el.closest("section") ?? el;
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: 0.8,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={wrap} className="h-[320px] w-full sm:h-[420px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        frameloop="always"
      >
        <ContainerScene progress={progress} />
      </Canvas>
    </div>
  );
}
