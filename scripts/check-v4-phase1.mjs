import fs from 'node:fs/promises';
import {
  services,
  capabilityFamilies,
  engagementModels,
  capabilityRegistry,
  researchCandidates,
  publicServiceBindings,
  restrictedOperationalClaims
} from '../src/data.mjs';

const dist = new URL('../dist/', import.meta.url);
const errors = [];

const expectedFamilies = new Set(['emergency-response', 'investigate', 'recover', 'protect', 'monitor', 'security-desk']);
const expectedEngagements = new Set(['on-demand', 'response-retainer', 'managed-security']);
const validOperationalStatuses = new Set(['LIVE', 'CONTRACT_DEPENDENT', 'PLANNED', 'NOT_PUBLIC']);
const validPublicationStatuses = new Set(['EXISTING_ROUTE', 'PHASE_2', 'NOT_PUBLIC']);

if (capabilityFamilies.length !== 6) errors.push(`expected 6 customer-facing capability families, found ${capabilityFamilies.length}`);
for (const family of capabilityFamilies) if (!expectedFamilies.has(family.id)) errors.push(`unexpected or missing family id ${family.id}`);

if (engagementModels.length !== 3) errors.push(`expected 3 engagement models, found ${engagementModels.length}`);
for (const model of engagementModels) if (!expectedEngagements.has(model.id)) errors.push(`unexpected engagement model ${model.id}`);

if (capabilityRegistry.length !== 31) errors.push(`expected 31 user-declared service capabilities, found ${capabilityRegistry.length}`);

const capabilityIds = new Set();
for (const capability of capabilityRegistry) {
  if (capabilityIds.has(capability.id)) errors.push(`duplicate capability id ${capability.id}`);
  capabilityIds.add(capability.id);
  if (!expectedFamilies.has(capability.primaryFamily)) errors.push(`${capability.id} references unknown family ${capability.primaryFamily}`);
  if (!validOperationalStatuses.has(capability.operationalStatus)) errors.push(`${capability.id} has invalid operational status ${capability.operationalStatus}`);
  if (!validPublicationStatuses.has(capability.publicationStatus)) errors.push(`${capability.id} has invalid publication status ${capability.publicationStatus}`);
  if (capability.verification !== 'USER_DECLARED_OFFERING') errors.push(`${capability.id} must retain USER_DECLARED_OFFERING provenance until operational review changes it`);
  for (const engagement of capability.engagements || []) if (!expectedEngagements.has(engagement)) errors.push(`${capability.id} references unknown engagement model ${engagement}`);
}

for (const candidate of researchCandidates) {
  if (candidate.operationalStatus !== 'PLANNED' || candidate.publicationStatus !== 'NOT_PUBLIC' || candidate.verification !== 'RESEARCH_CANDIDATE') {
    errors.push(`research candidate ${candidate.id} must remain planned, non-public, and explicitly unverified`);
  }
  if (capabilityIds.has(candidate.id)) errors.push(`research candidate ${candidate.id} must not also appear as a declared live capability`);
}

const publicServiceSlugs = new Set(services.map(service => service.slug));
for (const service of services) {
  const bindings = publicServiceBindings[service.slug];
  if (!bindings?.length) errors.push(`public service ${service.slug} is not mapped into the V4 capability registry`);
  if (!service.capabilityIds?.length) errors.push(`public service ${service.slug} is missing derived capability metadata`);
  for (const id of bindings || []) if (!capabilityIds.has(id)) errors.push(`public service ${service.slug} references unknown capability ${id}`);
}
for (const slug of Object.keys(publicServiceBindings)) if (!publicServiceSlugs.has(slug)) errors.push(`capability binding exists for unknown public service ${slug}`);

const duplicateFields = ['short', 'intro', 'boundary'];
for (const field of duplicateFields) {
  const seen = new Map();
  for (const service of services) {
    const value = String(service[field] || '').trim().toLowerCase();
    if (!value) continue;
    if (seen.has(value)) errors.push(`service copy is duplicated exactly in ${field}: ${seen.get(value)} and ${service.slug}`);
    else seen.set(value, service.slug);
  }
}

const tokens = text => String(text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
const ngrams = (text, n = 4) => {
  const words = tokens(text);
  const set = new Set();
  for (let index = 0; index <= words.length - n; index += 1) set.add(words.slice(index, index + n).join(' '));
  return set;
};
const similarity = (a, b) => {
  const left = ngrams(a);
  const right = ngrams(b);
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  for (const item of left) if (right.has(item)) intersection += 1;
  return intersection / Math.min(left.size, right.size);
};
for (let left = 0; left < services.length; left += 1) {
  for (let right = left + 1; right < services.length; right += 1) {
    const score = similarity(services[left].intro, services[right].intro);
    if (score >= 0.72) errors.push(`service introductions are too structurally similar (${score.toFixed(2)}): ${services[left].slug} and ${services[right].slug}`);
  }
}

const htmlFiles = [];
const walk = async dir => {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir);
    if (entry.isDirectory()) await walk(url);
    else if (entry.name.endsWith('.html')) htmlFiles.push(url);
  }
};
await walk(dist);

const visibleText = html => html
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim();

const clearlyNegated = snippet => /\b(?:not|does not|do not|is not|are not|cannot|without|unless|no)\b/i.test(snippet);
for (const file of htmlFiles) {
  const text = visibleText(await fs.readFile(file, 'utf8'));
  for (const control of restrictedOperationalClaims.filter(item => !item.approved)) {
    for (const pattern of control.patterns) {
      const regex = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
      for (const match of text.matchAll(regex)) {
        const start = Math.max(0, match.index - 120);
        const end = Math.min(text.length, match.index + match[0].length + 120);
        const snippet = text.slice(start, end);
        if (!clearlyNegated(snippet)) errors.push(`unapproved operational claim ${control.id} appears in ${file.pathname}: ${match[0]}`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`V4 Phase 1 checks passed: ${capabilityRegistry.length} declared capabilities, ${capabilityFamilies.length} customer families, ${engagementModels.length} engagement models, ${researchCandidates.length} non-public research candidates, public-service bindings, originality checks, and operational-claim gates.`);
