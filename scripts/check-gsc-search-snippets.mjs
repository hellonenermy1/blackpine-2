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
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
  assert.ok(title.length >= 25 && title.length <= 65, `${entry.file} title too short/long (${title.length})`);
  assert.ok(description.length >= 70 && description.length <= 160, `${entry.file} description too short/long (${description.length})`);
  for (const keyword of entry.keywords) {
    assert.ok(title.includes(keyword), `${entry.file} title missing ${keyword}`);
  }
  assert.ok(html.includes('<link rel="canonical" href="https://blackpinecybersecurity.com/'), `${entry.file} canonical missing`);
  assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html), `${entry.file} became noindex`);
}
console.log('GSC-informed principal English landing-page title and description checks passed.');
