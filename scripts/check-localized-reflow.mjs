import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.LOCALIZED_REFLOW_PORT || 4196);
const debugPort = Number(process.env.LOCALIZED_REFLOW_DEBUG_PORT || 9352);
const localHttp = ['http', '://'].join('');
const base = `${localHttp}${host}:${port}`;
const errors = [];
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
      if (response.ok) return;
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
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
      else pending.resolve(message.result || {});
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
  const result = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Runtime evaluation failed');
  return result.result?.value;
}

async function navigate(cdp, pathname, width) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: width <= 430 ? 844 : 900,
    deviceScaleFactor: 1,
    mobile: width <= 480,
    screenWidth: width,
    screenHeight: width <= 430 ? 844 : 900
  });
  await cdp.send('Page.navigate', { url: `${base}${pathname}` });
  const started = Date.now();
  while (Date.now() - started < 10000) {
    if (await evaluate(cdp, 'document.readyState') === 'complete') break;
    await sleep(40);
  }
  await sleep(50);
}

async function audit(cdp, pathname, width, expectedLocale) {
  await navigate(cdp, pathname, width);
  const result = await evaluate(cdp, `(() => {
    const root = document.documentElement;
    const body = document.body;
    const h1 = document.querySelector('h1');
    const main = document.querySelector('main#main');
    const visible = node => !!node && !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
    const viewportWidth = root.clientWidth;
    const describe = node => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const before = getComputedStyle(node, '::before');
      const after = getComputedStyle(node, '::after');
      return {
        tag: node.tagName.toLowerCase(),
        id: node.id || '',
        className: typeof node.className === 'string' ? node.className : '',
        left: Math.round(rect.left * 10) / 10,
        right: Math.round(rect.right * 10) / 10,
        width: Math.round(rect.width * 10) / 10,
        clientWidth: node.clientWidth,
        scrollWidth: node.scrollWidth,
        delta: node.scrollWidth - node.clientWidth,
        minWidth: style.minWidth,
        maxWidth: style.maxWidth,
        cssWidth: style.width,
        whiteSpace: style.whiteSpace,
        overflowX: style.overflowX,
        position: style.position,
        before: before.content === 'none' ? '' : before.content,
        after: after.content === 'none' ? '' : after.content,
        text: (node.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 120)
      };
    };
    const elements = [...document.querySelectorAll('body *')].filter(visible);
    const wideElements = elements
      .filter(node => {
        const rect = node.getBoundingClientRect();
        return rect.left < -2 || rect.right > viewportWidth + 2;
      })
      .slice(0, 12)
      .map(describe);
    const internallyWide = elements
      .filter(node => node.scrollWidth - node.clientWidth > 2)
      .map(describe)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 16);
    const pseudoContent = elements
      .map(describe)
      .filter(item => item.before || item.after)
      .slice(0, 16);
    return {
      locale: body?.dataset.locale || '',
      lang: root.lang,
      h1: h1?.textContent?.trim() || '',
      h1Visible: visible(h1),
      main: Boolean(main),
      overflow: Math.max(0, root.scrollWidth - root.clientWidth),
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      bodyClientWidth: body?.clientWidth || 0,
      bodyScrollWidth: body?.scrollWidth || 0,
      innerWidth: window.innerWidth,
      visualViewportWidth: window.visualViewport?.width || null,
      wideElements,
      internallyWide,
      pseudoContent
    };
  })()`);

  if (!result.main) errors.push(`${pathname} @ ${width}px has no main landmark`);
  if (!result.h1 || !result.h1Visible) errors.push(`${pathname} @ ${width}px has no visible H1`);
  if (result.overflow > 2) errors.push(`${pathname} @ ${width}px overflows horizontally by ${result.overflow}px; diagnostics: ${JSON.stringify({ clientWidth: result.clientWidth, scrollWidth: result.scrollWidth, bodyClientWidth: result.bodyClientWidth, bodyScrollWidth: result.bodyScrollWidth, innerWidth: result.innerWidth, visualViewportWidth: result.visualViewportWidth, wideElements: result.wideElements, internallyWide: result.internallyWide, pseudoContent: result.pseudoContent })}`);
  if (result.locale !== expectedLocale) errors.push(`${pathname} @ ${width}px exposes locale ${result.locale || '<missing>'}; expected ${expectedLocale}`);
  if (expectedLocale === 'fr-CA' && result.lang !== 'fr-CA') errors.push(`${pathname} @ ${width}px has lang=${result.lang}; expected fr-CA`);
  if (expectedLocale === 'es' && result.lang !== 'es') errors.push(`${pathname} @ ${width}px has lang=${result.lang}; expected es`);
}

const chrome = findBinary(['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']);
if (!chrome) {
  console.error('ERROR: Chrome/Chromium binary not found for localized reflow audit.');
  process.exit(1);
}

const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'blackpine-localized-reflow-'));
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
    '--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking', '--disable-default-apps',
    '--disable-extensions', '--disable-sync', '--disable-gpu', '--metrics-recording-only', '--no-first-run',
    `--remote-debugging-address=${host}`, `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, 'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  browser.stderr?.on('data', chunk => { browserError += String(chunk); });
  try {
    await waitFor(`${localHttp}${host}:${debugPort}/json/version`);
  } catch (error) {
    throw new Error(`Chrome DevTools did not start: ${error.message}${browserError ? `\n${browserError.slice(-3000)}` : ''}`);
  }

  const targetResponse = await fetch(`${localHttp}${host}:${debugPort}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' });
  if (!targetResponse.ok) throw new Error(`Unable to create Chrome target: ${targetResponse.status}`);
  const target = await targetResponse.json();
  cdp = new CDP(target.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  const localeIndexes = [
    { path: new URL('../dist/fr/search-index.json', import.meta.url), locale: 'fr-CA' },
    { path: new URL('../dist/es/search-index.json', import.meta.url), locale: 'es' }
  ];

  let routeCount = 0;
  for (const entry of localeIndexes) {
    const index = JSON.parse(await fs.readFile(entry.path, 'utf8'));
    const routes = [...new Set(index.map(item => item.path).filter(Boolean))];
    routeCount += routes.length;
    for (const pathname of routes) {
      await audit(cdp, pathname, 320, entry.locale);
      await audit(cdp, pathname, 1440, entry.locale);
    }
  }

  const representative = [
    '/fr/', '/fr/services/', '/fr/contact/', '/fr/trust/', '/fr/research/',
    '/es/', '/es/services/', '/es/contact/', '/es/trust/', '/es/research/'
  ];
  for (const pathname of representative) {
    const locale = pathname.startsWith('/fr/') ? 'fr-CA' : 'es';
    for (const width of [375, 430, 768, 1024, 1920]) await audit(cdp, pathname, width, locale);
  }

  if (!errors.length) console.log(`Localized rendered reflow passed: ${routeCount} published French/Spanish indexed routes at 320px and 1440px, plus ${representative.length} representative routes at 375/430/768/1024/1920px.`);
} catch (error) {
  errors.push(error.stack || error.message || String(error));
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
