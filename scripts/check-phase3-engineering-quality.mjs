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
  if (runtime.bytes > 50 * 1024) errors.push(`${label} references ${runtime.bytes} bytes of JavaScript; ordinary-page Phase 3 budget is 50 KiB`);
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
  if (!html.includes('data-404-suggestions')) errors.push(`${label} is missing the smart-404 suggestion container`);
}

const buildSource = await read('./build.mjs');
for (const path of ['/contact/', '/fr/contact/', '/es/contact/']) {
  if (!buildSource.includes(`'${path}'`)) errors.push(`route-aware runtime allowlist is missing ${path}`);
}
if (!buildSource.includes('removePhase2Runtime')) errors.push('build no longer contains the route-aware Phase 2 runtime removal step');

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
console.log(`Phase 3 engineering checks passed: ordinary routes omit the contact/404 feature runtime; home references ${(home.bytes / 1024).toFixed(1)} KiB across ${home.requests} JS assets; contact retains its feature runtime at ${(contact.bytes / 1024).toFixed(1)} KiB.`);
