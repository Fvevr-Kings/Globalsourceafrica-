"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRoll } from "./ContainerScene";

const MODEL_URL = "/models/container.glb";
const ORANGE = "#E8622C";

// Transparent canvas texture with the GSA wordmark — applied as decal planes on
// the container's long sides so the brand rides the model.
function makeBrandTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, c.width, c.height);

  // orange "G" mark
  const box = 168;
  const bx = 24;
  const by = (c.height - box) / 2;
  ctx.fillStyle = ORANGE;
  ctx.fillRect(bx, by, box, box);
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 118px Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText("G", bx + 46, by + box / 2 + 8);

  // wordmark
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 96px Arial, sans-serif";
  ctx.fillText("GLOBALSOURCE", bx + box + 40, c.height / 2 - 34);
  ctx.fillStyle = ORANGE;
  ctx.font = "700 54px Arial, sans-serif";
  const label = "A F R I C A";
  ctx.fillText(label, bx + box + 40, c.height / 2 + 62);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Loads a photoreal container GLB (public/models/container.glb), auto-centers
// and normalises its size, brands both long sides, and applies roll-on-scroll.
// Suspends while loading; the caller falls back to the code model on error.
export function ContainerModel({ progress }: { progress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  const { model, dims } = useMemo(() => {
    const s = scene.clone(true);
    // normalize size first…
    const size = new THREE.Box3().setFromObject(s).getSize(new THREE.Vector3());
    const scale = 3.2 / Math.max(size.x, size.y, size.z, 0.001);
    s.scale.setScalar(scale);
    // …then recenter using the SCALED bounds so it sits at the origin.
    const box = new THREE.Box3().setFromObject(s);
    const center = box.getCenter(new THREE.Vector3());
    s.position.sub(center);
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

  useRoll(group, progress);

  // Inside the inner group the model's LENGTH runs along Z and the long sides
  // face ±X — so the brand planes sit just off ±X, spanning Z.
  const decalW = dims.z * 0.6;
  const decalH = decalW * (256 / 1024);
  const sideX = dims.x / 2 + 0.015;

  // Outer group barrel-rolls around world-X (useRoll → rotation.x). This model's
  // long axis is Z, so the inner group yaws 90° to lay the length horizontal —
  // then the X-roll spins it around its length ("unrolling"), shown broadside.
  return (
    <group ref={group}>
      <group rotation={[0, Math.PI / 2, 0]}>
        <primitive object={model} />
        <mesh position={[sideX, dims.y * 0.06, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[decalW, decalH]} />
          <meshBasicMaterial map={brandTex} transparent toneMapped={false} />
        </mesh>
        <mesh position={[-sideX, dims.y * 0.06, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[decalW, decalH]} />
          <meshBasicMaterial map={brandTex} transparent toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
