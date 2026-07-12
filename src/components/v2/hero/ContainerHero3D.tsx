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
    // -scale-x-100 mirrors the render horizontally: raised end to the LEFT and
    // the branding reads forward. Taller on desktop per request.
    <div ref={wrap} className="h-[280px] w-full -scale-x-100 sm:h-[380px] lg:h-[500px]">
      <Canvas
        // Slightly elevated 3/4 seat on the [5,2.5,5] sightline (scaled close so
        // the container reads large). Never animated — the pose lives on the
        // poseGroup, not the camera. Keyed so the create-only camera re-applies
        // when the breakpoint resolves; phones sit closer to fill the frame.
        key={mobile ? "mobile" : "desktop"}
        // Wider FOV = stronger perspective so 3 faces read as a solid cube.
        camera={{ position: mobile ? [2.9, 1.45, 2.9] : [3.0, 1.5, 3.0], fov: 50 }}
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
