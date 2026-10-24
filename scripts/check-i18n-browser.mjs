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
  await sleep(160);
}

async function waitForPath(cdp, pathname, timeout = 8000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(cdp, 'window.location.pathname') === pathname) return true;
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
    key: document.body.dataset.translationKey
  })`);
  if (!firstVisit.open || firstVisit.firstVisit !== 'true' || firstVisit.locale !== 'en-CA' || firstVisit.key !== 'home') {
    errors.push(`first-visit dialog state failed: ${JSON.stringify(firstVisit)}`);
  }

  await evaluate(cdp, `(() => {
    document.querySelector('input[name="preferred-language"][value="fr-CA"]').checked = true;
    document.querySelector('input[name="preferred-theme"][value="dark"]').checked = true;
    document.querySelector('[data-preferences-form]').requestSubmit();
  })()`);
  await sleep(100);
  const savedOnEnglishOnly = await evaluate(cdp, `({
    path: location.pathname,
    preferences: JSON.parse(localStorage.getItem('blackpine.preferences.v1')),
    legacyTheme: localStorage.getItem('blackpine-theme'),
    theme: document.documentElement.dataset.theme,
    dialogOpen: document.querySelector('[data-preferences-dialog]').open,
    status: document.querySelector('[data-preferences-status]').textContent
  })`);
  if (savedOnEnglishOnly.path !== '/' || savedOnEnglishOnly.preferences?.locale !== 'fr-CA' || savedOnEnglishOnly.preferences?.theme !== 'dark' || savedOnEnglishOnly.legacyTheme !== 'dark' || savedOnEnglishOnly.theme !== 'dark' || !savedOnEnglishOnly.dialogOpen || !/not yet published/i.test(savedOnEnglishOnly.status)) {
    errors.push(`saving unavailable-language preference failed: ${JSON.stringify(savedOnEnglishOnly)}`);
  }

  await evaluate(cdp, `document.querySelector('[data-preferences-close]').click()`);
  await navigate(cdp, '/');
  const returning = await evaluate(cdp, `({ open: Boolean(document.querySelector('[data-preferences-dialog]')?.open), locale: JSON.parse(localStorage.getItem('blackpine.preferences.v1')).locale })`);
  if (returning.open || returning.locale !== 'fr-CA') errors.push(`returning-user suppression failed: ${JSON.stringify(returning)}`);

  await evaluate(cdp, `document.querySelector('.footer-preferences').click()`);
  await sleep(50);
  const reopened = await evaluate(cdp, `Boolean(document.querySelector('[data-preferences-dialog]')?.open)`);
  if (!reopened) errors.push('footer Privacy preferences control did not reopen the dialog.');
  await evaluate(cdp, `document.querySelector('[data-preferences-clear]').click()`);
  const cleared = await evaluate(cdp, `({ prefs: localStorage.getItem('blackpine.preferences.v1'), legacy: localStorage.getItem('blackpine-theme'), theme: document.documentElement.dataset.theme })`);
  if (cleared.prefs !== null || cleared.legacy !== null || cleared.theme !== 'auto') errors.push(`clear preferences failed: ${JSON.stringify(cleared)}`);
  await evaluate(cdp, `document.querySelector('[data-preferences-close]').click()`);

  await navigate(cdp, '/legal/privacy/?preferences-test=1');
  const legalPrompt = await evaluate(cdp, `({ open: document.querySelector('[data-preferences-dialog]').open, frTarget: document.querySelector('input[name="preferred-language"][value="fr-CA"]').dataset.target })`);
  if (!legalPrompt.open || legalPrompt.frTarget !== '/fr/legal/privacy/') errors.push(`legal counterpart mapping failed: ${JSON.stringify(legalPrompt)}`);
  await evaluate(cdp, `(() => {
    document.querySelector('input[name="preferred-language"][value="fr-CA"]').checked = true;
    document.querySelector('input[name="preferred-theme"][value="auto"]').checked = true;
    document.querySelector('[data-preferences-form]').requestSubmit();
  })()`);
  if (!await waitForPath(cdp, '/fr/legal/privacy/')) errors.push('saving French on English Privacy did not navigate to the reviewed French counterpart.');
  const frenchPage = await evaluate(cdp, `({
    path: location.pathname,
    lang: document.documentElement.lang,
    locale: document.body.dataset.locale,
    currentFr: Boolean(document.querySelector('.language-option[aria-current="page"][data-locale="fr-CA"]')),
    englishHref: document.querySelector('a[data-language-choice][data-locale="en-CA"]')?.getAttribute('href'),
    spanishAvailableLink: Boolean(document.querySelector('a[data-language-choice][data-locale="es"]')),
    saved: JSON.parse(localStorage.getItem('blackpine.preferences.v1')).locale
  })`);
  if (frenchPage.path !== '/fr/legal/privacy/' || frenchPage.lang !== 'fr-CA' || frenchPage.locale !== 'fr-CA' || !frenchPage.currentFr || frenchPage.englishHref !== '/legal/privacy/' || frenchPage.spanishAvailableLink || frenchPage.saved !== 'fr-CA') {
    errors.push(`French legal selector state failed: ${JSON.stringify(frenchPage)}`);
  }

  await evaluate(cdp, `localStorage.setItem('blackpine.preferences.v1', '{bad json')`);
  await navigate(cdp, '/?preferences-test=1');
  const corruptRecovery = await evaluate(cdp, `({ open: Boolean(document.querySelector('[data-preferences-dialog]')?.open), page: location.pathname })`);
  if (!corruptRecovery.open || corruptRecovery.page !== '/') errors.push(`corrupt preference recovery failed: ${JSON.stringify(corruptRecovery)}`);

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

console.log('Localization browser audit passed: first-visit prompt, preference persistence, unavailable-locale handling, theme migration, clearing, reviewed EN↔FR legal navigation, selector state, and corrupt-storage recovery.');
