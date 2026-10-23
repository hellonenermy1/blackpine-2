import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const artifacts = new URL('../browser-artifacts/', import.meta.url);
const host = '127.0.0.1';
const port = Number(process.env.BROWSER_AUDIT_PORT || 4177);
const debugPort = Number(process.env.CHROME_DEBUG_PORT || 9333);
const base = `http://${host}:${port}`;
const errors = [];
const warnings = [];
const browserExceptions = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function findBinary(candidates) {
  for (const name of candidates) {
    const result = spawnSync('which', [name], { encoding: 'utf8' });
    if (result.status === 0 && result.stdout.trim()) return result.stdout.trim();
  }
  return null;
}

async function waitFor(url, timeout = 15000) {
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
    await sleep(120);
  }
  throw lastError || new Error(`Timed out waiting for ${url}`);
}

class CDP {
  constructor(url) {
    this.url = url;
    this.nextId = 1;
    this.pending = new Map();
    this.ws = null;
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

  close() {
    this.ws?.close();
  }
}

async function evaluate(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
    userGesture: true
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Runtime evaluation failed');
  return result.result?.value;
}

async function navigate(cdp, pathname, width, height = 900) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 480,
    screenWidth: width,
    screenHeight: height
  });
  await cdp.send('Page.navigate', { url: `${base}${pathname}` });
  const started = Date.now();
  while (Date.now() - started < 10000) {
    const ready = await evaluate(cdp, 'document.readyState');
    if (ready === 'complete') break;
    await sleep(80);
  }
  await sleep(180);
}

async function key(cdp, keyName, code, windowsVirtualKeyCode, modifiers = 0) {
  const params = { key: keyName, code, windowsVirtualKeyCode, nativeVirtualKeyCode: windowsVirtualKeyCode, modifiers };
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', ...params });
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', ...params });
  await sleep(80);
}

async function screenshot(cdp, name) {
  const shot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  await fs.writeFile(new URL(`./${name}.png`, artifacts), Buffer.from(shot.data, 'base64'));
}

async function auditReflow(cdp) {
  const routes = [
    '/',
    '/services/',
    '/services/emergency-response/',
    '/services/security-desk/',
    '/contact/',
    '/research/',
    '/trust/'
  ];
  const widths = [1440, 768, 320];
  const report = [];

  for (const pathname of routes) {
    for (const width of widths) {
      await navigate(cdp, pathname, width, width === 320 ? 760 : 900);
      const result = await evaluate(cdp, `(() => {
        const root = document.documentElement;
        const h1 = document.querySelector('h1');
        const main = document.querySelector('main#main');
        const visible = node => !!node && !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
        return {
          title: document.title,
          h1: h1?.textContent?.trim() || '',
          h1Visible: visible(h1),
          main: !!main,
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          overflow: Math.max(0, root.scrollWidth - root.clientWidth)
        };
      })()`);
      report.push({ pathname, width, ...result });
      if (!result.main) errors.push(`${pathname} @ ${width}px has no main landmark`);
      if (!result.h1 || !result.h1Visible) errors.push(`${pathname} @ ${width}px has no visible H1`);
      if (result.overflow > 2) errors.push(`${pathname} @ ${width}px overflows horizontally by ${result.overflow}px`);
    }
  }

  return report;
}

