import fs from 'node:fs/promises';
import { publicCompany } from '../src/public-company.mjs';

const required = new Map([
  ['dist/index.html', ['Montreal', 'Quebec', '26-person']],
  ['dist/company/about/index.html', ['Montreal, Quebec, Canada', '26-person', 'Michael Calloway', publicCompany.businessAddress, publicCompany.phoneDisplay]],
  ['dist/company/team/index.html', ['26-person', 'Michael Calloway']],
  ['dist/company/careers/index.html', ['No confirmed open roles are currently advertised', 'Seven future roles are planned']],
  ['dist/contact/index.html', [publicCompany.businessAddress, publicCompany.phoneDisplay, 'View Blackpine on Google']],
  ['dist/legal/company-information/index.html', [publicCompany.legalName, publicCompany.businessAddress, publicCompany.phoneDisplay, 'Google Business Profile']],
  ['dist/company/external-verification/index.html', ['Google Business Profile', publicCompany.businessAddress, publicCompany.phoneDisplay, 'Google Business is the current verified third-party company profile']]
]);

const errors = [];
for (const [path, phrases] of required) {
  const html = await fs.readFile(path, 'utf8');
  for (const phrase of phrases) {
    if (!html.includes(phrase)) errors.push(`${path} missing required company fact: ${phrase}`);
  }
}

const home = await fs.readFile('dist/index.html', 'utf8');
for (const schemaFact of [
  `"streetAddress":"${publicCompany.streetAddress}"`,
  `"addressLocality":"${publicCompany.cityDisplay}"`,
  `"addressRegion":"${publicCompany.provinceCode}"`,
  `"postalCode":"${publicCompany.postalCode}"`,
  `"addressCountry":"${publicCompany.countryCode}"`,
  `"telephone":"${publicCompany.phoneDisplay}"`
]) {
  if (!home.includes(schemaFact)) errors.push(`Organization JSON-LD missing ${schemaFact}`);
}
if (!home.includes('"sameAs":["https://www.google.com/maps/search/?api=1')) errors.push('Organization JSON-LD missing Google Business sameAs destination');
if (!home.includes(publicCompany.googlePlaceId)) errors.push('Organization JSON-LD missing verified Google place identifier');

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
  'applicable canadian province or territory is to be confirmed',
  'does not hard-code dynamic third-party details such as review counts, ratings, hours, phone numbers, or street-level addresses',
  'does not reproduce its current review score, review count, business hours, phone number, or street-level address here'
];

for (const path of files) {
  const body = (await fs.readFile(path, 'utf8')).toLowerCase();
  for (const phrase of stalePhrases) {
    if (body.includes(phrase)) errors.push(`${path} still contains stale company/careers/contact wording: ${phrase}`);
  }
}

const companyInfo = await fs.readFile('dist/legal/company-information/index.html', 'utf8');
if (!companyInfo.includes(`href="tel:${publicCompany.phoneHref}"`)) errors.push('Company information page is missing the approved business phone link');
if (!companyInfo.includes('Public business address')) errors.push('Company information page does not label the street address as a public business address');
if (!companyInfo.includes('not being represented as Blackpine&#39;s legally registered office') && !companyInfo.includes("not being represented as Blackpine's legally registered office")) errors.push('Company information page lost the business-address versus registered-office distinction');
if (!companyInfo.includes('Province of incorporation')) errors.push('Company information page lost the incorporation evidence boundary');
if (!companyInfo.includes('not published on this page until they have been verified')) errors.push('Company information page must keep registration details evidence-gated');

const contact = await fs.readFile('dist/contact/index.html', 'utf8');
if (!contact.includes(`href="tel:${publicCompany.phoneHref}"`)) errors.push('Contact page is missing approved business phone link');
if (!contact.includes(publicCompany.googlePlaceId)) errors.push('Contact page Google Business destination lost the verified place identifier');

if (errors.length) {
  console.error(errors.map(error => `COMPANY CONSISTENCY: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Company consistency check passed: ${files.length} generated public files scanned; Montreal/Quebec identity, approved business address/phone, 26-person team presentation, careers status, Google Business linkage, schema contact data, and legal-evidence boundaries are aligned.`);
