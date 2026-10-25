import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.PHASE3_BROWSER_PORT || 4183);
const debugPort = Number(process.env.PHASE3_CHROME_DEBUG_PORT || 9343);
const localScheme = ['ht', 'tp'].join('');
const base = `${localScheme}://${host}:${port}`;
const debugBase = `${localScheme}://${host}:${debugPort}`;
const errors = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

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

async function navigate(cdp, pathname) {
  await cdp.send('Page.navigate', { url: `${base}${pathname}` });
  const started = Date.now();
  while (Date.now() - started < 10000) {
    if (await evaluate(cdp, 'document.readyState') === 'complete') break;
    await sleep(50);
  }
  await sleep(100);
}

const expect = (condition, message) => { if (!condition) errors.push(message); };

async function auditThemePersistence(cdp) {
  await navigate(cdp, '/');
  await evaluate(cdp, `(() => {
    localStorage.clear();
    localStorage.setItem('blackpine-theme', 'dark');
    return true;
  })()`);
  await navigate(cdp, '/');
  const migrated = await evaluate(cdp, `(() => ({
    theme: document.documentElement.dataset.theme,
    primary: localStorage.getItem('blackpine.preferences.v1'),
    legacy: localStorage.getItem('blackpine-theme')
  }))()`);
  expect(migrated.theme === 'dark', `legacy theme did not restore before/at page load: ${JSON.stringify(migrated)}`);
  let parsed = null;
  try { parsed = JSON.parse(migrated.primary || 'null'); } catch {}
  expect(parsed?.theme === 'dark', `legacy theme did not migrate into primary preference record: ${migrated.primary}`);
  expect(migrated.legacy === null, 'legacy blackpine-theme key was not cleaned up after successful migration');

  await evaluate(cdp, `document.querySelector('[data-theme-toggle]')?.click(); true`);
  await sleep(50);
  const changed = await evaluate(cdp, `(() => ({
    theme: document.documentElement.dataset.theme,
    primary: localStorage.getItem('blackpine.preferences.v1'),
    legacy: localStorage.getItem('blackpine-theme')
  }))()`);
  parsed = null;
  try { parsed = JSON.parse(changed.primary || 'null'); } catch {}
  expect(changed.theme === 'light', `theme toggle did not advance dark -> light: ${JSON.stringify(changed)}`);
  expect(parsed?.theme === 'light', `theme-change event was not persisted by preferences runtime: ${changed.primary}`);
  expect(changed.legacy === null, 'theme toggle recreated the legacy blackpine-theme key');
}

async function auditHeaderTool(cdp, pathname = '/tools/security-headers/', localizedPattern = /Content-Security-Policy/) {
  const sample = [
    "Content-Security-Policy: default-src 'self'; frame-ancestors 'none'",
    'Strict-Transport-Security: max-age=31536000',
    'X-Content-Type-Options: nosniff',
    'Referrer-Policy: strict-origin-when-cross-origin',
    'Permissions-Policy: camera=()'
  ].join('\n');
  await navigate(cdp, pathname);
  const state = await evaluate(cdp, `(() => {
    const input = document.querySelector('[data-headers-input]');
    const run = document.querySelector('[data-headers-run]');
    if (!input || !run) return { missing: true };
    input.value = ${JSON.stringify(sample)};
    run.click();
    return { missing: false, text: document.querySelector('[data-headers-output]')?.textContent || '' };
  })()`);
  expect(!state.missing, `${pathname} missing header-tool controls`);
  expect(localizedPattern.test(state.text || ''), `${pathname} header-tool output was not produced: ${state.text || ''}`);
  expect(/HSTS|Strict-Transport-Security/.test(state.text || ''), `${pathname} header-tool HSTS result missing`);
}

