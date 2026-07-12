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
    const box = new THREE.Box3().setFromObject(s);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    s.position.sub(center); // center at origin
    const scale = 3.4 / Math.max(size.x, size.y, size.z, 0.001);
    s.scale.setScalar(scale);
    s.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return s;
  }, [scene]);

  useRoll(group, progress);

  // Fixed yaw so the branded side shows while it rolls. If a given model's long
  // axis isn't X, adjust this rotation offset.
  return (
    <group ref={group} rotation={[0, -0.45, 0]}>
      <primitive object={model} />
    </group>
  );
}
