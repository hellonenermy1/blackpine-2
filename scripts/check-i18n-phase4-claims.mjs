import fs from 'node:fs/promises';
import { frCaCatalog } from '../src/i18n/fr-ca-catalog.mjs';
import { esCatalog } from '../src/i18n/es-catalog.mjs';

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const criticalEnglish = [
  'Independent recognition is stated only when it can be verified.',
  'Certifications, awards, vulnerability acknowledgements, partnerships and similar third-party recognition are published only when there is a current, verifiable basis for the exact claim.',
  'Readiness work is not a certification, legal opinion, regulatory determination, or third-party attestation unless a separate qualified service explicitly provides that outcome.',
  'Recovery outcomes depend on the affected technology, available evidence, access authority, third-party dependencies, and the condition of backups or recovery paths. Blackpine does not represent recovery as guaranteed.',
  'This page does not promise around-the-clock coverage, a particular response time, or guaranteed containment. Those claims require an approved operating model and contract.',
  'The corporate website is not the authoritative specification for Cipher cryptography. Implementation details, threat assumptions, test vectors, verification behavior, and release-specific claims must come from the current project repository and release documentation.',
  'These testimonials were supplied to Blackpine as client feedback. The client company names are intentionally not published because the clients requested that their organizations remain confidential.',
  "Blackpine does not infer client size, architecture, project value, location, incident status, findings, tools used, remediation completion, time saved or business outcome from a testimonial.",
  'No confirmed open roles are currently advertised. Seven future roles are planned.'
];

const translated = [];
for (const english of criticalEnglish) {
  const french = frCaCatalog.get(english);
  const spanish = esCatalog.get(english);
  assert(Boolean(french), `Critical claim has no approved French translation: ${english}`);
  assert(Boolean(spanish), `Critical claim has no approved Spanish translation: ${english}`);
  assert(!french || french !== english, `Critical French claim fell back to English: ${english}`);
  assert(!spanish || spanish !== english, `Critical Spanish claim fell back to English: ${english}`);
  translated.push({ english, french, spanish });
}

async function collectHtml(directory) {
  let output = '';
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const url = new URL(`./${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
      if (entry.isDirectory()) await walk(url);
      else if (entry.isFile() && entry.name.endsWith('.html')) output += `\n${await fs.readFile(url, 'utf8')}`;
    }
  }
  await walk(directory);
  return output;
}

const dist = new URL('../dist/', import.meta.url);
const frenchHtml = await collectHtml(new URL('./fr/', dist));
const spanishHtml = await collectHtml(new URL('./es/', dist));

for (const { english, french, spanish } of translated) {
  if (french) assert(frenchHtml.includes(french), `Rendered French corpus lost critical qualifier translated from: ${english}`);
  if (spanish) assert(spanishHtml.includes(spanish), `Rendered Spanish corpus lost critical qualifier translated from: ${english}`);
}

const prohibitedAffirmativePatterns = [
  /Blackpine (?:is|has been) (?:ISO|SOC 2|CMMC) (?:certified|attested|approved)/i,
  /Blackpine est (?:certifiée|attestée|approuvée) (?:ISO|SOC 2|CMMC)/i,
  /Blackpine (?:está|ha sido) (?:certificada|atestada|aprobada) (?:ISO|SOC 2|CMMC)/i,
  /(?:guaranteed|garantie|garantizada) (?:recovery|récupération|recuperación)/i,
  /(?:24\/7|24 h sur 24|las 24 horas) (?:coverage|couverture|cobertura)/i
];
for (const [locale, corpus] of [['fr-CA', frenchHtml], ['es', spanishHtml]]) {
  for (const pattern of prohibitedAffirmativePatterns) assert(!pattern.test(corpus), `${locale}: rendered localized corpus matched prohibited affirmative-claim pattern ${pattern}.`);
}

for (const path of ['/es/legal/privacy/', '/es/legal/terms/']) {
  assert(!spanishHtml.includes(`href="${path}"`), `Spanish corpus advertises unpublished lawyer-controlled route ${path}.`);
}

if (errors.length) {
  console.error(`Phase 4 cross-language claim gate failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Phase 4 cross-language claim gate passed: ${criticalEnglish.length} critical English qualifiers retain approved French/Spanish counterparts, prohibited certification/recovery/coverage inflation is absent, and unpublished Spanish lawyer legal routes remain unadvertised.`);
