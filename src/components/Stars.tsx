import { Star } from "lucide-react";

// Read-only satisfaction rating display (1–5 filled stars).
export function Stars({
  rating,
  className = "h-4 w-4",
}: {
  rating: number;
  className?: string;
}) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${r} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={className}
          aria-hidden
          fill={i <= r ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
