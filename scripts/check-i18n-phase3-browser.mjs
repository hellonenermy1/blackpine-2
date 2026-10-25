import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.I18N_PHASE3_BROWSER_AUDIT_PORT || 4188);
const debugPort = Number(process.env.I18N_PHASE3_CHROME_DEBUG_PORT || 9344);
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
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Runtime evaluation failed');
  return result.result?.value;
}

async function navigate(cdp, pathname) {
  await cdp.send('Page.navigate', { url: `${base}${pathname}` });
  const started = Date.now();
  while (Date.now() - started < 10000) {
    if (await evaluate(cdp, 'document.readyState') === 'complete') break;
    await sleep(50);
  }
  await sleep(220);
}

async function waitForPath(cdp, pathname, timeout = 8000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(cdp, 'location.pathname') === pathname) return true;
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
  console.error('ERROR: Chrome/Chromium binary not found for Phase 3 localization browser audit.');
  process.exit(1);
}

const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'blackpine-i18n-phase3-browser-'));
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
  const missingPrivacy = await fetch(`${base}/es/legal/privacy/`);
  const missingTerms = await fetch(`${base}/es/legal/terms/`);
  if (missingPrivacy.status !== 404 || missingTerms.status !== 404) errors.push(`Spanish lawyer legal routes must return 404; privacy=${missingPrivacy.status}, terms=${missingTerms.status}.`);

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

  await navigate(cdp, '/');
  await evaluate(cdp, `localStorage.clear()`);
  await navigate(cdp, '/?preferences-test=1');
  const englishPrompt = await evaluate(cdp, `({
    open: Boolean(document.querySelector('[data-preferences-dialog]')?.open),
    esTarget: document.querySelector('input[name="preferred-language"][value="es"]')?.dataset.target,
    frTarget: document.querySelector('input[name="preferred-language"][value="fr-CA"]')?.dataset.target
  })`);
  if (!englishPrompt.open || englishPrompt.esTarget !== '/es/' || englishPrompt.frTarget !== '/fr/') errors.push(`English preference dialog does not expose reviewed Spanish/French homes: ${JSON.stringify(englishPrompt)}`);

  await evaluate(cdp, `(() => {
    document.querySelector('input[name="preferred-language"][value="es"]').checked = true;
    document.querySelector('input[name="preferred-theme"][value="dark"]').checked = true;
    document.querySelector('[data-preferences-form]').requestSubmit();
  })()`);
  if (!await waitForPath(cdp, '/es/')) errors.push('saving Spanish on English home did not navigate to /es/.');

  const spanishHome = await evaluate(cdp, `({
    path: location.pathname,
    lang: document.documentElement.lang,
    locale: document.body.dataset.locale,
    key: document.body.dataset.translationKey,
    saved: JSON.parse(localStorage.getItem('blackpine.preferences.v1')),
    theme: document.documentElement.dataset.theme,
    skip: document.querySelector('.skip-link')?.textContent.trim(),
    primary: document.querySelector('#primary-nav')?.getAttribute('aria-label'),
    search: document.querySelector('#site-search-title')?.textContent.trim(),
    contactHref: document.querySelector('.header-contact')?.getAttribute('href'),
    trustHref: [...document.querySelectorAll('.site-footer a')].find(a => a.textContent.trim() === 'Centro de confianza')?.getAttribute('href'),
    englishHref: document.querySelector('a[data-language-choice][data-locale="en-CA"]')?.getAttribute('href'),
    frenchHref: document.querySelector('a[data-language-choice][data-locale="fr-CA"]')?.getAttribute('href'),
    currentEs: Boolean(document.querySelector('.language-option[aria-current="page"][data-locale="es"]')),
    prefsTitle: document.querySelector('#preferences-title')?.textContent.trim()
  })`);
  if (spanishHome.path !== '/es/' || spanishHome.lang !== 'es' || spanishHome.locale !== 'es' || spanishHome.key !== 'home' || spanishHome.saved?.locale !== 'es' || spanishHome.saved?.theme !== 'dark' || spanishHome.theme !== 'dark' || spanishHome.skip !== 'Ir al contenido' || spanishHome.primary !== 'Navegación principal' || spanishHome.search !== 'Buscar en el sitio público' || spanishHome.contactHref !== '/es/contact/' || spanishHome.trustHref !== '/es/trust/' || spanishHome.englishHref !== '/' || spanishHome.frenchHref !== '/fr/' || !spanishHome.currentEs || spanishHome.prefsTitle !== 'Preferencias de idioma y privacidad') {
    errors.push(`Spanish home/chrome state failed: ${JSON.stringify(spanishHome)}`);
  }

  await navigate(cdp, '/es/search/?q=ransomware');
  await waitForCondition(cdp, `document.querySelectorAll('[data-search-page-results] a.search-result').length > 0`);
  const spanishSearch = await evaluate(cdp, `({
    count: document.querySelectorAll('[data-search-page-results] a.search-result').length,
    hrefs: [...document.querySelectorAll('[data-search-page-results] a.search-result')].map(a => a.getAttribute('href')),
    families: [...document.querySelectorAll('[data-search-page-results] .search-result-family')].map(n => n.textContent.trim())
  })`);
  if (!spanishSearch.count || spanishSearch.hrefs.some(href => !href?.startsWith('/es/')) || spanishSearch.families.some(label => ['Capabilities', 'Work', 'Trust', 'Company', 'Expertises', 'Réalisations', 'Confiance', 'Entreprise'].includes(label))) {
    errors.push(`Spanish locale-pure search failed: ${JSON.stringify(spanishSearch)}`);
  }

  await navigate(cdp, '/es/contact/?intent=emergency-response');
  const spanishContact = await evaluate(cdp, `({
    intent: document.querySelector('#intent')?.value,
    note: document.querySelector('[data-contact-intent-note]')?.textContent.trim(),
    compose: document.querySelector('[data-contact-compose-button]')?.textContent.trim()
  })`);
  if (spanishContact.intent !== 'emergency-response' || !/buzón|dispositivo habitual/.test(spanishContact.note || '') || /Compose inquiry email|Composer le courriel/i.test(spanishContact.compose || '')) {
    errors.push(`Spanish contact dynamic guidance failed: ${JSON.stringify(spanishContact)}`);
  }

  await navigate(cdp, '/es/suspicious-login-not-found/');
  await waitForCondition(cdp, `document.querySelectorAll('[data-404-suggestions] a.search-result').length > 0`);
  const spanish404 = await evaluate(cdp, `({
    lang: document.documentElement.lang,
    locale: document.body.dataset.locale,
    heading: document.querySelector('[data-404-suggestions] .minor-heading')?.textContent.trim(),
    family: document.querySelector('[data-404-suggestions] .search-result-family')?.textContent.trim(),
    hrefs: [...document.querySelectorAll('[data-404-suggestions] a')].map(a => a.getAttribute('href')),
    text: document.querySelector('[data-404-suggestions]')?.textContent || ''
  })`);
  if (spanish404.lang !== 'es' || spanish404.locale !== 'es' || spanish404.heading !== 'Quizá esté buscando' || spanish404.family !== 'Ruta sugerida' || spanish404.hrefs.some(href => href && !href.startsWith('/es/')) || !spanish404.text.includes('Investigar con Blackpine')) {
    errors.push(`Spanish smart 404 failed: ${JSON.stringify(spanish404)}`);
  }

  await navigate(cdp, '/es/tools/security-headers/');
  const toolSetup = await evaluate(cdp, `(() => {
    const input = document.querySelector('[data-headers-input]');
    const run = document.querySelector('[data-headers-run]');
    if (!input || !run) return false;
    input.value = ["Content-Security-Policy: default-src 'self'", 'X-Content-Type-Options: nosniff'].join(String.fromCharCode(10));
    run.click();
    return true;
  })()`);
  if (!toolSetup) errors.push('Spanish security-header tool controls are missing.');
  const spanishTool = await evaluate(cdp, `document.querySelector('[data-headers-output]')?.textContent || ''`);
  if (!/Presente/.test(spanishTool) || !/No se encontró ninguna cabecera Strict-Transport-Security/.test(spanishTool)) errors.push(`Spanish tool runtime copy failed: ${spanishTool.slice(0, 500)}`);

  await navigate(cdp, '/es/research/');
  const researchStatus = await evaluate(cdp, `document.querySelector('.filter-status')?.textContent || ''`);
  if (!/publicación.*mostrada/.test(researchStatus)) errors.push(`Spanish research-filter status failed: ${researchStatus}`);

  await navigate(cdp, '/fr/legal/privacy/');
  await evaluate(cdp, `document.querySelector('.footer-preferences').click()`);
  const compactFr = await evaluate(cdp, `({
    path: location.pathname,
    lang: document.documentElement.lang,
    open: Boolean(document.querySelector('[data-preferences-dialog]')?.open),
    languageTag: document.querySelector('[name="preferred-language"]')?.tagName,
    language: document.querySelector('select[name="preferred-language"]')?.value,
    esTarget: document.querySelector('select[name="preferred-language"] option[value="es"]')?.dataset.target
  })`);
  if (compactFr.path !== '/fr/legal/privacy/' || compactFr.lang !== 'fr-CA' || !compactFr.open || compactFr.languageTag !== 'SELECT' || compactFr.language !== 'es' || compactFr.esTarget !== '') errors.push(`French compact legal preferences failed to preserve the saved unavailable Spanish preference safely: ${JSON.stringify(compactFr)}`);
  await evaluate(cdp, `(() => {
    const language = document.querySelector('select[name="preferred-language"]');
    language.value = 'en-CA';
    document.querySelector('[data-preferences-form]').requestSubmit();
  })()`);
  if (!await waitForPath(cdp, '/legal/privacy/')) errors.push('compact legal preference switch FR→EN did not navigate to English Privacy.');
  const compactEn = await evaluate(cdp, `({
    lang: document.documentElement.lang,
    language: document.querySelector('select[name="preferred-language"]')?.value,
    esTarget: document.querySelector('select[name="preferred-language"] option[value="es"]')?.dataset.target
  })`);
  if (compactEn.lang !== 'en-CA' || compactEn.language !== 'en-CA' || compactEn.esTarget) errors.push(`English compact legal preferences failed: ${JSON.stringify(compactEn)}`);

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

console.log('Phase 3 Spanish browser audit passed: EN→ES preference navigation, Spanish shared chrome, reciprocal language switching, locale-pure Spanish search, Spanish contact/404/tool/research runtime states, Spanish lawyer legal 404 boundaries, saved unavailable-locale handling, and functional compact EN↔FR legal preferences.');