import fs from 'node:fs/promises';

const pages = [
  { file: 'dist/legal/privacy/index.html', path: '/legal/privacy/', locale: 'en-CA' },
  { file: 'dist/legal/terms/index.html', path: '/legal/terms/', locale: 'en-CA' },
  { file: 'dist/fr/legal/privacy/index.html', path: '/fr/legal/privacy/', locale: 'fr-CA' },
  { file: 'dist/fr/legal/terms/index.html', path: '/fr/legal/terms/', locale: 'fr-CA' }
];

const copy = {
  'en-CA': { title: 'Preferences', local: 'Stored locally.', language: 'Language', theme: 'Theme', dark: 'Dark', light: 'Light', clear: 'Clear', close: 'Close', save: 'Save' },
  'fr-CA': { title: 'Préférences', local: 'Enregistrées localement.', language: 'Langue', theme: 'Thème', dark: 'Sombre', light: 'Clair', clear: 'Effacer', close: 'Fermer', save: 'Enregistrer' }
};

const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function compactDialog(path, locale) {
  const text = copy[locale];
  const basePath = path.startsWith('/fr/') ? path.slice(3) : path;
  const englishTarget = basePath;
  const frenchTarget = `/fr${basePath}`;
  const englishSelected = locale === 'en-CA' ? ' selected' : '';
  const frenchSelected = locale === 'fr-CA' ? ' selected' : '';
  return `<dialog class="preferences-dialog" data-preferences-dialog aria-labelledby="preferences-title"><form class="preferences-form" data-preferences-form><h2 id="preferences-title">${esc(text.title)}</h2><p>${esc(text.local)}</p><label>${esc(text.language)}<select name="preferred-language"><option value="en-CA" data-target="${esc(englishTarget)}"${englishSelected}>English</option><option value="fr-CA" data-target="${esc(frenchTarget)}"${frenchSelected}>Français</option><option value="es" data-target="">Español</option></select></label><label>${esc(text.theme)}<select name="preferred-theme"><option value="auto" selected>Auto</option><option value="dark">${esc(text.dark)}</option><option value="light">${esc(text.light)}</option></select></label><p data-preferences-status role="status" aria-live="polite"></p><button type="button" data-preferences-clear>${esc(text.clear)}</button><button type="button" data-preferences-close>${esc(text.close)}</button><button type="submit">${esc(text.save)}</button></form></dialog>`;
}

for (const page of pages) {
  let html = await fs.readFile(page.file, 'utf8');
  const mainBefore = html.match(/<main id="main">[\s\S]*?<\/main>/)?.[0];
  if (!mainBefore) throw new Error(`Unable to locate legal main content in ${page.file}`);

  const dialogs = html.match(/<dialog class="preferences-dialog"[\s\S]*?<\/dialog>/g) || [];
  if (dialogs.length !== 1) throw new Error(`Expected exactly one preferences dialog in ${page.file}; found ${dialogs.length}`);
  html = html.replace(dialogs[0], compactDialog(page.path, page.locale));

  const searchTrigger = html.match(/<button class="search-trigger"[\s\S]*?<\/button>/)?.[0];
  if (!searchTrigger) throw new Error(`Unable to locate search trigger in ${page.file}`);
  html = html.replace(searchTrigger, '');

  const searchOverlay = html.match(/\s*<div class="search-overlay"[\s\S]*?<\/div>\s*(?=<main id="main">)/)?.[0];
  if (!searchOverlay) throw new Error(`Unable to locate search overlay in ${page.file}`);
  html = html.replace(searchOverlay, '\n  ');

  const mainAfter = html.match(/<main id="main">[\s\S]*?<\/main>/)?.[0];
  if (mainAfter !== mainBefore) throw new Error(`Legal main content changed while compacting preferences chrome in ${page.file}`);
  await fs.writeFile(page.file, html);
}

console.log('Compacted non-legal chrome on four lawyer-controlled legal pages without changing legal main content.');
