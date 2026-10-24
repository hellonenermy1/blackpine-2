import fs from 'node:fs/promises';

const errors = [];
const readDist = relative => fs.readFile(new URL(`../dist/${relative}`, import.meta.url), 'utf8');

const legalPages = [
  { file: 'legal/terms/index.html', current: 'en', counterpart: '/fr/legal/terms/' },
  { file: 'legal/privacy/index.html', current: 'en', counterpart: '/fr/legal/privacy/' },
  { file: 'fr/legal/terms/index.html', current: 'fr', counterpart: '/legal/terms/' },
  { file: 'fr/legal/privacy/index.html', current: 'fr', counterpart: '/legal/privacy/' }
];

for (const page of legalPages) {
  const html = await readDist(page.file);
  const switchStart = html.indexOf('id="legal-language"');
  const switchEnd = switchStart === -1 ? -1 : html.indexOf('</section>', switchStart);
  const languageSwitch = switchStart === -1 || switchEnd === -1 ? '' : html.slice(switchStart, switchEnd);

  if (!languageSwitch) {
    errors.push(`${page.file}: legal language switch not found`);
    continue;
  }

  if (page.current === 'en') {
    if (!languageSwitch.includes('<span aria-current="page" lang="en">English</span>')) {
      errors.push(`${page.file}: English must be the non-link current language`);
    }
    if (!languageSwitch.includes(`href="${page.counterpart}"`) || !languageSwitch.includes('hreflang="fr-CA"')) {
      errors.push(`${page.file}: French counterpart link is missing or lacks fr-CA hreflang`);
    }
  } else {
    if (!languageSwitch.includes('<span aria-current="page" lang="fr">Français</span>')) {
      errors.push(`${page.file}: French must be the non-link current language`);
    }
    if (!languageSwitch.includes(`href="${page.counterpart}"`) || !languageSwitch.includes('hreflang="en-CA"')) {
      errors.push(`${page.file}: English counterpart link is missing or lacks en-CA hreflang`);
    }
  }
}

const englishSearchIndex = JSON.parse(await readDist('search-index.json'));
const frenchSearchIndex = JSON.parse(await readDist('fr/search-index.json'));
for (const { index, path } of [
  { index: englishSearchIndex, path: '/legal/terms/' },
  { index: englishSearchIndex, path: '/legal/privacy/' },
  { index: frenchSearchIndex, path: '/fr/legal/terms/' },
  { index: frenchSearchIndex, path: '/fr/legal/privacy/' }
]) {
  const entry = index.find(item => item.path === path);
  if (!entry) errors.push(`${path}: missing from its locale search index`);
  else if (entry.family !== 'legal') errors.push(`${path}: search family must be legal, found ${entry.family}`);
}

if (englishSearchIndex.some(item => item.path.startsWith('/fr/'))) errors.push('English search index contains French routes');
if (frenchSearchIndex.some(item => !item.path.startsWith('/fr/'))) errors.push('French search index contains non-French routes');

if (errors.length) {
  console.error(errors.map(error => `FINAL CLOSEOUT: ${error}`).join('\n'));
  process.exit(1);
}

console.log('Final closeout regressions passed: EN/FR legal language switches expose one non-link current language and one counterpart link, and locale-split search indexes classify all four legal routes as Legal without cross-locale leakage.');
