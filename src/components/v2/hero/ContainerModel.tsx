"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRoll } from "./ContainerScene";

const MODEL_URL = "/models/container.glb";

// Loads a photoreal container GLB (drop it at public/models/container.glb),
// auto-centers and normalises its size, and applies the same roll-on-scroll.
// Suspends while loading and throws if the file is missing/invalid — the caller
// wraps this in Suspense + an error boundary that falls back to the code model.
export function ContainerModel({ progress }: { progress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const s = scene.clone(true);
    // normalize size first…
    const size = new THREE.Box3().setFromObject(s).getSize(new THREE.Vector3());
    const scale = 3.2 / Math.max(size.x, size.y, size.z, 0.001);
    s.scale.setScalar(scale);
    // …then recenter using the SCALED bounds so it sits at the origin.
    const center = new THREE.Box3().setFromObject(s).getCenter(new THREE.Vector3());
    s.position.sub(center);
    s.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return s;
  }, [scene]);

  useRoll(group, progress);

  // Outer group barrel-rolls around world-X (useRoll → rotation.x). This model's
  // long axis is Z, so the inner group yaws 90° to lay the length horizontal —
  // then the X-roll spins it around its length ("unrolling"), shown broadside.
  return (
    <group ref={group}>
      <group rotation={[0, Math.PI / 2, 0]}>
        <primitive object={model} />
      </group>
    </group>
  );
}
