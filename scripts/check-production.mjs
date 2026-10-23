import fs from 'node:fs/promises';
import vm from 'node:vm';
import { loadRuntimeAssets } from './lib/runtime-assets.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];

const read = relative => fs.readFile(new URL(relative, root), 'utf8');
const readDist = relative => fs.readFile(new URL(relative, dist), 'utf8');
const exists = async relative => fs.access(new URL(relative, root)).then(() => true).catch(() => false);

const home = await readDist('./index.html');
let runtime;
try {
  runtime = await loadRuntimeAssets(dist, home);
} catch (error) {
  errors.push(error.message);
  runtime = { refs: {}, content: {} };
}
const styles = runtime.content.styles || '';
const siteJs = runtime.content.site || '';
const themeInit = runtime.content.themeInit || '';
const sitemap = await readDist('./sitemap.xml');
const netlify = await read('./netlify.toml');
const build = await read('./build.mjs');

for (const obsolete of ['./build-v2.mjs', './src/hardening.css', './src/templates.mjs']) {
  if (await exists(obsolete)) errors.push(`${obsolete} should not exist after build consolidation`);
}

const themeScriptIndex = runtime.refs.themeInit ? home.indexOf(`<script src="${runtime.refs.themeInit}"></script>`) : -1;
const cssIndex = runtime.refs.styles ? home.indexOf(`<link rel="stylesheet" href="${runtime.refs.styles}">`) : -1;
const siteScriptIndex = runtime.refs.site ? home.indexOf(`<script src="${runtime.refs.site}" defer></script>`) : -1;
if (themeScriptIndex === -1 || cssIndex === -1 || themeScriptIndex > cssIndex) errors.push('fingerprinted theme-init must run before the stylesheet to avoid a saved-theme flash');
if (siteScriptIndex === -1 || siteScriptIndex < cssIndex) errors.push('fingerprinted site.js must be deferred after stylesheet discovery');

if (/\[data-reveal\]\s*\{[^}]*opacity\s*:\s*0/s.test(styles)) errors.push('core content still depends on reveal JavaScript');
if (/main\s*\{\s*overflow\s*:\s*hidden/s.test(styles)) errors.push('main overflow can still break sticky navigation');
if (!styles.includes('scroll-padding-top: calc(var(--header) + 24px)')) errors.push('sticky-header anchor offset is missing');
if (!/\.hidden-field\s*\{\s*display\s*:\s*none\s*!important;/s.test(styles)) errors.push('honeypot is not removed from the accessibility tree');

const luminance = hex => {
  const rgb = hex.replace('#', '').match(/../g).map(part => parseInt(part, 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};
const contrast = (a, b) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
};
for (const [label, foreground, background] of [
  ['dark faint/main', '#748982', '#07100f'],
  ['dark faint/surface', '#748982', '#0e1c19'],
  ['light faint/main', '#5f716a', '#f1f4f1'],
  ['light faint/surface', '#5f716a', '#f7f9f7']
]) if (contrast(foreground, background) < 4.5) errors.push(`${label} contrast is below 4.5:1`);

try {
  vm.runInNewContext(themeInit, {
    window: { localStorage: { getItem() { throw new Error('SecurityError'); } } },
    document: { documentElement: { dataset: { theme: 'auto' } } }
  });
} catch (error) {
  errors.push(`theme-init.js crashes when storage is blocked: ${error.message}`);
}

if (!siteJs.includes("params.get('topic')")) errors.push('research topic deep-linking is missing');
if (!siteJs.includes("params.get('type')")) errors.push('research type deep-linking is missing');
if (!siteJs.includes("'incident-response': 'Incident response'")) errors.push('legacy service-to-contact preselection mapping is missing');

for (const route of ['legal/privacy', 'legal/terms']) {
  const html = await readDist(`./${route}/index.html`);
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) errors.push(`${route} must be indexable in Phase 3 production`);
  if (!sitemap.includes(`https://blackpinecybersecurity.com/${route}/`)) errors.push(`${route} must appear in the production sitemap`);
}

for (const asset of [
  './public/assets/visuals/infrastructure.svg',
  './public/assets/og/home.png',
  './public/assets/og/capabilities.png',
  './public/assets/og/research.png',
  './public/assets/og/labs.png',
  './public/assets/og/trust.png',
  './public/assets/og/company.png',
  './public/assets/og/contact.png',
  './public/assets/og/legal.png'
]) if (!await exists(asset)) errors.push(`missing production asset ${asset}`);

const generatedHtmlFiles = [];
async function walk(url) {
  for (const entry of await fs.readdir(url, { withFileTypes: true })) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, url);
    if (entry.isDirectory()) await walk(child);
    else if (entry.name.endsWith('.html')) generatedHtmlFiles.push(child);
  }
}
await walk(dist);
for (const file of generatedHtmlFiles) {
  const html = await fs.readFile(file, 'utf8');
  if (html.includes('images.unsplash.com') || html.includes('unsplash.com')) errors.push(`generated page still references Unsplash: ${file.pathname}`);
}
if (netlify.includes('images.unsplash.com')) errors.push('production CSP still permits Unsplash');
if (!netlify.includes("img-src 'self' data:;")) errors.push('production CSP should restrict images to self/data');

