import fs from 'node:fs/promises';
import { site } from '../src/data.mjs';
import { englishRoutes, frenchRoutes, routes, spanishSourceRoutes, spanishRoutes } from '../src/routes.mjs';
import { alternateLinksForRoute, decorateRoute } from '../src/i18n/locales.mjs';
import { esCatalogConflicts, translateEs } from '../src/i18n/es-localize.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const built = relative => fs.readFile(new URL(relative, dist), 'utf8');

const decode = value => String(value || '')
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&nbsp;', ' ')
  .replaceAll('&mdash;', '—')
  .replaceAll('&ndash;', '–')
  .replaceAll('&rsquo;', '’')
  .replaceAll('&ldquo;', '“')
  .replaceAll('&rdquo;', '”')
  .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)));

const clean = value => decode(value).replace(/\s+/g, ' ').trim();
const protectedValue = value => {
  const text = clean(value);
  if (!text) return true;
  if (/^[\d\s./:+#@©↗→↑↓⌘—–-]+$/u.test(text)) return true;
  if (/^(?:https?:\/\/|mailto:|tel:)/i.test(text)) return true;
  if (/^[A-Z0-9_.:@/+ -]{1,30}$/.test(text) && !/[a-z]/.test(text)) return true;
  return false;
};

const fileForPath = path => path === '/' ? 'index.html' : `${path.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
const metadataGaps = [];
const bodyGaps = new Map();

assert(spanishSourceRoutes.length === 85, `Expected 85 Spanish source routes after excluding lawyer Terms/Privacy, found ${spanishSourceRoutes.length}.`);
assert(spanishRoutes.length === spanishSourceRoutes.length, `Spanish route count ${spanishRoutes.length} does not match source count ${spanishSourceRoutes.length}.`);
assert(esCatalogConflicts.length === 0, `Spanish catalog has ${esCatalogConflicts.length} unresolved conflict(s).`);
assert(!spanishRoutes.some(route => route.path === '/es/legal/privacy/' || route.path === '/es/legal/terms/'), 'Spanish lawyer-controlled Terms/Privacy must remain unpublished.');

for (let index = 0; index < spanishSourceRoutes.length; index += 1) {
  const en = spanishSourceRoutes[index];
  const es = spanishRoutes[index];
  if (!es) {
    errors.push(`Missing Spanish route for ${en.path}.`);
    continue;
  }
  assert(es.indexable === en.indexable, `${en.path}: Spanish indexability differs from English source.`);
  assert(es.path.startsWith('/es/'), `${en.path}: Spanish path is outside /es/: ${es.path}.`);

  for (const field of ['title', 'description']) {
    const source = clean(en.page?.[field]);
    const target = clean(es.page?.[field]);
    if (source && source === target && !protectedValue(source)) metadataGaps.push({ path: en.path, field, source });
  }

  const body = String(en.page?.body || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, '');
  for (const match of body.matchAll(/>([^<>]+)</g)) {
    const source = clean(match[1]);
    if (!source || protectedValue(source) || translateEs(source) !== null) continue;
    const record = bodyGaps.get(source) || { source, routes: [] };
    if (!record.routes.includes(en.path)) record.routes.push(en.path);
    bodyGaps.set(source, record);
  }
  for (const match of body.matchAll(/\b(?:aria-label|placeholder|title|alt)="([^"]+)"/gi)) {
    const source = clean(match[1]);
    if (!source || protectedValue(source) || translateEs(source) !== null) continue;
    const record = bodyGaps.get(source) || { source, routes: [] };
    if (!record.routes.includes(en.path)) record.routes.push(en.path);
    bodyGaps.set(source, record);
  }
}

assert(metadataGaps.length === 0, `Spanish release has ${metadataGaps.length} untranslated metadata field(s).`);
assert(bodyGaps.size === 0, `Spanish release has ${bodyGaps.size} untranslated page-body/attribute string(s).`);

const decorated = routes.map(decorateRoute);
const decoratedSpanish = spanishRoutes.map(decorateRoute);
const englishByKey = new Map(englishRoutes.map(decorateRoute).map(route => [route.translationKey, route]));
const frenchByKey = new Map(frenchRoutes.map(decorateRoute).map(route => [route.translationKey, route]));

for (const route of decoratedSpanish) {
  const html = await built(fileForPath(route.path));
  const canonical = new URL(route.path, site.url).toString();
  assert(html.includes('<html lang="es"'), `${route.path}: document language is not es.`);
  assert(html.includes('data-locale="es"'), `${route.path}: body locale marker is not es.`);
  assert(html.includes(`<link rel="canonical" href="${canonical}">`), `${route.path}: self-canonical is missing or incorrect.`);
  const en = englishByKey.get(route.translationKey);
  const fr = frenchByKey.get(route.translationKey);
  assert(en, `${route.path}: missing English counterpart identity.`);
  assert(fr, `${route.path}: missing French counterpart identity.`);
  if (route.indexable) {
    const alternates = alternateLinksForRoute(route, decorated);
    for (const hreflang of ['en-CA', 'fr-CA', 'es', 'x-default']) {
      assert(alternates.some(link => link.hreflang === hreflang), `${route.path}: missing ${hreflang} alternate.`);
      assert(html.includes(`hreflang="${hreflang}"`), `${route.path}: rendered ${hreflang} alternate missing.`);
    }
  }
}

const spanishIndexable = decoratedSpanish.filter(route => route.indexable);
assert(spanishIndexable.length === 83, `Expected 83 indexable Spanish routes, found ${spanishIndexable.length}.`);
const spanishIndex = JSON.parse(await built('es/search-index.json'));
const englishIndex = JSON.parse(await built('search-index.json'));
const frenchIndex = JSON.parse(await built('fr/search-index.json'));
assert(spanishIndex.length === spanishIndexable.length, `Spanish search index must contain ${spanishIndexable.length} entries, found ${spanishIndex.length}.`);
assert(spanishIndex.every(entry => entry.path.startsWith('/es/')), 'Spanish search index contains a non-Spanish route.');
assert(englishIndex.every(entry => !entry.path.startsWith('/es/') && !entry.path.startsWith('/fr/')), 'English search index contains a localized route.');
assert(frenchIndex.every(entry => entry.path.startsWith('/fr/')), 'French search index contains a non-French route.');
for (const route of spanishIndexable) assert(spanishIndex.some(entry => entry.path === route.path), `${route.path}: missing from Spanish search index.`);
assert(!spanishIndex.some(entry => /\/es\/legal\/(?:privacy|terms)\//.test(entry.path)), 'Spanish search index exposes unpublished lawyer legal routes.');

const sitemap = await built('sitemap.xml');
for (const route of spanishIndexable) assert(sitemap.includes(new URL(route.path, site.url).toString()), `${route.path}: missing from sitemap.`);
assert(!sitemap.includes('/es/legal/privacy/') && !sitemap.includes('/es/legal/terms/'), 'Sitemap exposes unpublished Spanish lawyer legal routes.');
assert(!sitemap.includes('/es/search/') && !sitemap.includes('/es/contact/thanks/'), 'Sitemap exposes Spanish noindex routes.');

for (const legalPath of ['es/legal/privacy/index.html', 'es/legal/terms/index.html']) {
  const exists = await fs.stat(new URL(legalPath, dist)).then(() => true).catch(() => false);
  assert(!exists, `${legalPath} must not exist before separate legal approval.`);
}

if (errors.length) {
  console.error(`Phase 3 Spanish localization release gate failed with ${errors.length} issue(s):`);
  for (const gap of metadataGaps) console.error(`- untranslated metadata: ${gap.path} ${gap.field}: ${gap.source}`);
  for (const gap of [...bodyGaps.values()].sort((a, b) => a.source.localeCompare(b.source))) console.error(`- untranslated body: ${gap.routes.join(',')}: ${gap.source}`);
  for (const conflict of esCatalogConflicts) console.error(`- catalog conflict: ${conflict.english}: ${conflict.first} <> ${conflict.second}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Phase 3 Spanish localization release gate passed: ${spanishRoutes.length} reviewed Spanish routes, ${spanishIndexable.length} indexable/searchable routes, zero metadata/body gaps, zero catalog conflicts, self-canonical lang=es output, reciprocal EN/FR/ES/x-default alternates, locale-pure search, exact sitemap coverage, and no unpublished Spanish Terms/Privacy.`);