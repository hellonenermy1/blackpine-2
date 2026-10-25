import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.I18N_PHASE4_BROWSER_AUDIT_PORT || 4192);
const debugPort = Number(process.env.I18N_PHASE4_CHROME_DEBUG_PORT || 9348);
const base = `http://${host}:${port}`;
const errors = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const fail = message => errors.push(message);

function findBinary(names) {
  for (const name of names) {
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
    } catch (error) { lastError = error; }
    await sleep(150);
  }
  throw lastError || new Error(`Timed out waiting for ${url}`);
}

class CDP {
  constructor(url) { this.url = url; this.id = 1; this.pending = new Map(); }
  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('DevTools connection timed out')), 10000);
      this.ws.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
      this.ws.addEventListener('error', event => { clearTimeout(timer); reject(event.error || new Error('DevTools WebSocket error')); }, { once: true });
    });
    this.ws.addEventListener('message', event => {
      const message = JSON.parse(String(event.data));
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
      else pending.resolve(message.result || {});
    });
  }
  send(method, params = {}) {
    const id = this.id++;
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

async function navigate(cdp, pathname, settle = 180) {
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

async function key(cdp, value, code = value) {
  const keyCode = value === 'Enter' ? 13 : value === 'Tab' ? 9 : value === 'Escape' ? 27 : code === 'Space' ? 32 : 0;
  const params = { key: value, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode };
  await cdp.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...params });
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', ...params });
  await sleep(90);
}

const chrome = findBinary(['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']);
if (!chrome) {
  console.error('ERROR: Chrome/Chromium binary not found for Phase 4 browser audit.');
  process.exit(1);
}

const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'blackpine-phase4-browser-'));
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  cwd: new URL('../', import.meta.url),
  env: { ...process.env, HOST: host, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});
let browser;
let cdp;
let browserError = '';

