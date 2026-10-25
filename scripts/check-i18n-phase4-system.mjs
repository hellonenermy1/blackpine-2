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

const dist = new URL('../dist/', import.meta.url);
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const fileForPath = path => path === '/' ? 'index.html' : `${path.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
const decode = value => String(value || '')
  .replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&nbsp;', ' ')
  .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)));
const attr = (html, pattern) => decode(html.match(pattern)?.[1] || '');
const meta = (html, key, property = false) => attr(html, new RegExp(`<meta\\s+${property ? 'property' : 'name'}="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s+content="([^"]*)"`, 'i'));
const canonicalFrom = html => attr(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
const alternatesFrom = html => [...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)]
  .map(match => ({ hreflang: match[1], href: decode(match[2]) }));
const schemasFrom = (html, path) => [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((match, index) => {
  try { return JSON.parse(match[1]); }
  catch (error) { errors.push(`${path}: JSON-LD block ${index + 1} is invalid JSON (${error.message}).`); return null; }
}).filter(Boolean);
const localeDependentSchemaTypes = schemas => schemas
  .map(schema => schema['@type'])
  .filter(type => type && type !== 'Organization')
  .sort();
const normalHref = href => new URL(href, site.url).toString();

const decorated = routes.map(decorateRoute);
const routeByPath = new Map(decorated.map(route => [route.path, route]));
const htmlByPath = new Map();
const schemaTypesByKey = new Map();

for (const route of decorated) {
  const html = await fs.readFile(new URL(fileForPath(route.path), dist), 'utf8');
  htmlByPath.set(route.path, html);
  const canonical = normalHref(route.path);
  const expectedLang = route.locale;

  assert(attr(html, /<html\s+lang="([^"]+)"/i) === expectedLang, `${route.path}: html lang does not equal ${expectedLang}.`);
  assert(attr(html, /<body[^>]*\sdata-locale="([^"]+)"/i) === route.locale, `${route.path}: body data-locale does not equal ${route.locale}.`);
  assert(canonicalFrom(html) === canonical, `${route.path}: canonical is not self-referential.`);
  assert(attr(html, /<title>([^<]*)<\/title>/i) === route.page.title, `${route.path}: title does not match localized route metadata.`);
  assert(meta(html, 'description') === route.page.description, `${route.path}: description does not match localized route metadata.`);
  assert(meta(html, 'og:title', true) === route.page.title, `${route.path}: og:title does not match localized title.`);
  assert(meta(html, 'og:description', true) === route.page.description, `${route.path}: og:description does not match localized description.`);
  assert(meta(html, 'og:url', true) === canonical, `${route.path}: og:url does not match canonical.`);
  assert(meta(html, 'twitter:title') === route.page.title, `${route.path}: twitter:title does not match localized title.`);
  assert(meta(html, 'twitter:description') === route.page.description, `${route.path}: twitter:description does not match localized description.`);

  const basePath = basePathForLocale(route.path);
  const expectedFamily = basePath.split('/').filter(Boolean)[0] || 'home';
  assert(new RegExp(`<body class="page-${expectedFamily.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(html), `${route.path}: body page-family class is not locale-neutral ${expectedFamily}.`);
  const expectedSocialImage = route.page.image || site.ogImages?.[expectedFamily] || site.ogImage;
  assert(meta(html, 'og:image', true) === expectedSocialImage, `${route.path}: og:image does not use the locale-neutral page family.`);

  const expectedAlternates = mergeAlternateLinks(route.page.alternateLinks, alternateLinksForRoute(route, decorated))
    .map(link => ({ hreflang: link.hreflang, href: normalHref(link.href) }));
  const renderedAlternates = alternatesFrom(html);
  const expectedAlternateMap = new Map(expectedAlternates.map(link => [link.hreflang, link.href]));
  const renderedAlternateMap = new Map(renderedAlternates.map(link => [link.hreflang, link.href]));
  assert(renderedAlternateMap.size === expectedAlternateMap.size, `${route.path}: rendered hreflang count differs from published counterpart set.`);
  for (const [hreflang, href] of expectedAlternateMap) assert(renderedAlternateMap.get(hreflang) === href, `${route.path}: ${hreflang} alternate is missing or points to the wrong route.`);

  if (route.indexable) {
    const english = decorated.find(candidate => candidate.translationKey === route.translationKey && candidate.locale === 'en-CA');
    assert(renderedAlternateMap.get('x-default') === normalHref(english?.path || '/'), `${route.path}: x-default is not the published English counterpart.`);
  }

  const options = languageOptionsForRoute(route, decorated);
  for (const option of options) {
    if (option.current) {
      assert(html.includes(`aria-current="page" data-locale="${option.id}"`), `${route.path}: current ${option.id} language option is not marked as current.`);
    } else if (option.available) {
      const escapedHref = String(option.href).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escapedLocale = String(option.id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      assert(new RegExp(`<a[^>]+href="${escapedHref}"[^>]+data-language-choice[^>]+data-locale="${escapedLocale}"`, 'i').test(html), `${route.path}: crawlable selector link missing for ${option.id} equivalent ${option.href}.`);
    } else {
      assert(html.includes(`data-locale="${option.id}" aria-disabled="true"`), `${route.path}: unavailable ${option.id} counterpart is not explicitly disabled.`);
    }
  }

  const schemas = schemasFrom(html, route.path);
  schemaTypesByKey.set(`${route.translationKey}:${route.locale}`, localeDependentSchemaTypes(schemas));
  const organization = schemas.find(schema => schema['@type'] === 'Organization');
  const shouldHaveOrganization = route.locale === 'en-CA' && (route.path === '/' || route.path === '/company/about/');
  assert(Boolean(organization) === shouldHaveOrganization, `${route.path}: Organization JSON-LD scope differs from the narrow English canonical Home/About policy.`);

  const breadcrumb = schemas.find(schema => schema['@type'] === 'BreadcrumbList');
  if (route.page.breadcrumbItems?.length) {
    assert(Boolean(breadcrumb), `${route.path}: breadcrumb UI has no BreadcrumbList structured data.`);
    const expectedItems = route.page.breadcrumbItems.map(item => normalHref(item.href));
    const actualItems = breadcrumb?.itemListElement?.map(item => item.item) || [];
    assert(JSON.stringify(actualItems) === JSON.stringify(expectedItems), `${route.path}: BreadcrumbList targets do not match localized breadcrumb targets.`);
  }

  const article = schemas.find(schema => schema['@type'] === 'Article');
  if (route.page.articleMeta) {
    assert(Boolean(article), `${route.path}: article metadata exists but Article JSON-LD is missing.`);
    assert(article?.mainEntityOfPage === canonical, `${route.path}: Article mainEntityOfPage differs from canonical.`);
    assert(article?.headline === route.page.articleMeta.title, `${route.path}: Article headline differs from localized article title.`);
    assert(article?.description === route.page.articleMeta.dek, `${route.path}: Article description differs from localized article dek.`);
    const expectedAuthor = normalHref(route.locale === 'fr-CA' ? '/fr/research/' : route.locale === 'es' ? '/es/research/' : '/research/');
    assert(article?.author?.url === expectedAuthor, `${route.path}: Article author URL is not locale-aware.`);
  } else {
    assert(!article, `${route.path}: unexpected Article structured data.`);
  }
}

for (const route of decorated) {
  const types = schemaTypesByKey.get(`${route.translationKey}:${route.locale}`) || [];
  const englishTypes = schemaTypesByKey.get(`${route.translationKey}:en-CA`) || [];
  assert(JSON.stringify(types) === JSON.stringify(englishTypes), `${route.path}: locale-dependent structured-data types ${types.join(',') || '(none)'} differ from English counterpart ${englishTypes.join(',') || '(none)'}.`);
}

for (const route of decorated) {
  if (!route.indexable) continue;
  const html = htmlByPath.get(route.path);
  for (const alternate of alternatesFrom(html)) {
    if (alternate.hreflang === 'x-default') continue;
    const targetPath = new URL(alternate.href).pathname;
    const target = routeByPath.get(targetPath);
    assert(Boolean(target), `${route.path}: hreflang target ${targetPath} is not a published route.`);
    if (!target) continue;
    const targetAlternates = new Map(alternatesFrom(htmlByPath.get(targetPath)).map(link => [link.hreflang, link.href]));
    const reciprocalLang = route.locale;
    assert(targetAlternates.get(reciprocalLang) === normalHref(route.path), `${route.path}: hreflang relation to ${targetPath} is not reciprocal for ${reciprocalLang}.`);
  }
}

const sitemap = await fs.readFile(new URL('sitemap.xml', dist), 'utf8');
assert(!/<lastmod>/i.test(sitemap), 'Sitemap contains lastmod even though Phase 4 has no source-backed content freshness timestamp to publish.');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1])).sort();
const expectedSitemapUrls = decorated.filter(route => route.indexable).map(route => normalHref(route.path)).sort();
assert(JSON.stringify(sitemapUrls) === JSON.stringify(expectedSitemapUrls), 'Sitemap is not the exact set of indexable PUBLISHED EN/FR/ES routes.');

