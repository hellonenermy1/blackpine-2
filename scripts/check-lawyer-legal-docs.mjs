import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { websiteTerms, privacyPolicy } from '../src/legal-documents.mjs';

const errors = [];
const expectedHashes = {
  terms: 'feaaa409c43f24826db08ce92f9e8260e8dcb68a7f1cde996e5dee42d0087474',
  privacy: '5885e0887be0a5240e62dd03b9846158bc98e2189ae383f4cd1c6c2c4f2cd4f9'
};

const canonicalHash = document => createHash('sha256')
  .update(JSON.stringify(document))
  .digest('hex');

const checkDocument = (label, document, expectedSections, expectedHash) => {
  const clauses = document.sections.flatMap(section => section.clauses);
  const numbers = clauses.map(clause => clause.number);
  if (document.effectiveDate !== 'March 09, 2026') errors.push(`${label}: unexpected effective date ${document.effectiveDate}`);
  if (document.lastUpdated !== 'October 24, 2026') errors.push(`${label}: unexpected last-updated date ${document.lastUpdated}`);
  if (document.sections.length !== expectedSections) errors.push(`${label}: expected ${expectedSections} sections, found ${document.sections.length}`);
  if (clauses.length !== 150) errors.push(`${label}: expected 150 clauses, found ${clauses.length}`);
  for (let number = 1; number <= 150; number += 1) {
    if (numbers[number - 1] !== number) errors.push(`${label}: clause sequence breaks at ${number}`);
  }
  const actualHash = canonicalHash(document);
  if (actualHash !== expectedHash) errors.push(`${label}: source-of-truth hash mismatch; expected ${expectedHash}, found ${actualHash}`);
};

checkDocument('terms', websiteTerms, 17, expectedHashes.terms);
checkDocument('privacy', privacyPolicy, 15, expectedHashes.privacy);

const termsHtml = await fs.readFile('dist/legal/terms/index.html', 'utf8');
const privacyHtml = await fs.readFile('dist/legal/privacy/index.html', 'utf8');
const contactSource = await fs.readFile('src/pages/contact-legal.mjs', 'utf8');
const legalPageSource = await fs.readFile('src/pages/legal.mjs', 'utf8');

for (const [label, html, document] of [
  ['terms', termsHtml, websiteTerms],
  ['privacy', privacyHtml, privacyPolicy]
]) {
  for (const section of document.sections) {
    if (!html.includes(`${section.letter}. ${section.heading}`)) errors.push(`${label}: rendered page missing section ${section.letter}`);
  }
  for (let number = 1; number <= 150; number += 1) {
    if (!html.includes(`id="clause-${number}"`)) errors.push(`${label}: rendered page missing clause anchor ${number}`);
  }
  if (!html.includes(`Effective Date: ${document.effectiveDate}`)) errors.push(`${label}: rendered effective date missing`);
  if (!html.includes(`Last Updated: ${document.lastUpdated}`)) errors.push(`${label}: rendered last-updated date missing`);
}

for (const stale of [
  'The contact page prepares an email locally in your browser. The details you enter are not submitted to Blackpine’s website',
  'Website material is general information. It does not create a client relationship'
]) if (contactSource.includes(stale)) errors.push(`superseded short legal copy remains in contact-legal.mjs: ${stale.slice(0, 50)}…`);

if (!legalPageSource.includes("import { websiteTerms, privacyPolicy } from '../legal-documents.mjs';")) errors.push('legal page renderer is not bound to the lawyer-drafted source-of-truth module');
if (!termsHtml.includes('CAD $500')) errors.push('terms liability amount from clause 142 is missing');
if (!termsHtml.includes('French language.')) errors.push('terms French-language clause is missing');
if (!termsHtml.includes('Quebec')) errors.push('terms Quebec references are missing');
if (!privacyHtml.includes('Privacy Officer / Person in Charge of the Protection of Personal Information')) errors.push('privacy officer role is missing');
if (!privacyHtml.includes('mailto:contact@blackpinecybersecurity.com')) errors.push('privacy officer public email route is missing');
if (!privacyHtml.includes('tel:+')) errors.push('privacy officer public telephone route is missing');
if (!privacyHtml.includes('Cloudflare Pages')) errors.push('privacy hosting-provider statement is missing');
if (!privacyHtml.includes('does not include a third-party analytics service')) errors.push('privacy analytics baseline is missing');
if (!privacyHtml.includes('Commission d’accès à l’information du Québec')) errors.push('privacy authority reference is missing');

if (errors.length) {
  console.error(errors.map(error => `LAWYER LEGAL DOCS: ${error}`).join('\n'));
  process.exit(1);
}

console.log('Lawyer legal-document checks passed: exact source hashes, 17/15 sections, 150/150 ordered clauses, rendered anchors, dates, key legal provisions, explicit Privacy Officer contact routes, and stale-summary removal verified.');
