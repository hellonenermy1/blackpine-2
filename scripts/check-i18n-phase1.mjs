import fs from 'node:fs/promises';
import { routes } from '../src/routes.mjs';
import {
  alternateLinksForRoute,
  decorateRoute,
  defaultLocale,
  languageOptionsForRoute,
  locales,
  preferenceSchemaVersion,
  preferenceStorageKey,
  translationKeyForPath
} from '../src/i18n/locales.mjs';

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const source = async path => fs.readFile(new URL(path, root), 'utf8');
const built = async path => fs.readFile(new URL(path, dist), 'utf8');

const decorated = routes.map(decorateRoute);
const localeIds = locales.map(locale => locale.id);
assert(JSON.stringify(localeIds) === JSON.stringify(['en-CA', 'fr-CA', 'es']), `Unexpected locale registry: ${localeIds.join(', ')}`);
assert(defaultLocale === 'en-CA', 'English Canada must remain the default locale.');
assert(preferenceStorageKey === 'blackpine.preferences.v1', 'Preference storage key changed unexpectedly.');
assert(preferenceSchemaVersion === 1, 'Preference schema version changed unexpectedly.');

const routePairs = new Set();
for (const route of decorated) {
  assert(route.translationKey === translationKeyForPath(route.path), `Translation key mismatch for ${route.path}`);
  const pair = `${route.translationKey}::${route.locale}`;
  assert(!routePairs.has(pair), `Duplicate localized route identity: ${pair}`);
  routePairs.add(pair);
}

const english = decorated.filter(route => route.locale === 'en-CA');
const french = decorated.filter(route => route.locale === 'fr-CA');
const spanish = decorated.filter(route => route.locale === 'es');
const englishRoutes = english.map(route => route.path).sort();
const frenchRoutes = french.map(route => route.path).sort();
const spanishRoutes = spanish.map(route => route.path).sort();
assert(englishRoutes.length > 0, 'English route set is unexpectedly empty.');
assert(frenchRoutes.length === englishRoutes.length, `French route count ${frenchRoutes.length} must match English ${englishRoutes.length}.`);
const spanishExcludedEnglishPaths = new Set(['/legal/privacy/', '/legal/terms/']);
const spanishEligibleEnglish = english.filter(route => !spanishExcludedEnglishPaths.has(route.path));
assert(spanishRoutes.length === spanishEligibleEnglish.length, `Spanish route count ${spanishRoutes.length} must match the ${spanishEligibleEnglish.length} reviewed non-lawyer-legal English routes.`);
for (const route of spanishEligibleEnglish) {
  assert(spanish.some(candidate => candidate.translationKey === route.translationKey), `Reviewed Spanish counterpart missing for ${route.path}`);
}
assert(!spanish.some(route => route.path === '/es/legal/privacy/' || route.path === '/es/legal/terms/'), 'Spanish Terms/Privacy must remain unpublished until separately approved legal translations exist.');

for (const path of ['/legal/privacy/', '/legal/terms/', '/fr/legal/privacy/', '/fr/legal/terms/']) {
  const route = decorated.find(item => item.path === path);
  assert(route, `Missing legal route ${path}`);
  if (!route) continue;
  const options = languageOptionsForRoute(route, decorated);
  const en = options.find(option => option.id === 'en-CA');
  const fr = options.find(option => option.id === 'fr-CA');
  const es = options.find(option => option.id === 'es');
  assert(en?.available && fr?.available, `${path} must expose reciprocal EN/FR availability.`);
  assert(!es?.available, `${path} must not claim a Spanish lawyer-approved legal translation exists.`);
  const alternates = alternateLinksForRoute(route, decorated);
  assert(alternates.some(link => link.hreflang === 'en-CA'), `${path} missing en-CA alternate.`);
  assert(alternates.some(link => link.hreflang === 'fr-CA'), `${path} missing fr-CA alternate.`);
  assert(alternates.some(link => link.hreflang === 'x-default'), `${path} missing x-default alternate.`);
  assert(!alternates.some(link => link.hreflang === 'es'), `${path} must not advertise an unpublished Spanish legal alternate.`);
}

const home = decorated.find(route => route.path === '/');
const homeOptions = languageOptionsForRoute(home, decorated);
assert(homeOptions.find(option => option.id === 'en-CA')?.available, 'English home route must be available.');
assert(homeOptions.find(option => option.id === 'fr-CA')?.available, 'French home route must be available.');
assert(homeOptions.find(option => option.id === 'es')?.available, 'Reviewed Spanish home route must be available in Phase 3.');

