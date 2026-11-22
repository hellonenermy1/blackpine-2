import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const cases = [
  { file: 'index.html', keywords: ['Cybersecurity Services', 'Montreal', 'Blackpine'] },
  { file: 'services/index.html', keywords: ['Cybersecurity Services', 'Canada', 'Blackpine'] },
  { file: 'services/core-specialties/index.html', keywords: ['Core Cybersecurity Specialties', 'Blackpine'] }
];
for (const entry of cases) {
  const html = await fs.readFile(new URL(`../dist/${entry.file}`, import.meta.url), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
  const description = (html.match(/<meta name="description" content="([^"]+)">/)?.[1] || '').replaceAll('&#39;', "'").replaceAll('&amp;', '&');
  assert.ok(title.length >= 25 && title.length <= 65, `${entry.file} title too short/long (${title.length})`);
  assert.ok(description.length >= 70 && description.length <= 160, `${entry.file} description too short/long (${description.length})`);
  for (const keyword of entry.keywords) {
    assert.ok(title.includes(keyword), `${entry.file} title missing ${keyword}`);
  }
  assert.ok(html.includes('<link rel="canonical" href="https://blackpinecybersecurity.com/'), `${entry.file} canonical missing`);
  assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html), `${entry.file} became noindex`);
}
for (const base of ['', 'services/', 'services/core-specialties/']) {
  const english = await fs.readFile(new URL(`../dist/${base}index.html`, import.meta.url), 'utf8');
  for (const [locale, required] of [['fr', ['cybersécurité', 'Blackpine']], ['es', ['ciberseguridad', 'Blackpine']]]) {
    const translated = await fs.readFile(new URL(`../dist/${locale}/${base}index.html`, import.meta.url), 'utf8');
    const title = translated.match(/<title>([^<]+)<\/title>/)?.[1] || '';
    const description = translated.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
    const englishTitle = english.match(/<title>([^<]+)<\/title>/)?.[1] || '';
    const englishDescription = english.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
    assert.notEqual(description, englishDescription, `${locale}/${base} has untranslated description`);
    if (base !== 'services/core-specialties/') assert.notEqual(title, englishTitle, `${locale}/${base} has untranslated title`);
    const term = base === 'services/core-specialties/' ? (locale === 'fr' ? 'spécialités' : 'especialidades') : required[0];
    assert.ok(description.toLowerCase().includes(term), `${locale}/${base} description missing localized topic context`);
    assert.ok(title.includes(required[1]), `${locale}/${base} title missing brand`);
    assert.ok(translated.includes(`<html lang="${locale === 'fr' ? 'fr-CA' : 'es'}"`), `${locale}/${base} has wrong language`);
  }
}
console.log('GSC-informed search metadata passed, including distinct French and Spanish counterparts.');
