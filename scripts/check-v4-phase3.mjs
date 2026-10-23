import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadRuntimeAssets } from './lib/runtime-assets.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];
const warnings = [];
const read = relative => fs.readFile(new URL(relative, root), 'utf8');
const readDist = relative => fs.readFile(new URL(relative, dist), 'utf8');
const existsDist = relative => fs.access(new URL(relative, dist)).then(() => true).catch(() => false);
const existsRoot = relative => fs.access(new URL(relative, root)).then(() => true).catch(() => false);
const bytes = value => Buffer.byteLength(value, 'utf8');
const kib = value => `${(value / 1024).toFixed(1)} KiB`;

const home = await readDist('./index.html');
let runtime;
try {
  runtime = await loadRuntimeAssets(dist, home);
} catch (error) {
  errors.push(error.message);
  runtime = { refs: {}, content: {} };
}

const runtimeEntries = Object.entries(runtime.refs).filter(([, ref]) => ref);
if (runtimeEntries.length !== 6) errors.push(`expected 6 fingerprinted runtime assets, found ${runtimeEntries.length}`);
if (new Set(runtimeEntries.map(([, ref]) => ref)).size !== runtimeEntries.length) errors.push('fingerprinted runtime asset paths are not unique');

for (const [key, ref] of runtimeEntries) {
  const content = runtime.content[key] || '';
  const expectedHash = createHash('sha256').update(content).digest('hex').slice(0, 12);
  const actualHash = ref.match(/\.([a-f0-9]{12})\.(?:css|js)$/)?.[1];
  if (actualHash !== expectedHash) errors.push(`${ref} hash does not match its file content`);
}

const buildEntries = (await fs.readdir(new URL('./build/', dist), { withFileTypes: true })).filter(entry => entry.isFile()).map(entry => entry.name).sort();
if (buildEntries.length !== 6) errors.push(`dist/build should contain exactly 6 runtime files, found ${buildEntries.length}`);
for (const name of buildEntries) if (!/^(?:styles|theme-init|site|a11y|phase2|phase3)\.[a-f0-9]{12}\.(?:css|js)$/.test(name)) errors.push(`unexpected build asset name ${name}`);

for (const stable of ['./styles.css', './site.js', './theme-init.js', './a11y-v3.js', './phase2.js', './phase3.js']) {
  if (await existsDist(stable)) errors.push(`stable runtime alias should not exist in dist: ${stable}`);
}

const htmlFiles = [];
async function walkHtml(dir, prefix = '') {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) await walkHtml(new URL(`./${entry.name}/`, dir), `${relative}/`);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(relative);
  }
}
await walkHtml(dist);