for (const [locale, file] of [['en-CA', 'search-index.json'], ['fr-CA', 'fr/search-index.json'], ['es', 'es/search-index.json']]) {
  const index = JSON.parse(await fs.readFile(new URL(file, dist), 'utf8'));
  const expected = decorated.filter(route => route.locale === locale && route.indexable);
  assert(index.length === expected.length, `${locale}: search index count ${index.length} differs from ${expected.length} published indexable routes.`);
  const indexByPath = new Map(index.map(record => [record.path, record]));
  for (const route of expected) {
    const record = indexByPath.get(route.path);
    assert(Boolean(record), `${route.path}: missing from ${locale} search index.`);
    if (!record) continue;
    const base = basePathForLocale(route.path);
    const family = base.split('/').filter(Boolean)[0] || 'home';
    assert(record.family === family, `${route.path}: search classification ${record.family} differs from base route family ${family}.`);
    assert(record.title === route.page.title, `${route.path}: search title differs from localized title.`);
    assert(record.description === route.page.description, `${route.path}: search description differs from localized description.`);
  }
}

if (errors.length) {
  console.error(`Phase 4 three-language SEO/system gate failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Phase 4 three-language SEO/system gate passed across ${decorated.length} published EN/FR/ES routes: localized metadata, self-canonicals, reciprocal hreflang/x-default, locale-dependent structured-data parity with narrow Organization scope, crawlable language equivalents, exact sitemap membership, locale-pure search and source-backed freshness rules.`);
