"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ORANGE = "#E8622C";
const ORANGE_DARK = "#B34A1F";
const NAVY = "#0B2239";

// Draws a corrugated container panel to a canvas → CanvasTexture. `branding`
// adds the navy GSA livery panel + mono ID plate on the long sides.
function makePanel(w: number, h: number, branding: boolean): THREE.CanvasTexture {
  const scale = 128;
  const c = document.createElement("canvas");
  c.width = Math.round(w * scale);
  c.height = Math.round(h * scale);
  const ctx = c.getContext("2d")!;

  // base
  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, 0, c.width, c.height);

  // vertical corrugation ribs
  const rib = Math.max(6, Math.round(c.width / 60));
  for (let x = 0; x < c.width; x += rib) {
    ctx.fillStyle = ORANGE_DARK;
    ctx.globalAlpha = 0.35;
    ctx.fillRect(x, 0, Math.max(1, rib * 0.28), c.height);
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + rib * 0.5, 0, Math.max(1, rib * 0.12), c.height);
  }
  ctx.globalAlpha = 1;

  // top & bottom rails
  ctx.fillStyle = ORANGE_DARK;
  ctx.fillRect(0, 0, c.width, c.height * 0.06);
  ctx.fillRect(0, c.height * 0.94, c.width, c.height * 0.06);

  if (branding) {
    // navy branding panel
    const pw = c.width * 0.4;
    const ph = c.height * 0.5;
    const px = c.width * 0.08;
    const py = (c.height - ph) / 2;
    ctx.fillStyle = NAVY;
    ctx.fillRect(px, py, pw, ph);

    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${ph * 0.22}px Arial, sans-serif`;
    ctx.fillText("GLOBALSOURCE", px + pw * 0.08, py + ph * 0.42);
    ctx.fillStyle = ORANGE;
    ctx.font = `700 ${ph * 0.12}px Arial, sans-serif`;
    ctx.fillText("A F R I C A", px + pw * 0.08, py + ph * 0.66);

    // mono ID plate bottom-right
    ctx.fillStyle = "rgba(11,34,57,0.75)";
    ctx.font = `600 ${c.height * 0.05}px monospace`;
    ctx.textAlign = "right";
    ctx.fillText("GSAU 402 918 · 45G1", c.width * 0.95, c.height * 0.9);
    ctx.textAlign = "left";
  }

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// The container mesh. Rotation/position/scale are driven by `progress` (0→1
// hero-scroll) plus a gentle idle spin so it feels alive at rest.
export function ContainerScene({ progress }: { progress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const idle = useRef(0);

  const [sideTex, endTex] = useMemo(() => {
    const L = 3.4, H = 1.5, D = 1.5;
    return [makePanel(L, H, true), makePanel(D, H, false)];
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    idle.current += delta * 0.12;
    const p = progress.current;
    group.current.rotation.y = idle.current + p * Math.PI * 2; // ~1 rev across hero
    group.current.rotation.x = 0.22 + p * 0.15;
    group.current.position.y = 0.1 + p * 3.4; // rises and exits upward
    const s = 1 - p * 0.45;
    group.current.scale.setScalar(s);
  });

  const matProps = { metalness: 0.35, roughness: 0.5 } as const;

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#fff6ec" />
      <directionalLight position={[-5, 2, -3]} intensity={0.5} color="#8fb2d6" />
      <group ref={group} rotation={[0.22, 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.4, 1.5, 1.5]} />
          {/* +x, -x = door ends · +y,-y = top/bottom · +z,-z = branded sides */}
          <meshStandardMaterial attach="material-0" map={endTex} {...matProps} />
          <meshStandardMaterial attach="material-1" map={endTex} {...matProps} />
          <meshStandardMaterial attach="material-2" color={ORANGE_DARK} {...matProps} />
          <meshStandardMaterial attach="material-3" color={ORANGE_DARK} {...matProps} />
          <meshStandardMaterial attach="material-4" map={sideTex} {...matProps} />
          <meshStandardMaterial attach="material-5" map={sideTex} {...matProps} />
        </mesh>
      </group>
    </>
  );
}
