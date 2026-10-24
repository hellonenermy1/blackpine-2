import fs from 'node:fs/promises';

const pages = [
  ['dist/services/core-specialties/index.html', ['Core Cybersecurity Specialties', 'Security Assessments', 'Identity & Microsoft 365 Security', 'Cloud & SaaS Security', 'Incident Response & Digital Forensics']],
  ['dist/methodology/index.html', ['Authority and scope', 'Evidence plan', 'Framework mapping', 'Risk rating', 'Quality review', 'Reporting boundaries', 'NIST Cybersecurity Framework 2.0', 'CIS Controls v8', 'OWASP Top 10', 'MITRE ATT&CK']],
  ['dist/reports/sample-security-assessment/index.html', ['Fictional demonstration only', 'Northstar Components Ltd.', 'Executive summary', 'Risk model', 'Detailed findings', 'Prioritized remediation roadmap', 'Assumptions and limitations', 'Verification and closure']],
  ['dist/research/program/index.html', ['Publication classes', 'Evidence rules', 'Vulnerability research', 'Current evidence boundary']],
  ['dist/advisories/publication-standard/index.html', ['BPC-ADV-YYYY-NNN', 'CVE identifier only when actually assigned', 'Disclosure timeline', 'Publication threshold']],
  ['dist/labs/engineering-evidence/index.html', ['public GitHub repository', 'github.com/hellonenermy1/blackpine-2', 'sensitive client evidence', 'Future open-source releases']]
];

for (const [path, required] of pages) {
  const body = await fs.readFile(path, 'utf8');
  for (const text of required) {
    if (!body.toLowerCase().includes(text.toLowerCase())) throw new Error(`Phase 3 check failed: ${path} missing ${text}`);
  }
}

const sample = await fs.readFile('dist/reports/sample-security-assessment/index.html', 'utf8');
const findingIds = [...sample.matchAll(/BP-F-0[1-7]/g)].map(match => match[0]);
for (let i = 1; i <= 7; i++) {
  const id = `BP-F-0${i}`;
  if (!findingIds.includes(id)) throw new Error(`Phase 3 check failed: sample report missing ${id}`);
}
if (!sample.toLowerCase().includes('not a blackpine client')) throw new Error('Phase 3 check failed: sample report is not clearly identified as non-client fictional work');
if (!sample.toLowerCase().includes('does not describe a real client, real environment, or real incident')) throw new Error('Phase 3 check failed: fictional sample needs an explicit no-real-client/environment/incident disclaimer');

const methodology = await fs.readFile('dist/methodology/index.html', 'utf8');
for (const prohibited of ['certified to nist', 'nist certified', 'owasp certified', 'mitre certified']) {
  if (methodology.toLowerCase().includes(prohibited)) throw new Error(`Phase 3 check failed: methodology implies unsupported framework certification: ${prohibited}`);
}

const advisory = await fs.readFile('dist/advisories/publication-standard/index.html', 'utf8');
if (advisory.includes('CVE-2026-')) throw new Error('Phase 3 check failed: advisory standard contains a fabricated CVE identifier');

const engineering = await fs.readFile('dist/labs/engineering-evidence/index.html', 'utf8');
for (const prohibited of ['blackpine github organization', 'official blackpine github organization']) {
  if (engineering.toLowerCase().includes(prohibited)) throw new Error(`Phase 3 check failed: engineering page overstates GitHub organization status: ${prohibited}`);
}

const nav = await fs.readFile('dist/index.html', 'utf8');
for (const href of ['/services/core-specialties/', '/research/program/', '/reports/sample-security-assessment/', '/labs/engineering-evidence/']) {
  if (!nav.includes(`href="${href}"`)) throw new Error(`Phase 3 check failed: primary navigation does not expose ${href}`);
}

console.log('Phase 3 proof-of-capability checks passed: focused specialties, detailed methodology, fictional sample report, research/advisory standards, and engineering evidence boundaries.');
