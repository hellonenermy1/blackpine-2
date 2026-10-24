import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];
const read = relative => fs.readFile(new URL(relative, root), 'utf8');
const readDist = relative => fs.readFile(new URL(relative, dist), 'utf8');

const requiredRoutes = [
  '/trust/enterprise-assurance/',
  '/trust/governance-system/',
  '/trust/client-portal-security/',
  '/trust/service-standards/',
  '/trust/insurance/'
];

for (const route of requiredRoutes) {
  try {
    const html = await readDist(`.${route}index.html`);
    if (!html.includes('<h1')) errors.push(`${route} missing H1`);
    if (/noindex/i.test(html.match(/<meta name="robots"[^>]*>/i)?.[0] || '')) errors.push(`${route} must be indexable`);
  } catch {
    errors.push(`missing Phase 5 route ${route}`);
  }
}

const data = await read('./src/phase5-enterprise-data.mjs');
for (const target of ['ISO/IEC 27001:2022', 'SOC 2 Type II', 'ISO/IEC 27701:2025', 'ISO 22301:2019', 'ISO/IEC 20000-1:2018']) {
  if (!data.includes(target)) errors.push(`assurance target missing: ${target}`);
}
if ((data.match(/evidenceState: 'OPEN'/g) || []).length !== 5) errors.push('all five assurance targets must remain OPEN without independent evidence');
if (!data.includes("state: 'OPEN'")) errors.push('insurance evidence must remain OPEN without authoritative evidence');

const governance = await read('./governance/ENTERPRISE_GOVERNANCE_SYSTEM.md');
for (const register of ['Asset', 'Risk', 'Control', 'Supplier', 'Incident', 'Access review', 'Training', 'Vulnerability', 'Backup/recovery', 'Change', 'Exception', 'Management review', 'Internal audit', 'Corrective action']) {
  if (!governance.includes(`| ${register} |`)) errors.push(`enterprise governance system missing ${register} register`);
}
for (const state of ['DEFINED', 'IMPLEMENTED', 'OPERATING', 'VERIFIED', 'OPEN']) {
  if (!governance.includes(`**${state}**`)) errors.push(`enterprise governance system missing ${state} semantics`);
}

const crosswalk = await read('./governance/ASSURANCE_CROSSWALK.md');
for (const domain of ['Governance & risk', 'Identity & access', 'Information & privacy', 'Operations & change', 'Supplier management', 'Continuity & recovery', 'Service management', 'Assurance & improvement']) {
  if (!crosswalk.includes(domain)) errors.push(`assurance crosswalk missing ${domain}`);
}
if (!crosswalk.includes('not a substitute for the licensed standards')) errors.push('assurance crosswalk must preserve licensed-standard/assessor boundary');

const portalStandard = await read('./governance/CLIENT_PORTAL_SECURITY_STANDARD.md');
for (const marker of ['MFA', 'server-side authorization', 'tenant', 'Audit logging', 'Session', 'Backup', 'incident-response', 'Security testing']) {
  if (!portalStandard.toLowerCase().includes(marker.toLowerCase())) errors.push(`portal standard missing ${marker}`);
}
if (!portalStandard.includes('does not claim that such a production portal is already deployed')) errors.push('portal standard must not imply a deployed portal');

const serviceStandards = await read('./governance/SERVICE_STANDARDS.md');
if (!serviceStandards.includes('Do not publish 24/7 availability')) errors.push('service standards must explicitly prohibit unsupported 24/7 claims');
if (!serviceStandards.includes('no universal acknowledgement time is promised')) errors.push('service standards must preserve the no-universal-response-time boundary');

const assuranceRegister = await read('./governance/ASSURANCE_EVIDENCE_REGISTER.md');
if ((assuranceRegister.match(/\| OPEN \|/g) || []).length < 7) errors.push('assurance evidence register must keep all certification/insurance evidence items OPEN');

const enterpriseHtml = await readDist('./trust/enterprise-assurance/index.html');
if (!enterpriseHtml.includes('Readiness framework')) errors.push('enterprise assurance page must present readiness state');
if (!enterpriseHtml.includes('must not publish')) errors.push('enterprise assurance page must include an explicit claim boundary');
for (const badClaim of [
  /<p>Blackpine is certified to ISO/i,
  /<p>Blackpine has a SOC 2 Type II/i,
  /<h[1-3][^>]*>[^<]*SOC 2 Type II compliant/i
]) if (badClaim.test(enterpriseHtml)) errors.push(`enterprise assurance page contains unsupported affirmative assurance claim matching ${badClaim}`);

const insuranceHtml = await readDist('./trust/insurance/index.html');
if (!insuranceHtml.includes('OPEN')) errors.push('insurance page must display OPEN evidence status');

const portalHtml = await readDist('./trust/client-portal-security/index.html');
if (!portalHtml.includes('Not claimed here')) errors.push('portal page must state production portal is not claimed');

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log('Phase 5 enterprise-readiness checks passed: five assurance targets remain evidence-gated, 14 governance registers are defined, cross-framework domains are mapped, portal security has a release gate, service commitments remain conservative, and insurance/certification claims remain OPEN without independent evidence.');
