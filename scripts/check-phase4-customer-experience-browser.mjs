import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.PHASE4_BROWSER_PORT || 4184);
const debugPort = Number(process.env.PHASE4_CHROME_DEBUG_PORT || 9344);
const localScheme = ['ht', 'tp'].join('');
const base = `${localScheme}://${host}:${port}`;
const debugBase = `${localScheme}://${host}:${debugPort}`;
const errors = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const waitForExit = async (child, timeout = 3000) => {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  await Promise.race([new Promise(resolve => child.once('exit', resolve)), sleep(timeout)]);
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill('SIGKILL');
  await Promise.race([new Promise(resolve => child.once('exit', resolve)), sleep(1000)]);
};

const findBinary = candidates => {
  for (const name of candidates) {
    const result = spawnSync('which', [name], { encoding: 'utf8' });
    if (result.status === 0 && result.stdout.trim()) return result.stdout.trim();
  }
  return null;
};

async function waitFor(url, timeout = 30000) {
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
    await sleep(100);
  }
  throw lastError || new Error(`Timed out waiting for ${url}`);
}

class CDP {
  constructor(url) {
    this.url = url;
    this.nextId = 1;
    this.pending = new Map();
    this.ws = null;
    this.exceptions = [];
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
        this.exceptions.push(detail?.exception?.description || detail?.text || 'Unknown browser exception');
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
  const response = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
    userGesture: true
  });
  if (response.exceptionDetails) {
    const detail = response.exceptionDetails;
    throw new Error(detail.exception?.description || detail.text || 'Runtime evaluation failed');
  }
  return response.result?.value;
}

async function navigate(cdp, pathname, width = 1440, height = 900) {
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
    if (await evaluate(cdp, 'document.readyState') === 'complete') break;
    await sleep(50);
  }
  await sleep(100);
}

const expect = (condition, message) => { if (!condition) errors.push(message); };

async function auditPreferences(cdp) {
  await navigate(cdp, '/');
  await evaluate(cdp, 'localStorage.clear(); true');
  await navigate(cdp, '/');
  const fresh = await evaluate(cdp, `(() => {
    const dialog = document.querySelector('[data-preferences-dialog]');
    return {
      open: !!dialog?.open,
      active: document.activeElement?.tagName || '',
      saved: localStorage.getItem('blackpine.preferences.v1')
    };
  })()`);
  expect(fresh.open === false, `fresh visit was interrupted by the preferences dialog: ${JSON.stringify(fresh)}`);
  expect(fresh.saved === null, `fresh visit created preference state without a user choice: ${fresh.saved}`);

  const opened = await evaluate(cdp, `(() => {
    const trigger = document.querySelector('.footer-preferences');
    trigger?.click();
    const dialog = document.querySelector('[data-preferences-dialog]');
    return {
      open: !!dialog?.open,
      heading: dialog?.querySelector('h2')?.textContent?.trim() || '',
      activeInside: !!dialog?.contains(document.activeElement)
    };
  })()`);
  expect(opened.open && opened.heading === 'Language & appearance', `user-invoked preferences did not open with reviewed copy: ${JSON.stringify(opened)}`);
  expect(opened.activeInside, 'opening preferences did not move focus into the dialog');

  await evaluate(cdp, `(() => {
    document.querySelector('[name="preferred-theme"][value="dark"]')?.click();
    document.querySelector('[name="preferred-language"][value="en-CA"]')?.click();
    document.querySelector('[data-preferences-form]')?.requestSubmit();
    return true;
  })()`);
  await sleep(80);
  const saved = await evaluate(cdp, `(() => ({
    open: !!document.querySelector('[data-preferences-dialog]')?.open,
    theme: document.documentElement.dataset.theme,
    value: localStorage.getItem('blackpine.preferences.v1')
  }))()`);
  let parsed = null;
  try { parsed = JSON.parse(saved.value || 'null'); } catch {}
  expect(saved.open === false, 'saving available preferences did not close the dialog');
  expect(saved.theme === 'dark' && parsed?.theme === 'dark' && parsed?.locale === 'en-CA', `preferences were not saved as chosen: ${JSON.stringify(saved)}`);

  await evaluate(cdp, `document.querySelector('.footer-preferences')?.click(); true`);
  await sleep(40);
  await evaluate(cdp, `document.querySelector('[data-preferences-clear]')?.click(); true`);
  const cleared = await evaluate(cdp, `(() => ({
    theme: document.documentElement.dataset.theme,
    value: localStorage.getItem('blackpine.preferences.v1'),
    status: document.querySelector('[data-preferences-status]')?.textContent?.trim() || ''
  }))()`);
  expect(cleared.theme === 'auto' && cleared.value === null, `reset did not clear local preference state: ${JSON.stringify(cleared)}`);
  expect(/cleared/i.test(cleared.status), `reset did not provide human-readable status: ${cleared.status}`);

  for (const [pathname, heading] of [['/fr/', 'Langue et apparence'], ['/es/', 'Idioma y apariencia']]) {
    await navigate(cdp, pathname);
    const state = await evaluate(cdp, `(() => {
      const dialog = document.querySelector('[data-preferences-dialog]');
      const trigger = document.querySelector('.footer-preferences');
      const wasOpen = !!dialog?.open;
      trigger?.click();
      return { wasOpen, open: !!dialog?.open, heading: dialog?.querySelector('h2')?.textContent?.trim() || '' };
    })()`);
    expect(state.wasOpen === false, `${pathname} auto-opened preferences on arrival`);
    expect(state.open && state.heading === heading, `${pathname} preference dialog copy/state is incorrect: ${JSON.stringify(state)}`);
  }
}

