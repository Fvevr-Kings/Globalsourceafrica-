"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Quote } from "lucide-react";
import { Stars } from "./Stars";
import type { Testimonial } from "@/lib/types";

// A slow, continuous right-to-left marquee of customer reviews shown above the
// footer. Self-fetches from /api/testimonials; renders nothing until there's at
// least one approved review. Cards show an avatar (photo or initials), stars,
// the comment, and the customer. Hover pauses the scroll.
export function TestimonialsSlideshow() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    let alive = true;
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => {
        if (alive) setItems(Array.isArray(d.testimonials) ? d.testimonials : []);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (items.length === 0) return null;

  // Duplicate the list so the -50% translate loops seamlessly. With only a few
  // reviews, repeat enough times to comfortably fill wide screens.
  const base = items.length < 4 ? [...items, ...items, ...items] : items;
  const track = [...base, ...base];

  return (
    <section
      aria-label="What our customers say"
      className="gsa-marquee-group overflow-hidden border-t border-greenLine bg-greenSoft py-10"
    >
      <div className="px-4 text-center">
        <p className="font-display text-xs font-semibold uppercase tracking-wide text-green">
          What our customers say
        </p>
      </div>

      {/* Edge fade so cards slide in/out softly instead of clipping hard. */}
      <div
        className="relative mt-6"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <ul className="gsa-marquee flex w-max gap-4">
          {track.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} t={t} />
          ))}
        </ul>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/leave-a-review"
          className="text-sm font-medium text-green hover:underline"
        >
          Bought from us? Share your experience →
        </Link>
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <li className="flex w-80 shrink-0 flex-col rounded-2xl border border-greenLine bg-white p-5 shadow-sm">
      <Quote className="h-5 w-5 text-green/40" aria-hidden />
      <p className="mt-2 line-clamp-4 flex-1 text-sm italic leading-relaxed text-ink">
        &ldquo;{t.comment}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3 border-t border-greenLine pt-4">
        <Avatar name={t.customer_name} src={t.avatar_url} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{t.customer_name}</p>
          {t.location && <p className="truncate text-xs text-sub">{t.location}</p>}
          <span className="mt-0.5 inline-flex text-green">
            <Stars rating={t.rating} className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </li>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function Avatar({ name, src }: { name: string; src?: string | null }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-greenSoft text-sm font-semibold text-green">
      {initials(name) || "★"}
    </span>
  );
}