try {
  await waitFor(`${base}/`);
  browser = spawn(chrome, [
    '--headless', '--incognito', '--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking',
    '--disable-default-apps', '--disable-extensions', '--disable-sync', '--disable-gpu', '--metrics-recording-only', '--no-first-run',
    `--remote-debugging-address=${host}`, `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, 'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  browser.stderr?.on('data', chunk => { browserError += String(chunk); });
  try { await waitFor(`http://${host}:${debugPort}/json/version`); }
  catch (error) { throw new Error(`Chrome DevTools did not start: ${error.message}\n${browserError.slice(-3000)}`); }

  const targetResponse = await fetch(`http://${host}:${debugPort}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' });
  if (!targetResponse.ok) throw new Error(`Unable to create Chrome target: ${targetResponse.status}`);
  const target = await targetResponse.json();
  cdp = new CDP(target.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Accessibility.enable');

  await navigate(cdp, '/');
  const fresh = await evaluate(cdp, `({stored:localStorage.getItem('blackpine.preferences.v1'),locale:document.body.dataset.locale,lang:document.documentElement.lang})`);
  if (fresh.stored !== null || fresh.locale !== 'en-CA' || fresh.lang !== 'en') fail(`Fresh incognito-style state failed: ${JSON.stringify(fresh)}`);

  await evaluate(cdp, `localStorage.setItem('blackpine.preferences.v1','{broken-json')`);
  await navigate(cdp, '/fr/services/incident-response/');
  const corrupt = await evaluate(cdp, `({path:location.pathname,locale:document.body.dataset.locale,main:Boolean(document.querySelector('#main'))})`);
  if (corrupt.path !== '/fr/services/incident-response/' || corrupt.locale !== 'fr-CA' || !corrupt.main) fail(`Corrupt preference JSON broke explicit French deep link: ${JSON.stringify(corrupt)}`);

  await evaluate(cdp, `localStorage.setItem('blackpine.preferences.v1',JSON.stringify({version:1,locale:'xx-UNKNOWN',theme:'dark'}))`);
  await navigate(cdp, '/es/services/incident-response/');
  const unknown = await evaluate(cdp, `({path:location.pathname,locale:document.body.dataset.locale,theme:document.documentElement.dataset.theme})`);
  if (unknown.path !== '/es/services/incident-response/' || unknown.locale !== 'es' || unknown.theme !== 'dark') fail(`Unknown saved locale was not ignored safely: ${JSON.stringify(unknown)}`);

  await evaluate(cdp, `localStorage.setItem('blackpine.preferences.v1',JSON.stringify({version:1,locale:'fr-CA',theme:'auto'}))`);
  await navigate(cdp, '/es/services/incident-response/');
  const explicit = await evaluate(cdp, `({path:location.pathname,locale:document.body.dataset.locale,saved:JSON.parse(localStorage.getItem('blackpine.preferences.v1')).locale})`);
  if (explicit.path !== '/es/services/incident-response/' || explicit.locale !== 'es' || explicit.saved !== 'fr-CA') fail(`Saved preference overrode explicit Spanish URL: ${JSON.stringify(explicit)}`);

  await navigate(cdp, '/services/incident-response/');
  await evaluate(cdp, `document.querySelector('a[data-language-choice][data-locale="es"]')?.click()`);
  if (!await waitForPath(cdp, '/es/services/incident-response/')) fail('EN→ES selector did not preserve equivalent deep route.');
  await evaluate(cdp, 'history.back()');
  if (!await waitForPath(cdp, '/services/incident-response/')) fail('Browser Back did not restore English equivalent route.');
  await evaluate(cdp, 'history.forward()');
  if (!await waitForPath(cdp, '/es/services/incident-response/')) fail('Browser Forward did not restore Spanish equivalent route.');

  await navigate(cdp, '/legal/privacy/');
  const legal = await evaluate(cdp, `({link:Boolean(document.querySelector('a[data-language-choice][data-locale="es"]')),disabled:Boolean(document.querySelector('.language-option[data-locale="es"][aria-disabled="true"]')),target:document.querySelector('[name="preferred-language"][value="es"]')?.dataset.target??document.querySelector('select[name="preferred-language"] option[value="es"]')?.dataset.target??null})`);
  if (legal.link || !legal.disabled || legal.target) fail(`Unavailable Spanish lawyer route is not safely disabled: ${JSON.stringify(legal)}`);
  const missingLegal = await fetch(`${base}/es/legal/privacy/`);
  if (missingLegal.status !== 404) fail(`Unpublished Spanish Privacy returned ${missingLegal.status}; expected 404.`);

  await evaluate(cdp, `(() => {window.__phase4SetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('blocked','SecurityError')};document.querySelector('[data-preferences-open]')?.click();const radio=document.querySelector('[name="preferred-language"][value="en-CA"]');if(radio)radio.checked=true;const select=document.querySelector('select[name="preferred-language"]');if(select)select.value='en-CA';document.querySelector('[data-preferences-form]')?.requestSubmit();})()`);
  const blockedWrite = await evaluate(cdp, `({main:Boolean(document.querySelector('#main')),open:Boolean(document.querySelector('[data-preferences-dialog]')?.open),status:document.querySelector('[data-preferences-status]')?.textContent.trim()||''})`);
  if (!blockedWrite.main || !blockedWrite.open || !/storage|stockage/i.test(blockedWrite.status)) fail(`Blocked storage write did not remain recoverable: ${JSON.stringify(blockedWrite)}`);
  await evaluate(cdp, `document.querySelector('[data-preferences-close]')?.click();Storage.prototype.setItem=window.__phase4SetItem`);
  if (!await evaluate(cdp, `!document.querySelector('[data-preferences-dialog]')?.open`)) fail('Preferences dialog could not close after blocked storage write.');

  const injection = await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: `Object.defineProperty(Storage.prototype,'getItem',{configurable:true,value:function(){throw new DOMException('blocked','SecurityError')}});` });
  await navigate(cdp, '/es/trust/security-practices/');
  const blockedRead = await evaluate(cdp, `({path:location.pathname,locale:document.body.dataset.locale,main:Boolean(document.querySelector('#main')),heading:document.querySelector('h1')?.textContent.trim()})`);
  if (blockedRead.path !== '/es/trust/security-practices/' || blockedRead.locale !== 'es' || !blockedRead.main || !blockedRead.heading) fail(`Blocked storage read broke page access: ${JSON.stringify(blockedRead)}`);
  if (injection.identifier) await cdp.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: injection.identifier });

  const noJsResponse = await fetch(`${base}/fr/services/security-assessments/`);
  const noJs = await noJsResponse.text();
  if (!noJs.includes('<main id="main"') || /<dialog[^>]*\sopen(?:\s|>)/i.test(noJs) || !noJs.includes('href="/services/security-assessments/"') || !noJs.includes('href="/es/services/security-assessments/"')) {
    fail('Server-rendered no-JavaScript French route does not preserve core content, nonblocking preferences, or crawlable language equivalents.');
  }

  await navigate(cdp, '/es/services/security-assessments/');
  await evaluate(cdp, `document.querySelector('.footer-preferences')?.focus()`);
  await key(cdp, ' ', 'Space');
  const opened = await evaluate(cdp, `({open:Boolean(document.querySelector('[data-preferences-dialog]')?.open),inside:Boolean(document.querySelector('[data-preferences-dialog]')?.contains(document.activeElement))})`);
  if (!opened.open || !opened.inside) fail(`Keyboard activation did not focus modal dialog: ${JSON.stringify(opened)}`);
  for (let i = 0; i < 10; i += 1) {
    await key(cdp, 'Tab', 'Tab');
    if (!await evaluate(cdp, `Boolean(document.querySelector('[data-preferences-dialog]')?.contains(document.activeElement))`)) { fail(`Tab escaped preferences dialog on iteration ${i + 1}.`); break; }
  }
  const ax = await cdp.send('Accessibility.getFullAXTree');
  if (!ax.nodes?.some(node => node.role?.value === 'dialog' && /Idioma y apariencia/.test(node.name?.value || ''))) fail('Accessibility tree does not expose the reviewed Spanish preferences dialog name.');
  await key(cdp, 'Escape', 'Escape');
  const closed = await evaluate(cdp, `({open:Boolean(document.querySelector('[data-preferences-dialog]')?.open),restored:document.activeElement?.classList.contains('footer-preferences')||false})`);
  if (closed.open || !closed.restored) fail(`Escape did not close dialog and restore focus: ${JSON.stringify(closed)}`);

  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await navigate(cdp, '/es/');
  await evaluate(cdp, `document.querySelector('.footer-preferences')?.click()`);
  const reduced = await evaluate(cdp, `(() => {const style=getComputedStyle(document.querySelector('[data-preferences-dialog]'));const ms=v=>{const x=String(v||'0s').split(',')[0].trim();return x.endsWith('ms')?(parseFloat(x)||0):(parseFloat(x)||0)*1000};return {matches:matchMedia('(prefers-reduced-motion: reduce)').matches,animation:ms(style.animationDuration),transition:ms(style.transitionDuration)}})()`);
  if (!reduced.matches || reduced.animation > 0.01 || reduced.transition > 0.01) fail(`Reduced-motion policy not applied: ${JSON.stringify(reduced)}`);
  await cdp.send('Emulation.setEmulatedMedia', { features: [] });

  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 1, mobile: true });
  await navigate(cdp, '/es/');
  await evaluate(cdp, `document.querySelector('.footer-preferences')?.click()`);
  const narrow = await evaluate(cdp, `(() => {const d=document.querySelector('[data-preferences-dialog]'),r=d?.getBoundingClientRect();return {open:Boolean(d?.open),viewport:innerWidth,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,left:r?.left,right:r?.right,width:r?.width}})()`);
  if (!narrow.open || narrow.viewport !== 320 || narrow.overflow > 2 || narrow.left < -1 || narrow.right > 321 || narrow.width > 321) fail(`320px preferences layout overflowed: ${JSON.stringify(narrow)}`);
  await cdp.send('Emulation.clearDeviceMetricsOverride');
} catch (error) {
  fail(error.stack || error.message || String(error));
} finally {
  cdp?.close();
  browser?.kill('SIGTERM');
  server.kill('SIGTERM');
  await fs.rm(profile, { recursive: true, force: true }).catch(() => {});
}

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}
console.log('Phase 4 localization failure/accessibility browser audit passed: incognito-style fresh state, corrupt/unknown preferences, explicit deep-link precedence, Back/Forward equivalents, unavailable Spanish legal routes, blocked storage reads/writes, no-JavaScript progressive access, keyboard focus trapping/restoration, accessibility-tree dialog semantics, reduced motion and 320px rendering.');
