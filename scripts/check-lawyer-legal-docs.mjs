import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { websiteTerms, privacyPolicy } from '../src/legal-documents.mjs';
import { websiteTermsFr, privacyPolicyFr } from '../src/legal-documents-fr.mjs';

const errors = [];
const expectedHashes = {
  terms: 'd19e78928da10a4b4cc38feb60c41d41dfd0b4c0af1e49138f27e7a815bf1e54',
  privacy: '5885e0887be0a5240e62dd03b9846158bc98e2189ae383f4cd1c6c2c4f2cd4f9',
  termsFr: '8e31f7399f49b3d53c7b78a830622d2c01b242069fda551a8d4ca3b1308494dd',
  privacyFr: 'f289ab2cffdfbe93ffaf79994e6d498ba2e77ebb8b2a2331058ae4f5a861b52d'
};

const canonicalHash = document => createHash('sha256')
  .update(JSON.stringify(document))
  .digest('hex');

const checkDocument = ({ label, document, expectedSections, expectedHash, effectiveDate, lastUpdated }) => {
  const clauses = document.sections.flatMap(section => section.clauses);
  const numbers = clauses.map(clause => clause.number);
  if (document.effectiveDate !== effectiveDate) errors.push(`${label}: unexpected effective date ${document.effectiveDate}`);
  if (document.lastUpdated !== lastUpdated) errors.push(`${label}: unexpected last-updated date ${document.lastUpdated}`);
  if (document.sections.length !== expectedSections) errors.push(`${label}: expected ${expectedSections} sections, found ${document.sections.length}`);
  if (clauses.length !== 150) errors.push(`${label}: expected 150 clauses, found ${clauses.length}`);
  for (let number = 1; number <= 150; number += 1) {
    if (numbers[number - 1] !== number) errors.push(`${label}: clause sequence breaks at ${number}`);
  }
  const actualHash = canonicalHash(document);
  if (actualHash !== expectedHash) errors.push(`${label}: source-of-truth hash mismatch; expected ${expectedHash}, found ${actualHash}`);
};

checkDocument({ label: 'terms-en', document: websiteTerms, expectedSections: 17, expectedHash: expectedHashes.terms, effectiveDate: 'March 09, 2026', lastUpdated: 'October 24, 2026' });
checkDocument({ label: 'privacy-en', document: privacyPolicy, expectedSections: 15, expectedHash: expectedHashes.privacy, effectiveDate: 'March 09, 2026', lastUpdated: 'October 24, 2026' });
checkDocument({ label: 'terms-fr', document: websiteTermsFr, expectedSections: 17, expectedHash: expectedHashes.termsFr, effectiveDate: '9 mars 2026', lastUpdated: '24 octobre 2026' });
checkDocument({ label: 'privacy-fr', document: privacyPolicyFr, expectedSections: 15, expectedHash: expectedHashes.privacyFr, effectiveDate: '9 mars 2026', lastUpdated: '24 octobre 2026' });

const rendered = [
  { label: 'terms-en', html: await fs.readFile('dist/legal/terms/index.html', 'utf8'), document: websiteTerms, effectiveLabel: 'Effective Date', updatedLabel: 'Last Updated', lang: 'en-CA', counterpart: '/fr/legal/terms/' },
  { label: 'privacy-en', html: await fs.readFile('dist/legal/privacy/index.html', 'utf8'), document: privacyPolicy, effectiveLabel: 'Effective Date', updatedLabel: 'Last Updated', lang: 'en-CA', counterpart: '/fr/legal/privacy/' },
  { label: 'terms-fr', html: await fs.readFile('dist/fr/legal/terms/index.html', 'utf8'), document: websiteTermsFr, effectiveLabel: 'Date d’entrée en vigueur', updatedLabel: 'Dernière mise à jour', lang: 'fr-CA', counterpart: '/legal/terms/' },
  { label: 'privacy-fr', html: await fs.readFile('dist/fr/legal/privacy/index.html', 'utf8'), document: privacyPolicyFr, effectiveLabel: 'Date d’entrée en vigueur', updatedLabel: 'Dernière mise à jour', lang: 'fr-CA', counterpart: '/legal/privacy/' }
];