const researchDir = new URL('./research/', dist);
const researchEntries = (await fs.readdir(researchDir, { withFileTypes: true })).filter(entry => entry.isDirectory());
if (researchEntries.length !== 8) errors.push(`expected 8 curated production research articles, found ${researchEntries.length}`);
if (!researchEntries.length) errors.push('no generated research articles found');
else {
  const sample = await fs.readFile(new URL(`./${researchEntries[0].name}/index.html`, researchDir), 'utf8');
  const scripts = [...sample.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const article = scripts.find(item => item['@type'] === 'Article');
  if (!article) errors.push('research article is missing direct Article JSON-LD');
  else {
    if (article.author?.['@type'] !== 'Organization') errors.push('Article author is not typed as Organization');
    if (!article.mainEntityOfPage?.startsWith('https://blackpinecybersecurity.com/research/')) errors.push('Article mainEntityOfPage is incorrect');
    if (!article.image?.[0]?.startsWith('https://blackpinecybersecurity.com/assets/og/')) errors.push('Article image is not a self-hosted Blackpine OG asset');
  }
}

const cloudService = await readDist('./services/cloud-saas-security/index.html');
if (!cloudService.includes('/research/common-cloud-administrative-access-mistakes/')) errors.push('cloud service page is missing mapped cloud research');
if (cloudService.includes('/research/business-email-compromise-first-actions/')) errors.push('cloud service page contains unrelated incident research');

const contact = await readDist('./contact/index.html');
if (contact.includes('name="consent"')) errors.push('redundant contact-consent checkbox is still present');
if (!contact.includes('aria-describedby="message-guidance"')) errors.push('contact message guidance is not programmatically associated');
if (!contact.includes('data-netlify="true"')) errors.push('Netlify form detection marker is missing');

if (!netlify.includes('from = "https://www.blackpinecybersecurity.com/*"')) errors.push('canonical www-to-apex redirect is missing');
if (!netlify.includes('from = "/contact.html"')) errors.push('legacy contact redirect is missing');
if (!/for = "\/build\/\*"[\s\S]*?Cache-Control = "public, max-age=31536000, immutable"/.test(netlify)) errors.push('fingerprinted build assets are missing the immutable cache policy');
if (!/for = "\/search-index\.json"[\s\S]*?Cache-Control = "public, max-age=3600, must-revalidate"/.test(netlify)) errors.push('search-index.json must remain short-lived and revalidated');
if (/Strict-Transport-Security\s*=\s*"[^"]*preload/.test(netlify)) errors.push('HSTS preload must not be committed accidentally');

if (build.includes('build-v2.mjs')) errors.push('build.mjs delegates to obsolete build wrapper');
if (/readFile\([^)]*dist[\s\S]*replace\(/.test(build)) errors.push('build.mjs appears to repair generated HTML after rendering');
if (!build.includes("createHash('sha256')")) errors.push('build.mjs is missing content hashing for runtime assets');

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log('Production regression checks passed: consolidated build, fingerprinted runtime assets, pre-paint theme selection, progressive enhancement, contrast, sticky anchors, accessible honeypot, published legal routes, self-hosted media, curated research, direct Article JSON-LD, contact intake, redirects, and cache/CSP policy.');
