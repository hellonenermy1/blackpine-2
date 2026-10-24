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
const phase2Js = runtime.content.phase2 || '';
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
if (/main\s*\{[^}]*overflow-x\s*:\s*clip/s.test(styles)) errors.push('main must not clip horizontal overflow; the browser audit should see real reflow failures');
if (!styles.includes('scroll-padding-top: calc(var(--header) + 24px)')) errors.push('sticky-header anchor offset is missing');

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
  ['dark faint/surface', '#748982', '#0d1a17'],
  ['light faint/main', '#5f716a', '#f3f5f2'],
  ['light faint/surface', '#5f716a', '#fafbf9']
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
if (siteJs.includes('initContactContext')) errors.push('legacy V3 contact preselection must not coexist with the V4 intent-aware contact controller');
if (!siteJs.includes('searchIndexPromise = undefined')) errors.push('local search must clear a failed cached index request so a later attempt can retry');
if (!phase2Js.includes('mailto:contact@blackpinecybersecurity.com')) errors.push('contact composer must target the published Blackpine contact mailbox');
if (!phase2Js.includes("form.addEventListener('submit'")) errors.push('contact composer must intercept native form submission before data reaches the static host');
if (!phase2Js.includes('form.reportValidity()')) errors.push('contact composer must preserve native form validation');

for (const route of ['legal/privacy', 'legal/terms']) {
  const html = await readDist(`./${route}/index.html`);
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) errors.push(`${route} must be indexable in production`);
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
if (netlify.includes('images.unsplash.com')) errors.push('static-host CSP still permits Unsplash');
if (!netlify.includes("img-src 'self' data:;")) errors.push('static-host CSP should restrict images to self/data');

const researchDir = new URL('./research/', dist);
const researchEntries = (await fs.readdir(researchDir, { withFileTypes: true })).filter(entry => entry.isDirectory() && entry.name !== 'program');
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
if (!contact.includes('data-contact-compose')) errors.push('contact page is missing the local email-composer marker');
if (!contact.includes('Compose inquiry email')) errors.push('contact action must state that it composes an email');
if (!contact.includes('Blackpine receives nothing from these fields until you send that email.')) errors.push('contact page must explain the local composer boundary');
if (/data-netlify|netlify-honeypot|name="form-name"/i.test(contact)) errors.push('production contact page must not imply a Netlify form backend on Cloudflare Pages');

if (!netlify.includes('from = "https://www.blackpinecybersecurity.com/*"')) errors.push('canonical www-to-apex redirect is missing from portability config');
if (!netlify.includes('from = "/contact.html"')) errors.push('legacy contact redirect is missing from portability config');
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

console.log('Production regression checks passed: consolidated build, fingerprinted runtime assets, pre-paint theme selection, progressive enhancement, exact contrast tokens, visible-overflow auditing, retryable local search, Cloudflare-compatible local contact composer, published legal routes, self-hosted media, curated research, direct Article JSON-LD, redirects, and cache/CSP policy.');
