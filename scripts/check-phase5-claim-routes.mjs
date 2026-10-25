import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { englishRoutes } from '../src/routes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const register = JSON.parse(fs.readFileSync(path.join(root, 'governance/PUBLIC_CLAIM_REGISTER.json'), 'utf8'));
const publicationMap = JSON.parse(fs.readFileSync(path.join(root, 'governance/PUBLIC_CLAIM_PUBLICATION_MAP.json'), 'utf8'));
const errors = [];
const fail = message => errors.push(message);

if (publicationMap.schemaVersion !== 1) fail(`publication map schemaVersion must be 1; found ${publicationMap.schemaVersion}.`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(publicationMap.updatedOn || '')) fail('publication map updatedOn must be YYYY-MM-DD.');
if (!publicationMap.entries || typeof publicationMap.entries !== 'object' || Array.isArray(publicationMap.entries)) fail('publication map entries object is missing.');

const allowedModes = new Set([
  'affirmative',
  'affirmative-bounded',
  'boundary',
  'client-supplied',
  'client-supplied-bounded',
  'externally-corroborated-bounded',
  'not-public-boundary'
]);
const publicEnglishRoutes = new Set(englishRoutes.map(route => route.path));
const registered = new Map(register.claims.map(claim => [claim.id, claim]));
const mappedIds = new Set(Object.keys(publicationMap.entries || {}));

for (const id of registered.keys()) {
  if (!mappedIds.has(id)) fail(`${id}: no public-route mapping exists.`);
}
for (const id of mappedIds) {
  if (!registered.has(id)) fail(`${id}: publication map has no matching claim record.`);
}

for (const [id, entry] of Object.entries(publicationMap.entries || {})) {
  const claim = registered.get(id);
  if (!allowedModes.has(entry.mode)) fail(`${id}: invalid publication mode ${entry.mode}.`);
  if (!Array.isArray(entry.routes) || !entry.routes.length) fail(`${id}: publication route list is empty.`);
  if (new Set(entry.routes || []).size !== (entry.routes || []).length) fail(`${id}: duplicate route in publication map.`);
  for (const route of entry.routes || []) {
    if (!publicEnglishRoutes.has(route)) fail(`${id}: mapped route is not a published English route: ${route}.`);
  }
  if (claim?.publicationStatus === 'NOT_PUBLIC' && entry.mode !== 'not-public-boundary') fail(`${id}: NOT_PUBLIC claim must map only as not-public-boundary.`);
  if (claim?.publicationStatus !== 'NOT_PUBLIC' && entry.mode === 'not-public-boundary') fail(`${id}: publishable claim is incorrectly mapped as not-public-boundary.`);
  if (claim?.evidenceBasis?.includes('CLIENT_SUPPLIED') && !entry.mode.startsWith('client-supplied') && claim.publicationStatus !== 'NOT_PUBLIC') fail(`${id}: client-supplied claim must keep a client-supplied publication mode.`);
  if (claim?.evidenceBasis?.includes('EXTERNAL_VERIFIED') && id === 'EXT-001' && entry.mode !== 'externally-corroborated-bounded') fail(`${id}: external corroboration must remain explicitly bounded in the publication map.`);
}

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Phase 5 claim-route gate passed: ${registered.size} material claims have one canonical publication-map entry and every mapped route exists in the English public route registry.`);
