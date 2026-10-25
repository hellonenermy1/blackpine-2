import fs from 'node:fs/promises';
import { site } from '../src/data.mjs';
import { routes } from '../src/routes.mjs';
import {
  alternateLinksForRoute,
  basePathForLocale,
  decorateRoute,
  languageOptionsForRoute,
  mergeAlternateLinks
} from '../src/i18n/locales.mjs';
import { documentLangForRoute } from '../src/i18n/phase4-render.mjs';

const dist = new URL('../dist/', import.meta.url);
const errors = [];
const assert = (ok, message) => { if (!ok) errors.push(message); };
const esc = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const decode = value => String(value || '').replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&nbsp;', ' ').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
const fileFor = path => path === '/' ? 'index.html' : `${path.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
const capture = (html, pattern) => decode(html.match(pattern)?.[1] || '');
const meta = (html, key, property = false) => capture(html, new RegExp(`<meta\\s+${property ? 'property' : 'name'}="${esc(key)}"\\s+content="([^"]*)"`, 'i'));
const canonical = html => capture(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
const alternates = html => [...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)].map(match => ({ hreflang: match[1], href: decode(match[2]) }));
const absolute = href => new URL(href, site.url).toString();
const schemaBlocks = (html, path) => [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((match, index) => {
  try { return JSON.parse(match[1]); }
  catch (error) { errors.push(`${path}: invalid JSON-LD block ${index + 1}: ${error.message}`); return null; }
}).filter(Boolean);
const localeSchemaTypes = schemas => schemas.map(schema => schema['@type']).filter(type => type && type !== 'Organization').sort();

const published = routes.map(decorateRoute);
const byPath = new Map(published.map(route => [route.path, route]));
const htmlByPath = new Map();
const schemaTypes = new Map();

for (const route of published) {
  const html = await fs.readFile(new URL(fileFor(route.path), dist), 'utf8');
  htmlByPath.set(route.path, html);
  const self = absolute(route.path);
  const base = basePathForLocale(route.path);
  const family = base.split('/').filter(Boolean)[0] || 'home';
  const expectedImage = route.page.image || site.ogImages?.[family] || site.ogImage;

  assert(capture(html, /<html\s+lang="([^"]+)"/i) === documentLangForRoute(route), `${route.path}: wrong html lang.`);
  assert(capture(html, /<body[^>]*\sdata-locale="([^"]+)"/i) === route.locale, `${route.path}: wrong data-locale.`);
  assert(new RegExp(`<body class="page-${esc(family)}"`).test(html), `${route.path}: body page family is not locale-neutral.`);
  assert(canonical(html) === self, `${route.path}: canonical is not self-referential.`);
  assert(capture(html, /<title>([^<]*)<\/title>/i) === route.page.title, `${route.path}: title mismatch.`);
  assert(meta(html, 'description') === route.page.description, `${route.path}: description mismatch.`);
  assert(meta(html, 'og:title', true) === route.page.title, `${route.path}: og:title mismatch.`);
  assert(meta(html, 'og:description', true) === route.page.description, `${route.path}: og:description mismatch.`);
  assert(meta(html, 'og:url', true) === self, `${route.path}: og:url mismatch.`);
  assert(meta(html, 'og:image', true) === expectedImage, `${route.path}: og:image is not derived from locale-neutral family.`);
  assert(meta(html, 'twitter:title') === route.page.title, `${route.path}: twitter:title mismatch.`);
  assert(meta(html, 'twitter:description') === route.page.description, `${route.path}: twitter:description mismatch.`);

  const expectedLinks = mergeAlternateLinks(route.page.alternateLinks, alternateLinksForRoute(route, published)).map(link => [link.hreflang, absolute(link.href)]);
  const actualLinks = new Map(alternates(html).map(link => [link.hreflang, link.href]));
  assert(actualLinks.size === expectedLinks.length, `${route.path}: hreflang count differs from published counterpart set.`);
  for (const [hreflang, href] of expectedLinks) assert(actualLinks.get(hreflang) === href, `${route.path}: wrong/missing ${hreflang} hreflang.`);
  if (route.indexable) {
    const english = published.find(candidate => candidate.translationKey === route.translationKey && candidate.locale === 'en-CA');
    assert(actualLinks.get('x-default') === absolute(english?.path || '/'), `${route.path}: x-default is not the English counterpart.`);
  }

  for (const option of languageOptionsForRoute(route, published)) {
    if (option.current) assert(html.includes(`aria-current="page" data-locale="${option.id}"`), `${route.path}: current language ${option.id} is not marked current.`);
    else if (option.available) assert(new RegExp(`<a[^>]+href="${esc(option.href)}"[^>]+data-language-choice[^>]+data-locale="${esc(option.id)}"`, 'i').test(html), `${route.path}: crawlable ${option.id} equivalent link missing.`);
    else assert(html.includes(`data-locale="${option.id}" aria-disabled="true"`), `${route.path}: unavailable ${option.id} counterpart is not disabled.`);
  }

  const schemas = schemaBlocks(html, route.path);
  schemaTypes.set(`${route.translationKey}:${route.locale}`, localeSchemaTypes(schemas));
  const org = schemas.find(schema => schema['@type'] === 'Organization');
  const shouldHaveOrg = route.locale === 'en-CA' && (route.path === '/' || route.path === '/company/about/');
  assert(Boolean(org) === shouldHaveOrg, `${route.path}: Organization schema violates narrow English Home/About scope.`);

  const breadcrumb = schemas.find(schema => schema['@type'] === 'BreadcrumbList');
  if (route.page.breadcrumbItems?.length) {
    assert(Boolean(breadcrumb), `${route.path}: BreadcrumbList missing.`);
    const expected = route.page.breadcrumbItems.map(item => absolute(item.href));
    const actual = breadcrumb?.itemListElement?.map(item => item.item) || [];
    assert(JSON.stringify(actual) === JSON.stringify(expected), `${route.path}: BreadcrumbList targets differ from localized breadcrumbs.`);
  }

  const article = schemas.find(schema => schema['@type'] === 'Article');
  if (route.page.articleMeta) {
    assert(Boolean(article), `${route.path}: Article JSON-LD missing.`);
    assert(article?.mainEntityOfPage === self, `${route.path}: Article mainEntityOfPage mismatch.`);
    assert(article?.headline === route.page.articleMeta.title, `${route.path}: Article headline mismatch.`);
    assert(article?.description === route.page.articleMeta.dek, `${route.path}: Article description mismatch.`);
    const authorPath = route.locale === 'fr-CA' ? '/fr/research/' : route.locale === 'es' ? '/es/research/' : '/research/';
    assert(article?.author?.url === absolute(authorPath), `${route.path}: Article author URL is not locale-aware.`);
  } else assert(!article, `${route.path}: unexpected Article JSON-LD.`);
}

for (const route of published) {
  const current = schemaTypes.get(`${route.translationKey}:${route.locale}`) || [];
  const english = schemaTypes.get(`${route.translationKey}:en-CA`) || [];
  assert(JSON.stringify(current) === JSON.stringify(english), `${route.path}: locale-dependent schema types differ from English counterpart.`);
}

for (const route of published.filter(route => route.indexable)) {
  for (const link of alternates(htmlByPath.get(route.path))) {
    if (link.hreflang === 'x-default') continue;
    const targetPath = new URL(link.href).pathname;
    const target = byPath.get(targetPath);
    assert(Boolean(target), `${route.path}: hreflang target ${targetPath} is not published.`);
    if (!target) continue;
    const reverse = new Map(alternates(htmlByPath.get(targetPath)).map(item => [item.hreflang, item.href]));
    assert(reverse.get(route.locale) === absolute(route.path), `${route.path}: ${targetPath} hreflang is not reciprocal for ${route.locale}.`);
  }
}

const sitemap = await fs.readFile(new URL('sitemap.xml', dist), 'utf8');
assert(!/<lastmod>/i.test(sitemap), 'sitemap contains synthetic lastmod freshness.');
const actualSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1])).sort();
const expectedSitemap = published.filter(route => route.indexable).map(route => absolute(route.path)).sort();
assert(JSON.stringify(actualSitemap) === JSON.stringify(expectedSitemap), 'sitemap is not the exact PUBLISHED indexable EN/FR/ES set.');