let largestHtml = { file: '', size: 0 };
for (const file of htmlFiles) {
  const html = await readDist(`./${file}`);
  const size = bytes(html);
  if (size > largestHtml.size) largestHtml = { file, size };
  for (const ref of Object.values(runtime.refs)) if (ref && !html.includes(ref)) errors.push(`${file} does not load the shared fingerprinted runtime asset ${ref}`);
  if (/<script[^>]+src="https?:\/\//i.test(html)) errors.push(`${file} loads an external executable script`);
  if (/<link[^>]+rel="stylesheet"[^>]+href="https?:\/\//i.test(html)) errors.push(`${file} loads an external stylesheet`);
  if (/(?:src|href)="\/(?:styles\.css|site\.js|theme-init\.js|a11y-v3\.js|phase2\.js|phase3\.js)"/.test(html)) errors.push(`${file} references a stable runtime alias`);
}

const stylesSize = bytes(runtime.content.styles || '');
const jsEntries = Object.entries(runtime.content).filter(([key]) => key !== 'styles');
const totalJsSize = jsEntries.reduce((sum, [, value]) => sum + bytes(value || ''), 0);
const searchSize = bytes(await readDist('./search-index.json'));
const budgets = {
  styles: 160 * 1024,
  totalJs: 240 * 1024,
  search: 750 * 1024,
  largestHtml: 180 * 1024
};
if (stylesSize > budgets.styles) errors.push(`CSS budget exceeded: ${kib(stylesSize)} > ${kib(budgets.styles)}`);
if (totalJsSize > budgets.totalJs) errors.push(`runtime JS budget exceeded: ${kib(totalJsSize)} > ${kib(budgets.totalJs)}`);
if (searchSize > budgets.search) errors.push(`search index budget exceeded: ${kib(searchSize)} > ${kib(budgets.search)}`);
if (largestHtml.size > budgets.largestHtml) errors.push(`largest HTML budget exceeded: ${largestHtml.file} is ${kib(largestHtml.size)} > ${kib(budgets.largestHtml)}`);

const allRuntimeJs = jsEntries.map(([, value]) => value || '').join('\n');
if (/addEventListener\s*\(\s*['"](?:beforeunload|unload)['"]/i.test(allRuntimeJs) || /window\.on(?:beforeunload|unload)\s*=/i.test(allRuntimeJs)) errors.push('runtime JavaScript introduces an unload/beforeunload handler that can harm bfcache eligibility');
if (/navigator\.serviceWorker|serviceWorker\.register|service-worker\.js/i.test(allRuntimeJs)) errors.push('runtime JavaScript introduces a service worker; Phase 3 intentionally keeps caching in HTTP/bfcache layers');
for (const host of ['cipher.blackpinecybersecurity.com', 'verify.blackpinecybersecurity.com', 'support.blackpinecybersecurity.com']) {
  if (allRuntimeJs.includes(host)) errors.push(`corporate runtime JavaScript reaches across the ${host} trust boundary`);
}
if (/\b(?:WebSocket|EventSource)\s*\(|sendBeacon\s*\(\s*['"]https?:\/\//i.test(allRuntimeJs)) errors.push('runtime JavaScript introduces an unexpected external realtime/beacon channel');

const phase3 = runtime.content.phase3 || '';
for (const required of ['rel = \'prefetch\'', 'saveData', 'effectiveType', 'maxPrefetches = 2', 'url.origin !== window.location.origin']) {
  if (!phase3.includes(required)) errors.push(`Phase 3 selective prefetch is missing ${required}`);
}
if (/prerender/i.test(phase3)) errors.push('Phase 3 must not indiscriminately prerender pages');
if (/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/i.test(phase3)) errors.push('Phase 3 prefetch enhancement should rely on same-origin link prefetch, not custom network APIs');

const headers = await readDist('./_headers');
const netlify = await read('./netlify.toml');
for (const config of [['Cloudflare Pages _headers', headers], ['Netlify headers', netlify]]) {
  const [label, text] = config;
  if (!text.includes("worker-src 'none'")) errors.push(`${label} CSP lost worker-src 'none'`);
  if (!text.includes("script-src 'self'")) errors.push(`${label} CSP lost self-only script-src`);
  if (!text.includes("style-src 'self'")) errors.push(`${label} CSP lost self-only style-src`);
  if (/unsafe-inline|unsafe-eval/i.test(text)) errors.push(`${label} CSP permits unsafe inline/eval execution`);
  if (/Cache-Control[^\n"]*no-store/i.test(text)) errors.push(`${label} introduces no-store and may unnecessarily reduce bfcache/cache reuse`);
}
if (!headers.includes('/build/*') || !headers.includes('max-age=31536000, immutable')) errors.push('Cloudflare Pages build-asset immutable cache rule is missing');
if (!/for = "\/build\/\*"[\s\S]*?max-age=31536000, immutable/.test(netlify)) errors.push('Netlify build-asset immutable cache rule is missing');
if (!headers.includes('/search-index.json') || !headers.includes('max-age=3600, must-revalidate')) errors.push('Cloudflare Pages search index revalidation rule is missing');
if (!/for = "\/search-index\.json"[\s\S]*?max-age=3600, must-revalidate/.test(netlify)) errors.push('Netlify search index revalidation rule is missing');

const securityTxt = await readDist('./.well-known/security.txt');
const expiryRaw = securityTxt.match(/^Expires:\s*(.+)$/mi)?.[1]?.trim();
const expiry = expiryRaw ? new Date(expiryRaw) : null;
if (!expiry || Number.isNaN(expiry.getTime())) errors.push('security.txt is missing a valid Expires field');
else {
  const daysRemaining = Math.floor((expiry.getTime() - Date.now()) / 86400000);
  if (daysRemaining < 30) errors.push(`security.txt expires too soon or is expired: ${daysRemaining} day(s) remaining`);
  else if (daysRemaining < 90) warnings.push(`security.txt expires in ${daysRemaining} days; schedule renewal`);
  else console.log(`security.txt lifecycle: ${daysRemaining} day(s) remaining.`);
}

const sitemap = await readDist('./sitemap.xml');
if (/<lastmod>/i.test(sitemap)) errors.push('sitemap contains lastmod without a route-level source-backed modification-date system');

const homeSchemas = [...home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
if (!homeSchemas.some(schema => schema['@type'] === 'Organization')) errors.push('homepage is missing the canonical Organization schema');
const about = await readDist('./company/about/index.html');
const aboutSchemas = [...about.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
if (!aboutSchemas.some(schema => schema['@type'] === 'Organization')) errors.push('About page is missing Organization schema');
const protect = await readDist('./services/protect/index.html');
const protectSchemas = [...protect.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
if (protectSchemas.some(schema => schema['@type'] === 'Organization')) errors.push('generic service pages should not duplicate top-level Organization schema');

const pkg = JSON.parse(await read('./package.json'));
for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
  if (pkg[field] && Object.keys(pkg[field]).length) errors.push(`package.json introduces ${field}; static runtime should remain dependency-free`);
}
if (await existsRoot('./package-lock.json')) warnings.push('package-lock.json exists; confirm no dependency install has become part of the production build');

console.log(`Phase 3 measured sizes: CSS ${kib(stylesSize)}; JS ${kib(totalJsSize)}; search ${kib(searchSize)}; largest HTML ${largestHtml.file} ${kib(largestHtml.size)}.`);
for (const warning of warnings) console.warn(`WARNING: ${warning}`);
if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}
console.log(`V4 Phase 3 checks passed: ${runtimeEntries.length} content-addressed runtime assets, immutable build caching, measured size budgets, bfcache-safe runtime guards, conservative same-origin prefetch, strict CSP/cross-surface boundaries, security.txt lifecycle, truthful sitemap freshness, narrow Organization schema, and dependency-free static architecture.`);
