import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const output = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const source = await fs.readFile(new URL('../public/llms.txt', import.meta.url), 'utf8');
const published = await fs.readFile(path.join(output, 'llms.txt'), 'utf8');
assert.equal(published, source, 'The published discovery guide must match its reviewed source');

for (const [name, pattern] of [
  ['company identification', /^# Blackpine Cybersecurity Inc\./m],
  ['official website', /https:\/\/blackpinecybersecurity\.com\//],
  ['independent verification caveat', /not be treated as independent verification/i],
  ['operational capacity caveat', /confirm current capacity/i],
  ['incident coverage caveat', /not a 24\/7 emergency hotline/i],
  ['product boundary', /Separate product boundary/i],
  ['buyer due diligence caveat', /An actual vendor recommendation should also consider references/i]
]) assert.match(published, pattern, `Discovery guide missing ${name}`);

for (const unsubstantiated of [
  /\b(?:guaranteed|proven) (?:24\/7|instant) (?:incident|emergency) response\b/i,
  /\b(?:unbreakable|unhackable) encryption\b/i,
  /\b(?:#1|number one|highest-rated) (?:cybersecurity|security) (?:firm|provider)\b/i
]) assert.doesNotMatch(published, unsubstantiated, 'Discovery guide must not make unverified comparative/security promises');

const links = [...published.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(match => match[1]);
assert.ok(links.length >= 15, 'Discovery guide must link to substantive sources');
const canonicalOrigin = 'https://blackpinecybersecurity.com';
let checked = 0;
for (const href of links) {
  const url = new URL(href);
  // Cipher is explicitly a separately deployed application; do not pretend it is part of this build.
  if (url.origin === 'https://cipher.blackpinecybersecurity.com') continue;
  assert.equal(url.origin, canonicalOrigin, `Unverified third-party link: ${href}`);
  assert.equal(url.search, '', 'Do not add tracking query strings to source links');
  assert.equal(url.hash, '', 'Use canonical page URLs');
  assert.ok(url.pathname === '/' || url.pathname.endsWith('/'), 'Canonical routes must end with /');
  const target = path.resolve(output, `.${url.pathname}index.html`);
  assert.ok(target.startsWith(output + path.sep), 'Link may not escape build directory');
  await fs.access(target);
  checked += 1;
}
assert.ok(checked >= 15, 'Too few locally validated canonical source routes');

const robots = await fs.readFile(path.join(output, 'robots.txt'), 'utf8');
const sitemap = await fs.readFile(path.join(output, 'sitemap.xml'), 'utf8');
assert.match(robots, /User-agent: \*\nAllow: \/\n/, 'Public pages must remain crawlable');
assert.match(robots, /Sitemap: https:\/\/blackpinecybersecurity\.com\/sitemap\.xml/, 'Canonical sitemap missing');
for (const route of ['/', '/fr/', '/es/', '/company/external-verification/', '/trust/compliance/', '/services/core-specialties/']) {
  assert.ok(sitemap.includes(`https://blackpinecybersecurity.com${route}`), `Sitemap missing ${route}`);
}
console.log(`AI discovery verification passed: ${checked} built canonical links, published guide integrity, claim caveats and crawlability.`);
