import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readManifest, sha256 } from './lib/release-integrity.mjs';

// The baseline is local, produced from reviewed source. Never trust a manifest fetched from the monitored site.
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const manifest = await readManifest(root);
const origin = 'https://blackpinecybersecurity.com';
const representative = [
  'index.html', 'contact/index.html', 'trust/website-security/index.html',
  'fr/index.html', 'fr/contact/index.html', 'es/index.html', 'es/contact/index.html',
  'tools/security-headers/index.html', 'fr/tools/security-headers/index.html', 'es/tools/security-headers/index.html',
  'search-index.json', 'fr/search-index.json', 'es/search-index.json'
];
const selected = process.argv.includes('--all')
  ? Object.keys(manifest.files).filter(name => !name.startsWith('_') && !/(^|\/)404\.html$/.test(name))
  : [...new Set([...representative, ...Object.keys(manifest.files).filter(name => /^build\//.test(name))])];
const failures = [];
for (const name of selected) {
  const expected = manifest.files[name];
  if (!expected) { failures.push(`${name}: missing from approved baseline`); continue; }
  const requestPath = name === 'index.html' ? '/' : name.endsWith('/index.html') ? `/${name.slice(0, -10)}` : `/${name}`;
  try {
    const response = await fetch(new URL(requestPath, origin), {
      redirect: 'error', signal: AbortSignal.timeout(15000), credentials: 'omit',
      headers: { 'user-agent': 'Blackpine-Integrity-Monitor/1.0', 'cache-control': 'no-cache' }
    });
    if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
    if (name.endsWith('.html')) {
      if (!response.headers.get('cache-control')?.split(',').some(value => value.trim() === 'no-transform')) throw new Error('missing no-transform');
      if (!response.headers.get('content-security-policy')) throw new Error('missing response CSP');
    }
    const reader = response.body.getReader();
    const chunks = [];
    let length = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > expected.bytes + 1024) { await reader.cancel(); throw new Error('response exceeds approved size'); }
      chunks.push(Buffer.from(value));
    }
    const bytes = Buffer.concat(chunks);
    if (bytes.length !== expected.bytes || sha256(bytes) !== expected.sha256) throw new Error('content differs from approved release');
  } catch (error) {
    failures.push(`${requestPath}: ${error.message}`);
  }
}
const report = { version: 1, origin, mode: process.argv.includes('--all') ? 'all-public-files' : 'representative', checked: selected.length, failures };
const reportDir = fileURLToPath(new URL('../integrity-artifacts/', import.meta.url));
await fs.mkdir(reportDir, { recursive: true });
await fs.writeFile(path.join(reportDir, 'live-integrity.json'), `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) {
  console.error(failures.map(value => `INTEGRITY: ${value}`).join('\n'));
  process.exitCode = 1;
} else console.log(`Live integrity verified against locally built baseline: ${selected.length} public files.`);
