import fs from 'node:fs/promises';
import { englishRoutes } from '../src/routes.mjs';
import { translationStatus } from '../src/i18n/translation-status.mjs';
import { driftBlocksRelease, sourceHashForRoute } from './i18n-phase4-lib.mjs';

const registryByPath = new Map(Object.values(translationStatus.entries).map(entry => [entry.sourcePath, entry]));
const records = [];
const summary = {
  englishSourceUnits: englishRoutes.length,
  published: 0,
  staleBlocking: 0,
  staleStandard: 0,
  nonPublished: 0
};

for (const route of englishRoutes) {
  const entry = registryByPath.get(route.path);
  const currentSourceHash = sourceHashForRoute(route);
  if (!entry) {
    records.push({ sourcePath: route.path, effectiveState: 'MISSING_REGISTRY' });
    continue;
  }

  for (const [locale, approval] of Object.entries(entry.locales || {})) {
    const stale = approval.approvedSourceHash !== currentSourceHash || approval.state === 'STALE';
    let effectiveState = approval.state;
    if (stale) effectiveState = 'STALE';
    if (approval.state === 'PUBLISHED') summary.published += 1;
    else summary.nonPublished += 1;
    if (stale && driftBlocksRelease(entry.risk)) summary.staleBlocking += 1;
    else if (stale) summary.staleStandard += 1;
    records.push({
      sourcePath: route.path,
      locale,
      risk: entry.risk,
      registryState: approval.state,
      effectiveState,
      approvedSourceHash: approval.approvedSourceHash,
      currentSourceHash,
      blocksRelease: stale && driftBlocksRelease(entry.risk)
    });
  }
}

const report = {
  schemaVersion: 1,
  approvalSourceRevision: translationStatus.sourceRevision,
  generatedFromCurrentTree: true,
  summary,
  records
};

await fs.mkdir(new URL('../phase4-artifacts/', import.meta.url), { recursive: true });
await fs.writeFile(new URL('../phase4-artifacts/translation-status-report.json', import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
console.log(`PHASE4 STATUS REPORT: ${summary.published} published approvals; ${summary.staleBlocking} blocking stale; ${summary.staleStandard} standard-risk stale; ${summary.nonPublished} non-published. Artifact: phase4-artifacts/translation-status-report.json.`);
