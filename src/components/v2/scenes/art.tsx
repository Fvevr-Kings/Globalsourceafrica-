// Shared flat-industrial SVG art for the scroll set pieces (PRD §4.2 / §4.3).
// Side-view container + truck, drawn in code — no external assets.

const BODY = "#2b3542";
const BODY_DARK = "#1c242e";
const RAIL = "#16202b";
const ORANGE = "#E8622C";

// Container, local coords 0 0 300 120 (side view).
export function ContainerArt() {
  return (
    <g>
      <rect x="0" y="0" width="300" height="120" rx="3" fill={BODY} />
      {/* corrugation ribs */}
      {Array.from({ length: 24 }).map((_, i) => (
        <rect key={i} x={8 + i * 12} y="7" width="5" height="106" fill={BODY_DARK} opacity="0.8" />
      ))}
      {/* rails + corner castings */}
      <rect x="0" y="0" width="300" height="7" fill={RAIL} />
      <rect x="0" y="113" width="300" height="7" fill={RAIL} />
      {[0, 288].map((x) => (
        <g key={x}>
          <rect x={x} y="0" width="12" height="12" fill="#0e161e" rx="2" />
          <rect x={x} y="108" width="12" height="12" fill="#0e161e" rx="2" />
        </g>
      ))}
      {/* brand plate */}
      <rect x="84" y="42" width="34" height="34" fill={ORANGE} rx="2" />
      <text x="94" y="67" fill="#fff" style={{ font: "800 24px Arial, sans-serif" }}>G</text>
      <text x="128" y="61" fill="#fff" style={{ font: "800 17px Arial, sans-serif" }}>GLOBALSOURCE</text>
      <text x="128" y="76" fill={ORANGE} style={{ font: "700 10px Arial, sans-serif", letterSpacing: "3px" }}>AFRICA</text>
      <text x="292" y="105" textAnchor="end" fill="#ffffff" opacity="0.45" style={{ font: "600 9px monospace", letterSpacing: "1px" }}>
        GSAU 402 918 · 45G1
      </text>
    </g>
  );
}

function Wheel({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g className="gsa-wheel" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r="20" fill="#10161c" />
      <circle cx={cx} cy={cy} r="9" fill="#2c3742" />
      <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} stroke="#4a5866" strokeWidth="2.5" />
      <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8} stroke="#4a5866" strokeWidth="2.5" />
    </g>
  );
}

// Truck (tractor + flatbed), local coords 0 0 620 200, facing right.
// `withContainer` puts a GSA container on the bed (crane section); the landing
// scene passes false and drops its own container onto the empty bed.
export function TruckArt({ withContainer = true }: { withContainer?: boolean }) {
  return (
    <g>
      {/* flatbed */}
      <rect x="8" y="128" width="410" height="12" rx="2" fill={BODY_DARK} />
      <rect x="8" y="140" width="410" height="4" fill={RAIL} />
      {withContainer && (
        <g transform="translate(62,8)">
          <ContainerArt />
        </g>
      )}
      {/* tractor chassis + cab */}
      <rect x="408" y="126" width="180" height="14" rx="2" fill={BODY_DARK} />
      <g>
        <rect x="472" y="56" width="112" height="84" rx="8" fill={ORANGE} />
        <rect x="472" y="56" width="112" height="18" rx="8" fill="#c94e1d" />
        <rect x="526" y="68" width="48" height="30" rx="3" fill="#aac4de" />
        <rect x="584" y="96" width="10" height="44" rx="2" fill="#c94e1d" />
        {/* headlight + bumper */}
        <rect x="586" y="118" width="6" height="10" rx="2" fill="#ffd9a8" />
        <rect x="470" y="136" width="126" height="8" rx="3" fill={RAIL} />
      </g>
      {/* wheels: 3 trailer + 2 tractor */}
      <Wheel cx={70} cy={162} />
      <Wheel cx={118} cy={162} />
      <Wheel cx={166} cy={162} />
      <Wheel cx={448} cy={162} />
      <Wheel cx={548} cy={162} />
    </g>
  );
}
