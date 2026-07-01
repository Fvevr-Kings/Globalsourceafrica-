"use client";

import { useState } from "react";
import { User } from "lucide-react";

// Shows /ceo.jpg if present; falls back to a placeholder avatar if the file
// hasn't been added yet, so the About page never shows a broken image.
export function CeoPhoto({ src = "/ceo.jpg" }: { src?: string }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-greenSoft">
        <User className="h-16 w-16 text-green" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="CEO"
      onError={() => setBroken(true)}
      className="h-40 w-40 rounded-2xl object-cover"
    />
  );
}
