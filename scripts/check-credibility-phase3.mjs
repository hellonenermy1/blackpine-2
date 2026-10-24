import fs from 'node:fs/promises';
import { research } from '../src/data.mjs';
import { clientTestimonials, testimonialEvidenceSnapshots } from '../src/phase4-client-evidence.mjs';
import { authorityReferenceVerifiedDate, authorityReferences, authorityEvidence, authorityRecognition } from '../src/authority-data.mjs';

const errors = [];
const expectedReferences = new Map([
  ['NIST Cybersecurity Framework', '2.0'],
  ['CIS Critical Security Controls', 'v8.1'],
  ['OWASP Top 10', '2025'],
  ['OWASP Application Security Verification Standard', '5.0.0'],
  ['MITRE ATT&CK', 'v20.0']
]);

if (authorityReferenceVerifiedDate !== '2026-10-24') errors.push(`unexpected authority reference verification date: ${authorityReferenceVerifiedDate}`);
if (authorityReferences.length !== expectedReferences.size) errors.push(`expected ${expectedReferences.size} authoritative references, found ${authorityReferences.length}`);
for (const [name, version] of expectedReferences) {
  const item = authorityReferences.find(reference => reference.name === name);
  if (!item) errors.push(`missing authoritative reference: ${name}`);
  else if (item.version !== version) errors.push(`${name} expected ${version}, found ${item.version}`);
  if (item && !item.url.startsWith('https://')) errors.push(`${name} does not use an HTTPS authoritative source`);
}

if (authorityEvidence.length < 6) errors.push('expected at least six current inspectable evidence classes');
if (authorityEvidence.some(item => item.status !== 'PUBLISHED')) errors.push('current inspectable evidence register contains a non-PUBLISHED item');
if (authorityRecognition.length < 6) errors.push('expected at least six evidence-gated recognition classes');
if (authorityRecognition.some(item => item.status !== 'OPEN')) errors.push('unearned recognition was promoted beyond OPEN');

for (const requiredId of ['REC-ORIGINAL-RESEARCH', 'REC-CVE', 'REC-VENDOR-ACK', 'REC-MEDIA', 'REC-BYLINE', 'REC-CASE-STUDY']) {
  if (!authorityRecognition.some(item => item.id === requiredId && item.status === 'OPEN')) errors.push(`${requiredId} must remain OPEN`);
}

if (clientTestimonials.length !== 20) errors.push(`expected 20 client testimonials, found ${clientTestimonials.length}`);
if (testimonialEvidenceSnapshots.length !== 3) errors.push(`expected 3 testimonial-derived snapshots, found ${testimonialEvidenceSnapshots.length}`);
for (const item of research) {
  if (!Array.isArray(item.sources) || item.sources.length === 0) errors.push(`research publication has no listed sources: ${item.slug}`);
}

const authorityPage = await fs.readFile('dist/research/evidence/index.html', 'utf8');
const caseStudyPage = await fs.readFile('dist/work/case-study-standard/index.html', 'utf8');
const methodologyPage = await fs.readFile('dist/methodology/index.html', 'utf8');
const researchPage = await fs.readFile('dist/research/index.html', 'utf8');
const researchProgramPage = await fs.readFile('dist/research/program/index.html', 'utf8');

for (const reference of authorityReferences) {
  for (const text of [reference.name, reference.version, reference.publisher, reference.url]) {
    if (!authorityPage.includes(text)) errors.push(`authority page missing reference evidence: ${text}`);
  }
}
for (const item of authorityRecognition) {
  if (!authorityPage.includes(item.id) || !authorityPage.includes(item.label)) errors.push(`authority page missing recognition row: ${item.id}`);
}
for (const item of research) {
  if (!authorityPage.includes(item.title)) errors.push(`publication ledger missing research item: ${item.slug}`);
}

for (const text of [
  'Full client case studies supported by current supplied evidence</strong>0',
  `${clientTestimonials.length} testimonials`,
  `${testimonialEvidenceSnapshots.length} bounded outcome snapshots`,
  'Every full case study must pass all eight gates',
  'Never infer missing engagement facts',
  'Quantification requires measurement evidence'
]) {
  if (!caseStudyPage.includes(text)) errors.push(`case-study standard missing required boundary: ${text}`);
}

for (const text of ['NIST Cybersecurity Framework 2.0', 'CIS Controls v8.1', 'OWASP Top 10 2025', 'OWASP ASVS 5.0.0', 'MITRE ATT&amp;CK v20.0', '/research/evidence/']) {
  if (!methodologyPage.includes(text)) errors.push(`methodology missing current reference/binding: ${text}`);
}
if (methodologyPage.includes('CIS Controls v8 —')) errors.push('methodology still contains stale CIS Controls v8 wording');
if (!researchPage.includes('/research/evidence/')) errors.push('research index does not link to authority evidence register');
if (!researchProgramPage.includes('/research/evidence/')) errors.push('research program does not link to authority evidence register');

const governanceChecks = [
  ['governance/AUTHORITY_EVIDENCE_REGISTER.md', ['REC-CVE', 'OPEN', 'A testimonial is not a full case study']],
  ['governance/REFERENCE_SOURCE_REGISTER.md', ['NIST Cybersecurity Framework', 'v8.1', 'OWASP Top 10', 'v20.0', '2026-10-24']],
  ['governance/RESEARCH_PUBLICATION_EVIDENCE_STANDARD.md', ['Original-research gate', 'A submitted vulnerability report is not a CVE', 'Corrections']],
  ['governance/CASE_STUDY_RELEASE_GATE.md', ['20 testimonials', '3 testimonial-derived evidence snapshots', '0 full anonymized client case studies', 'Automatic fail conditions']]
];
for (const [path, required] of governanceChecks) {
  const body = await fs.readFile(path, 'utf8');
  for (const text of required) if (!body.includes(text)) errors.push(`${path} missing ${text}`);
}

if (errors.length) {
  console.error(errors.map(error => `CREDIBILITY PHASE 3: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Credibility Phase 3 checks passed: ${authorityEvidence.length} published evidence classes, ${authorityRecognition.length} OPEN recognition classes, ${authorityReferences.length} current authoritative references, ${research.length} source-backed research publications, and the client case-study release gate remains evidence-bounded.`);
