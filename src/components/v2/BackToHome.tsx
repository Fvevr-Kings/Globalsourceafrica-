import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Back-to-home link for sub-pages. Lives at the TOP-LEFT of the page's first
// section (under the nav), not in the nav bar itself. Colour is inherited from
// the section (white on the navy heroes, navy on light ones), so one component
// works everywhere.
//
// It sits on its own row: MonoLabel is an inline <span>, so an inline back link
// would butt straight up against the eyebrow text and the two would collide.
// `flex` makes this block-level and `w-fit` keeps the hit area to the text.
export function BackToHome({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`mb-6 flex w-fit items-center gap-1.5 text-sm font-semibold opacity-70 transition-opacity hover:opacity-100 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Back to home
    </Link>
  );
}
