// Static, CSS-composed shipping container in GSA livery (dark steel body, orange
// logo panel). Stands in for the 3D hero on mobile / reduced-motion (PRD §4.1).
// Swap in a rendered PNG here later for a photoreal match. Purely decorative.
export function HeroContainerStatic({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`relative mx-auto select-none ${className}`}
      style={{ perspective: "1200px" }}
    >
      <div
        className="relative mx-auto w-[min(84vw,440px)]"
        style={{ transform: "rotateX(8deg) rotateY(-18deg)", transformStyle: "preserve-3d" }}
      >
        {/* container body */}
        <div className="relative aspect-[2.2/1] rounded-md bg-[#2b3542] shadow-2xl shadow-black/40 ring-1 ring-black/30">
          {/* corrugation */}
          <div
            className="absolute inset-0 rounded-md opacity-70"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 2px, transparent 2px, transparent 13px)",
            }}
          />
          {/* top & bottom rails */}
          <div className="absolute inset-x-0 top-0 h-[7%] rounded-t-md bg-black/30" />
          <div className="absolute inset-x-0 bottom-0 h-[7%] rounded-b-md bg-black/30" />

          {/* orange logo panel + wordmark, centered */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 px-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-container font-heading text-2xl font-extrabold text-white sm:h-14 sm:w-14">
              G
            </span>
            <div className="leading-none">
              <span className="gsa-heading block text-base font-extrabold uppercase tracking-tight text-white sm:text-lg">
                GlobalSource
              </span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.3em] text-container sm:text-[10px]">
                Africa
              </span>
            </div>
          </div>

          {/* ID plate */}
          <span className="absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-widest text-white/50">
            GSAU 402 918 · 45G1
          </span>
        </div>
        {/* ground shadow */}
        <div className="mx-auto mt-6 h-4 w-3/4 rounded-[100%] bg-black/25 blur-md" />
      </div>
    </div>
  );
}
