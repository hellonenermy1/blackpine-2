import { englishRoutes, frenchRoutes, spanishRoutes } from '../src/routes.mjs';
import { sourceHashForRoute, stableTranslationKey, translationRiskForPath } from './i18n-phase4-lib.mjs';

const frByKey = new Map(frenchRoutes.map(route => [stableTranslationKey(route.path.replace(/^\/fr(?=\/|$)/, '') || '/'), route]));
const esByKey = new Map(spanishRoutes.map(route => [stableTranslationKey(route.path.replace(/^\/es(?=\/|$)/, '') || '/'), route]));

const entries = englishRoutes.map(route => {
  const key = stableTranslationKey(route.path);
  const sourceHash = sourceHashForRoute(route);
  const risk = translationRiskForPath(route.path);
  const locales = {};
  if (frByKey.has(key)) locales['fr-CA'] = {
    state: 'PUBLISHED',
    approvedSourceHash: sourceHash,
    legalReviewRequired: risk === 'legal'
  };
  if (esByKey.has(key)) locales.es = {
    state: 'PUBLISHED',
    approvedSourceHash: sourceHash,
    legalReviewRequired: false
  };
  return [key, {
    sourcePath: route.path,
    risk,
    sourceHash,
    locales
  }];
});

const manifest = {
  version: 1,
  sourceRevision: '7e2584eb2ce069ac15e07a473e55b9b01aa2e1d0',
  states: ['DRAFT', 'TRANSLATED', 'TECHNICAL_REVIEWED', 'LEGAL_REVIEWED', 'APPROVED', 'PUBLISHED', 'STALE'],
  entries: Object.fromEntries(entries)
};

console.log('PHASE4_TRANSLATION_BASELINE_BEGIN');
console.log(JSON.stringify(manifest, null, 2));
console.log('PHASE4_TRANSLATION_BASELINE_END');
