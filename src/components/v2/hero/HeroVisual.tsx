"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { HeroContainerStatic } from "../HeroContainerStatic";

// 3D canvas never joins the server bundle; static shows while it loads.
const ContainerHero3D = dynamic(
  () => import("./ContainerHero").then((m) => m.ContainerHero),
  { ssr: false, loading: () => <HeroContainerStatic /> }
);

// The real spinning container runs on ALL devices (most visitors are mobile).
// Static fallback only for prefers-reduced-motion or missing WebGL.
export function HeroVisual() {
  const [mode, setMode] = useState<"static" | "3d">("static");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const webgl = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();
    setMode(!reduced && webgl ? "3d" : "static");
  }, []);

  return mode === "3d" ? <ContainerHero3D /> : <HeroContainerStatic />;
}
