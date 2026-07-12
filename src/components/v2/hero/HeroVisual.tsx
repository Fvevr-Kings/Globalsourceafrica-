"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { HeroContainerStatic } from "../HeroContainerStatic";

// 3D canvas is desktop + motion only, and never on the server bundle.
const ContainerHero3D = dynamic(
  () => import("./ContainerHero3D").then((m) => m.ContainerHero3D),
  { ssr: false, loading: () => <HeroContainerStatic /> }
);

// Decides between the real 3D spinning container (desktop, motion allowed) and
// the static livery render (mobile / reduced-motion) — PRD §4.1.
export function HeroVisual() {
  const [mode, setMode] = useState<"static" | "3d">("static");

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(desktop && !reduced ? "3d" : "static");
  }, []);

  return mode === "3d" ? <ContainerHero3D /> : <HeroContainerStatic />;
}
