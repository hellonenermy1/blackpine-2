import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.I18N_PHASE4_BROWSER_AUDIT_PORT || 4192);
const debugPort = Number(process.env.I18N_PHASE4_CHROME_DEBUG_PORT || 9348);
const base = `http://${host}:${port}`;
const errors = [];
const browserExceptions = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const fail = message => errors.push(message);

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

async function navigate(cdp, pathname, settle = 220) {
  await cdp.send('Page.navigate', { url: `${base}${pathname}` });
  const started = Date.now();
  while (Date.now() - started < 10000) {
    if (await evaluate(cdp, 'document.readyState') === 'complete') break;
    await sleep(50);
  }
  await sleep(settle);
}

async function waitForPath(cdp, pathname, timeout = 8000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(cdp, 'location.pathname') === pathname) return true;
    await sleep(80);
  }
  return false;
}

async function pressKey(cdp, key, code = key) {
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code });
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code });
  await sleep(80);
}

async function domNode(cdp, rootId, selector) {
  const result = await cdp.send('DOM.querySelector', { nodeId: rootId, selector });
  return result.nodeId || 0;
}

async function domAttributes(cdp, nodeId) {
  if (!nodeId) return {};
  const result = await cdp.send('DOM.getAttributes', { nodeId });
  const attributes = {};
  for (let index = 0; index < (result.attributes || []).length; index += 2) attributes[result.attributes[index]] = result.attributes[index + 1];
  return attributes;
}

const chrome = findBinary(['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']);
if (!chrome) {
  console.error('ERROR: Chrome/Chromium binary not found for Phase 4 localization browser audit.');
  process.exit(1);
}

