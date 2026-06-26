// Generates PWA icons (no external deps) using a tiny PNG encoder + SDF shapes.
// Brand: green #1F6B4A background, white "globe" mark for GlobalSource Africa.
// Run: node scripts/gen-icons.mjs  (outputs to public/icons/)
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const GREEN = [0x1f, 0x6b, 0x4a];
const WHITE = [0xff, 0xff, 0xff];

// ---- PNG encoder ----------------------------------------------------------
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---- shape math (anti-aliased via coverage) -------------------------------
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
// smooth coverage for "inside" given a signed distance (negative = inside)
function cov(d, aa) {
  return clamp01(0.5 - d / aa);
}

function render(size, { maskable }) {
  const buf = Buffer.alloc(size * size * 4);
  const aa = 1.5 / size; // edge softness in unit space
  const cx = 0.5, cy = 0.5;
  const R = 0.30;            // globe radius
  const ring = 0.045;        // ring stroke
  const merW = 0.13;         // meridian ellipse half-width
  const stroke = 0.038;      // meridian / equator stroke
  const corner = maskable ? 0 : 0.20; // rounded-rect radius for non-maskable

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const x = (px + 0.5) / size;
      const y = (py + 0.5) / size;

      // background coverage (rounded rect, or full bleed for maskable)
      let bgCov = 1;
      if (corner > 0) {
        const qx = Math.abs(x - 0.5) - (0.5 - corner);
        const qy = Math.abs(y - 0.5) - (0.5 - corner);
        const dx = Math.max(qx, 0), dy = Math.max(qy, 0);
        const outside = Math.sqrt(dx * dx + dy * dy) - corner + Math.min(Math.max(qx, qy), 0);
        bgCov = cov(outside, aa);
      }

      // distances to mark shapes (signed, negative inside)
      const dxC = x - cx, dyC = y - cy;
      const distCircle = Math.sqrt(dxC * dxC + dyC * dyC);
      const dRing = Math.abs(distCircle - R) - ring / 2;          // ring
      const ell = Math.sqrt((dxC / merW) * (dxC / merW) + (dyC / R) * (dyC / R)) * Math.min(merW, R);
      const dMer = Math.abs(ell - Math.min(merW, R)) - stroke / 2; // meridian outline approx
      const dEq = Math.max(Math.abs(dyC) - stroke / 2, distCircle - R); // equator clipped to globe

      const markD = Math.min(dRing, dMer, dEq);
      const markCov = cov(markD, aa);

      // compose: green bg, white mark on top, all masked by bgCov
      let r = GREEN[0], g = GREEN[1], b = GREEN[2];
      r = r + (WHITE[0] - r) * markCov;
      g = g + (WHITE[1] - g) * markCov;
      b = b + (WHITE[2] - b) * markCov;

      const i = (py * size + px) * 4;
      buf[i] = r; buf[i + 1] = g; buf[i + 2] = b;
      buf[i + 3] = Math.round(255 * bgCov);
    }
  }
  return encodePNG(size, size, buf);
}

mkdirSync("public/icons", { recursive: true });
writeFileSync("public/icons/icon-192.png", render(192, { maskable: false }));
writeFileSync("public/icons/icon-512.png", render(512, { maskable: false }));
writeFileSync("public/icons/maskable-512.png", render(512, { maskable: true }));
writeFileSync("public/icons/apple-touch-icon.png", render(180, { maskable: true }));
writeFileSync("public/favicon-32.png", render(32, { maskable: false }));
console.log("✅ icons written to public/icons/");
