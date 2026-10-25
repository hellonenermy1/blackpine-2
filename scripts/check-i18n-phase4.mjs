import { englishRoutes, frenchSourceRoutes, spanishSourceRoutes } from '../src/routes.mjs';
import { translationStatus, publishedSourcePaths } from '../src/i18n/translation-status.mjs';
import {
  driftBlocksRelease,
  sourceHashForRoute,
  stableTranslationKey,
  translationRiskForPath,
  translationStates
} from './i18n-phase4-lib.mjs';

const errors = [];
const warnings = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const allowedStates = new Set(translationStates);
const englishByPath = new Map(englishRoutes.map(route => [route.path, route]));
const registryByPath = new Map();

assert(translationStatus.version === 1, `Expected translation status schema version 1, found ${translationStatus.version}.`);
assert(JSON.stringify(translationStatus.states) === JSON.stringify(translationStates), 'Translation lifecycle differs from the approved Phase 4 state sequence.');

for (const [key, entry] of Object.entries(translationStatus.entries)) {
  assert(key === stableTranslationKey(entry.sourcePath), `${key}: registry key does not match source path ${entry.sourcePath}.`);
  assert(!registryByPath.has(entry.sourcePath), `${entry.sourcePath}: duplicate translation registry source path.`);
  registryByPath.set(entry.sourcePath, entry);
  assert(['standard', 'critical', 'legal'].includes(entry.risk), `${entry.sourcePath}: invalid risk ${entry.risk}.`);
  assert(entry.risk === translationRiskForPath(entry.sourcePath), `${entry.sourcePath}: registry risk ${entry.risk} differs from derived risk ${translationRiskForPath(entry.sourcePath)}.`);
  assert(/^[a-f0-9]{64}$/.test(entry.sourceHash || ''), `${entry.sourcePath}: baseline source hash is not SHA-256.`);

  for (const [locale, record] of Object.entries(entry.locales || {})) {
    assert(locale === 'fr-CA' || locale === 'es', `${entry.sourcePath}: unsupported registry locale ${locale}.`);
    assert(allowedStates.has(record.state), `${entry.sourcePath} ${locale}: invalid lifecycle state ${record.state}.`);
    assert(/^[a-f0-9]{64}$/.test(record.approvedSourceHash || ''), `${entry.sourcePath} ${locale}: approved source hash is not SHA-256.`);
    if (entry.risk === 'legal') assert(record.legalReviewRequired === true, `${entry.sourcePath} ${locale}: legal publication must retain legalReviewRequired=true.`);
    else assert(record.legalReviewRequired === false, `${entry.sourcePath} ${locale}: non-legal route unexpectedly requires lawyer review.`);
  }
}

assert(registryByPath.size === englishRoutes.length, `Translation registry covers ${registryByPath.size} English source routes; expected ${englishRoutes.length}.`);
for (const route of englishRoutes) assert(registryByPath.has(route.path), `${route.path}: missing translation registry entry.`);
for (const path of registryByPath.keys()) assert(englishByPath.has(path), `${path}: registry entry has no current English route.`);

const expectedFrench = publishedSourcePaths('fr-CA');
const expectedSpanish = publishedSourcePaths('es');
const actualFrench = new Set(frenchSourceRoutes.map(route => route.path));
const actualSpanish = new Set(spanishSourceRoutes.map(route => route.path));

assert(actualFrench.size === expectedFrench.size, `French publication count ${actualFrench.size} differs from registry PUBLISHED count ${expectedFrench.size}.`);
assert(actualSpanish.size === expectedSpanish.size, `Spanish publication count ${actualSpanish.size} differs from registry PUBLISHED count ${expectedSpanish.size}.`);
for (const path of expectedFrench) assert(actualFrench.has(path), `${path}: registry says French PUBLISHED but route is not generated.`);
for (const path of actualFrench) assert(expectedFrench.has(path), `${path}: French route generated without PUBLISHED registry authority.`);
for (const path of expectedSpanish) assert(actualSpanish.has(path), `${path}: registry says Spanish PUBLISHED but route is not generated.`);
for (const path of actualSpanish) assert(expectedSpanish.has(path), `${path}: Spanish route generated without PUBLISHED registry authority.`);

for (const path of ['/legal/privacy/', '/legal/terms/']) {
  const entry = registryByPath.get(path);
  assert(entry?.locales?.['fr-CA']?.state === 'PUBLISHED', `${path}: approved French lawyer translation must remain PUBLISHED.`);
  assert(!entry?.locales?.es, `${path}: Spanish lawyer translation must remain absent until approved legal source exists.`);
  assert(!actualSpanish.has(path), `${path}: unpublished Spanish lawyer route was generated.`);
}

let staleStandard = 0;
let staleBlocking = 0;
let published = 0;
let nonPublished = 0;

for (const route of englishRoutes) {
  const entry = registryByPath.get(route.path);
  if (!entry) continue;
  const currentHash = sourceHashForRoute(route);

  for (const [locale, record] of Object.entries(entry.locales || {})) {
    if (record.state === 'PUBLISHED') {
      published += 1;
      if (currentHash !== record.approvedSourceHash) {
        const message = `${route.path} ${locale}: STALE — approved English hash ${record.approvedSourceHash.slice(0, 12)}… differs from current ${currentHash.slice(0, 12)}….`;
        if (driftBlocksRelease(entry.risk)) {
          staleBlocking += 1;
          errors.push(message);
        } else {
          staleStandard += 1;
          warnings.push(message);
        }
      }
    } else {
      nonPublished += 1;
      if (record.state === 'STALE' && driftBlocksRelease(entry.risk)) {
        staleBlocking += 1;
        errors.push(`${route.path} ${locale}: critical/legal translation is explicitly STALE.`);
      }
    }
  }
}

if (warnings.length) {
  console.warn(`Phase 4 translation status report has ${warnings.length} non-blocking standard-risk drift warning(s):`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error(`Phase 4 localization release gate failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Phase 4 translation drift/publication gate passed: ${englishRoutes.length} English source units; ${expectedFrench.size} French and ${expectedSpanish.size} Spanish PUBLISHED routes; ${published} published locale approvals; ${nonPublished} non-published locale records; ${staleBlocking} blocking stale translations; ${staleStandard} standard-risk stale translations.`);
