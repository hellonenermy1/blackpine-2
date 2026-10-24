import fs from 'node:fs/promises';
import { publicCompany } from '../src/public-company.mjs';

const errors = [];
const externalPage = await fs.readFile('dist/company/external-verification/index.html', 'utf8');
const companyInfo = await fs.readFile('dist/legal/company-information/index.html', 'utf8');
const contact = await fs.readFile('dist/contact/index.html', 'utf8');
const home = await fs.readFile('dist/index.html', 'utf8');
const register = await fs.readFile('governance/EXTERNAL_REPUTATION_REGISTER.md', 'utf8');
const program = await fs.readFile('governance/EXTERNAL_REPUTATION_PROGRAM.md', 'utf8');

for (const [label, html] of [['external verification', externalPage], ['company information', companyInfo], ['contact', contact]]) {
  if (!html.includes(publicCompany.businessAddress)) errors.push(`${label} page missing approved business address`);
  if (!html.includes(publicCompany.phoneDisplay)) errors.push(`${label} page missing approved business phone`);
  if (!html.includes(publicCompany.googlePlaceId)) errors.push(`${label} page missing verified Google place identifier`);
}

if (!home.includes(`"streetAddress":"${publicCompany.streetAddress}"`)) errors.push('Organization schema missing street address');
if (!home.includes(`"telephone":"${publicCompany.phoneDisplay}"`)) errors.push('Organization schema missing business phone');
if (!home.includes(publicCompany.googlePlaceId)) errors.push('Organization schema missing verified Google Business sameAs destination');

for (const prohibited of ['linkedin.com', 'clutch.co', 'clutch.com']) {
  if (externalPage.toLowerCase().includes(prohibited)) errors.push(`unverified external profile link published: ${prohibited}`);
}

for (const unsupported of ['5.0', 'five-star', '5 star', '1 google review', 'one google review', 'google rating:']) {
  if (externalPage.toLowerCase().includes(unsupported)) errors.push(`dynamic or inflated review claim published: ${unsupported}`);
}

for (const required of [
  'Reviews are voluntary',
  'does not buy reviews',
  "pre-written review",
  'confidential engagement details',
  'No Blackpine LinkedIn company profile or Clutch company profile is linked'
]) {
  if (!externalPage.includes(required)) errors.push(`external verification page missing review/reputation boundary: ${required}`);
}

for (const required of [
  'Do not buy reviews',
  'Do not review-gate',
  'Do not fabricate',
  'pre-written review',
  'confidential systems',
  'Employees, contractors, family members',
  'LinkedIn company profile — OPEN',
  'Clutch profile/reviews — OPEN'
]) {
  if (!program.includes(required)) errors.push(`external reputation program missing control: ${required}`);
}

const verifiedRows = register.match(/^\|.*\| VERIFIED \|.*$/gm) || [];
if (verifiedRows.length !== 1) errors.push(`expected exactly one VERIFIED external reputation row, found ${verifiedRows.length}`);
if (!verifiedRows[0]?.includes('Google Business Profile identity/location/contact')) errors.push('verified external reputation row is not the approved Google Business identity/location/contact record');
for (const openName of ['Google Business reviews/rating', 'LinkedIn company profile', 'Clutch profile/reviews', 'Vendor partnership', 'ISO certification', 'SOC 2 report']) {
  const row = register.split('\n').find(line => line.includes(`| ${openName} |`));
  if (!row?.includes('| OPEN |')) errors.push(`${openName} must remain OPEN until separately verified`);
}

if (!companyInfo.includes('not being represented as Blackpine&#39;s legally registered office') && !companyInfo.includes("not being represented as Blackpine's legally registered office")) errors.push('public business address is not clearly separated from registered-office status');

if (errors.length) {
  console.error(errors.map(error => `EXTERNAL REPUTATION: ${error}`).join('\n'));
  process.exit(1);
}

console.log('External reputation checks passed: approved Montréal address/phone, Google Business verification, dynamic-review boundaries, no unverified LinkedIn/Clutch links, ethical review controls, and evidence-gated third-party claims.');