const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'blackpine-i18n-phase4-browser-'));
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
    '--headless', '--incognito', '--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking', '--disable-default-apps',
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
  await cdp.send('DOM.enable');
  await cdp.send('Accessibility.enable');

  await navigate(cdp, '/');
  const incognitoStart = await evaluate(cdp, `({ saved: localStorage.getItem('blackpine.preferences.v1'), locale: document.body.dataset.locale, lang: document.documentElement.lang })`);
  if (incognitoStart.saved !== null || incognitoStart.locale !== 'en-CA' || incognitoStart.lang !== 'en-CA') fail(`Fresh incognito-style state failed: ${JSON.stringify(incognitoStart)}`);

  await evaluate(cdp, `localStorage.setItem('blackpine.preferences.v1', '{broken-json')`);
  await navigate(cdp, '/fr/services/incident-response/');
  const corrupt = await evaluate(cdp, `({ path: location.pathname, locale: document.body.dataset.locale, main: Boolean(document.querySelector('#main')), saved: localStorage.getItem('blackpine.preferences.v1') })`);
  if (corrupt.path !== '/fr/services/incident-response/' || corrupt.locale !== 'fr-CA' || !corrupt.main) fail(`Corrupt preference JSON broke explicit French deep link: ${JSON.stringify(corrupt)}`);

  await evaluate(cdp, `localStorage.setItem('blackpine.preferences.v1', JSON.stringify({version:1,locale:'xx-UNKNOWN',theme:'dark'}))`);
  await navigate(cdp, '/es/services/incident-response/');
  const unknown = await evaluate(cdp, `({ path: location.pathname, locale: document.body.dataset.locale, theme: document.documentElement.dataset.theme, dialogOpen: Boolean(document.querySelector('[data-preferences-dialog]')?.open) })`);
  if (unknown.path !== '/es/services/incident-response/' || unknown.locale !== 'es' || unknown.theme !== 'dark') fail(`Unknown saved locale overrode explicit Spanish route or theme recovery: ${JSON.stringify(unknown)}`);

  await evaluate(cdp, `localStorage.setItem('blackpine.preferences.v1', JSON.stringify({version:1,locale:'fr-CA',theme:'auto'}))`);
  await navigate(cdp, '/es/services/incident-response/');
  const explicitWins = await evaluate(cdp, `({ path: location.pathname, locale: document.body.dataset.locale, saved: JSON.parse(localStorage.getItem('blackpine.preferences.v1')).locale })`);
  if (explicitWins.path !== '/es/services/incident-response/' || explicitWins.locale !== 'es' || explicitWins.saved !== 'fr-CA') fail(`Saved preference overrode explicit Spanish deep link: ${JSON.stringify(explicitWins)}`);

  await navigate(cdp, '/services/incident-response/');
  await evaluate(cdp, `document.querySelector('a[data-language-choice][data-locale="es"]')?.click()`);
  if (!await waitForPath(cdp, '/es/services/incident-response/')) fail('Language link EN→ES did not navigate to the equivalent deep route.');
  await evaluate(cdp, 'history.back()');
  if (!await waitForPath(cdp, '/services/incident-response/')) fail('Browser Back did not return from Spanish equivalent to the English deep route.');
  await evaluate(cdp, 'history.forward()');
  if (!await waitForPath(cdp, '/es/services/incident-response/')) fail('Browser Forward did not return to the Spanish equivalent deep route.');

  await navigate(cdp, '/legal/privacy/');
  const unavailableLegal = await evaluate(cdp, `({
    esLink: Boolean(document.querySelector('a[data-language-choice][data-locale="es"]')),
    esDisabled: Boolean(document.querySelector('.language-option[data-locale="es"][aria-disabled="true"]')),
    esPreferenceTarget: document.querySelector('[name="preferred-language"][value="es"]')?.dataset.target ?? document.querySelector('select[name="preferred-language"] option[value="es"]')?.dataset.target ?? null
  })`);
  if (unavailableLegal.esLink || !unavailableLegal.esDisabled || unavailableLegal.esPreferenceTarget) fail(`Unpublished Spanish Privacy counterpart is not safely unavailable: ${JSON.stringify(unavailableLegal)}`);
  const missingLegal = await fetch(`${base}/es/legal/privacy/`);
  if (missingLegal.status !== 404) fail(`Unpublished Spanish Privacy route returned ${missingLegal.status}, expected 404.`);

  await evaluate(cdp, `(() => {
    const original = Storage.prototype.setItem;
    window.__phase4OriginalSetItem = original;
    Storage.prototype.setItem = function(){ throw new DOMException('blocked','SecurityError'); };
    document.querySelector('[data-preferences-open]')?.click();
    const language = document.querySelector('[name="preferred-language"][value="en-CA"]');
    if (language) language.checked = true;
    const select = document.querySelector('select[name="preferred-language"]');
    if (select) select.value = 'en-CA';
    document.querySelector('[data-preferences-form]')?.requestSubmit();
  })()`);
  const blockedWrite = await evaluate(cdp, `({
    path: location.pathname,
    main: Boolean(document.querySelector('#main')),
    status: document.querySelector('[data-preferences-status]')?.textContent.trim() || '',
    open: Boolean(document.querySelector('[data-preferences-dialog]')?.open)
  })`);
  if (!blockedWrite.main || !blockedWrite.open || !/blocked|bloqu|bloque/i.test(blockedWrite.status)) fail(`Blocked localStorage write did not expose recoverable page-only status: ${JSON.stringify(blockedWrite)}`);
  await evaluate(cdp, `document.querySelector('[data-preferences-close]')?.click()`);
  const blockedClosed = await evaluate(cdp, `!document.querySelector('[data-preferences-dialog]')?.open`);
  if (!blockedClosed) fail('Preferences dialog could not be closed after blocked localStorage write.');
  await evaluate(cdp, `if (window.__phase4OriginalSetItem) Storage.prototype.setItem = window.__phase4OriginalSetItem`);

  const injection = await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `Object.defineProperty(Storage.prototype,'getItem',{configurable:true,value:function(){throw new DOMException('blocked','SecurityError')}});`
  });
  await navigate(cdp, '/es/trust/security-practices/');
  const blockedRead = await evaluate(cdp, `({ path: location.pathname, locale: document.body.dataset.locale, main: Boolean(document.querySelector('#main')), heading: document.querySelector('h1')?.textContent.trim() })`);
  if (blockedRead.path !== '/es/trust/security-practices/' || blockedRead.locale !== 'es' || !blockedRead.main || !blockedRead.heading) fail(`Blocked localStorage read broke page access: ${JSON.stringify(blockedRead)}`);
  if (injection.identifier) await cdp.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: injection.identifier });

  await cdp.send('Emulation.setScriptExecutionDisabled', { value: true });
  await cdp.send('Page.navigate', { url: `${base}/fr/services/security-assessments/` });
  await sleep(550);
  const documentNode = await cdp.send('DOM.getDocument', { depth: -1, pierce: true });
  const rootId = documentNode.root?.nodeId;
  const mainNode = await domNode(cdp, rootId, '#main');
  const openDialogNode = await domNode(cdp, rootId, '[data-preferences-dialog][open]');
  const navNode = await domNode(cdp, rootId, '#primary-nav');
  const enNode = await domNode(cdp, rootId, 'a[data-language-choice][data-locale="en-CA"]');
  const esNode = await domNode(cdp, rootId, 'a[data-language-choice][data-locale="es"]');
  const enAttrs = await domAttributes(cdp, enNode);
  const esAttrs = await domAttributes(cdp, esNode);
  if (!mainNode || openDialogNode || !navNode || enAttrs.href !== '/services/security-assessments/' || esAttrs.href !== '/es/services/security-assessments/') {
    fail(`No-JavaScript progressive access failed: ${JSON.stringify({ mainNode, openDialogNode, navNode, enHref: enAttrs.href, esHref: esAttrs.href })}`);
  }
  await cdp.send('Emulation.setScriptExecutionDisabled', { value: false });

  await navigate(cdp, '/es/services/security-assessments/');
  await evaluate(cdp, `document.querySelector('.footer-preferences')?.focus()`);
  await pressKey(cdp, 'Enter', 'Enter');
  await sleep(120);
  const keyboardOpen = await evaluate(cdp, `({ open: Boolean(document.querySelector('[data-preferences-dialog]')?.open), activeInside: Boolean(document.querySelector('[data-preferences-dialog]')?.contains(document.activeElement)), activeTag: document.activeElement?.tagName })`);
  if (!keyboardOpen.open || !keyboardOpen.activeInside) fail(`Keyboard activation did not move focus into preferences dialog: ${JSON.stringify(keyboardOpen)}`);
  for (let index = 0; index < 10; index += 1) {
    await pressKey(cdp, 'Tab', 'Tab');
    const inside = await evaluate(cdp, `Boolean(document.querySelector('[data-preferences-dialog]')?.contains(document.activeElement))`);
    if (!inside) { fail(`Keyboard Tab escaped the modal preferences dialog on iteration ${index + 1}.`); break; }
  }
  const ax = await cdp.send('Accessibility.getFullAXTree');
  const dialogNode = ax.nodes?.find(node => node.role?.value === 'dialog' && /Preferencias de idioma y privacidad/.test(node.name?.value || ''));
  if (!dialogNode) fail('Accessibility tree does not expose the Spanish preferences control as a named dialog.');
  await pressKey(cdp, 'Escape', 'Escape');
  const keyboardClose = await evaluate(cdp, `({ open: Boolean(document.querySelector('[data-preferences-dialog]')?.open), restored: document.activeElement?.classList.contains('footer-preferences') || false })`);
  if (keyboardClose.open || !keyboardClose.restored) fail(`Escape did not close preferences and restore opener focus: ${JSON.stringify(keyboardClose)}`);

  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await navigate(cdp, '/es/');
  await evaluate(cdp, `document.querySelector('.footer-preferences')?.click()`);
  const reduced = await evaluate(cdp, `(() => {
    const node = document.querySelector('[data-preferences-dialog]');
    const style = getComputedStyle(node);
    const toMs = value => {
      const first = String(value || '0s').split(',')[0].trim();
      if (first.endsWith('ms')) return Number.parseFloat(first) || 0;
      if (first.endsWith('s')) return (Number.parseFloat(first) || 0) * 1000;
      return Number.parseFloat(first) || 0;
    };
    return { animationMs: toMs(style.animationDuration), transitionMs: toMs(style.transitionDuration), reduced: matchMedia('(prefers-reduced-motion: reduce)').matches };
  })()`);
  if (!reduced.reduced || reduced.animationMs > 0.01 || reduced.transitionMs > 0.01) fail(`Reduced-motion CSS was not applied to preferences UI: ${JSON.stringify(reduced)}`);
  await cdp.send('Emulation.setEmulatedMedia', { features: [] });

  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 1, mobile: true });
  await navigate(cdp, '/es/');
  await evaluate(cdp, `document.querySelector('.footer-preferences')?.click()`);
  const narrow = await evaluate(cdp, `(() => {
    const dialog = document.querySelector('[data-preferences-dialog]');
    const rect = dialog?.getBoundingClientRect();
    return {
      viewport: innerWidth,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      dialogLeft: rect?.left,
      dialogRight: rect?.right,
      dialogWidth: rect?.width,
      open: Boolean(dialog?.open)
    };
  })()`);
  if (!narrow.open || narrow.viewport !== 320 || narrow.overflow > 2 || narrow.dialogLeft < -1 || narrow.dialogRight > 321 || narrow.dialogWidth > 321) fail(`320px preferences layout overflowed: ${JSON.stringify(narrow)}`);
  await cdp.send('Emulation.clearDeviceMetricsOverride');

  if (browserExceptions.length) fail(browserExceptions.map(error => `browser exception: ${error}`).join('\n'));
} catch (error) {
  fail(error.stack || error.message || String(error));
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

console.log('Phase 4 localization failure/accessibility browser audit passed: incognito-style fresh state, corrupt/unknown preferences, explicit deep-link precedence, Back/Forward equivalents, unavailable Spanish legal routes, blocked storage reads/writes, no-JavaScript progressive access, keyboard focus trapping/restoration, accessibility-tree dialog semantics, reduced motion and 320px rendering.');