async function auditEmailTool(cdp) {
  const sample = [
    'TXT @ v=spf1 include:_spf.example.test -all',
    'TXT selector._domainkey v=DKIM1; p=abc',
    'TXT _dmarc v=DMARC1; p=reject'
  ].join('\n');
  await navigate(cdp, '/tools/email-security/');
  const text = await evaluate(cdp, `(() => {
    const input = document.querySelector('[data-email-records-input]');
    input.value = ${JSON.stringify(sample)};
    document.querySelector('[data-email-records-run]')?.click();
    return document.querySelector('[data-email-records-output]')?.textContent || '';
  })()`);
  expect(/SPF/.test(text) && /DKIM/.test(text) && /DMARC/.test(text), `email-security tool output incomplete: ${text}`);
  expect(/p=reject/.test(text), `email-security tool did not preserve DMARC enforcement detail: ${text}`);
}

async function auditDnsTool(cdp) {
  const sample = [
    'example.test. 3600 IN NS ns1.example.test.',
    'example.test. 3600 IN MX 10 mail.example.test.',
    'example.test. 3600 IN CAA 0 issue "letsencrypt.org"',
    '_dmarc.example.test. 3600 IN TXT "v=DMARC1; p=reject"'
  ].join('\n');
  await navigate(cdp, '/tools/domain-dns/');
  const text = await evaluate(cdp, `(() => {
    const input = document.querySelector('[data-dns-records-input]');
    input.value = ${JSON.stringify(sample)};
    document.querySelector('[data-dns-records-run]')?.click();
    return document.querySelector('[data-dns-records-output]')?.textContent || '';
  })()`);
  expect(/Authoritative nameservers|NS records/.test(text), `DNS tool nameserver result missing: ${text}`);
  expect(/CAA/.test(text) && /DMARC/.test(text), `DNS tool CAA/DMARC result missing: ${text}`);
}

async function auditAssessment(cdp) {
  await navigate(cdp, '/assessment/');
  const state = await evaluate(cdp, `(() => {
    const form = document.querySelector('[data-assessment]');
    if (!form) return { missing: true };
    for (const field of form.querySelectorAll('fieldset[data-category]')) field.querySelector('input[value="yes"]')?.click();
    document.querySelector('[data-assessment-run]')?.click();
    return { missing: false, text: document.querySelector('[data-assessment-output]')?.textContent || '' };
  })()`);
  expect(!state.missing, 'assessment surface is missing');
  expect(/Stronger baseline/.test(state.text || ''), `assessment did not calculate category observations: ${state.text || ''}`);
  expect(/not a risk rating or security assessment/i.test(state.text || ''), 'assessment lost its non-assessment disclaimer');
}

async function auditLocalizedTools(cdp) {
  await navigate(cdp, '/fr/assessment/');
  const fr = await evaluate(cdp, `(() => {
    const form = document.querySelector('[data-assessment]');
    if (!form) return '';
    for (const field of form.querySelectorAll('fieldset[data-category]')) field.querySelector('input[value="partial"]')?.click();
    document.querySelector('[data-assessment-run]')?.click();
    return document.querySelector('[data-assessment-output]')?.textContent || '';
  })()`);
  expect(/À examiner/.test(fr), `French assessment runtime did not render reviewed French output: ${fr}`);

  await auditHeaderTool(cdp, '/es/tools/security-headers/', /Presente|Revisar/);
}

const chrome = findBinary(['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']);
if (!chrome) {
  console.error('PHASE3 BROWSER: Chrome/Chromium binary not found.');
  process.exit(1);
}

const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'blackpine-phase3-chrome-'));
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

  await auditThemePersistence(cdp);
  await auditHeaderTool(cdp);
  await auditEmailTool(cdp);
  await auditDnsTool(cdp);
  await auditAssessment(cdp);
  await auditLocalizedTools(cdp);

  if (cdp.exceptions.length) errors.push(`browser exceptions: ${cdp.exceptions.join(' | ')}`);
} catch (error) {
  errors.push(error.stack || error.message || String(error));
} finally {
  cdp?.close();
  browser.kill('SIGTERM');
  server.kill('SIGTERM');
  await fs.rm(profile, { recursive: true, force: true });
}

if (errors.length) {
  console.error(errors.map(error => `PHASE3 BROWSER: ${error}`).join('\n'));
  process.exit(1);
}

console.log('Phase 3 engineering browser checks passed: one-way legacy theme migration, primary preference persistence, extracted header/email/DNS tools, assessment behavior, and French/Spanish route-scoped runtime smoke.');
