import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.CONTACT_BROWSER_PORT || 4197);
const debugPort = Number(process.env.CONTACT_BROWSER_DEBUG_PORT || 9353);
const scheme = ['ht', 'tp'].join('');
const base = `${scheme}://${host}:${port}`;
const debugBase = `${scheme}://${host}:${debugPort}`;
const errors = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const expect = (condition, message) => { if (!condition) errors.push(message); };

function findBinary(candidates) {
  for (const name of candidates) {
    const result = spawnSync('which', [name], { encoding: 'utf8' });
    if (result.status === 0 && result.stdout.trim()) return result.stdout.trim();
  }
  return null;
}

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
  const response = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text || 'Runtime evaluation failed');
  return response.result?.value;
}

const chrome = findBinary(['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']);
if (!chrome) {
  console.error('CONTACT BROWSER: Chrome/Chromium binary not found.');
  process.exit(1);
}

const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'blackpine-contact-browser-'));
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  cwd: new URL('../', import.meta.url),
  env: { ...process.env, HOST: host, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});
const browser = spawn(chrome, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, 'about:blank'
], { stdio: ['ignore', 'ignore', 'pipe'] });

let cdp;
try {
  await waitFor(`${base}/`);
  await waitFor(`${debugBase}/json/version`);
  const target = await (await fetch(`${debugBase}/json/new?${encodeURIComponent(`${base}/contact/?intent=protect`)}`, { method: 'PUT' })).json();
  cdp = new CDP(target.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  const started = Date.now();
  while (Date.now() - started < 10000) {
    if (await evaluate(cdp, 'document.readyState') === 'complete') break;
    await sleep(50);
  }
  await sleep(100);

  const prepared = await evaluate(cdp, `(() => {
    const form = document.querySelector('[data-contact-form]');
    const set = (selector, value) => {
      const node = form?.querySelector(selector);
      if (!node) throw new Error('missing ' + selector);
      node.value = value;
      node.dispatchEvent(new Event('input', { bubbles: true }));
      node.dispatchEvent(new Event('change', { bubbles: true }));
    };
    set('#name', 'Browser Regression');
    set('#email', 'browser-regression@example.com');
    set('#organization', 'Example Organization');
    set('#intent', 'protect');
    set('#message', 'X'.repeat(2000));
    form.requestSubmit();
    const output = form.querySelector('[data-contact-prepared-output]');
    const link = form.querySelector('[data-contact-open-email]');
    return {
      visible: !form.querySelector('[data-contact-prepared]')?.hidden,
      outputLength: output?.value?.length || 0,
      hasLongMessage: output?.value?.includes('X'.repeat(2000)) || false,
      href: link?.getAttribute('href') || '',
      focused: document.activeElement === output
    };
  })()`);
  expect(prepared.visible, `prepared inquiry panel did not open: ${JSON.stringify(prepared)}`);
  expect(prepared.hasLongMessage && prepared.outputLength > 2000, `prepared summary did not retain the maximum message payload: ${JSON.stringify(prepared)}`);
  expect(prepared.href.startsWith('mailto:contact@blackpinecybersecurity.com?subject='), `mailto handoff has unexpected target: ${prepared.href}`);
  expect(!/[?&]body=/i.test(prepared.href) && !prepared.href.includes('XXXX'), `mailto handoff still contains inquiry body: ${prepared.href.slice(0, 240)}`);
  expect(prepared.focused, 'prepared summary did not receive focus after composition');

  const copied = await evaluate(cdp, `(async () => {
    const output = document.querySelector('[data-contact-prepared-output]');
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__contactCopied = text; } } });
    document.querySelector('[data-contact-copy]')?.click();
    await new Promise(resolve => setTimeout(resolve, 30));
    return {
      copiedMatches: window.__contactCopied === output?.value,
      status: document.querySelector('[data-contact-prepared-status]')?.textContent?.trim() || ''
    };
  })()`);
  expect(copied.copiedMatches, `clipboard path did not copy the prepared summary: ${JSON.stringify(copied)}`);
  expect(/copied/i.test(copied.status), `clipboard success did not expose confirmation status: ${copied.status}`);

  const fallback = await evaluate(cdp, `(async () => {
    const output = document.querySelector('[data-contact-prepared-output]');
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('blocked'); } } });
    document.querySelector('[data-contact-copy]')?.click();
    await new Promise(resolve => setTimeout(resolve, 30));
    return {
      focused: document.activeElement === output,
      selectedAll: output?.selectionStart === 0 && output?.selectionEnd === output?.value.length,
      status: document.querySelector('[data-contact-prepared-status]')?.textContent?.trim() || ''
    };
  })()`);
  expect(fallback.focused && fallback.selectedAll, `manual-copy fallback did not select the prepared summary: ${JSON.stringify(fallback)}`);
  expect(/unavailable/i.test(fallback.status), `manual-copy fallback did not explain the next step: ${fallback.status}`);
} catch (error) {
  errors.push(error.stack || error.message || String(error));
} finally {
  cdp?.close();
  browser.kill('SIGTERM');
  server.kill('SIGTERM');
  await fs.rm(profile, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 }).catch(() => {});
}

if (errors.length) {
  console.error(errors.map(error => `CONTACT BROWSER: ${error}`).join('\n'));
  process.exit(1);
}

console.log('Contact composer browser checks passed: maximum local inquiry content remains in the prepared summary, mailto stays bounded to recipient/subject, clipboard copy works, and blocked clipboard falls back to selected manual-copy text.');
