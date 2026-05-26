// Fetch placeholder photos for menu items from Wikimedia Commons.
// Commons content is generally free for commercial use under CC/PD; attribution
// is recommended. The log file written at the end records source URLs and the
// license string so the family can verify and credit each image.
//
// Run with: node scripts/fetch-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public/images');
const TMP_DIR = '/tmp/abi-cocina-fetch';
const UA = 'AbiCocinaImageFetch/1.0 (https://github.com/abicocina; contact via project owner)';

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

// Spanish-first queries with English fallback. Tuned to match what Commons
// actually indexes well — for very Venezuelan-specific dishes we lean on the
// regional term first.
const QUERIES = {
  'caraotas-negras':     ['caraotas negras venezolano', 'black beans frijoles negros'],
  'lentejas':            ['lentejas guisadas', 'lentil stew bowl'],
  'arroz-blanco':        ['arroz blanco plato', 'white rice bowl'],
  'arroz-amarillo':      ['arroz amarillo', 'yellow rice'],
  'arepa-harina-blanca': ['arepa venezolana', 'arepas'],
  'arepa-harina-amarilla': ['arepa amarilla', 'arepa yellow corn'],
  'arepa-integral':      ['arepa integral', 'whole wheat arepa'],
  'pollo-mechado':       ['pollo mechado', 'shredded chicken'],
  'pollo-guisado-papas': ['pollo guisado', 'chicken stew potatoes'],
  'pollo-fajitas':       ['fajitas de pollo', 'chicken fajitas skillet'],
  'albondigas-pollo':    ['albóndigas pollo', 'chicken meatballs'],
  'pavo-molido':         ['pavo molido', 'ground turkey skillet'],
  'albondigas-pavo':     ['albóndigas pavo', 'turkey meatballs'],
  'hamburguesitas-pavo': ['hamburguesa pavo', 'turkey slider'],
  'pisillo-tilapia':     ['pisillo tilapia', 'shredded tilapia'],
  'pisillo-atun':        ['pisillo atún', 'tuna fish flaked'],
  'carne-molida':        ['carne molida', 'ground beef skillet'],
  'carne-mechada':       ['carne mechada venezolana', 'ropa vieja'],
  'salsa-bologna':       ['salsa boloñesa', 'bolognese sauce'],
  'albondigas-carne':    ['albóndigas carne', 'beef meatballs'],
  'carne-fajitas':       ['fajitas de res', 'beef fajitas'],
  'asado-negro':         ['asado negro venezolano', 'asado negro'],
  'bistek-tomate-cebolla': ['bistec cebolla tomate', 'steak onion tomato'],
  'carne-guisada-papas': ['carne guisada', 'beef stew potatoes'],
  'bistek-vinagreta':    ['bistec vinagreta', 'steak vinaigrette'],
};

// Avoid grabbing infographics, coats of arms, etc. that sometimes turn up.
const FILE_BLACKLIST = /(logo|flag|coat[_ ]of[_ ]arms|map|infograph|diagram|seal|emblem)/i;

async function api(params) {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.search = new URLSearchParams({ format: 'json', origin: '*', ...params }).toString();
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Commons API ${res.status}: ${url}`);
  return res.json();
}

async function searchCommons(query) {
  const data = await api({
    action: 'query', list: 'search', srnamespace: 6,
    srsearch: query, srlimit: 15,
  });
  return data?.query?.search ?? [];
}

async function getFileInfo(title) {
  const data = await api({
    action: 'query', titles: title,
    prop: 'imageinfo',
    iiprop: 'url|mime|size|extmetadata',
    iiurlwidth: 1200,
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

async function tryQuery(query, basenameNoExt) {
  const results = await searchCommons(query);
  for (const r of results) {
    const title = r.title;
    if (!/\.(jpe?g|png)$/i.test(title)) continue;
    if (FILE_BLACKLIST.test(title)) continue;
    const info = await getFileInfo(title);
    if (!info?.thumburl) continue;
    if (info.mime && !['image/jpeg', 'image/png'].includes(info.mime)) continue;
    if (info.size && info.size < 8000) continue; // skip tiny files

    const tmp = path.join(TMP_DIR, `${basenameNoExt}.src`);
    try {
      execSync(`curl -sL --max-time 25 -A "${UA}" -o "${tmp}" "${info.thumburl}"`);
    } catch {
      continue;
    }
    const stat = fs.statSync(tmp);
    if (stat.size < 5000) { fs.unlinkSync(tmp); continue; }

    const out = path.join(OUT_DIR, `${basenameNoExt}.jpg`);
    // -Z 800: longest side = 800, preserves aspect (CSS object-cover handles squaring)
    try {
      execSync(
        `sips -Z 800 -s format jpeg -s formatOptions 82 "${tmp}" --out "${out}" >/dev/null`
      );
    } catch (e) {
      console.warn(`  sips failed for ${title}: ${e.message}`);
      fs.unlinkSync(tmp);
      continue;
    }
    fs.unlinkSync(tmp);

    const { license, author } = licenseFrom(info);
    return { title, source: info.descriptionurl, license, author, query };
  }
  return null;
}

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

const menu = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/menu.json'), 'utf8'));
const allItems = menu.categories.flatMap((c) => c.items);

const log = [];
for (const item of allItems) {
  const basenameNoExt = path.basename(item.image).replace(/\.jpe?g$/i, '');
  const queries = QUERIES[item.id] || [item.name, item.nameEn];
  process.stdout.write(`[${item.id}] `);

  let picked = null;
  for (const q of queries) {
    picked = await tryQuery(q, basenameNoExt);
    if (picked) break;
    await sleep(150);
  }

  if (picked) {
    log.push({ itemId: item.id, file: `${basenameNoExt}.jpg`, status: 'ok', ...picked });
    process.stdout.write(`✓ ${picked.title}  [${picked.license}]\n`);
  } else {
    log.push({ itemId: item.id, file: `${basenameNoExt}.jpg`, status: 'no_match' });
    process.stdout.write(`✗ no match — placeholder kept\n`);
  }
  await sleep(300);
}

const logPath = path.join(ROOT, 'scripts/fetch-images.log.json');
fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
console.log(`\nLog written to ${path.relative(ROOT, logPath)}`);

const okCount = log.filter((l) => l.status === 'ok').length;
console.log(`Got images for ${okCount}/${log.length} items.`);
