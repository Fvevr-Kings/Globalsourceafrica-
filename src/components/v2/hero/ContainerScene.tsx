"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

const BODY = "#2b3542";       // dark steel container body (Bankar-style)
const BODY_DARK = "#1c242e";
const ORANGE = "#E8622C";

// Draws a corrugated container panel to a canvas → CanvasTexture. `branding`
// adds the orange GSA livery panel on the long sides.
function makePanel(w: number, h: number, branding: boolean): THREE.CanvasTexture {
  const scale = 160;
  const c = document.createElement("canvas");
  c.width = Math.round(w * scale);
  c.height = Math.round(h * scale);
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = BODY;
  ctx.fillRect(0, 0, c.width, c.height);

  // vertical corrugation ribs
  const rib = Math.max(6, Math.round(c.width / 55));
  for (let x = 0; x < c.width; x += rib) {
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = BODY_DARK;
    ctx.fillRect(x, 0, Math.max(1, rib * 0.34), c.height);
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + rib * 0.55, 0, Math.max(1, rib * 0.12), c.height);
  }
  ctx.globalAlpha = 1;

  // top & bottom rails
  ctx.fillStyle = BODY_DARK;
  ctx.fillRect(0, 0, c.width, c.height * 0.07);
  ctx.fillRect(0, c.height * 0.93, c.width, c.height * 0.07);

  if (branding) {
    const pw = c.width * 0.34;
    const ph = c.height * 0.44;
    const px = (c.width - pw) / 2;
    const py = (c.height - ph) / 2;
    // orange logo panel
    ctx.fillStyle = ORANGE;
    ctx.fillRect(px, py, ph * 0.9, ph); // square mark
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${ph * 0.5}px Arial, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText("G", px + ph * 0.24, py + ph * 0.52);
    // wordmark
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${ph * 0.34}px Arial, sans-serif`;
    ctx.fillText("GLOBALSOURCE", px + ph, py + ph * 0.4);
    ctx.fillStyle = ORANGE;
    ctx.font = `700 ${ph * 0.2}px Arial, sans-serif`;
    ctx.fillText("A F R I C A", px + ph, py + ph * 0.72);

    // mono ID plate
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = `600 ${c.height * 0.055}px monospace`;
    ctx.textAlign = "right";
    ctx.fillText("GSAU 402 918 · 45G1", c.width * 0.96, c.height * 0.88);
    ctx.textAlign = "left";
  }

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Lights + in-scene studio environment (no external HDR). Shared by the
// procedural fallback and the GLB model.
export function SceneRig() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={2.0} color="#fff4ea" castShadow />
      <directionalLight position={[-5, 1, -2]} intensity={0.5} color="#9db8d6" />
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 3, 3]} scale={[8, 3, 1]} color="#fff2e6" />
        <Lightformer intensity={1.1} position={[-4, 1, -3]} scale={[5, 5, 1]} color="#a9c2df" />
        <Lightformer intensity={0.8} position={[4, -1, 2]} scale={[4, 4, 1]} color="#ffffff" />
      </Environment>
    </>
  );
}

// FIXED diagonal pose (reference): door end lifted toward upper-left, opposite
// end plunging lower-right, top face + one long side visible. Set ONCE on the
// outer poseGroup's rotation prop — the scroll handler NEVER touches it.
//   x: -0.30 tips it so the top face shows
//   y:  0.35 turns the door end toward the viewer/left
//   z:  0.55 lifts the left end, drops the right end (the diagonal)
export const POSE: [number, number, number] = [-0.3, 0.35, 0.55];

// Scroll roll: ONLY rollGroup.rotation.x (the container's LONG axis — length
// lies along local X inside the roll group). Nested inside the tilted
// poseGroup, this local-X roll spins it in place like a rolling pin on the
// diagonal — the pose never changes, nothing sweeps across the page.
export function useLongRoll(
  rollGroup: MutableRefObject<THREE.Group | null>,
  progress: MutableRefObject<number>
) {
  useFrame(() => {
    if (!rollGroup.current) return;
    // scroll down = roll forward; negate if the direction ever feels wrong
    rollGroup.current.rotation.x = progress.current * Math.PI * 2;
  });
}

// Code-built container — the fallback until a photoreal GLB is dropped in.
export function ProceduralContainer({ progress }: { progress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const [sideTex, endTex] = useMemo(() => {
    const L = 3.4, H = 1.5, D = 1.5;
    return [makePanel(L, H, true), makePanel(D, H, false)];
  }, []);
  useLongRoll(group, progress);
  const matProps = { metalness: 0.7, roughness: 0.38 } as const;

  // poseGroup (fixed diagonal) → rollGroup (long-axis roll only). The box's
  // length already lies along local X.
  return (
    <group rotation={POSE}>
      <group ref={group}>
        <mesh castShadow>
        <boxGeometry args={[3.4, 1.5, 1.5]} />
        <meshStandardMaterial attach="material-0" map={endTex} {...matProps} />
        <meshStandardMaterial attach="material-1" map={endTex} {...matProps} />
        <meshStandardMaterial attach="material-2" color={BODY_DARK} {...matProps} />
        <meshStandardMaterial attach="material-3" color={BODY_DARK} {...matProps} />
        <meshStandardMaterial attach="material-4" map={sideTex} {...matProps} />
        <meshStandardMaterial attach="material-5" map={sideTex} {...matProps} />
        </mesh>
      </group>
    </group>
  );
}
