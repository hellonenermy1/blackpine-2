import fs from 'node:fs/promises';

const required = new Map([
  ['dist/index.html', ['Montreal', 'Quebec', '26-person']],
  ['dist/company/about/index.html', ['Montreal, Quebec, Canada', '26-person', 'Michael Calloway']],
  ['dist/company/team/index.html', ['26-person', 'Michael Calloway']],
  ['dist/company/careers/index.html', ['No confirmed open roles are currently advertised', 'Seven future roles are planned']],
  ['dist/contact/index.html', ['Montreal', 'Quebec']],
  ['dist/legal/company-information/index.html', ['Blackpine Cybersecurity Inc.', 'Montreal, Quebec, Canada', 'Google Business Profile']],
  ['dist/company/external-verification/index.html', ['Google Business Profile', 'Montreal, Quebec', 'Broader review depth remains an area to build over time']]
]);

const errors = [];
for (const [path, phrases] of required) {
  const html = await fs.readFile(path, 'utf8');
  for (const phrase of phrases) {
    if (!html.includes(phrase)) errors.push(`${path} missing required company fact: ${phrase}`);
  }
}

const home = await fs.readFile('dist/index.html', 'utf8');
for (const schemaFact of ['"addressLocality":"Montreal"', '"addressRegion":"Quebec"', '"addressCountry":"CA"']) {
  if (!home.includes(schemaFact)) errors.push(`Organization JSON-LD missing ${schemaFact}`);
}

const files = [];
async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith('.html') || entry.name === 'search-index.json') files.push(path);
  }
}
await walk('dist');

const stalePhrases = [
  'small, trusted consulting network',
  'talent network',
  'expressions of interest for future consulting',
  'province to be confirmed',
  'applicable canadian province or territory is to be confirmed'
];

for (const path of files) {
  const body = (await fs.readFile(path, 'utf8')).toLowerCase();
  for (const phrase of stalePhrases) {
    if (body.includes(phrase)) errors.push(`${path} still contains stale company/careers wording: ${phrase}`);
  }
}

const companyInfo = await fs.readFile('dist/legal/company-information/index.html', 'utf8');
if (/href=["']tel:/i.test(companyInfo)) errors.push('Company information page should not expose a direct phone link by default');
if (!companyInfo.includes('Province of incorporation')) errors.push('Company information page lost the incorporation evidence boundary');
if (!companyInfo.includes('not published on this page until they have been verified')) errors.push('Company information page must keep registration details evidence-gated');

if (errors.length) {
  console.error(errors.map(error => `COMPANY CONSISTENCY: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Company consistency check passed: ${files.length} generated public files scanned; Montreal/Quebec identity, 26-person team presentation, careers status, external business-profile evidence, schema location, and legal-evidence boundaries are aligned.`);
