import fs from 'node:fs';

const shardPaths = [
  '../../governance/localization-status/core.json',
  '../../governance/localization-status/services.json',
  '../../governance/localization-status/research-proof.json',
  '../../governance/localization-status/resources-labs-tools.json',
  '../../governance/localization-status/trust.json',
  '../../governance/localization-status/company-legal.json'
];

const shards = shardPaths.map(path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8')));
const [first] = shards;

for (const shard of shards) {
  if (shard.version !== first.version) throw new Error('Localization status shards have mismatched schema versions.');
  if (shard.sourceRevision !== first.sourceRevision) throw new Error('Localization status shards have mismatched source revisions.');
  if (JSON.stringify(shard.states) !== JSON.stringify(first.states)) throw new Error('Localization status shards have mismatched lifecycle states.');
}

const entries = {};
for (const shard of shards) {
  for (const [key, entry] of Object.entries(shard.entries || {})) {
    if (entries[key]) throw new Error(`Duplicate localization status key: ${key}`);
    entries[key] = entry;
  }
}

export const translationStatus = Object.freeze({
  version: first.version,
  sourceRevision: first.sourceRevision,
  states: Object.freeze([...first.states]),
  entries: Object.freeze(entries)
});

export const translationStatusBySourcePath = new Map(
  Object.values(entries).map(entry => [entry.sourcePath, entry])
);

export function translationRecord(locale, sourcePath) {
  return translationStatusBySourcePath.get(sourcePath)?.locales?.[locale] || null;
}

export function isTranslationPublished(locale, sourcePath) {
  return translationRecord(locale, sourcePath)?.state === 'PUBLISHED';
}

export function publishedSourcePaths(locale) {
  return new Set(
    Object.values(entries)
      .filter(entry => entry.locales?.[locale]?.state === 'PUBLISHED')
      .map(entry => entry.sourcePath)
  );
}
