import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { sri } from './lib/release-integrity.mjs';

const run = promisify(execFile);
const candidates = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];
let chrome;
for (const name of candidates) {
  try { chrome = (await run('which', [name])).stdout.trim(); break; } catch { /* Try the next installed browser. */ }
}
if (!chrome) throw new Error('Chromium is required for script-integrity browser checks');
const approved = await fs.readFile(new URL('../src/theme-init.js', import.meta.url), 'utf8');
const modified = `${approved}\n// altered bytes`;
const approvedHash = sri(approved);
const page = (integrity, policy) => `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><script src="/asset.js" integrity="${integrity}"></script></head><body>Integrity fixture</body></html>`;
const cases = [
  { name: 'approved script', bytes: approved, integrity: approvedHash, policy: `script-src '${approvedHash}'`, executes: true },
  { name: 'modified asset rejected by SRI', bytes: modified, integrity: approvedHash, policy: "script-src 'self'", executes: false },
  { name: 'new script rejected by CSP even with matching SRI', bytes: modified, integrity: sri(modified), policy: `script-src '${approvedHash}'`, executes: false }
];
let current;
const server = http.createServer((request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  if (request.url === '/asset.js') {
    response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    response.end(current.bytes);
  } else {
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.end(page(current.integrity, current.policy));
  }
});
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'blackpine-script-browser-'));
try {
  for (let index = 0; index < cases.length; index += 1) {
    current = cases[index];
    const { stdout } = await run(chrome, [
      '--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking',
      '--no-first-run', `--user-data-dir=${path.join(directory, String(index))}`, '--dump-dom',
      `http://127.0.0.1:${server.address().port}/`
    ], { timeout: 30000, maxBuffer: 1024 * 1024 });
    assert.equal(/<html[^>]*\bclass="js"/.test(stdout), current.executes, current.name);
    console.log(`Browser security passed: ${current.name}`);
  }
} finally {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  await fs.rm(directory, { recursive: true, force: true });
}
