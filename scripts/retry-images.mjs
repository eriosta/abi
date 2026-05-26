// Retry pass for items where the first fetch missed or picked a poor match.
// Same flow as fetch-images.mjs but targets a specific list with tuned queries.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public/images');
const TMP_DIR = '/tmp/abi-cocina-fetch';
const UA = 'AbiCocinaImageFetch/1.0 (https://github.com/abicocina; contact via project owner)';

fs.mkdirSync(TMP_DIR, { recursive: true });

// id -> { basename, queries[], extraBlacklist?: RegExp }
const RETRIES = {
  'pollo-mechado': {
    basename: 'pollo-mechado',
    queries: ['ropa vieja chicken', 'shredded chicken plate', 'pulled chicken'],
  },
  'carne-molida': {
    basename: 'carne-molida',
    queries: ['picadillo cuban', 'ground beef cooked', 'minced beef skillet'],
    extraBlacklist: /meatloaf/i,
  },
  'carne-fajitas': {
    basename: 'carne-fajitas',
    queries: ['beef fajitas skillet', 'fajitas de res', 'steak fajitas tortilla'],
    extraBlacklist: /chicken|pollo/i,
  },
  'bistek-tomate-cebolla': {
    basename: 'bistek-tomate',
    queries: ['bistec encebollado', 'steak onions tomato', 'bistec a la criolla'],
  },
  'bistek-vinagreta': {
    basename: 'bistek-vinagreta',
    queries: ['bistec vinagreta', 'beef vinegar marinade', 'beef bell pepper steak'],
    extraBlacklist: /tuna|salmon|fish|atún|mango/i,
  },
  'arepa-harina-amarilla': {
    basename: 'arepa-amarilla',
    queries: ['arepa maíz amarillo', 'corn arepa yellow', 'arepa amarilla'],
  },
  'arepa-integral': {
    basename: 'arepa-integral',
    queries: ['arepa integral', 'whole grain arepa', 'arepa wheat'],
  },
  'pavo-molido': {
    basename: 'pavo-molido',
    queries: ['ground turkey skillet', 'turkey mince cooked', 'pavo picadillo'],
  },
  'pisillo-tilapia': {
    basename: 'pisillo-tilapia',
    queries: ['tilapia cocida', 'flaked tilapia', 'fish flakes plate', 'pescado desmenuzado'],
  },
};

const FILE_BLACKLIST = /(logo|flag|coat[_ ]of[_ ]arms|map|infograph|diagram|seal|emblem)/i;

async function api(params) {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.search = new URLSearchParams({ format: 'json', origin: '*', ...params }).toString();
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Commons API ${res.status}`);
  return res.json();
}

async function searchCommons(query) {
  const data = await api({ action: 'query', list: 'search', srnamespace: 6, srsearch: query, srlimit: 15 });
  return data?.query?.search ?? [];
}

async function getFileInfo(title) {
  const data = await api({
    action: 'query', titles: title,
    prop: 'imageinfo', iiprop: 'url|mime|size|extmetadata', iiurlwidth: 1200,
  });
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0] ?? null;
}

function licenseFrom(info) {
  const md = info?.extmetadata || {};
  const license = md.LicenseShortName?.value || md.License?.value || 'unknown';
  const author = (md.Artist?.value || '').replace(/<[^>]+>/g, '').trim();
  return { license, author };
}

async function tryQuery(query, basenameNoExt, extraBlacklist) {
  const results = await searchCommons(query);
  for (const r of results) {
    const title = r.title;
    if (!/\.(jpe?g|png)$/i.test(title)) continue;
    if (FILE_BLACKLIST.test(title)) continue;
    if (extraBlacklist && extraBlacklist.test(title)) continue;
    const info = await getFileInfo(title);
    if (!info?.thumburl) continue;
    if (info.mime && !['image/jpeg', 'image/png'].includes(info.mime)) continue;
    if (info.size && info.size < 8000) continue;

    const tmp = path.join(TMP_DIR, `${basenameNoExt}.src`);
    try {
      execSync(`curl -sL --max-time 25 -A "${UA}" -o "${tmp}" "${info.thumburl}"`);
    } catch { continue; }
    const stat = fs.statSync(tmp);
    if (stat.size < 5000) { fs.unlinkSync(tmp); continue; }

    const out = path.join(OUT_DIR, `${basenameNoExt}.jpg`);
    try {
      execSync(`sips -Z 800 -s format jpeg -s formatOptions 82 "${tmp}" --out "${out}" >/dev/null`);
    } catch { fs.unlinkSync(tmp); continue; }
    fs.unlinkSync(tmp);

    const { license, author } = licenseFrom(info);
    return { title, source: info.descriptionurl, license, author, query };
  }
  return null;
}

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

const log = [];
for (const [itemId, cfg] of Object.entries(RETRIES)) {
  process.stdout.write(`[${itemId}] `);
  let picked = null;
  for (const q of cfg.queries) {
    picked = await tryQuery(q, cfg.basename, cfg.extraBlacklist);
    if (picked) break;
    await sleep(150);
  }
  if (picked) {
    log.push({ itemId, file: `${cfg.basename}.jpg`, status: 'ok', ...picked });
    process.stdout.write(`✓ ${picked.title}  [${picked.license}]\n`);
  } else {
    log.push({ itemId, file: `${cfg.basename}.jpg`, status: 'no_match' });
    process.stdout.write(`✗ still no match\n`);
  }
  await sleep(300);
}

// Merge retry results into the main log if it exists
const mainLogPath = path.join(ROOT, 'scripts/fetch-images.log.json');
let mainLog = [];
if (fs.existsSync(mainLogPath)) {
  mainLog = JSON.parse(fs.readFileSync(mainLogPath, 'utf8'));
}
const merged = mainLog.map((entry) => {
  const retry = log.find((l) => l.itemId === entry.itemId);
  return retry && retry.status === 'ok' ? retry : entry;
});
fs.writeFileSync(mainLogPath, JSON.stringify(merged, null, 2));

const okRetries = log.filter((l) => l.status === 'ok').length;
console.log(`\nRetry got ${okRetries}/${log.length} improved. Log merged into fetch-images.log.json.`);