for (const [locale, file] of [['en-CA', 'search-index.json'], ['fr-CA', 'fr/search-index.json'], ['es', 'es/search-index.json']]) {
  const index = JSON.parse(await fs.readFile(new URL(file, dist), 'utf8'));
  const expected = published.filter(route => route.locale === locale && route.indexable);
  const records = new Map(index.map(record => [record.path, record]));
  assert(index.length === expected.length, `${locale}: search-index count differs from PUBLISHED indexable routes.`);
  for (const route of expected) {
    const record = records.get(route.path);
    assert(Boolean(record), `${route.path}: missing from ${locale} search index.`);
    if (!record) continue;
    const family = basePathForLocale(route.path).split('/').filter(Boolean)[0] || 'home';
    assert(record.family === family, `${route.path}: search family mismatch.`);
    assert(record.title === route.page.title && record.description === route.page.description, `${route.path}: search metadata mismatch.`);
  }
}

if (errors.length) {
  console.error(`Phase 4 three-language SEO/system gate failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Phase 4 three-language SEO/system gate passed across ${published.length} published routes: document-language semantics, self-canonicals, reciprocal hreflang/x-default, localized metadata and page families, locale-dependent structured-data parity with narrow Organization scope, crawlable equivalents, exact sitemap membership, locale-pure search and source-backed freshness rules.`);
