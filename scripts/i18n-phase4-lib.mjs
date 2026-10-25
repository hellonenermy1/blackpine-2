import { createHash } from 'node:crypto';

export const translationStates = Object.freeze([
  'DRAFT',
  'TRANSLATED',
  'TECHNICAL_REVIEWED',
  'LEGAL_REVIEWED',
  'APPROVED',
  'PUBLISHED',
  'STALE'
]);

export const publishedState = 'PUBLISHED';

const excludedPageKeys = new Set([
  'alternateLinks',
  'lang',
  'localizationSourcePath',
  'localizationSourceHash',
  'translationStatus'
]);

function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value)
      .filter(key => !excludedPageKeys.has(key))
      .sort()
      .map(key => [key, normalize(value[key])]));
  }
  if (typeof value === 'string') return value.replace(/\r\n/g, '\n');
  if (typeof value === 'undefined') return null;
  return value;
}

export function sourceHashForRoute(route) {
  const payload = normalize({
    path: route.path,
    indexable: Boolean(route.indexable),
    page: route.page || {}
  });
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

export function translationRiskForPath(path) {
  const value = String(path || '/');
  if (value === '/legal/privacy/' || value === '/legal/terms/') return 'legal';
  if (
    value === '/contact/' ||
    value === '/incident/' ||
    value === '/assessment/' ||
    value === '/engagements/' ||
    value === '/methodology/' ||
    value === '/security-baseline/' ||
    value.startsWith('/services/') ||
    value.startsWith('/trust/') ||
    value.startsWith('/labs/cipher/') ||
    value === '/company/external-verification/' ||
    value === '/work/client-evidence/' ||
    value === '/reports/sample-security-assessment/'
  ) return 'critical';
  return 'standard';
}

export const driftBlocksRelease = risk => risk === 'critical' || risk === 'legal';

export function effectiveTranslationStatus(entry, record, currentSourceHash) {
  const registryState = record?.state || 'DRAFT';
  const stale = registryState === 'STALE' || (Boolean(record?.approvedSourceHash) && record.approvedSourceHash !== currentSourceHash);
  return {
    registryState,
    effectiveState: stale ? 'STALE' : registryState,
    stale,
    published: registryState === publishedState,
    blocksRelease: stale && driftBlocksRelease(entry?.risk)
  };
}

export function stableTranslationKey(path) {
  const clean = String(path || '/').replace(/^\/+|\/+$/g, '');
  return clean ? clean.split('/').join('.') : 'home';
}
