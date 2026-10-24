import fs from 'node:fs/promises';

const trustPages = [
  ['privacy', ['Privacy & Information Handling', '/legal/privacy/']],
  ['compliance', ['Compliance & Assurance Status', 'Readiness versus certification']],
  ['subprocessors', ['Subprocessors & Service Providers', 'Cloudflare Pages']],
  ['business-continuity', ['Business Continuity', 'recovery-time']],
  ['incident-response-governance', ['Incident Response Governance', 'detection', 'post-incident review']],
  ['data-retention', ['Data Retention & Deletion', 'early deletion']],
  ['security-contacts', ['Security & Company Contacts', 'security@blackpinecybersecurity.com']],
  ['assurance-requests', ['Security Reviews & Assurance Requests', 'No placeholder evidence']],
  ['security-faq', ['Security FAQ', 'guaranteed-security claims']]
];

for (const [slug, required] of trustPages) {
  const path = `dist/trust/${slug}/index.html`;
  const body = await fs.readFile(path, 'utf8');
  for (const text of required) {
    if (!body.toLowerCase().includes(text.toLowerCase())) throw new Error(`Phase 2 check failed: ${path} missing ${text}`);
  }
}

const trustIndex = await fs.readFile('dist/trust/index.html', 'utf8');
for (const [slug] of trustPages) {
  if (!trustIndex.includes(`href="/trust/${slug}/"`)) throw new Error(`Phase 2 check failed: Trust Center missing /trust/${slug}/`);
}

const governanceFiles = [
  ['governance/README.md', ['DEFINED', 'IMPLEMENTED', 'OPERATING', 'VERIFIED']],
  ['governance/CONTROL_REGISTER.md', ['IAM-01', 'IR-01', 'DATA-01', 'RET-01', 'SUP-01', 'BCM-01', 'GOV-01']],
  ['governance/EVIDENCE_REGISTER.md', ['Evidence ID', 'NOT STORED HERE', 'Independent assurance']],
  ['governance/INCIDENT_RESPONSE_STANDARD.md', ['Detect and record', 'Preserve evidence', 'Post-incident review']],
  ['governance/DATA_HANDLING_STANDARD.md', ['Minimum necessary', 'Authorized exchange', 'No unsupported secondary use']]
];

for (const [path, required] of governanceFiles) {
  const body = await fs.readFile(path, 'utf8');
  for (const text of required) {
    if (!body.toLowerCase().includes(text.toLowerCase())) throw new Error(`Phase 2 check failed: ${path} missing ${text}`);
  }
}

const compliance = await fs.readFile('dist/trust/compliance/index.html', 'utf8');
const dangerousAssuranceClaims = [
  'blackpine is iso/iec 27001 certified',
  'blackpine is iso 27001 certified',
  'blackpine is soc 2 type ii certified',
  'blackpine is soc 2 certified',
  'blackpine is iso/iec 27701 certified',
  'blackpine is iso 22301 certified',
  'blackpine is iso/iec 20000-1 certified'
];
for (const claim of dangerousAssuranceClaims) {
  if (compliance.toLowerCase().includes(claim)) throw new Error(`Phase 2 check failed: unsupported assurance claim: ${claim}`);
}

const incident = await fs.readFile('dist/trust/incident-response-governance/index.html', 'utf8');
const positiveAvailabilityClaims = [
  'blackpine provides guaranteed 24/7',
  'blackpine guarantees 24/7',
  'guaranteed 24/7 incident response is provided'
];
for (const claim of positiveAvailabilityClaims) {
  if (incident.toLowerCase().includes(claim)) throw new Error(`Phase 2 check failed: unsupported availability claim: ${claim}`);
}

const register = await fs.readFile('governance/CONTROL_REGISTER.md', 'utf8');
if ((register.match(/\| DEFINED \|/g) || []).length < 15) throw new Error('Phase 2 check failed: control register is not populated with a meaningful defined baseline');

console.log(`Phase 2 trust/governance checks passed: ${trustPages.length} new trust pages and ${governanceFiles.length} governance artifacts.`);
