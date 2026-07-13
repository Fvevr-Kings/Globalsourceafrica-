"use client";

import { useState } from "react";

// Renders a real transparent PNG asset; until the file is dropped in, shows a
// clearly-labeled dashed placeholder (so it's obvious what's expected, and the
// layout/animation can be tuned before the art lands).
export function SceneImg({
  src,
  alt,
  className = "",
  label,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  label: string;
  style?: React.CSSProperties;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border-2 border-dashed border-steel/40 bg-steel/10 p-4 text-center font-mono text-[10px] uppercase leading-relaxed tracking-wider text-steel ${className}`}
      >
        {label}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} style={style} onError={() => setOk(false)} draggable={false} />;
}
