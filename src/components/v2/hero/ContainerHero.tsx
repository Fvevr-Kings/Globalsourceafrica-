"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MODEL_URL = "/models/container.glb";
// Brand gold for the "AFRICA" wordmark on the container livery (matches the
// logo mark's gold arrow; the old orange was pre-rebrand).
const ORANGE = "#C9A227";

// ---------------------------------------------------------------------------
// LOCKED POSE — dialed visually with leva/debug screenshots (2026-07-13),
// then horizontally mirrored ([x,-y,-z] of the dialed values) so the
// container faces LEFT. Three faces read at once: branded LONG SIDE lifted
// up-right, ROOF receding upper-left, UNDERSIDE showing along the lower
// edge. Nose (door end) dives away toward the lower-left; rear end lifted
// up-right toward the viewer — the Bankar falling-container look. Set ONCE
// on poseGroup; NOTHING animates it. The camera is equally static.
// ---------------------------------------------------------------------------
const POSE: [number, number, number] = [-0.72, 2.43, 0.45];
const CAMERA: [number, number, number] = [0, 1.2, 5.4];
const FOV = 45;

// Scroll roll: one full revolution around the container's LONG axis over the
// hero's scroll range. The model's length runs along local Z (dims ≈
// 1.33 × 1.41 × 3.20 after normalisation), so Z is the rolling-pin axis —
// verified visually: rolling Z keeps the falling silhouette identical while
// the faces revolve; rolling X tumbles end-over-end.
const ROLL_TURNS = 1;

// ---------------------------------------------------------------------------
// Brand texture — the real GSA emblem on a white badge + wordmark, drawn to a
// canvas and applied as decal planes on the container's long sides. The
// emblem is a transparent PNG loaded async; the badge/wordmark paint
// immediately and the emblem is composited in (tex.needsUpdate) once it loads.
// ---------------------------------------------------------------------------
const LOGO_MARK_URL = "/scenes/logo_mark.png";

function makeBrandTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;

  // white badge on the left, wordmark to its right (real container livery)
  const badge = { x: 24, y: 26, w: 204, h: 204, r: 28 };
  const textX = badge.x + badge.w + 34;

  const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  const draw = (logo?: HTMLImageElement) => {
    ctx.clearRect(0, 0, c.width, c.height);

    // white rounded badge so the green/gold emblem reads on the dark steel
    ctx.fillStyle = "#ffffff";
    roundRect(badge.x, badge.y, badge.w, badge.h, badge.r);
    ctx.fill();
    if (logo) {
      const pad = 24;
      const s = Math.min((badge.w - pad * 2) / logo.width, (badge.h - pad * 2) / logo.height);
      const dw = logo.width * s;
      const dh = logo.height * s;
      ctx.drawImage(logo, badge.x + (badge.w - dw) / 2, badge.y + (badge.h - dh) / 2, dw, dh);
    }

    // wordmark — shrink to fit so the final E never clips
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    let size = 92;
    ctx.font = `800 ${size}px Arial, sans-serif`;
    const avail = c.width - textX - 24;
    const tw = ctx.measureText("GLOBALSOURCE").width;
    if (tw > avail) {
      size = Math.floor((size * avail) / tw);
      ctx.font = `800 ${size}px Arial, sans-serif`;
    }
    ctx.fillText("GLOBALSOURCE", textX, c.height / 2 - 30);
    ctx.fillStyle = ORANGE;
    ctx.font = "700 50px Arial, sans-serif";
    ctx.fillText("A F R I C A", textX, c.height / 2 + 58);

    tex.needsUpdate = true;
  };

  draw(); // badge + wordmark now; emblem composites in on load
  const img = new Image();
  img.onload = () => draw(img);
  img.src = LOGO_MARK_URL;

  return tex;
}