const preferencesSource = await source('src/preferences.js');
for (const forbidden of ['fetch(', 'sendBeacon', 'XMLHttpRequest', 'WebSocket(', 'document.cookie', 'randomUUID', 'indexedDB']) {
  assert(!preferencesSource.includes(forbidden), `Preference runtime must not use tracking/network primitive: ${forbidden}`);
}
assert(preferencesSource.includes(preferenceStorageKey), 'Preference runtime is not using the versioned first-party storage key.');
assert(preferencesSource.includes("new Set(['en-CA', 'fr-CA', 'es'])"), 'Preference runtime locale allowlist is missing or changed.');
assert(!/Date\.|Date\(|performance\.now|Math\.random/.test(preferencesSource), 'Preference runtime must not create timestamps or random identifiers.');
assert(!/innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\s*\(|new Function/.test(preferencesSource), 'Preference runtime must not use dynamic HTML/eval sinks.');
assert(preferencesSource.includes('No unique preference identifier is created or transmitted to Blackpine.'), 'Preference runtime must retain the no-tracking-identifier invariant marker.');

const layoutSource = await source('src/layout.mjs');
assert(layoutSource.includes('function preferencesDialog('), 'Preference dialog must be rendered from the trusted static layout.');
assert(layoutSource.includes('Language & privacy preferences'), 'Static preferences dialog is missing its English accessible heading.');
assert(layoutSource.includes('No unique preference identifier is created or transmitted to Blackpine.'), 'Rendered preference disclosure must state that it creates no tracking identifier.');
assert(layoutSource.includes('third-party analytics') && layoutSource.includes('social-media tracking widgets'), 'Rendered preference disclosure must match the published tracking baseline.');

const themeInitSource = await source('src/theme-init.js');
assert(themeInitSource.includes(preferenceStorageKey), 'Early theme initializer must read the preference object.');
assert(themeInitSource.includes('blackpine-theme'), 'Legacy theme compatibility must be preserved during localization migration.');

const homeHtml = await built('index.html');
for (const marker of ['data-language-menu', 'data-preferences-open', 'data-preferences-dialog', 'data-locale="en-CA"', 'data-translation-key="home"']) {
  assert(homeHtml.includes(marker), `Generated home page missing localization marker ${marker}.`);
}
assert(!homeHtml.includes('Accept all cookies'), 'Localization must not introduce a fake accept-all cookie banner.');
assert(homeHtml.includes('href="/fr/"') && homeHtml.includes('hreflang="fr-CA"'), 'English home must expose the reviewed French counterpart.');
assert(homeHtml.includes('href="/es/"') && homeHtml.includes('hreflang="es"'), 'English home must expose the reviewed Spanish counterpart.');

const esHome = await built('es/index.html');
assert(esHome.includes('<html lang="es"'), 'Spanish home must declare html lang=es.');
assert(esHome.includes('data-locale="es"'), 'Spanish home localization metadata is incorrect.');
assert(esHome.includes('data-translation-key="home"'), 'Spanish home translation identity is incorrect.');
assert(esHome.includes('hreflang="en-CA"') && esHome.includes('hreflang="fr-CA"') && esHome.includes('hreflang="es"') && esHome.includes('hreflang="x-default"'), 'Spanish home must expose reciprocal EN/FR/ES/x-default alternates.');

const frPrivacy = await built('fr/legal/privacy/index.html');
assert(frPrivacy.includes('<html lang="fr-CA"'), 'French privacy page lost fr-CA document language.');
assert(frPrivacy.includes('hreflang="en-CA"'), 'French privacy page lost en-CA alternate.');
assert(frPrivacy.includes('hreflang="fr-CA"'), 'French privacy page lost fr-CA alternate.');
assert(frPrivacy.includes('hreflang="x-default"'), 'French privacy page lost x-default alternate.');
assert(frPrivacy.includes('data-locale="fr-CA"'), 'French privacy page localization metadata is incorrect.');
assert(frPrivacy.includes('href="/legal/privacy/"') && frPrivacy.includes('data-language-choice'), 'French Privacy top-bar selector must link back to the English equivalent.');
assert(!frPrivacy.includes('href="/es/legal/privacy/"'), 'French Privacy page must not invent a Spanish counterpart.');
assert(frPrivacy.includes('La traduction de cette page n’est pas encore publiée') || frPrivacy.includes('Translation not published for this page yet'), 'French Privacy language selector must explain unavailable Spanish legal translation state.');

const compactLegalScript = await source('scripts/compact-lawyer-legal-preferences.mjs');
assert(compactLegalScript.includes('Legal main content changed while compacting preferences chrome'), 'Legal preference compaction must guard the approved legal main body against modification.');
assert(compactLegalScript.includes("'/legal/privacy/'") && compactLegalScript.includes("'/fr/legal/privacy/'"), 'Legal preference compaction must cover both EN/FR Privacy routes.');

const buildFiles = await fs.readdir(new URL('./build/', dist));
assert(buildFiles.some(name => /^preferences\.[a-f0-9]{12}\.js$/.test(name)), 'Fingerprinted preference runtime was not emitted.');
assert(buildFiles.some(name => /^styles\.[a-f0-9]{12}\.css$/.test(name)), 'Fingerprinted stylesheet was not emitted.');

const esPath = new URL('./es/', dist);
const esExists = await fs.stat(esPath).then(() => true).catch(() => false);
assert(esExists, 'Reviewed Phase 3 Spanish release did not generate an /es/ directory.');
const esLegalPrivacyExists = await fs.stat(new URL('./es/legal/privacy/index.html', dist)).then(() => true).catch(() => false);
const esLegalTermsExists = await fs.stat(new URL('./es/legal/terms/index.html', dist)).then(() => true).catch(() => false);
assert(!esLegalPrivacyExists && !esLegalTermsExists, 'Spanish lawyer-approved Terms/Privacy must remain absent until separately approved.');

if (errors.length) {
  console.error(`Localization foundation check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Localization foundation check passed: ${englishRoutes.length} English routes, ${frenchRoutes.length} French routes, ${spanishRoutes.length} reviewed Spanish routes, EN/FR-only lawyer legal availability, server-rendered network-free preferences, and reciprocal Spanish locale metadata.`);