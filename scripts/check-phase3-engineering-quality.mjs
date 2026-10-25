import fs from 'node:fs/promises';
import { runtimeAssetRefs } from './lib/runtime-assets.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];

const read = relative => fs.readFile(new URL(relative, root), 'utf8');
const readDist = relative => fs.readFile(new URL(relative, dist), 'utf8');

const runtimeBytes = async html => {
  const refs = runtimeAssetRefs(html);
  const jsRefs = Object.entries(refs).filter(([key, ref]) => key !== 'styles' && ref);
  let bytes = 0;
  for (const [, ref] of jsRefs) bytes += (await fs.stat(new URL(`.${ref}`, dist))).size;
  return { refs, bytes, requests: jsRefs.length };
};

const ordinaryRoutes = [
  ['home', './index.html'],
  ['French home', './fr/index.html'],
  ['Spanish home', './es/index.html'],
  ['services', './services/index.html'],
  ['research', './research/index.html']
];

for (const [label, relative] of ordinaryRoutes) {
  const html = await readDist(relative);
  const runtime = await runtimeBytes(html);
  if (runtime.refs.phase2) errors.push(`${label} unexpectedly loads the contact/404 feature runtime`);
  if (runtime.refs.tools) errors.push(`${label} unexpectedly loads the local tools feature runtime`);
  if (runtime.bytes > 40 * 1024) errors.push(`${label} references ${runtime.bytes} bytes of JavaScript; ordinary-page Phase 3 budget is 40 KiB`);
  if (runtime.requests > 5) errors.push(`${label} makes ${runtime.requests} JavaScript asset requests; ordinary-page Phase 3 ceiling is 5`);
}

const contactRoutes = [
  ['English contact', './contact/index.html'],
  ['French contact', './fr/contact/index.html'],
  ['Spanish contact', './es/contact/index.html']
];
for (const [label, relative] of contactRoutes) {
  const html = await readDist(relative);
  const runtime = await runtimeBytes(html);
  if (!runtime.refs.phase2) errors.push(`${label} is missing the contact runtime`);
  if (runtime.refs.tools) errors.push(`${label} unexpectedly loads the local tools runtime`);
  if (!html.includes('data-contact-form')) errors.push(`${label} is missing the generated contact form`);
}

const errorRoutes = [
  ['English 404', './404.html'],
  ['French 404', './fr/404.html'],
  ['Spanish 404', './es/404.html']
];
for (const [label, relative] of errorRoutes) {
  const html = await readDist(relative);
  const runtime = await runtimeBytes(html);
  if (!runtime.refs.phase2) errors.push(`${label} is missing the smart-404 runtime`);
  if (runtime.refs.tools) errors.push(`${label} unexpectedly loads the local tools runtime`);
  if (!html.includes('data-404-suggestions')) errors.push(`${label} is missing the smart-404 suggestion container`);
}

const toolRoutes = [
  ['English headers tool', './tools/security-headers/index.html', 'data-headers-input'],
  ['English email tool', './tools/email-security/index.html', 'data-email-records-input'],
  ['English DNS tool', './tools/domain-dns/index.html', 'data-dns-records-input'],
  ['English assessment', './assessment/index.html', 'data-assessment'],
  ['French headers tool', './fr/tools/security-headers/index.html', 'data-headers-input'],
  ['French email tool', './fr/tools/email-security/index.html', 'data-email-records-input'],
  ['French DNS tool', './fr/tools/domain-dns/index.html', 'data-dns-records-input'],
  ['French assessment', './fr/assessment/index.html', 'data-assessment'],
  ['Spanish headers tool', './es/tools/security-headers/index.html', 'data-headers-input'],
  ['Spanish email tool', './es/tools/email-security/index.html', 'data-email-records-input'],
  ['Spanish DNS tool', './es/tools/domain-dns/index.html', 'data-dns-records-input'],
  ['Spanish assessment', './es/assessment/index.html', 'data-assessment']
];
for (const [label, relative, marker] of toolRoutes) {
  const html = await readDist(relative);
  const runtime = await runtimeBytes(html);
  if (!runtime.refs.tools) errors.push(`${label} is missing the local tools runtime`);
  if (runtime.refs.phase2) errors.push(`${label} unexpectedly loads the contact/404 runtime`);
  if (!html.includes(marker)) errors.push(`${label} is missing its tool surface marker ${marker}`);
}

