import { effectiveTranslationStatus } from './i18n-phase4-lib.mjs';

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const approved = 'a'.repeat(64);
const changed = 'b'.repeat(64);

const critical = effectiveTranslationStatus(
  { risk: 'critical' },
  { state: 'PUBLISHED', approvedSourceHash: approved },
  changed
);
assert(critical.effectiveState === 'STALE', 'Critical changed translation did not become STALE.');
assert(critical.blocksRelease === true, 'Critical changed translation did not block release.');
assert(critical.published === true, 'Critical changed translation lost its registry publication state during drift evaluation.');

const standard = effectiveTranslationStatus(
  { risk: 'standard' },
  { state: 'PUBLISHED', approvedSourceHash: approved },
  changed
);
assert(standard.effectiveState === 'STALE', 'Standard changed translation did not become STALE.');
assert(standard.blocksRelease === false, 'Standard changed translation incorrectly blocks release.');

const current = effectiveTranslationStatus(
  { risk: 'critical' },
  { state: 'PUBLISHED', approvedSourceHash: approved },
  approved
);
assert(current.effectiveState === 'PUBLISHED' && !current.stale && !current.blocksRelease, 'Matching critical translation was incorrectly marked stale.');

const draft = effectiveTranslationStatus(
  { risk: 'critical' },
  { state: 'DRAFT', approvedSourceHash: approved },
  approved
);
assert(draft.effectiveState === 'DRAFT' && draft.published === false, 'DRAFT translation was treated as published.');

const explicitStale = effectiveTranslationStatus(
  { risk: 'legal' },
  { state: 'STALE', approvedSourceHash: approved },
  approved
);
assert(explicitStale.effectiveState === 'STALE' && explicitStale.blocksRelease, 'Explicit STALE legal translation did not block release.');

if (errors.length) {
  console.error(`Phase 4 drift fixture failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Phase 4 drift fixture passed: critical/legal drift blocks release, standard drift reports without blocking, matching approvals remain current, and pre-publication states stay non-public.');