async function auditKeyboardAndInteractions(cdp) {
  await navigate(cdp, '/', 1440, 900);
  await evaluate(cdp, 'document.activeElement?.blur?.(); document.body.focus(); true');
  await key(cdp, 'Tab', 'Tab', 9);
  const firstFocus = await evaluate(cdp, `({ tag: document.activeElement?.tagName, className: document.activeElement?.className || '', href: document.activeElement?.getAttribute?.('href') || '' })`);
  if (!String(firstFocus.className).includes('skip-link') || firstFocus.href !== '#main') errors.push(`first keyboard focus is not the skip link: ${JSON.stringify(firstFocus)}`);

  // Shortcut-opened search should return focus to the exact element that had
  // focus when the shortcut was invoked, not to an arbitrary search button.
  await key(cdp, 'k', 'KeyK', 75, 2);
  const shortcutOpen = await evaluate(cdp, `({ hidden: document.querySelector('[data-search-overlay]')?.hidden, active: document.activeElement?.id || '' })`);
  if (shortcutOpen.hidden !== false || shortcutOpen.active !== 'site-search-input') errors.push(`Ctrl+K search did not open/focus correctly: ${JSON.stringify(shortcutOpen)}`);

  await evaluate(cdp, `(() => { const input = document.querySelector('[data-search-input]'); input.value = 'ransomware'; input.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
  await sleep(250);
  const searchResult = await evaluate(cdp, `document.querySelector('[data-search-results]')?.textContent || ''`);
  if (!/ransomware|incident|emergency/i.test(searchResult)) errors.push('local search did not return a ransomware/incident/emergency result');
  await key(cdp, 'Escape', 'Escape', 27);
  const shortcutClosed = await evaluate(cdp, `({
    hidden: document.querySelector('[data-search-overlay]')?.hidden,
    className: document.activeElement?.className || '',
    href: document.activeElement?.getAttribute?.('href') || ''
  })`);
  if (shortcutClosed.hidden !== true || !String(shortcutClosed.className).includes('skip-link') || shortcutClosed.href !== '#main') {
    errors.push(`Escape did not return shortcut-opened search focus to the invoking skip link: ${JSON.stringify(shortcutClosed)}`);
  }

  // Button-opened search should return focus to that same button.
  await evaluate(cdp, `document.querySelector('[data-search-open]')?.click(); true`);
  await sleep(100);
  const buttonOpen = await evaluate(cdp, `({ hidden: document.querySelector('[data-search-overlay]')?.hidden, active: document.activeElement?.id || '' })`);
  if (buttonOpen.hidden !== false || buttonOpen.active !== 'site-search-input') errors.push(`search button did not open/focus correctly: ${JSON.stringify(buttonOpen)}`);
  await key(cdp, 'Escape', 'Escape', 27);
  const buttonClosed = await evaluate(cdp, `({
    hidden: document.querySelector('[data-search-overlay]')?.hidden,
    focusReturned: document.activeElement?.hasAttribute?.('data-search-open') || false
  })`);
  if (buttonClosed.hidden !== true || !buttonClosed.focusReturned) errors.push(`Escape did not return button-opened search focus to its invoking button: ${JSON.stringify(buttonClosed)}`);

  await navigate(cdp, '/', 390, 844);
  await evaluate(cdp, `document.querySelector('[data-nav-toggle]')?.click(); true`);
  const navOpen = await evaluate(cdp, `document.querySelector('[data-nav-toggle]')?.getAttribute('aria-expanded')`);
  if (navOpen !== 'true') errors.push('mobile navigation did not expose aria-expanded=true after opening');
  await evaluate(cdp, `document.querySelector('[data-nav-group-toggle]')?.click(); true`);
  const groupOpen = await evaluate(cdp, `document.querySelector('[data-nav-group-toggle]')?.getAttribute('aria-expanded')`);
  if (groupOpen !== 'true') errors.push('mobile navigation group did not expose aria-expanded=true after opening');
  await key(cdp, 'Escape', 'Escape', 27);
  const navClosed = await evaluate(cdp, `({ expanded: document.querySelector('[data-nav-toggle]')?.getAttribute('aria-expanded'), focus: document.activeElement?.hasAttribute?.('data-nav-toggle') || false })`);
  if (navClosed.expanded !== 'false' || !navClosed.focus) errors.push(`Escape did not close mobile navigation and restore focus: ${JSON.stringify(navClosed)}`);

  await navigate(cdp, '/contact/?intent=emergency-response&capability=ransomware-response#inquiry', 390, 844);
  const emergencyContact = await evaluate(cdp, `({
    intent: document.querySelector('#intent')?.value,
    capability: document.querySelector('[data-capability-context]')?.value,
    urgentVisible: [...document.querySelectorAll('[data-contact-urgent]')].every(node => !node.hidden)
  })`);
  if (emergencyContact.intent !== 'emergency-response' || emergencyContact.capability !== 'ransomware-response' || !emergencyContact.urgentVisible) {
    errors.push(`emergency contact routing failed: ${JSON.stringify(emergencyContact)}`);
  }

  await navigate(cdp, '/contact/?intent=protect#inquiry', 390, 844);
  const protectContact = await evaluate(cdp, `({
    intent: document.querySelector('#intent')?.value,
    urgentHidden: [...document.querySelectorAll('[data-contact-urgent]')].every(node => node.hidden)
  })`);
  if (protectContact.intent !== 'protect' || !protectContact.urgentHidden) errors.push(`non-urgent contact routing failed: ${JSON.stringify(protectContact)}`);

  await navigate(cdp, '/ransomware-help-notfound', 390, 844);
  const smart404 = await evaluate(cdp, `document.querySelector('[data-404-suggestions]')?.textContent || ''`);
  if (!/Emergency Response/i.test(smart404)) errors.push('smart 404 did not suggest Emergency Response for a ransomware-like path');
}

async function runFirefoxSmoke() {
  const firefox = findBinary(['firefox']);
  if (!firefox) {
    const message = 'Firefox binary not found; Firefox render smoke skipped.';
    if (process.env.REQUIRE_FIREFOX === '1') errors.push(message);
    else warnings.push(message);
    return;
  }
  const output = path.resolve(new URL('../browser-artifacts/firefox-home.png', import.meta.url).pathname);
  const result = spawnSync(firefox, ['--headless', '--screenshot', output, `${base}/`], {
    encoding: 'utf8',
    timeout: 30000,
    env: { ...process.env, MOZ_HEADLESS: '1' }
  });
  if (result.status !== 0) errors.push(`Firefox render smoke failed: ${(result.stderr || result.stdout || '').trim()}`);
  else {
    const stat = await fs.stat(output).catch(() => null);
    if (!stat?.size) errors.push('Firefox render smoke did not produce a screenshot');
  }
}

await fs.rm(artifacts, { recursive: true, force: true });
await fs.mkdir(artifacts, { recursive: true });

const chrome = findBinary(['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']);
if (!chrome) {
  console.error('ERROR: Chrome/Chromium binary not found.');
  process.exit(1);
}

const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'blackpine-browser-'));
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  cwd: new URL('../', import.meta.url),
  env: { ...process.env, HOST: host, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});
let chromeProcess;
let cdp;

try {
  await waitFor(`${base}/`);
  chromeProcess = spawn(chrome, [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--metrics-recording-only',
    '--no-first-run',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  await waitFor(`http://${host}:${debugPort}/json/version`);
  const targetResponse = await fetch(`http://${host}:${debugPort}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' });
  if (!targetResponse.ok) throw new Error(`Unable to create Chrome target: ${targetResponse.status}`);
  const target = await targetResponse.json();
  cdp = new CDP(target.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');

  const reflow = await auditReflow(cdp);
  await auditKeyboardAndInteractions(cdp);

  await navigate(cdp, '/', 1440, 900);
  await screenshot(cdp, 'chrome-home-desktop');
  await navigate(cdp, '/services/emergency-response/', 390, 844);
  await screenshot(cdp, 'chrome-emergency-mobile');
  await navigate(cdp, '/contact/?intent=emergency-response#inquiry', 320, 760);
  await screenshot(cdp, 'chrome-contact-320');

  await runFirefoxSmoke();

  if (browserExceptions.length) errors.push(...browserExceptions.map(error => `browser exception: ${error}`));
  await fs.writeFile(new URL('./browser-audit.json', artifacts), `${JSON.stringify({
    chrome,
    firefoxRequired: process.env.REQUIRE_FIREFOX === '1',
    reflow,
    warnings,
    errors
  }, null, 2)}\n`);
} catch (error) {
  errors.push(error.stack || error.message || String(error));
} finally {
  cdp?.close();
  chromeProcess?.kill('SIGTERM');
  server.kill('SIGTERM');
  await fs.rm(profile, { recursive: true, force: true }).catch(() => {});
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log('Rendered-browser audit passed: Chrome desktop/tablet/320px reflow, skip-link keyboard order, shortcut and button search focus restoration, mobile navigation/Escape focus return, intent-aware contact routing, smart 404, screenshots, and Firefox render smoke.');