const spanishProtect = await readDist('./es/services/protect/index.html');
const spanishNav = spanishProtect.match(/<nav\b[^>]*\bid="primary-nav"[\s\S]*?<\/nav>/)?.[0] || '';
if (!/class="nav-parent[^"]*is-context-active[^"]*"[^>]*href="\/es\/services\/"/.test(spanishNav)) {
  errors.push('Spanish service pages must mark the Capabilities parent as the active navigation context');
}
if (!/<a\b[^>]*href="\/es\/services\/protect\/"[^>]*aria-current="page"/.test(spanishNav)) {
  errors.push('Spanish service pages must expose aria-current on the current navigation child');
}
if (!spanishProtect.includes('<body class="page-services"')) errors.push('Spanish service pages must retain the base service page family');

const siteSource = await read('./src/site.js');
const toolsSource = await read('./src/tools.js');
const preferencesSource = await read('./src/preferences.js');
const themeInitSource = await read('./src/theme-init.js');
if (/localStorage|blackpine-theme|blackpine\.preferences\.v1/.test(siteSource)) {
  errors.push('src/site.js must not own or write browser preference storage');
}
if (!siteSource.includes("CustomEvent('blackpine:themechange'")) errors.push('theme UI must emit the named preference event');
if (!preferencesSource.includes("addEventListener('blackpine:themechange'")) errors.push('preferences runtime must own persistence for theme-change events');
if (!preferencesSource.includes("setItem(storageKey")) errors.push('preferences runtime must write the primary preference record');
if (/setItem\(legacyThemeKey/.test(preferencesSource) || /setItem\(legacyThemeKey/.test(themeInitSource)) {
  errors.push('legacy blackpine-theme storage must be migration/cleanup-only and never receive new writes');
}
if (!themeInitSource.includes('validLegacyThemes') || !themeInitSource.includes('removeItem(legacyThemeKey)')) {
  errors.push('pre-paint theme boot must retain one-way legacy migration and cleanup');
}
if (!themeInitSource.includes('setItem(preferencesKey')) errors.push('legacy theme migration must write the primary preference record');
if (preferencesSource.includes('queueMicrotask')) errors.push('theme persistence must not rely on post-click microtask ordering');

for (const marker of ['data-headers-input', 'data-email-records-input', 'data-dns-records-input', 'data-assessment-run']) {
  if (siteSource.includes(marker)) errors.push(`global site runtime still contains route-specific tool marker ${marker}`);
  if (!toolsSource.includes(marker)) errors.push(`local tools runtime is missing ${marker}`);
}
if (/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie/.test(toolsSource)) {
  errors.push('local tools runtime must remain offline and non-persisting');
}

const buildSource = await read('./build.mjs');
for (const path of ['/contact/', '/fr/contact/', '/es/contact/']) {
  if (!buildSource.includes(`'${path}'`)) errors.push(`route-aware runtime allowlist is missing ${path}`);
}
for (const path of ['/tools/security-headers/', '/tools/email-security/', '/tools/domain-dns/', '/assessment/']) {
  if (!buildSource.includes(`'${path}'`)) errors.push(`tool runtime allowlist is missing ${path}`);
}
if (!buildSource.includes('removePhase2Runtime')) errors.push('build no longer contains the route-aware Phase 2 runtime removal step');
if (!buildSource.includes('addToolsRuntime')) errors.push('build no longer contains the route-aware tools runtime injection step');

const layoutSource = await read('./src/layout.mjs');
if (!layoutSource.includes('assets.phase2')) errors.push('layout no longer exposes the Phase 2 feature runtime for contact/404 routes');

const securityGate = await read('./scripts/check-phase2-security-hardening.mjs');
if (!securityGate.includes('mailto:contact@blackpinecybersecurity.com')) errors.push('Phase 2 contact security assertions were unexpectedly removed');

if (errors.length) {
  console.error(errors.map(error => `PHASE3 ENGINEERING: ${error}`).join('\n'));
  process.exit(1);
}

const home = await runtimeBytes(await readDist('./index.html'));
const contact = await runtimeBytes(await readDist('./contact/index.html'));
const headersTool = await runtimeBytes(await readDist('./tools/security-headers/index.html'));
console.log(`Phase 3 engineering checks passed: ordinary routes use ${(home.bytes / 1024).toFixed(1)} KiB across ${home.requests} JS assets; contact retains its route-scoped runtime at ${(contact.bytes / 1024).toFixed(1)} KiB; local tools load only where used (${(headersTool.bytes / 1024).toFixed(1)} KiB on a tool route); Spanish navigation state matches the base route; theme persistence has one live owner.`);
