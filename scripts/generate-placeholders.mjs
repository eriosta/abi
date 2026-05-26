// One-shot script: generates a flat-color PNG per menu item with a soft
// vertical gradient, then sips converts each to JPG. Run with:
//   node scripts/generate-placeholders.mjs
// Then:
//   cd public/images && for f in *.png; do sips -s format jpeg -s formatOptions 80 "$f" --out "${f%.png}.jpg" && rm "$f"; done
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SIZE = 600;

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng(width, height, baseR, baseG, baseB) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: truecolor RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const scanlineLen = 1 + 3 * width;
  const raw = Buffer.alloc(scanlineLen * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * scanlineLen;
    raw[rowStart] = 0; // filter: None
    // Subtle vertical light->dark gradient (top is lighter)
    const t = y / (height - 1);
    const f = 1 + 0.10 * (1 - t) - 0.10 * t; // ~+10% top, -10% bottom
    const r = Math.max(0, Math.min(255, Math.round(baseR * f)));
    const g = Math.max(0, Math.min(255, Math.round(baseG * f)));
    const b = Math.max(0, Math.min(255, Math.round(baseB * f)));
    for (let x = 0; x < width; x++) {
      const off = rowStart + 1 + 3 * x;
      raw[off] = r; raw[off + 1] = g; raw[off + 2] = b;
    }
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const categoryColors = {
  'granos':              [212, 165, 116], // warm tan
  'arepas':              [232, 193, 112], // golden corn
  'pollo-pavo-pescado':  [216, 132,  95], // terracotta
  'carnes':              [168,  91,  79], // brick
};

const menu = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/menu.json'), 'utf8'));
const outDir = path.join(ROOT, 'public/images');
fs.mkdirSync(outDir, { recursive: true });

let count = 0;
for (const cat of menu.categories) {
  const [r, g, b] = categoryColors[cat.id] || [180, 180, 180];
  cat.items.forEach((item, i) => {
    // Per-item variance: ±12 to give each tile a slightly different hue.
    const v = (i - (cat.items.length - 1) / 2) * 6;
    const rr = Math.max(0, Math.min(255, Math.round(r + v)));
    const gg = Math.max(0, Math.min(255, Math.round(g + v * 0.5)));
    const bb = Math.max(0, Math.min(255, Math.round(b - v * 0.5)));
    const png = makePng(SIZE, SIZE, rr, gg, bb);
    const basename = path.basename(item.image).replace(/\.jpg$/i, '.png');
    fs.writeFileSync(path.join(outDir, basename), png);
    count++;
  });
}
console.log(`Wrote ${count} PNG placeholders to public/images/`);