for (const item of rendered) {
  for (const section of item.document.sections) {
    if (!item.html.includes(`${section.letter}. ${section.heading}`)) errors.push(`${item.label}: rendered page missing section ${section.letter}`);
  }
  for (let number = 1; number <= 150; number += 1) {
    if (!item.html.includes(`id="clause-${number}"`)) errors.push(`${item.label}: rendered page missing clause anchor ${number}`);
  }
  if (!item.html.includes(`${item.effectiveLabel} : ${item.document.effectiveDate}`)) errors.push(`${item.label}: rendered effective date missing`);
  if (!item.html.includes(`${item.updatedLabel} : ${item.document.lastUpdated}`)) errors.push(`${item.label}: rendered last-updated date missing`);
  if (!item.html.includes(`<html lang="${item.lang}"`)) errors.push(`${item.label}: html language is not ${item.lang}`);
  if (!item.html.includes(`href="${item.counterpart}"`)) errors.push(`${item.label}: language counterpart link missing`);
  if (!item.html.includes('hreflang="en-CA"') || !item.html.includes('hreflang="fr-CA"') || !item.html.includes('hreflang="x-default"')) errors.push(`${item.label}: hreflang alternates incomplete`);
}

const termsHtml = rendered[0].html;
const privacyHtml = rendered[1].html;
const termsFrHtml = rendered[2].html;
const privacyFrHtml = rendered[3].html;
const contactSource = await fs.readFile('src/pages/contact-legal.mjs', 'utf8');
const legalPageSource = await fs.readFile('src/pages/legal.mjs', 'utf8');
const routesSource = await fs.readFile('src/routes.mjs', 'utf8');

for (const stale of [
  'The contact page prepares an email locally in your browser. The details you enter are not submitted to Blackpine’s website',
  'Website material is general information. It does not create a client relationship'
]) if (contactSource.includes(stale)) errors.push(`superseded short legal copy remains in contact-legal.mjs: ${stale.slice(0, 50)}…`);

if (!legalPageSource.includes("import { websiteTerms, privacyPolicy } from '../legal-documents.mjs';")) errors.push('legal page renderer is not bound to the English lawyer-drafted source-of-truth module');
if (!legalPageSource.includes("import { websiteTermsFr, privacyPolicyFr } from '../legal-documents-fr.mjs';")) errors.push('legal page renderer is not bound to the approved French source-of-truth module');
if (!routesSource.includes("'/fr/legal/terms/'") || !routesSource.includes("'/fr/legal/privacy/'")) errors.push('French legal routes are not registered');
if (!termsHtml.includes('CAD $500')) errors.push('English terms liability amount from clause 142 is missing');
if (!termsHtml.includes('French language.')) errors.push('English terms French-language clause is missing');
if (!termsFrHtml.includes('500 $ CA')) errors.push('French terms liability amount from clause 142 is missing');
if (!termsFrHtml.includes('Langue française.')) errors.push('French terms clause 147 is missing');
if (!termsFrHtml.includes('Les présentes Conditions doivent être offertes en français')) errors.push('French-first requirement from approved Terms clause 147 is missing');
if (!privacyHtml.includes('Privacy Officer / Person in Charge of the Protection of Personal Information')) errors.push('English privacy officer role is missing');
if (!privacyFrHtml.includes('Responsable de la protection des renseignements personnels')) errors.push('French privacy officer role is missing');
for (const html of [privacyHtml, privacyFrHtml]) {
  if (!html.includes('mailto:contact@blackpinecybersecurity.com')) errors.push('privacy officer public email route is missing');
  if (!html.includes('tel:+')) errors.push('privacy officer public telephone route is missing');
  if (!html.includes('Cloudflare Pages')) errors.push('privacy hosting-provider statement is missing');
}
if (!privacyHtml.includes('does not include a third-party analytics service')) errors.push('English privacy analytics baseline is missing');
if (!privacyFrHtml.includes('n’inclut aucun service d’analytique tiers')) errors.push('French privacy analytics baseline is missing');
if (!privacyHtml.includes('Commission d’accès à l’information du Québec')) errors.push('English privacy authority reference is missing');
if (!privacyFrHtml.includes('Commission d’accès à l’information du Québec')) errors.push('French privacy authority reference is missing');

if (errors.length) {
  console.error(errors.map(error => `LAWYER LEGAL DOCS: ${error}`).join('\n'));
  process.exit(1);
}

console.log('Lawyer legal-document checks passed: exact EN/FR source hashes, 17/15 sections, 150/150 ordered clauses in all four documents, rendered anchors/dates, bilingual routes, hreflang links, Privacy Officer contact routes, and key legal provisions verified.');
