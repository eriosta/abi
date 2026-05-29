// Re-crop every menu thumbnail to a uniform 800×800 (center crop).
// Some Wikimedia thumbnails are WebP/AVIF with a .jpg extension — sips can read
// but not write those formats, so we force a JPEG round-trip via a temp file.
// Skips og-image.jpg and abi-norma.png. Run with: node scripts/square-crop.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../public/images');
const SKIP = new Set(['og-image.png', 'abi-norma.png']);

function getDims(file) {
  const out = execSync(`sips -g pixelWidth -g pixelHeight "${file}"`).toString();
  const w = parseInt((out.match(/pixelWidth:\s*(\d+)/) || [])[1], 10);
  const h = parseInt((out.match(/pixelHeight:\s*(\d+)/) || [])[1], 10);
  return { w, h };
}

function detectFormat(file) {
  // `file -b --mime-type` returns e.g. image/jpeg, image/webp, image/avif
  return execSync(`file -b --mime-type "${file}"`).toString().trim();
}

function reencodeAsJpeg(file) {
  // Round-trip through a temp file so sips can write JPEG regardless of input.
  const tmp = `${file}.fix.jpg`;
  execSync(`sips -s format jpeg -s formatOptions 90 "${file}" --out "${tmp}" >/dev/null`);
  fs.renameSync(tmp, file);
}

const files = fs.readdirSync(DIR).filter((f) => /\.jpe?g$/i.test(f) && !SKIP.has(f));
let processed = 0;
for (const f of files) {
  const full = path.join(DIR, f);

  // Step 0: if the file isn't actually JPEG, fix that first.
  const mime = detectFormat(full);
  if (mime !== 'image/jpeg') reencodeAsJpeg(full);

  let { w, h } = getDims(full);
  if (!w || !h) continue;

  // Step 1: resize so the shorter side is ≥ 800 (preserve aspect).
  if (w !== h || w < 800) {
    if (w < h) {
      execSync(`sips --resampleWidth 800 "${full}" >/dev/null`);
    } else {
      execSync(`sips --resampleHeight 800 "${full}" >/dev/null`);
    }
  }

  // Step 2: center-crop to exactly 800×800.
  execSync(`sips -c 800 800 "${full}" >/dev/null`);

  // Step 3: re-encode at consistent JPEG quality.
  reencodeAsJpeg(full);

  processed++;
}
console.log(`Cropped ${processed} thumbnails to 800×800.`);
