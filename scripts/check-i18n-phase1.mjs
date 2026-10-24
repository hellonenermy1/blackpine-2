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

const englishRoutes = decorated.filter(route => route.locale === 'en-CA').map(route => route.path).sort();
const frenchRoutes = decorated.filter(route => route.locale === 'fr-CA').map(route => route.path).sort();
const spanishRoutes = decorated.filter(route => route.locale === 'es').map(route => route.path).sort();
assert(englishRoutes.length > 0, 'English route set is unexpectedly empty.');
assert(frenchRoutes.length > 0, 'French route set is unexpectedly empty after Phase 2 publication.');
assert(spanishRoutes.length === 0, `Spanish routes must not publish before translation review. Found: ${spanishRoutes.join(', ')}`);

for (const path of ['/legal/privacy/', '/legal/terms/', '/fr/legal/privacy/', '/fr/legal/terms/']) {
  const route = decorated.find(item => item.path === path);
  assert(route, `Missing legal route ${path}`);
  if (!route) continue;
  const options = languageOptionsForRoute(route, decorated);
  const en = options.find(option => option.id === 'en-CA');
  const fr = options.find(option => option.id === 'fr-CA');
  const es = options.find(option => option.id === 'es');
  assert(en?.available && fr?.available, `${path} must expose reciprocal EN/FR availability.`);
  assert(!es?.available, `${path} must not claim a Spanish legal translation exists.`);
  const alternates = alternateLinksForRoute(route, decorated);
  assert(alternates.some(link => link.hreflang === 'en-CA'), `${path} missing en-CA alternate.`);
  assert(alternates.some(link => link.hreflang === 'fr-CA'), `${path} missing fr-CA alternate.`);
  assert(alternates.some(link => link.hreflang === 'x-default'), `${path} missing x-default alternate.`);
}

const home = decorated.find(route => route.path === '/');
const homeOptions = languageOptionsForRoute(home, decorated);
assert(homeOptions.find(option => option.id === 'en-CA')?.available, 'English home route must be available.');
assert(homeOptions.find(option => option.id === 'fr-CA')?.available, 'French home route must be available after Phase 2 publication.');
assert(!homeOptions.find(option => option.id === 'es')?.available, 'Spanish home must remain unavailable until a reviewed Spanish release publishes it.');

const preferencesSource = await source('src/preferences.js');
for (const forbidden of ['fetch(', 'sendBeacon', 'XMLHttpRequest', 'WebSocket(', 'document.cookie', 'randomUUID', 'indexedDB']) {
  assert(!preferencesSource.includes(forbidden), `Preference runtime must not use tracking/network primitive: ${forbidden}`);
}
assert(preferencesSource.includes(preferenceStorageKey), 'Preference runtime is not using the versioned first-party storage key.');
assert(preferencesSource.includes("new Set(['en-CA', 'fr-CA', 'es'])"), 'Preference runtime locale allowlist is missing or changed.');
assert(!/Date\.|Date\(|performance\.now|Math\.random/.test(preferencesSource), 'Preference runtime must not create timestamps or random identifiers.');
assert(preferencesSource.includes("make('dialog', 'preferences-dialog')"), 'Preference dialog must be constructed safely at runtime.');
assert(!/innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\s*\(|new Function/.test(preferencesSource), 'Preference runtime must not use dynamic HTML/eval sinks.');
assert(preferencesSource.includes('Language & privacy preferences'), 'Preference runtime is missing its English accessible dialog heading.');
assert(preferencesSource.includes('No unique preference identifier is created or transmitted to Blackpine.'), 'Preference runtime must disclose that it creates no tracking identifier.');
assert(preferencesSource.includes('third-party analytics') && preferencesSource.includes('social-media tracking widgets'), 'Preference disclosure must match the published tracking baseline.');

const themeInitSource = await source('src/theme-init.js');
assert(themeInitSource.includes(preferenceStorageKey), 'Early theme initializer must read the preference object.');
assert(themeInitSource.includes('blackpine-theme'), 'Legacy theme compatibility must be preserved during localization migration.');

const homeHtml = await built('index.html');
for (const marker of ['data-language-menu', 'data-preferences-open', 'data-locale="en-CA"', 'data-translation-key="home"']) {
  assert(homeHtml.includes(marker), `Generated home page missing localization marker ${marker}.`);
}
assert(!homeHtml.includes('data-preferences-dialog'), 'Full preference dialog should not be duplicated into every static HTML page.');
assert(!homeHtml.includes('Accept all cookies'), 'Localization must not introduce a fake accept-all cookie banner.');
assert(homeHtml.includes('href="/fr/"') && homeHtml.includes('hreflang="fr-CA"'), 'English home must expose the reviewed French counterpart.');
assert(homeHtml.includes('Translation not published for this page yet'), 'Unavailable Spanish state is not explained in the language selector.');

const frPrivacy = await built('fr/legal/privacy/index.html');
assert(frPrivacy.includes('<html lang="fr-CA"'), 'French privacy page lost fr-CA document language.');
assert(frPrivacy.includes('hreflang="en-CA"'), 'French privacy page lost en-CA alternate.');
assert(frPrivacy.includes('hreflang="fr-CA"'), 'French privacy page lost fr-CA alternate.');
assert(frPrivacy.includes('hreflang="x-default"'), 'French privacy page lost x-default alternate.');
assert(frPrivacy.includes('data-locale="fr-CA"'), 'French privacy page localization metadata is incorrect.');
assert(frPrivacy.includes('href="/legal/privacy/"') && frPrivacy.includes('data-language-choice'), 'French Privacy top-bar selector must link back to the English equivalent.');
assert(!frPrivacy.includes('href="/es/legal/privacy/"'), 'French Privacy page must not invent a Spanish counterpart.');

const buildFiles = await fs.readdir(new URL('./build/', dist));
assert(buildFiles.some(name => /^preferences\.[a-f0-9]{12}\.js$/.test(name)), 'Fingerprinted preference runtime was not emitted.');
assert(buildFiles.some(name => /^styles\.[a-f0-9]{12}\.css$/.test(name)), 'Fingerprinted stylesheet was not emitted.');

const esPath = new URL('./es/', dist);
const esExists = await fs.stat(esPath).then(() => true).catch(() => false);
assert(!esExists, 'Localization unexpectedly generated an /es/ directory.');

if (errors.length) {
  console.error(`Localization foundation check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Localization foundation check passed: ${englishRoutes.length} English routes, ${frenchRoutes.length} French routes, 0 Spanish routes, reciprocal EN/FR legal availability, runtime-built preference dialog, and network-free preference storage.`);
