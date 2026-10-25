import fs from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
const bytes = value => Buffer.byteLength(value, 'utf8');
const kib = value => `${(value / 1024).toFixed(1)} KiB`;
const errors = [];

const search = await fs.readFile(new URL('./search-index.json', dist), 'utf8');
const searchBudget = 240 * 1024;
if (bytes(search) > searchBudget) {
  errors.push(`English search index exceeds remediation budget: ${kib(bytes(search))} > ${kib(searchBudget)}`);
}

const legalFiles = [
  'legal/privacy/index.html',
  'legal/terms/index.html',
  'fr/legal/privacy/index.html',
  'fr/legal/terms/index.html'
];
const legalBudget = 63 * 1024;
let largest = { file: '', size: 0 };
for (const file of legalFiles) {
  const html = await fs.readFile(new URL(`./${file}`, dist), 'utf8');
  const size = bytes(html);
  if (size > largest.size) largest = { file, size };
  if (size > legalBudget) errors.push(`${file} exceeds remediation legal-page budget: ${kib(size)} > ${kib(legalBudget)}`);
}

if (errors.length) {
  console.error(errors.map(error => `HEADROOM: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Remediation headroom gate passed: search ${kib(bytes(search))} / ${kib(searchBudget)}; largest lawyer-controlled legal page ${largest.file} ${kib(largest.size)} / ${kib(legalBudget)}.`);
