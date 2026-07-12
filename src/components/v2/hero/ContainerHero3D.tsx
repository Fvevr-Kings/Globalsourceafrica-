"use client";

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SceneRig, ProceduralContainer } from "./ContainerScene";
import { ContainerModel } from "./ContainerModel";

gsap.registerPlugin(ScrollTrigger);

// Falls back to the code-built container if the GLB fails to load/parse.
class ModelErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// The 3D hero runs on every device. Mobile gets a closer camera (container
// reads big, not shrunken) and a capped pixel ratio so low-end phones stay
// smooth; desktop gets the full treatment. Roll is scrubbed to hero scroll.
export function ContainerHero3D() {
  const progress = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

  const fallback = <ProceduralContainer progress={progress} />;

  return (
    <div ref={wrap} className="h-[300px] w-full sm:h-[380px] lg:h-[420px]">
      <Canvas
        // Closer camera on phones so the container fills the frame. Keyed so the
        // camera re-applies when the breakpoint resolves (camera is create-only).
        key={mobile ? "mobile" : "desktop"}
        camera={{ position: [0, 0, mobile ? 4.6 : 6], fov: 40 }}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
        frameloop="always"
      >
        <SceneRig />
        <ModelErrorBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <ContainerModel progress={progress} />
          </Suspense>
        </ModelErrorBoundary>
      </Canvas>
    </div>
  );
}