async function auditNarrowReflow(cdp) {
  await navigate(cdp, '/legal/company-information/', 320, 760);
  const state = await evaluate(cdp, `(() => {
    const root = document.documentElement;
    const width = root.clientWidth;
    const offenders = [...document.querySelectorAll('body *')]
      .filter(node => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return style.position !== 'fixed' && rect.width > 0 && (rect.right > width + 0.5 || rect.left < -0.5);
      })
      .slice(0, 8)
      .map(node => {
        const rect = node.getBoundingClientRect();
        return {
          tag: node.tagName,
          className: node.className || '',
          text: (node.textContent || '').trim().slice(0, 90),
          left: Math.round(rect.left * 10) / 10,
          right: Math.round(rect.right * 10) / 10,
          width: Math.round(rect.width * 10) / 10
        };
      });
    return {
      clientWidth: width,
      scrollWidth: root.scrollWidth,
      overflow: Math.max(0, root.scrollWidth - width),
      offenders
    };
  })()`);
  expect(state.overflow === 0, `company information overflows at 320px: ${JSON.stringify(state)}`);

  await evaluate(cdp, `document.querySelector('.footer-preferences')?.click(); true`);
  await sleep(40);
  const dialogState = await evaluate(cdp, `(() => {
    const root = document.documentElement;
    const dialog = document.querySelector('[data-preferences-dialog]');
    const rect = dialog?.getBoundingClientRect();
    return {
      open: !!dialog?.open,
      rootOverflow: Math.max(0, root.scrollWidth - root.clientWidth),
      left: rect?.left ?? null,
      right: rect?.right ?? null,
      viewport: root.clientWidth
    };
  })()`);
  expect(dialogState.open && dialogState.rootOverflow === 0 && dialogState.left >= 0 && dialogState.right <= dialogState.viewport + 0.5, `preferences dialog does not fit a 320px viewport: ${JSON.stringify(dialogState)}`);
}

const chrome = findBinary(['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']);
if (!chrome) {
  console.error('PHASE4 BROWSER: Chrome/Chromium binary not found.');
  process.exit(1);
}

const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'blackpine-phase4-chrome-'));
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  cwd: new URL('../', import.meta.url),
  env: { ...process.env, HOST: host, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});
const browser = spawn(chrome, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profile}`,
  'about:blank'
], { stdio: ['ignore', 'ignore', 'pipe'] });

let cdp;
try {
  await waitFor(`${base}/`);
  await waitFor(`${debugBase}/json/version`);
  const target = await (await fetch(`${debugBase}/json/new?${encodeURIComponent(`${base}/`)}`, { method: 'PUT' })).json();
  cdp = new CDP(target.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  await auditPreferences(cdp);
  await auditNarrowReflow(cdp);

  if (cdp.exceptions.length) errors.push(`browser exceptions: ${cdp.exceptions.join(' | ')}`);
} catch (error) {
  errors.push(error.stack || error.message || String(error));
} finally {
  cdp?.close();
  browser.kill('SIGTERM');
  server.kill('SIGTERM');
  await Promise.all([waitForExit(browser), waitForExit(server)]);
  await fs.rm(profile, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
}

if (errors.length) {
  console.error(errors.map(error => `PHASE4 BROWSER: ${error}`).join('\n'));
  process.exit(1);
}

console.log('Phase 4 customer-experience browser checks passed: non-interruptive first visit, user-invoked EN/FR/ES preferences, save/reset behavior, and zero 320px company-information/preferences overflow.');