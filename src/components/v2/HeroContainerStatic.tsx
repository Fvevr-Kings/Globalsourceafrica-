// Static, CSS-composed shipping container in GSA livery. Stands in for the
// react-three-fiber hero on Phase 1, and is the permanent fallback on mobile /
// reduced-motion (PRD §4.1). Purely decorative.
export function HeroContainerStatic({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`relative select-none ${className}`}
      style={{ perspective: "1200px" }}
    >
      <div
        className="relative mx-auto w-[min(90vw,460px)]"
        style={{ transform: "rotateX(12deg) rotateY(-24deg)", transformStyle: "preserve-3d" }}
      >
        {/* container body */}
        <div className="relative aspect-[2/1] rounded-md bg-container shadow-2xl shadow-black/40 ring-1 ring-black/20">
          {/* corrugation */}
          <div
            className="absolute inset-0 rounded-md opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, transparent 2px, transparent 14px)",
            }}
          />
          {/* navy branding panel */}
          <div className="absolute inset-y-6 left-6 flex w-[42%] flex-col justify-center rounded-sm bg-navy px-4">
            <span className="gsa-heading text-sm font-extrabold uppercase leading-none tracking-tight text-white sm:text-base">
              GlobalSource
            </span>
            <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.3em] text-container sm:text-[10px]">
              Africa
            </span>
          </div>
          {/* ID plate */}
          <span className="absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-widest text-navy/70">
            GSAU 402 918 · 45G1
          </span>
          {/* right door edge */}
          <div className="absolute right-0 top-0 h-full w-2 rounded-r-md bg-black/20" />
        </div>
        {/* ground shadow */}
        <div className="mx-auto mt-6 h-4 w-3/4 rounded-[100%] bg-black/30 blur-md" />
      </div>
    </div>
  );
}
