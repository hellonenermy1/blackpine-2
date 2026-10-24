import fs from 'node:fs/promises';
import { capabilityFamilies, researchCandidates, services } from '../src/data.mjs';
import { loadRuntimeAssets } from './lib/runtime-assets.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];
const read = relative => fs.readFile(new URL(relative, root), 'utf8');
const readDist = relative => fs.readFile(new URL(relative, dist), 'utf8');
const visibleText = html => String(html || '')
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ')
  .trim();

const familyPaths = capabilityFamilies.map(family => family.path);
if (familyPaths.length !== 6 || new Set(familyPaths).size !== 6) errors.push('Phase 2 must expose exactly six unique family paths');

const searchIndex = JSON.parse(await readDist('./search-index.json'));
const searchPaths = new Set(searchIndex.map(entry => entry.path));
const sitemap = await readDist('./sitemap.xml');
for (const family of capabilityFamilies) {
  const file = `.${family.path}index.html`;
  let html = '';
  try { html = await readDist(file); } catch { errors.push(`missing family route ${family.path}`); continue; }
  if (!html.includes('<h1')) errors.push(`${family.path} is missing an H1`);
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) errors.push(`${family.path} must be indexable`);
  if (!visibleText(html).includes(family.name)) errors.push(`${family.path} does not identify ${family.name}`);
  if (!html.includes(`/contact/?intent=${family.id}`)) errors.push(`${family.path} does not carry its intent into contact intake`);
  if (!searchPaths.has(family.path)) errors.push(`search index is missing ${family.path}`);
  if (!sitemap.includes(`https://blackpinecybersecurity.com${family.path}`)) errors.push(`sitemap is missing ${family.path}`);
}

const home = await readDist('./index.html');
const homeText = visibleText(home);
for (const family of capabilityFamilies) {
  if (!home.includes(family.path)) errors.push(`homepage is missing family route ${family.path}`);
  if (!homeText.includes(family.intent)) errors.push(`homepage is missing customer-language intent for ${family.id}`);
}
if (!homeText.includes('You should not need to diagnose the service first.')) errors.push('homepage is missing the Phase 2 problem-first framing');

const servicesIndex = await readDist('./services/index.html');
for (const family of capabilityFamilies) if (!servicesIndex.includes(family.path)) errors.push(`/services/ is missing family ${family.path}`);
for (const service of services) if (!servicesIndex.includes(`/services/${service.slug}/`)) errors.push(`/services/ dropped specialist route ${service.slug}`);

const engagements = await readDist('./engagements/index.html');
for (const name of ['Blackpine On-Demand', 'Blackpine Response Retainer', 'Blackpine Managed Security']) {
  if (!engagements.includes(name)) errors.push(`/engagements/ is missing ${name}`);
}

const contact = await readDist('./contact/index.html');
for (const marker of ['data-contact-form', 'data-contact-urgent', 'data-capability-context', 'safe-email', 'safe-phone']) {
  if (!contact.includes(marker)) errors.push(`contact intake is missing ${marker}`);
}
for (const family of capabilityFamilies) if (!contact.includes(`value="${family.id}"`)) errors.push(`contact intake is missing family option ${family.id}`);
if (!contact.includes('Safe email to use') || !contact.includes('Safe callback number')) errors.push('contact intake is missing safe communication labels');
if (!contact.includes('malware samples')) errors.push('contact guidance must warn against sending malware samples through public intake');
if (/data-contact-urgent\s+hidden/.test(contact)) errors.push('safe alternate-contact fields must remain available in the no-JavaScript form');

let runtime;
try {
  runtime = await loadRuntimeAssets(dist, home);
} catch (error) {
  errors.push(error.message);
  runtime = { refs: {}, content: {} };
}
const phase2Js = runtime.content.phase2 || '';
if (/localStorage|sessionStorage|indexedDB/i.test(phase2Js)) errors.push('Phase 2 experience script must not persist contact/incident context in browser storage');
if (/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/i.test(phase2Js)) errors.push('Phase 2 experience script unexpectedly performs a network request');
for (const marker of ['initContact', 'initSmart404', 'safePathname', 'data-contact-urgent', 'data-404-suggestions']) if (!phase2Js.includes(marker)) errors.push(`Phase 2 script is missing ${marker}`);
if (!/try\s*\{[\s\S]*decodeURIComponent/.test(phase2Js) || !/catch\s*\{/.test(phase2Js)) errors.push('smart 404 pathname decoding must fail safely on malformed URLs');

const errorPage = await readDist('./404.html');
if (!errorPage.includes('data-404-suggestions')) errors.push('404 page is missing the local suggestion surface');
if (!runtime.refs.phase2 || !errorPage.includes(`<script src="${runtime.refs.phase2}" defer></script>`)) errors.push('404 output is missing the fingerprinted Phase 2 enhancement script');

const layout = await read('./src/layout.mjs');
if (!layout.includes("./nav-v4.mjs")) errors.push('shared layout is not using the Phase 2 navigation model');
const nav = await read('./src/nav-v4.mjs');
for (const family of capabilityFamilies) if (!nav.includes(family.path)) errors.push(`primary navigation is missing ${family.path}`);

const phase2Css = await read('./src/styles/phase2.css');
for (const marker of ['scroll-margin-top', '@media (forced-colors: active)', '.family-models', '.family-question-grid']) {
  if (!phase2Css.includes(marker)) errors.push(`Phase 2 CSS is missing ${marker}`);
}

const allGeneratedText = searchIndex.map(entry => `${entry.title} ${entry.description} ${entry.terms} ${entry.text}`).join('\n');
for (const candidate of researchCandidates) {
  if (allGeneratedText.includes(candidate.name)) errors.push(`non-public research candidate leaked into public search content: ${candidate.name}`);
}

const privacy = await readDist('./legal/privacy/index.html');
if (!visibleText(privacy).includes('does not deliberately store contact-form or incident-description fields in local browser storage')) errors.push('privacy page is missing the lawyer-approved Phase 2 browser-storage disclosure');
if (/production V[0-9]+ baseline/i.test(visibleText(privacy))) errors.push('privacy page reintroduced release-number wording instead of a version-neutral production baseline');

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`V4 Phase 2 checks passed: ${familyPaths.length} problem-first routes, specialist-route preservation, intent-aware safe contact intake including no-JS fallback, robust local smart-404 behavior, R&D isolation, fingerprinted enhancement loading, storage/network restrictions, navigation, privacy, and accessibility markers.`);
