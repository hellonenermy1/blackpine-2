import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.I18N_BROWSER_AUDIT_PORT || 4187);
const debugPort = Number(process.env.I18N_CHROME_DEBUG_PORT || 9343);
const base = `http://${host}:${port}`;
const errors = [];
const browserExceptions = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function findBinary(candidates) {
  for (const name of candidates) {
    const result = spawnSync('which', [name], { encoding: 'utf8' });
    if (result.status === 0 && result.stdout.trim()) return result.stdout.trim();
  }
  return null;
}

async function waitFor(url, timeout = 45000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      lastError = new Error(`${url} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(150);
  }
  throw lastError || new Error(`Timed out waiting for ${url}`);
}

class CDP {
  constructor(url) {
    this.url = url;
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timed out connecting to Chrome DevTools')), 10000);
      this.ws.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
      this.ws.addEventListener('error', event => { clearTimeout(timer); reject(event.error || new Error('Chrome DevTools WebSocket error')); }, { once: true });
    });
    this.ws.addEventListener('message', event => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
        else pending.resolve(message.result || {});
        return;
      }
      if (message.method === 'Runtime.exceptionThrown') {
        const detail = message.params?.exceptionDetails;
        browserExceptions.push(detail?.exception?.description || detail?.text || 'Unknown browser exception');
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (!this.pending.has(id)) return;
        this.pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, 10000);
    });
  }

  close() { this.ws?.close(); }
}

async function evaluate(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Runtime evaluation failed');
  return result.result?.value;
}

async function navigate(cdp, pathname) {
  await cdp.send('Page.navigate', { url: `${base}${pathname}` });
  const started = Date.now();
  while (Date.now() - started < 10000) {
    const ready = await evaluate(cdp, 'document.readyState');
    if (ready === 'complete') break;
    await sleep(50);
  }
  await sleep(220);
}

async function waitForPath(cdp, pathname, timeout = 8000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(cdp, 'window.location.pathname') === pathname) return true;
    await sleep(80);
  }
  return false;
}

async function waitForCondition(cdp, expression, timeout = 5000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(cdp, expression)) return true;
    await sleep(80);
  }
  return false;
}

const chrome = findBinary(['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']);
if (!chrome) {
  console.error('ERROR: Chrome/Chromium binary not found for localization browser audit.');
  process.exit(1);
}

const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'blackpine-i18n-browser-'));
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  cwd: new URL('../', import.meta.url),
  env: { ...process.env, HOST: host, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});
let chromeProcess;
let cdp;
let chromeStderr = '';

try {
  await waitFor(`${base}/`);
  chromeProcess = spawn(chrome, [
    '--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking', '--disable-default-apps',
    '--disable-extensions', '--disable-sync', '--disable-gpu', '--metrics-recording-only', '--no-first-run',
    `--remote-debugging-address=${host}`, `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, 'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  chromeProcess.stderr?.on('data', chunk => { chromeStderr += String(chunk); });
  try {
    await waitFor(`http://${host}:${debugPort}/json/version`);
  } catch (error) {
    throw new Error(`Chrome DevTools endpoint did not become ready: ${error.message}${chromeStderr ? `\n${chromeStderr.slice(-4000)}` : ''}`);
  }

  const targetResponse = await fetch(`http://${host}:${debugPort}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' });
  if (!targetResponse.ok) throw new Error(`Unable to create Chrome target: ${targetResponse.status}`);
  const target = await targetResponse.json();
  cdp = new CDP(target.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  await navigate(cdp, '/?preferences-test=1');
  const firstVisit = await evaluate(cdp, `({
    open: Boolean(document.querySelector('[data-preferences-dialog]')?.open),
    firstVisit: document.querySelector('[data-preferences-dialog]')?.dataset.firstVisit,
    locale: document.body.dataset.locale,
    key: document.body.dataset.translationKey,
    frTarget: document.querySelector('input[name="preferred-language"][value="fr-CA"]')?.dataset.target
  })`);
  if (!firstVisit.open || firstVisit.firstVisit !== 'true' || firstVisit.locale !== 'en-CA' || firstVisit.key !== 'home' || firstVisit.frTarget !== '/fr/') {
    errors.push(`first-visit bilingual dialog state failed: ${JSON.stringify(firstVisit)}`);
  }

  await evaluate(cdp, `(() => {
    document.querySelector('input[name="preferred-language"][value="fr-CA"]').checked = true;
    document.querySelector('input[name="preferred-theme"][value="dark"]').checked = true;
    document.querySelector('[data-preferences-form]').requestSubmit();
  })()`);
  if (!await waitForPath(cdp, '/fr/')) errors.push('saving French on English home did not navigate to the reviewed French home.');
  const frenchHome = await evaluate(cdp, `({
    path: location.pathname,
    lang: document.documentElement.lang,
    locale: document.body.dataset.locale,
    saved: JSON.parse(localStorage.getItem('blackpine.preferences.v1')),
    theme: document.documentElement.dataset.theme,
    skip: document.querySelector('.skip-link')?.textContent.trim(),
    primary: document.querySelector('#primary-nav')?.getAttribute('aria-label'),
    search: document.querySelector('#site-search-title')?.textContent.trim(),
    contactHref: document.querySelector('.header-contact')?.getAttribute('href'),
    trustHref: [...document.querySelectorAll('.site-footer a')].find(a => a.textContent.trim() === 'Centre de confiance')?.getAttribute('href'),
    englishHref: document.querySelector('a[data-language-choice][data-locale="en-CA"]')?.getAttribute('href'),
    spanishLink: Boolean(document.querySelector('a[data-language-choice][data-locale="es"]')),
    prefsTitle: document.querySelector('#preferences-title')?.textContent.trim()
  })`);
  if (frenchHome.path !== '/fr/' || frenchHome.lang !== 'fr-CA' || frenchHome.locale !== 'fr-CA' || frenchHome.saved?.locale !== 'fr-CA' || frenchHome.saved?.theme !== 'dark' || frenchHome.theme !== 'dark' || frenchHome.skip !== 'Aller au contenu' || frenchHome.primary !== 'Navigation principale' || frenchHome.search !== 'Rechercher sur le site public' || frenchHome.contactHref !== '/fr/contact/' || frenchHome.trustHref !== '/fr/trust/' || frenchHome.englishHref !== '/' || frenchHome.spanishLink || frenchHome.prefsTitle !== 'Préférences de langue et de confidentialité') {
    errors.push(`French home/chrome state failed: ${JSON.stringify(frenchHome)}`);
  }

  await navigate(cdp, '/');
  const explicitEnglish = await evaluate(cdp, `({
    path: location.pathname,
    locale: document.body.dataset.locale,
    dialogOpen: Boolean(document.querySelector('[data-preferences-dialog]')?.open),
    savedLocale: JSON.parse(localStorage.getItem('blackpine.preferences.v1')).locale
  })`);
  if (explicitEnglish.path !== '/' || explicitEnglish.locale !== 'en-CA' || explicitEnglish.dialogOpen || explicitEnglish.savedLocale !== 'fr-CA') {
    errors.push(`explicit English URL precedence failed: ${JSON.stringify(explicitEnglish)}`);
  }

  await evaluate(cdp, `document.querySelector('.footer-preferences').click()`);
  await sleep(60);
  const reopened = await evaluate(cdp, `Boolean(document.querySelector('[data-preferences-dialog]')?.open)`);
  if (!reopened) errors.push('footer Privacy preferences control did not reopen the dialog.');
  await evaluate(cdp, `document.querySelector('[data-preferences-clear]').click()`);
  const cleared = await evaluate(cdp, `({ prefs: localStorage.getItem('blackpine.preferences.v1'), legacy: localStorage.getItem('blackpine-theme'), theme: document.documentElement.dataset.theme })`);
  if (cleared.prefs !== null || cleared.legacy !== null || cleared.theme !== 'auto') errors.push(`clear preferences failed: ${JSON.stringify(cleared)}`);
  await evaluate(cdp, `document.querySelector('[data-preferences-close]').click()`);

  await navigate(cdp, '/fr/?preferences-test=1');
  const frenchPrompt = await evaluate(cdp, `({
    open: Boolean(document.querySelector('[data-preferences-dialog]')?.open),
    title: document.querySelector('#preferences-title')?.textContent.trim(),
    privacy: document.querySelector('.preferences-privacy')?.textContent.trim(),
    englishTarget: document.querySelector('input[name="preferred-language"][value="en-CA"]')?.dataset.target,
    spanishTarget: document.querySelector('input[name="preferred-language"][value="es"]')?.dataset.target
  })`);
  if (!frenchPrompt.open || frenchPrompt.title !== 'Préférences de langue et de confidentialité' || !/Protection de la vie privée par défaut/.test(frenchPrompt.privacy || '') || frenchPrompt.englishTarget !== '/' || frenchPrompt.spanishTarget) {
    errors.push(`French preferences dialog failed: ${JSON.stringify(frenchPrompt)}`);
  }
  await evaluate(cdp, `document.querySelector('[data-preferences-close]').click()`);

  await navigate(cdp, '/fr/legal/privacy/');
  const frenchLegal = await evaluate(cdp, `({
    lang: document.documentElement.lang,
    currentFr: Boolean(document.querySelector('.language-option[aria-current="page"][data-locale="fr-CA"]')),
    englishHref: document.querySelector('a[data-language-choice][data-locale="en-CA"]')?.getAttribute('href'),
    legalEnglishHref: document.querySelector('#legal-language a[hreflang="en-CA"]')?.getAttribute('href')
  })`);
  if (frenchLegal.lang !== 'fr-CA' || !frenchLegal.currentFr || frenchLegal.englishHref !== '/legal/privacy/' || frenchLegal.legalEnglishHref !== '/legal/privacy/') {
    errors.push(`French legal counterpart state failed: ${JSON.stringify(frenchLegal)}`);
  }

  await navigate(cdp, '/fr/search/?q=rançongiciel');
  await waitForCondition(cdp, `document.querySelectorAll('[data-search-page-results] a.search-result').length > 0`);
  const frenchSearch = await evaluate(cdp, `({
    count: document.querySelectorAll('[data-search-page-results] a.search-result').length,
    hrefs: [...document.querySelectorAll('[data-search-page-results] a.search-result')].map(a => a.getAttribute('href')),
    families: [...document.querySelectorAll('[data-search-page-results] .search-result-family')].map(n => n.textContent.trim()),
    text: document.querySelector('[data-search-page-results]')?.textContent || ''
  })`);
  if (!frenchSearch.count || frenchSearch.hrefs.some(href => !href?.startsWith('/fr/')) || frenchSearch.families.some(label => ['Capabilities', 'Work', 'Trust', 'Company', 'Legal'].includes(label))) {
    errors.push(`French locale-pure search failed: ${JSON.stringify(frenchSearch)}`);
  }

  await navigate(cdp, '/fr/contact/?intent=emergency-response');
  const frenchContact = await evaluate(cdp, `({
    intent: document.querySelector('#intent')?.value,
    note: document.querySelector('[data-contact-intent-note]')?.textContent.trim(),
    compose: document.querySelector('[data-contact-compose-button]')?.textContent.trim()
  })`);
  if (frenchContact.intent !== 'emergency-response' || !/boîte de courriel|appareil habituel/.test(frenchContact.note || '') || /Compose inquiry email/i.test(frenchContact.compose || '')) {
    errors.push(`French contact dynamic guidance failed: ${JSON.stringify(frenchContact)}`);
  }

  await navigate(cdp, '/fr/suspicious-login-not-found/');
  await waitForCondition(cdp, `document.querySelectorAll('[data-404-suggestions] a.search-result').length > 0`);
  const french404 = await evaluate(cdp, `({
    lang: document.documentElement.lang,
    locale: document.body.dataset.locale,
    heading: document.querySelector('[data-404-suggestions] .minor-heading')?.textContent.trim(),
    family: document.querySelector('[data-404-suggestions] .search-result-family')?.textContent.trim(),
    hrefs: [...document.querySelectorAll('[data-404-suggestions] a')].map(a => a.getAttribute('href')),
    text: document.querySelector('[data-404-suggestions]')?.textContent || ''
  })`);
  if (french404.lang !== 'fr-CA' || french404.locale !== 'fr-CA' || french404.heading !== 'Vous cherchez peut-être' || french404.family !== 'Parcours suggéré' || french404.hrefs.some(href => href?.startsWith('/services/') || href === '/') || !french404.text.includes('Enquêter avec Blackpine')) {
    errors.push(`French smart 404 failed: ${JSON.stringify(french404)}`);
  }

  await navigate(cdp, '/fr/tools/security-headers/');
  await evaluate(cdp, `(() => {
    const input = document.querySelector('[data-headers-input]');
    input.value = 'Content-Security-Policy: default-src \'self\'\\nX-Content-Type-Options: nosniff';
    document.querySelector('[data-headers-run]').click();
  })()`);
  const frenchTool = await evaluate(cdp, `document.querySelector('[data-headers-output]')?.textContent || ''`);
  if (!/Présent/.test(frenchTool) || !/Aucun en-tête Strict-Transport-Security/.test(frenchTool)) errors.push(`French tool runtime copy failed: ${frenchTool.slice(0, 500)}`);

  await navigate(cdp, '/fr/research/');
  const researchStatus = await evaluate(cdp, `document.querySelector('.filter-status')?.textContent || ''`);
  if (!/publication.*affichée/.test(researchStatus)) errors.push(`French research-filter status failed: ${researchStatus}`);

  await evaluate(cdp, `localStorage.setItem('blackpine.preferences.v1', '{bad json')`);
  await navigate(cdp, '/fr/?preferences-test=1');
  const corruptRecovery = await evaluate(cdp, `({
    open: Boolean(document.querySelector('[data-preferences-dialog]')?.open),
    page: location.pathname,
    title: document.querySelector('#preferences-title')?.textContent.trim()
  })`);
  if (!corruptRecovery.open || corruptRecovery.page !== '/fr/' || corruptRecovery.title !== 'Préférences de langue et de confidentialité') errors.push(`corrupt preference recovery failed: ${JSON.stringify(corruptRecovery)}`);

  if (browserExceptions.length) errors.push(...browserExceptions.map(error => `browser exception: ${error}`));
} catch (error) {
  errors.push(error.stack || error.message || String(error));
} finally {
  cdp?.close();
  chromeProcess?.kill('SIGTERM');
  server.kill('SIGTERM');
  await fs.rm(profile, { recursive: true, force: true }).catch(() => {});
}

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log('Localization browser audit passed: EN→FR home navigation, explicit-URL precedence, French shared chrome, French preferences, EN↔FR legal mapping, locale-pure French search, localized contact guidance, locale-aware smart 404, French tool/research runtime states, preference clearing, and corrupt-storage recovery.');
