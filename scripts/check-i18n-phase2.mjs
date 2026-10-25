import fs from 'node:fs/promises';
import { site } from '../src/data.mjs';
import { englishRoutes, frenchRoutes, routes } from '../src/routes.mjs';
import { decorateRoute, alternateLinksForRoute, translationKeyForPath } from '../src/i18n/locales.mjs';
import { frenchPathFor, frCaCatalogConflicts } from '../src/i18n/fr-ca-localize.mjs';

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const dist = new URL('../dist/', import.meta.url);
const root = new URL('../', import.meta.url);
const built = relative => fs.readFile(new URL(relative, dist), 'utf8');
const source = relative => fs.readFile(new URL(relative, root), 'utf8');

const fileForPath = path => {
  if (path === '/') return 'index.html';
  return `${path.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
};

const editorialRegressions = [
  [/\bsite(?: Web)? corporatif\b/i, 'site corporatif'],
  [/\bsystèmes corporatifs\b/i, 'systèmes corporatifs'],
  [/\bsurfaces? corporatives?\b/i, 'surface corporative'],
  [/\bregistre corporatif\b/i, 'registre corporatif'],
  [/\bmodalités de rétention\b/i, 'modalités de rétention'],
  [/\bservice de rétention\b/i, 'service de rétention'],
  [/Entrée Ouvrir/i, 'Entrée Ouvrir'],
  [/Échap Fermer/i, 'Échap Fermer'],
  [/\ble risque et la recherche technique\b/i, 'le risque et la recherche technique'],
  [/\bscanner sans restriction\b/i, 'scanner sans restriction'],
  [/\bne scanne pas\b/i, 'ne scanne pas'],
  [/\bscanner DNS\b/i, 'scanner DNS'],
  [/\bGouvernance et risque\b/i, 'Gouvernance et risque'],
  [/\bcontinuité client\b/i, 'continuité client'],
  [/Practice Leadership &amp; Advisory|Practice Leadership & Advisory/i, 'untranslated Practice Leadership & Advisory'],
  [/Technical Assessments &amp; Defensive Engineering|Technical Assessments & Defensive Engineering/i, 'untranslated Technical Assessments & Defensive Engineering'],
  [/Les éléments probants avant la mise en scène\./i, 'literal case-study heading']
];

const decorated = routes.map(decorateRoute);
const english = englishRoutes.map(decorateRoute);
const french = frenchRoutes.map(decorateRoute);
const spanish = decorated.filter(route => route.locale === 'es');
const englishByKey = new Map(english.map(route => [route.translationKey, route]));
const frenchByKey = new Map(french.map(route => [route.translationKey, route]));
const englishPathSet = new Set(englishRoutes.map(route => route.path));
const englishIndexableCount = englishRoutes.filter(route => route.indexable).length;
const frenchIndexableCount = frenchRoutes.filter(route => route.indexable).length;

assert(englishRoutes.length === 87, `Expected the approved 87-route English corpus, found ${englishRoutes.length}.`);
assert(frenchRoutes.length === englishRoutes.length, `French route count ${frenchRoutes.length} does not match English route count ${englishRoutes.length}.`);
assert(englishIndexableCount === 85, `Expected 85 indexable English routes, found ${englishIndexableCount}.`);
assert(frenchIndexableCount === englishIndexableCount, `French indexable route count ${frenchIndexableCount} does not match English count ${englishIndexableCount}.`);
assert(frCaCatalogConflicts.length === 0, `French catalog has ${frCaCatalogConflicts.length} unresolved conflict(s).`);
assert(spanish.length === 85, `Phase 3 must coexist with the reviewed 85-route Spanish corpus; found ${spanish.length}.`);
assert(!spanish.some(route => route.path === '/es/legal/privacy/' || route.path === '/es/legal/terms/'), 'Spanish lawyer-approved Terms/Privacy must remain unpublished.');

for (const en of english) {
  const fr = frenchByKey.get(en.translationKey);
  assert(fr, `Missing French counterpart for ${en.path}.`);
  if (!fr) continue;
  assert(fr.path === frenchPathFor(en.path), `${en.path}: French path must be ${frenchPathFor(en.path)}, found ${fr.path}.`);
  assert(fr.indexable === en.indexable, `${en.path}: EN/FR indexability mismatch.`);
  assert(fr.translationKey === translationKeyForPath(fr.path), `${fr.path}: translation key mismatch.`);
}
for (const fr of french) assert(englishByKey.has(fr.translationKey), `French route ${fr.path} has no English counterpart.`);

for (const route of [...english, ...french]) {
  const html = await built(fileForPath(route.path));
  const canonical = new URL(route.path, site.url).toString();
  assert(html.includes(`<link rel="canonical" href="${canonical}">`), `${route.path}: self-canonical is missing or incorrect.`);
  if (route.locale === 'fr-CA') {
    assert(html.includes('<html lang="fr-CA"'), `${route.path}: document language is not fr-CA.`);
    assert(html.includes('data-locale="fr-CA"'), `${route.path}: body locale marker is not fr-CA.`);
  }

  const counterpart = route.locale === 'fr-CA' ? englishByKey.get(route.translationKey) : frenchByKey.get(route.translationKey);
  if (counterpart && route.indexable) {
    const alternates = alternateLinksForRoute(route, decorated);
    assert(alternates.some(link => link.hreflang === 'en-CA'), `${route.path}: missing en-CA alternate.`);
    assert(alternates.some(link => link.hreflang === 'fr-CA'), `${route.path}: missing fr-CA alternate.`);
    assert(alternates.some(link => link.hreflang === 'x-default'), `${route.path}: missing x-default alternate.`);
    assert(html.includes('hreflang="en-CA"'), `${route.path}: rendered en-CA alternate missing.`);
    assert(html.includes('hreflang="fr-CA"'), `${route.path}: rendered fr-CA alternate missing.`);
    assert(html.includes('hreflang="x-default"'), `${route.path}: rendered x-default alternate missing.`);
  }
}

for (const route of french) {
  const html = await built(fileForPath(route.path));
  for (const [pattern, label] of editorialRegressions) {
    if (pattern.test(html)) errors.push(`${route.path}: Canadian-French editorial regression detected (${label}).`);
  }
  for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
    const attrs = match[1];
    const href = attrs.match(/\bhref="([^"]+)"/i)?.[1];
    if (!href || !href.startsWith('/') || href.startsWith('//') || href.startsWith('/fr/')) continue;
    if (/\bdata-language-choice\b/i.test(attrs) || /\bhreflang="en-CA"/i.test(attrs)) continue;
    const pathname = href.split(/[?#]/)[0];
    if (englishPathSet.has(pathname)) errors.push(`${route.path}: French page links to English route outside an explicit language switch: ${href}.`);
  }
}

const frHome = await built('fr/index.html');
const chromeOpenTags = [
  ['header', frHome.match(/<header\b[^>]*\bdata-header\b[^>]*>/i)?.[0] || ''],
  ['search overlay', frHome.match(/<div\s+class="search-overlay"[^>]*>/i)?.[0] || ''],
  ['footer', frHome.match(/<footer\s+class="site-footer"[^>]*>/i)?.[0] || '']
];
for (const [label, tag] of chromeOpenTags) {
  assert(tag, `French home ${label} opening tag could not be isolated for audit.`);
  assert(!/\slang="en"/i.test(tag), `French home ${label} wrapper is incorrectly marked as English.`);
}
for (const required of [
  'Aller au contenu', 'Navigation principale', 'Expertises', 'Réalisations', 'Confiance', 'Rechercher',
  'Rechercher sur le site public', 'Nous joindre', 'Préférences de confidentialité', 'Centre de confiance'
]) assert(frHome.includes(required), `French shared chrome is missing reviewed text: ${required}`);
for (const forbidden of ['>Skip to content<', '>Capabilities<', '>Work<', '>Trust Center<', '>Privacy preferences<']) {
  assert(!frHome.includes(forbidden), `French shared chrome still contains English UI fragment ${forbidden}.`);
}
assert(frHome.includes('href="/fr/contact/"'), 'French header/footer must keep Contact inside /fr/.');
assert(frHome.includes('href="/fr/research/"'), 'French header/footer must keep Research inside /fr/.');
assert(frHome.includes('href="/fr/trust/"'), 'French header/footer must keep Trust inside /fr/.');
assert(frHome.includes('https://cipher.blackpinecybersecurity.com'), 'French site lost the external Cipher trust boundary.');
assert(frHome.includes('https://support.blackpinecybersecurity.com'), 'French site lost the external Support trust boundary.');
assert(!frHome.includes('https://cipher.blackpinecybersecurity.com/fr/'), 'French path was incorrectly appended to Cipher.');
assert(!frHome.includes('https://support.blackpinecybersecurity.com/fr/'), 'French path was incorrectly appended to Support.');

const englishIndex = JSON.parse(await built('search-index.json'));
const frenchIndex = JSON.parse(await built('fr/search-index.json'));
assert(englishIndex.length === englishIndexableCount, `English search index must contain ${englishIndexableCount} entries, found ${englishIndex.length}.`);
assert(frenchIndex.length === frenchIndexableCount, `French search index must contain ${frenchIndexableCount} entries, found ${frenchIndex.length}.`);
assert(englishIndex.every(entry => !entry.path.startsWith('/fr/') && !entry.path.startsWith('/es/')), 'English search index contains a localized route.');
assert(frenchIndex.every(entry => entry.path.startsWith('/fr/')), 'French search index contains a non-French route.');
for (const route of english.filter(route => route.indexable)) assert(englishIndex.some(entry => entry.path === route.path), `${route.path}: missing from English search index.`);
for (const route of french.filter(route => route.indexable)) assert(frenchIndex.some(entry => entry.path === route.path), `${route.path}: missing from French search index.`);

const siteJs = await source('src/site.js');
const toolsJs = await source('src/tools.js');
const preferencesJs = await source('src/preferences.js');
const layoutSource = await source('src/layout.mjs');
const phase2Js = await source('public/phase2.js');
const phase3Js = await source('public/phase3.js');
for (const required of ['/fr/search-index.json', 'Aucune page publique ne correspond', 'Thème :']) {
  assert(siteJs.includes(required), `site.js missing French shared-runtime marker: ${required}`);
}
for (const required of ['Répondez aux questions', 'À examiner', 'Écart important']) {
  assert(toolsJs.includes(required), `tools.js missing French tool/assessment runtime marker: ${required}`);
}
for (const required of ['Langue et apparence', 'Enregistré sur cet appareil.', 'Aucun identifiant unique de préférence n’est créé ni transmis à Blackpine.', 'Enregistrer']) {
  assert(layoutSource.includes(required), `layout.mjs missing reviewed French preference marker: ${required}`);
}
assert(preferencesJs.includes('blackpine.preferences.v1'), 'preferences.js lost the versioned preference storage key.');
for (const required of ['Demande transmise depuis le site Web de Blackpine', 'Parcours suggéré', 'Vous cherchez peut-être', 'Intervention d’urgence Blackpine']) {
  assert(phase2Js.includes(required), `phase2.js missing French runtime marker: ${required}`);
}
assert(phase3Js.includes('...englishPaths.map(path => `/fr${path}`)'), 'French approved prefetch counterparts are not derived from the conservative English allowlist.');

for (const runtime of [siteJs, toolsJs, preferencesJs, phase2Js]) {
  assert(!/innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\s*\(|new Function/.test(runtime), 'Localized browser runtime introduced a dangerous dynamic HTML/eval sink.');
}

const root404 = await built('404.html');
const fr404 = await built('fr/404.html');
assert(fr404.includes('<html lang="fr-CA"'), 'French 404 document language is not fr-CA.');
assert(fr404.includes('data-locale="fr-CA"'), 'French 404 locale marker is missing.');
assert(!root404.includes('href="/fr/404/"'), 'Root 404 exposes a fabricated French 404 route.');
assert(!fr404.includes('href="/404/"'), 'French 404 exposes a fabricated English 404 route.');

const esPath = new URL('./es/', dist);
assert(await fs.stat(esPath).then(() => true).catch(() => false), 'Phase 3 Spanish corpus must coexist with the preserved Phase 2 French release.');
assert(!(await fs.stat(new URL('./es/legal/privacy/index.html', dist)).then(() => true).catch(() => false)), 'Spanish Privacy must remain absent until separately lawyer-approved.');
assert(!(await fs.stat(new URL('./es/legal/terms/index.html', dist)).then(() => true).catch(() => false)), 'Spanish Terms must remain absent until separately lawyer-approved.');

if (errors.length) {
  console.error(`Phase 2 localization release gate failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Phase 2 localization release gate passed under Phase 4: ${englishRoutes.length} English and ${frenchRoutes.length} French routes (${englishIndexableCount} indexable each) retain exact parity, reciprocal locale SEO, locale-pure search, French shared/runtime UI, route-scoped French tool UI, reviewed concise preferences, French-local internal navigation, Canadian-French editorial guards, safe 404 behavior, preserved cross-surface boundaries, zero French catalog conflicts, and coexistence with ${spanish.length} reviewed Spanish routes while Spanish lawyer legal Terms/Privacy remain unpublished.`);