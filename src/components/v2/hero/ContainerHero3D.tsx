"use client";

import { Component, Suspense, useEffect, useRef, type ReactNode } from "react";
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

// Desktop 3D hero. Uses a photoreal GLB at /models/container.glb when present,
// otherwise the code-built container. Rotation/rise/scale scrubbed to hero scroll.
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

  const fallback = <ProceduralContainer progress={progress} />;

  return (
    <div ref={wrap} className="h-[320px] w-full sm:h-[420px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
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
