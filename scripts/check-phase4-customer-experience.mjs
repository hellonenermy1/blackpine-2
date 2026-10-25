import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const source = path => fs.readFile(new URL(path, root), 'utf8');
const built = path => fs.readFile(new URL(path, dist), 'utf8');

const [preferencesJs, layoutSource, baseCss, componentsCss, responsiveCss, preferencesCss] = await Promise.all([
  source('src/preferences.js'),
  source('src/layout.mjs'),
  source('src/styles/base.css'),
  source('src/styles/components.css'),
  source('src/styles/responsive.css'),
  source('src/styles/preferences.css')
]);

assert(!preferencesJs.includes('navigator.languages') && !preferencesJs.includes('navigator.language'), 'Preferences must not infer a visitor language before an explicit choice.');
assert(!preferencesJs.includes('firstVisitPromptAllowed') && !preferencesJs.includes('firstVisit: true'), 'Preferences must not auto-open on first visit.');
assert(preferencesJs.includes("new Set(['en-CA', 'fr-CA', 'es'])"), 'Preference locale allowlist changed unexpectedly.');
assert(preferencesJs.includes("const storageKey = 'blackpine.preferences.v1'"), 'Versioned first-party preference storage key is missing.');
for (const forbidden of ['fetch(', 'sendBeacon', 'XMLHttpRequest', 'WebSocket(', 'document.cookie', 'randomUUID', 'indexedDB']) {
  assert(!preferencesJs.includes(forbidden), `Preference runtime introduced prohibited network/tracking primitive: ${forbidden}`);
}

for (const marker of [
  'Language & appearance',
  'Blackpine stores only your language and theme in this browser.',
  'No unique preference identifier is created or sent to Blackpine.',
  'Langue et apparence',
  'Aucun identifiant unique de préférence n’est créé ni transmis à Blackpine.',
  'Idioma y apariencia',
  'No se crea ni se envía a Blackpine ningún identificador único de preferencias.'
]) {
  assert(layoutSource.includes(marker), `Reviewed preference copy is missing: ${marker}`);
}
assert(!layoutSource.includes('advertising networks, third-party analytics, a third-party tag manager'), 'Preferences dialog has regressed to implementation-inventory copy.');

assert(baseCss.includes(':focus-visible'), 'Global focus-visible treatment is missing.');
assert(responsiveCss.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced-motion override is missing.');
assert(responsiveCss.includes('scroll-behavior: auto'), 'Reduced-motion mode must disable smooth scrolling.');
assert(/\.prose a\s*\{[^}]*overflow-wrap:\s*anywhere/.test(componentsCss), 'Long prose links must wrap instead of causing narrow-screen overflow.');
assert(/\.preferences-dialog\s*\{[^}]*calc\(100% - 32px\)/.test(preferencesCss), 'Preference dialog must retain viewport-safe width constraints.');

for (const [path, locale, title] of [
  ['index.html', 'en-CA', 'Language &amp; appearance'],
  ['fr/index.html', 'fr-CA', 'Langue et apparence'],
  ['es/index.html', 'es', 'Idioma y apariencia']
]) {
  const html = await built(path);
  assert(html.includes(`data-locale="${locale}"`), `${path} locale marker is missing.`);
  assert(html.includes('data-preferences-dialog'), `${path} is missing the preference dialog.`);
  assert(html.includes(title), `${path} is missing reviewed preference heading ${title}.`);
  assert(!html.includes('Accept all cookies'), `${path} introduced fake cookie-consent UI.`);
}

if (errors.length) {
  console.error(`Phase 4 customer-experience checks failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Phase 4 customer-experience checks passed: user-invoked network-free preferences, concise EN/FR/ES copy, focus/reduced-motion foundations, viewport-safe dialog sizing, and long-link wrapping are enforced.');