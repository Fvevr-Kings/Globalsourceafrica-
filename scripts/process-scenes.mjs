// One-off: clean the three ChatGPT scene images into web-ready transparent WebPs.
//   truck   — checkerboard bg (no alpha): remove via edge-connected flood fill
//   container/flatbed — already alpha: just trim + resize + webp
// Usage: node scripts/process-scenes.mjs
import sharp from "sharp";

const DIR = "public/scenes";
const SRC = {
  truck: `${DIR}/ChatGPT Image Jul 12, 2026, 01_21_40 PM.png`,
  container: `${DIR}/ChatGPT Image Jul 12, 2026, 01_25_30 PM.png`,
  flatbed: `${DIR}/ChatGPT Image Jul 12, 2026, 01_34_02 PM.png`,
};

// Flood-fill from the borders through "checkerboard-like" pixels (light greys /
// whites), zeroing alpha. Interior whites (logo text) stay: not border-connected.
async function removeCheckerboard(src, out) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const isBg = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    return max - min <= 10 && min >= 195; // near-neutral light grey/white
  };
  const seen = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) { stack.push(x, 0, x, H - 1); }
  for (let y = 0; y < H; y++) { stack.push(0, y, W - 1, y); }
  // stack holds x,y pairs
  const px = [];
  for (let i = 0; i < stack.length; i += 2) px.push([stack[i], stack[i + 1]]);
  while (px.length) {
    const [x, y] = px.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const idx = y * W + x;
    if (seen[idx]) continue;
    seen[idx] = 1;
    const di = idx * C;
    if (!isBg(di)) continue;
    data[di + 3] = 0;
    px.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  // soften 1px halo: any remaining light pixel adjacent to cleared bg gets 50% alpha
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const di = (y * W + x) * C;
      if (data[di + 3] === 0) continue;
      const r = data[di], g = data[di + 1], b = data[di + 2];
      if (Math.max(r, g, b) < 180) continue;
      const nbrClear =
        data[((y - 1) * W + x) * C + 3] === 0 || data[((y + 1) * W + x) * C + 3] === 0 ||
        data[(y * W + x - 1) * C + 3] === 0 || data[(y * W + x + 1) * C + 3] === 0;
      if (nbrClear) data[di + 3] = Math.min(data[di + 3], 120);
    }
  }
  await finish(sharp(data, { raw: { width: W, height: H, channels: C } }), out);
}

async function finish(img, out) {
  const buf = await img.png().toBuffer();
  await sharp(buf)
    .trim({ threshold: 1 }) // crop to content
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 90 })
    .toFile(out);
  const meta = await sharp(out).metadata();
  const { size } = await import("node:fs").then((fs) => fs.statSync(out));
  console.log(`${out} → ${meta.width}x${meta.height}, ${(size / 1024).toFixed(0)}KB`);
}

await removeCheckerboard(SRC.truck, `${DIR}/truck.webp`);
await finish(sharp(SRC.container), `${DIR}/container.webp`);
await finish(sharp(SRC.flatbed), `${DIR}/flatbed.webp`);
console.log("done");
