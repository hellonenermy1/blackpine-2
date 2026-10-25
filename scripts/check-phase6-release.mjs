import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const exists = relative => fs.existsSync(path.join(root, relative));
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

const requiredFiles = [
  'governance/RELEASE_EVIDENCE_STANDARD.md',
  'governance/RELEASE_EVIDENCE_REGISTER.json',
  'governance/CLOUDFLARE_CANONICAL_HOST_CONTROL.md',
  'governance/CLOUDFLARE_EDGE_TRANSFORM_CONTROL.md',
  'audit/deep-audit-remediation-2026-10-25.md',
  'scripts/check-live-production.mjs',
  'scripts/check-live-exact-release.mjs',
  'scripts/check-www-canonical.mjs',
  '.github/workflows/verify.yml'
];
for (const file of requiredFiles) if (!exists(file)) errors.push(`missing Phase 6 file: ${file}`);

let register;
try {
  register = JSON.parse(read('governance/RELEASE_EVIDENCE_REGISTER.json'));
} catch (error) {
  errors.push(`release evidence register is invalid JSON: ${error.message}`);
}

if (register) {
  const states = new Set(['VERIFIED', 'POST_MERGE_REQUIRED', 'DEFERRED_MANUAL', 'DEFERRED_GOVERNANCE', 'UNAVAILABLE_HISTORICAL', 'OPEN']);
  const classes = new Set(['SOURCE_BUILD', 'DEPLOYMENT_STATUS', 'LIVE_ORIGIN', 'BROWSER_ENGINE', 'MANUAL_DEVICE', 'GOVERNANCE', 'HISTORICAL_PERFORMANCE']);
  const risks = new Set(['critical', 'high', 'standard']);
  const ids = new Set();

  if (register.schemaVersion !== 1) errors.push(`release register schemaVersion must be 1; found ${register.schemaVersion}.`);
  if (register.standard !== 'governance/RELEASE_EVIDENCE_STANDARD.md') errors.push('release register does not point to the canonical Phase 6 standard.');
  if (!/^[0-9a-f]{40}$/.test(register.baselineCommit || '')) errors.push('release register baselineCommit must be a full Git SHA.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(register.updatedOn || '')) errors.push('release register updatedOn must be YYYY-MM-DD.');
  if (!Array.isArray(register.items) || !register.items.length) errors.push('release register must contain items.');

  for (const item of register.items || []) {
    if (!/^[A-Z]{3,4}-\d{3}$/.test(item.id || '')) errors.push(`invalid release evidence id: ${item.id || '<missing>'}.`);
    if (ids.has(item.id)) errors.push(`duplicate release evidence id: ${item.id}.`);
    ids.add(item.id);
    if (!classes.has(item.class)) errors.push(`${item.id}: invalid class ${item.class}.`);
    if (!risks.has(item.risk)) errors.push(`${item.id}: invalid risk ${item.risk}.`);
    if (!states.has(item.state)) errors.push(`${item.id}: invalid state ${item.state}.`);
    if (!item.description || typeof item.description !== 'string') errors.push(`${item.id}: description is missing.`);
    if (!item.boundary || typeof item.boundary !== 'string') errors.push(`${item.id}: boundary is missing.`);
    if (!Array.isArray(item.evidence) || !item.evidence.length) errors.push(`${item.id}: evidence references are missing.`);
    for (const relative of item.evidence || []) if (!exists(relative)) errors.push(`${item.id}: evidence path does not exist: ${relative}.`);
  }

  const requiredIds = ['REL-001', 'REL-002', 'LIVE-001', 'LIVE-002', 'LIVE-003', 'LIVE-004', 'LIVE-005', 'BRW-001', 'BRW-002', 'BRW-003', 'DEV-001', 'GOV-001', 'PERF-001', 'REL-003'];
  for (const id of requiredIds) if (!ids.has(id)) errors.push(`required Phase 6 evidence item is missing: ${id}.`);

  const byId = new Map((register.items || []).map(item => [item.id, item]));
  for (const id of ['REL-002', 'LIVE-001', 'LIVE-002', 'LIVE-003', 'LIVE-005']) if (byId.get(id)?.state !== 'POST_MERGE_REQUIRED') errors.push(`${id} must remain POST_MERGE_REQUIRED because every merged release needs fresh production proof.`);
  if (byId.get('LIVE-004')?.state !== 'VERIFIED') errors.push('LIVE-004 must remain VERIFIED after the www-to-apex redirect passed root and deep-path/query live checks.');
  if (byId.get('BRW-003')?.state !== 'DEFERRED_MANUAL') errors.push('BRW-003 must remain DEFERRED_MANUAL until Safari/WebKit is actually tested.');
  if (byId.get('DEV-001')?.state !== 'DEFERRED_MANUAL') errors.push('DEV-001 must remain DEFERRED_MANUAL until a real mobile-device pass is recorded.');
  if (!['OPEN', 'VERIFIED'].includes(byId.get('GOV-001')?.state)) errors.push('GOV-001 must remain OPEN while main is unprotected and may move to VERIFIED only after the actual GitHub protection/ruleset state is re-read.');
  if (byId.get('PERF-001')?.state !== 'UNAVAILABLE_HISTORICAL') errors.push('PERF-001 must not claim a controlled pre-V4 comparison without a same-method historical baseline.');
}

const standard = exists('governance/RELEASE_EVIDENCE_STANDARD.md') ? read('governance/RELEASE_EVIDENCE_STANDARD.md') : '';
for (const marker of [
  'Source configuration is not live-origin evidence.',
  'A green hosting badge is not canonical-domain proof.',
  'Chromium is not Safari/WebKit coverage.',
  'Responsive emulation is not a physical-device pass.',
  'Branch protection is not enabled because a document recommends it.',
  'Deferred items remain visible in the final sign-off'
]) {
  if (!standard.includes(marker)) errors.push(`release evidence standard is missing required boundary: ${marker}`);
}

const workflow = exists('.github/workflows/verify.yml') ? read('.github/workflows/verify.yml') : '';
for (const marker of ['live-production-audit:', 'RUN_EXACT_LIVE_MATCH:', 'Verify canonical production origin', 'LIVE_MATCH_DIST=0 npm run check:live', 'node scripts/check-www-canonical.mjs', 'node scripts/check-live-exact-release.mjs']) {
  if (!workflow.includes(marker)) errors.push(`verify workflow is missing Phase 6 live gate marker: ${marker}`);
}

const pkg = exists('package.json') ? JSON.parse(read('package.json')) : {};
if (pkg.scripts?.['check:live'] !== 'node scripts/check-live-production.mjs') errors.push('package.json check:live does not point to the Phase 6 live audit.');
if (!String(pkg.scripts?.check || '').includes('scripts/check-phase6-release.mjs')) errors.push('Phase 6 source gate is not wired into npm run check.');

const live = exists('scripts/check-live-production.mjs') ? read('scripts/check-live-production.mjs') : '';
for (const marker of ['verifyTls()', 'verifyHttp2()', 'verifyCanonicalSurface()', 'verifyMetadataAndCaching()', 'verifyContactSurface()', 'verifyCrossDomainBoundaries()']) {
  if (!live.includes(marker)) errors.push(`live production audit is missing required check: ${marker}`);
}

const exact = exists('scripts/check-live-exact-release.mjs') ? read('scripts/check-live-exact-release.mjs') : '';
for (const marker of ['static.cloudflareinsights.com', 'rocket-loader', '/cdn-cgi/l/email-protection', '/cdn-cgi/challenge-platform/scripts/jsd/main.js', 'window.__CF$cv$params', 'assertNoEdgeInjection', 'no-transform', 'Exact live-release match passed']) {
  if (!exact.includes(marker)) errors.push(`exact live-release audit is missing required edge-control marker: ${marker}`);
}

const edgePolicy = exists('governance/CLOUDFLARE_EDGE_TRANSFORM_CONTROL.md') ? read('governance/CLOUDFLARE_EDGE_TRANSFORM_CONTROL.md') : '';
for (const marker of ['Cloudflare Pages Web Analytics: **disabled**', 'Rocket Loader: **disabled**', 'Cloudflare JavaScript Detection / Challenge Platform HTML injection: **must not be injected into the corporate site**', 'Cache-Control: no-transform', "script-src 'self'", 'The exact live-release gate must verify']) {
  if (!edgePolicy.includes(marker)) errors.push(`Cloudflare edge-transform policy is missing required boundary: ${marker}`);
}

const canonical = exists('scripts/check-www-canonical.mjs') ? read('scripts/check-www-canonical.mjs') : '';
for (const marker of ['www.blackpinecybersecurity.com/company/about/', 'phase6=canonical-check', 'blackpinecybersecurity.com/company/about/']) {
  if (!canonical.includes(marker)) errors.push(`deep-path canonical-host check is missing required marker: ${marker}`);
}

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

const deferred = register.items.filter(item => item.state.startsWith('DEFERRED_')).length;
const postMerge = register.items.filter(item => item.state === 'POST_MERGE_REQUIRED').length;
const open = register.items.filter(item => item.state === 'OPEN').length;
console.log(`Phase 6 release-governance gate passed: ${register.items.length} evidence items; ${postMerge} recurring post-merge production proofs; ${deferred} explicit manual deferrals; ${open} open evidence item(s); canonical-host and no-transform exact-live release audits are wired into CI without overstating Safari/device, branch-protection or historical-performance evidence.`);
