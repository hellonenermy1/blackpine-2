import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { routes } from '../src/routes.mjs';
import { site } from '../src/data.mjs';
import { decorateRoute, alternateLinksForRoute } from '../src/i18n/locales.mjs';

const xml = await fs.readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
assert.match(xml, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
assert.doesNotMatch(xml, /<lastmod>/i, 'No fabricated freshness dates');
const indexable = routes.map(decorateRoute).filter(route => route.indexable);
const actual = [...xml.matchAll(/<url><loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g)];
assert.equal(actual.length, indexable.length, 'One sitemap entry per published indexable route');
let linksChecked = 0;
for (let index = 0; index < indexable.length; index += 1) {
  const route = indexable[index];
  const [entry, loc, linksText] = actual[index];
  assert.equal(loc, new URL(route.path, site.url).toString(), `Wrong sitemap canonical for ${route.path}`);
  const expected = alternateLinksForRoute(route, indexable);
  const found = [...linksText.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g)];
  assert.equal(found.length, expected.length, `Wrong alternate count for ${route.path}`);
  assert.equal(linksText.replace(/<xhtml:link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>/g, ''), '', `Unexpected XML in ${route.path}`);
  for (let j = 0; j < expected.length; j += 1) {
    const expectedLink = expected[j];
    assert.equal(found[j][1], expectedLink.hreflang, `Wrong alternate locale for ${route.path}`);
    assert.equal(found[j][2], new URL(expectedLink.href, site.url).toString(), `Wrong alternate URL for ${route.path}`);
    const target = indexable.find(candidate => candidate.path === expectedLink.href);
    assert.ok(target && target.translationKey === route.translationKey, `Unpublished or mismatched counterpart for ${route.path}`);
    const reverse = alternateLinksForRoute(target, indexable);
    assert.ok(reverse.some(link => link.href === route.path), `Non-reciprocal alternate for ${route.path}`);
    linksChecked += 1;
  }
}
assert.ok(linksChecked > 400, 'Expected substantial multilingual reciprocal coverage');
assert.ok(!xml.includes('/es/legal/privacy/') && !xml.includes('/es/legal/terms/'), 'Unapproved Spanish legal pages must remain excluded');
console.log(`Sitemap alternate verification passed: ${actual.length} indexable URLs and ${linksChecked} reciprocal hreflang links.`);
