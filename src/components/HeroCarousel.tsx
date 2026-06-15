"use client";

import { useEffect, useRef, useState } from "react";
import type { Banner } from "@/lib/banners";

const HEIGHT = "h-36 w-full sm:h-44 lg:h-52";

// Rotating homepage billboard. Each slide is an admin-uploaded GIF / image /
// short looping video, optionally a click-through ad. Auto-advances unless the
// user prefers reduced motion or there's only one slide.
export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (banners.length <= 1) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    timer.current = setInterval(
      () => setI((n) => (n + 1) % banners.length),
      6000
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [banners.length]);

  const current = banners[i];
  const hasText = !!(current.headline || current.subtitle);

  return (
    <section className="relative isolate w-full overflow-hidden rounded-3xl border border-greenLine bg-green text-white">
      <div className={`relative ${HEIGHT}`}>
        <Slide banner={current} />

        {/* Legibility scrim ONLY when there's overlay text. With no text the
            uploaded media shows clean at full colour (no green tint). */}
        {hasText && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-green/85 via-green/40 to-transparent" />
        )}

        {(current.headline || current.subtitle) && (
          <div className="pointer-events-none relative flex h-full max-w-2xl flex-col justify-center gap-1.5 px-6 sm:px-10">
            {current.headline && (
              <h2 className="font-display text-xl font-semibold leading-tight drop-shadow sm:text-2xl lg:text-3xl">
                {current.headline}
              </h2>
            )}
            {current.subtitle && (
              <p className="max-w-xl text-xs text-white/90 sm:text-sm">
                {current.subtitle}
              </p>
            )}
            {current.link_url && current.cta_label && (
              <a
                href={current.link_url}
                className="pointer-events-auto mt-1 inline-flex w-fit items-center rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orangeDark"
              >
                {current.cta_label}
              </a>
            )}
          </div>
        )}

        {/* full-slide click-through when there's a link but no explicit CTA */}
        {current.link_url && !current.cta_label && (
          <a
            href={current.link_url}
            className="absolute inset-0"
            aria-label={current.headline ?? "Open promotion"}
          />
        )}

        {/* dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 right-4 flex gap-1.5">
            {banners.map((b, idx) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === i}
                className={
                  idx === i
                    ? "h-2 w-5 rounded-full bg-white"
                    : "h-2 w-2 rounded-full bg-white/50 hover:bg-white/80"
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Slide({ banner }: { banner: Banner }) {
  if (banner.media_type === "video") {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={banner.media_url}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
    );
  }
  // GIF / image — plain <img> so animated GIFs play without optimization.
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={banner.media_url}
      alt={banner.headline ?? ""}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
