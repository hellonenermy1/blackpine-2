import fs from 'node:fs/promises';

const requiredFiles = [
  'dist/company/about/index.html',
  'dist/company/team/index.html',
  'dist/legal/company-information/index.html',
  'dist/legal/privacy/index.html',
  'dist/legal/terms/index.html',
  'dist/legal/acceptable-use/index.html',
  'dist/trust/responsible-disclosure/index.html',
  'dist/.well-known/security.txt'
];

const requiredContent = new Map([
  ['dist/company/about/index.html', ['Blackpine Cybersecurity Inc.', 'Canada', '/legal/company-information/']],
  ['dist/company/team/index.html', ['Leadership information must be verifiable.', 'invented employee counts']],
  ['dist/legal/company-information/index.html', ['Blackpine Cybersecurity Inc.', 'security@blackpinecybersecurity.com', 'registration number']],
  ['dist/legal/privacy/index.html', ['Privacy', 'not used to build advertising profiles']],
  ['dist/legal/terms/index.html', ['Website Terms', 'No guarantee of security']],
  ['dist/legal/acceptable-use/index.html', ['Acceptable Use Policy', 'Unauthorized access', 'Responsible Disclosure Policy']],
  ['dist/trust/responsible-disclosure/index.html', ['Responsible Disclosure Policy', 'Allowed testing', 'Prohibited testing', 'Good-faith research', '/.well-known/security.txt']],
  ['dist/.well-known/security.txt', ['Contact: mailto:security@blackpinecybersecurity.com', 'Canonical:', 'Policy:', 'Expires:']]
]);

const forbiddenPublicClaims = [
  'CIA-level',
  'unbreakable',
  '100% secure',
  'guaranteed secure'
];

for (const file of requiredFiles) {
  await fs.access(file);
  const body = await fs.readFile(file, 'utf8');
  for (const text of requiredContent.get(file) || []) {
    if (!body.includes(text)) throw new Error(`Phase 1 check failed: ${file} is missing required text: ${text}`);
  }
}

const sitePages = [
  await fs.readFile('dist/index.html', 'utf8'),
  await fs.readFile('dist/company/about/index.html', 'utf8'),
  await fs.readFile('dist/legal/company-information/index.html', 'utf8')
].join('\n');

for (const claim of forbiddenPublicClaims) {
  if (sitePages.toLowerCase().includes(claim.toLowerCase())) {
    throw new Error(`Phase 1 check failed: forbidden absolute security claim found: ${claim}`);
  }
}

const footer = await fs.readFile('dist/index.html', 'utf8');
for (const href of ['/legal/company-information/', '/legal/privacy/', '/legal/terms/', '/legal/acceptable-use/', '/.well-known/security.txt']) {
  if (!footer.includes(`href="${href}"`)) throw new Error(`Phase 1 check failed: sitewide legal/trust link missing: ${href}`);
}

console.log('Phase 1 trust-foundation checks passed.');
