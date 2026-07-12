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
    <div ref={wrap} className="h-[280px] w-full sm:h-[360px] lg:h-[440px]">
      <Canvas
        // Slightly above and back on the [4,3,6] sightline (scaled so the
        // container stays large), looking at the origin — a straight-on camera
        // would flatten the 3/4 tilt. Keyed so the create-only camera re-applies
        // when the breakpoint resolves; phones sit closer to fill the frame.
        key={mobile ? "mobile" : "desktop"}
        // Slightly elevated 3/4 seat on the [5,2.5,5] sightline (scaled close so
        // the container reads large). Never animated — the pose lives on the
        // poseGroup, not the camera.
        camera={{ position: mobile ? [2.9, 1.45, 2.9] : [3.3, 1.65, 3.3], fov: 42 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
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
