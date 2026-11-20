import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { releasePath, verifyRelease } from './lib/release-integrity.mjs';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const manifest = await verifyRelease(root);
let resources = 0;
let pages = 0;
for (const name of Object.keys(manifest.files).filter(name => name.endsWith('.html'))) {
  const html = await fs.readFile(path.join(root, name), 'utf8');
  const policies = [...html.matchAll(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/g)];
  assert.equal(policies.length, 1, `${name}: requires one hash restriction`);
  const policy = policies[0][1];
  assert.ok(html.indexOf(policies[0][0]) < html.indexOf('<script'), `${name}: policy must precede scripts`);
  assert.ok(!policy.includes("'self'") && !policy.includes('unsafe-') && !policy.includes('https:'), `${name}: script policy must authorize hashes only`);
  for (const [tag] of html.matchAll(/<(?:script|link)\b[^>]*>/gi)) {
    const script = /^<script\b/.test(tag);
    if (!script && !/rel="stylesheet"/.test(tag)) continue;
    const source = tag.match(script ? /\bsrc="([^"]+)"/ : /\bhref="([^"]+)"/)?.[1];
    if (!source) { assert.ok(/type="application\/ld\+json"/.test(tag), `${name}: executable inline script`); continue; }
    assert.ok(source.startsWith('/build/'), `${name}: unreviewed resource`);
    const bytes = await fs.readFile(path.join(root, releasePath(source.slice(1))));
    const expected = `sha384-${createHash('sha384').update(bytes).digest('base64')}`;
    assert.equal(tag.match(/\bintegrity="([^"]+)"/)?.[1], expected, `${name}: incorrect resource integrity`);
    if (script) assert.ok(policy.includes(`'${expected}'`), `${name}: script not authorized by hash policy`);
    resources += 1;
  }
  pages += 1;
}

for (const invalid of ['../file', '/file', 'a/../b', 'a\\b', 'a//b', 'a%2fb', 'a?b', 'a#b', 'a\nb']) assert.throws(() => releasePath(invalid));
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'blackpine-integrity-'));
try {
  const content = Buffer.from('approved release');
  const fixture = { version: 1, files: { 'index.html': { bytes: content.length, sha256: createHash('sha256').update(content).digest('hex') } } };
  await fs.writeFile(path.join(temporary, 'index.html'), content);
  await fs.writeFile(path.join(temporary, 'release-manifest.json'), JSON.stringify(fixture));
  await verifyRelease(temporary);
  await fs.writeFile(path.join(temporary, 'index.html'), 'changed release!');
  await assert.rejects(verifyRelease(temporary), /integrity mismatch/);
  await fs.writeFile(path.join(temporary, 'index.html'), content);
  await fs.writeFile(path.join(temporary, 'unexpected.js'), 'unexpected');
  await assert.rejects(verifyRelease(temporary), /inventory/);
  await fs.rm(path.join(temporary, 'unexpected.js'));
  await fs.rm(path.join(temporary, 'index.html'));
  await assert.rejects(verifyRelease(temporary), /inventory/);
  await fs.symlink('/etc/hosts', path.join(temporary, 'index.html'));
  await assert.rejects(verifyRelease(temporary), /symbolic link/);
} finally {
  await fs.rm(temporary, { recursive: true, force: true });
}
console.log(`Release security passed: ${pages} HTML pages; ${resources} SRI resources; hash-only script restrictions; modified/missing/extra file, symlink and invalid-path rejection.`);