// ---------------------------------------------------------------------------
// ContainerModel — GLB normalised to ~3.2 units with its geometric center
// dead on the origin (recomputed from the SCALED bounds, then verified:
// post-offset box center = (0,0,0)). The pivot must stay centered or the
// long-axis roll orbits an edge instead of spinning in place.
// ---------------------------------------------------------------------------
function ContainerModel() {
  const { scene } = useGLTF(MODEL_URL);

  const { model, dims } = useMemo(() => {
    const s = scene.clone(true);
    // normalise size first…
    const raw = new THREE.Box3().setFromObject(s).getSize(new THREE.Vector3());
    const scale = 3.2 / Math.max(raw.x, raw.y, raw.z, 0.001);
    s.scale.setScalar(scale);
    // …then recenter using the SCALED bounds so the center sits at (0,0,0).
    const box = new THREE.Box3().setFromObject(s);
    s.position.sub(box.getCenter(new THREE.Vector3()));
    const dims = box.getSize(new THREE.Vector3());
    s.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return { model: s, dims };
  }, [scene]);

  const brandTex = useMemo(() => makeBrandTexture(), []);

  // The GLB's LENGTH runs along local Z; the long sides face ±X. Brand decals
  // sit just off the ±X faces, spanning Z, and roll with the container.
  const decalW = dims.z * 0.6;
  const decalH = decalW * (256 / 1024);
  const sideX = dims.x / 2 + 0.015;

  return (
    <>
      <primitive object={model} />
      <mesh position={[sideX, dims.y * 0.06, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[decalW, decalH]} />
        <meshBasicMaterial map={brandTex} transparent toneMapped={false} />
      </mesh>
      <mesh position={[-sideX, dims.y * 0.06, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[decalW, decalH]} />
        <meshBasicMaterial map={brandTex} transparent toneMapped={false} />
      </mesh>
    </>
  );
}

// ---------------------------------------------------------------------------
// Lights — simple studio rig, no external HDR.
// ---------------------------------------------------------------------------
function SceneRig() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={2.0} color="#fff4ea" />
      <directionalLight position={[-5, 1, -2]} intensity={0.5} color="#9db8d6" />
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 3, 3]} scale={[8, 3, 1]} color="#fff2e6" />
        <Lightformer intensity={1.1} position={[-4, 1, -3]} scale={[5, 5, 1]} color="#a9c2df" />
        <Lightformer intensity={0.8} position={[4, -1, 2]} scale={[4, 4, 1]} color="#ffffff" />
      </Environment>
    </>
  );
}

// ---------------------------------------------------------------------------
// Rig: poseGroup (FIXED falling pose, set once) → rollGroup (scroll-driven
// long-axis roll ONLY) → ContainerModel. The scroll handler mutates NOTHING
// but rollGroup.rotation.z — never poseGroup, never the camera. If the pose
// ever drifts during scroll, a rotation leaked into the wrong group.
// ---------------------------------------------------------------------------
function Rig({
  progress,
  scale,
}: {
  progress: React.MutableRefObject<number>;
  scale: number;
}) {
  const rollGroup = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!rollGroup.current) return;
    rollGroup.current.rotation.z = progress.current * Math.PI * 2 * ROLL_TURNS;
  });

  // Uniform scale on the pose group changes SIZE only — the dialed pose and
  // camera perspective stay exactly as locked.
  return (
    <group rotation={POSE} scale={scale} position={[0, Y_OFFSET, 0]}>
      <group ref={rollGroup}>
        <ContainerModel />
      </group>
    </group>
  );
}

// Renders nothing if the GLB fails — HeroVisual's static image already covers
// the no-WebGL/reduced-motion cases; a broken GLB shouldn't crash the page.
class ModelErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// ---------------------------------------------------------------------------
// ContainerHero — GSAP ScrollTrigger scrubs a 0..1 progress ref over the hero
// section; the ref feeds ONLY the rollGroup's Z rotation inside <Rig>.
// ---------------------------------------------------------------------------
// Size boost per breakpoint — as large as fits WITHOUT the canvas edge
// cutting the container at any roll angle (mid-roll corners sweep wider than
// the rest pose). Mobile is width-bound: the container already spans the full
// canvas width, so its cap is lower than desktop's. The downward offset sinks
// the container toward the canvas bottom so it sits close to the content
// below instead of floating with dead space under it.
const SCALE_DESKTOP = 1.35;
const SCALE_MOBILE = 1.26;
const Y_OFFSET = -0.25;

export function ContainerHero() {
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

  return (
    <div ref={wrap} className="h-[280px] w-full sm:h-[380px] lg:h-[500px]">
      <Canvas
        camera={{ position: CAMERA, fov: FOV }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop="always"
      >
        <SceneRig />
        <ModelErrorBoundary>
          <Suspense fallback={null}>
            <Rig progress={progress} scale={mobile ? SCALE_MOBILE : SCALE_DESKTOP} />
          </Suspense>
        </ModelErrorBoundary>
      </Canvas>
    </div>
  );
}
