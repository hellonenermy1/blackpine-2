import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { filesWithin, releasePath, sha256, sri } from './lib/release-integrity.mjs';

// Runs after every HTML transformation, including lawyer-controlled chrome compaction.
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const files = await filesWithin(root);

for (const name of files.filter(name => name.endsWith('.html'))) {
  const file = path.join(root, name);
  let html = await fs.readFile(file, 'utf8');
  if (/http-equiv="Content-Security-Policy"/i.test(html)) throw new Error(`Unexpected preexisting CSP meta in ${name}`);
  const scriptHashes = new Set();
  const tags = [...html.matchAll(/<(?:script|link)\b[^>]*>/gi)];
  for (const [tag] of tags) {
    const script = /^<script\b/i.test(tag);
    if (!script && !/\brel="stylesheet"/i.test(tag)) continue;
    const source = tag.match(script ? /\bsrc="([^"]+)"/i : /\bhref="([^"]+)"/i)?.[1];
    if (!source && script) {
      if (!/\btype="application\/ld\+json"/i.test(tag)) throw new Error(`Unreviewed inline script in ${name}`);
      continue;
    }
    if (!source?.startsWith('/build/') || /\bintegrity\s*=/i.test(tag)) throw new Error(`Unreviewed executable/style asset in ${name}`);
    const bytes = await fs.readFile(path.join(root, releasePath(source.slice(1))));
    if (script) scriptHashes.add(`'${sri(bytes)}'`);
    html = html.replace(tag, tag.replace(/>$/, ` integrity="${sri(bytes)}">`));
  }
  if (!scriptHashes.size) throw new Error(`Missing scripts in ${name}`);
  const policy = `script-src ${[...scriptHashes].sort().join(' ')}; script-src-attr 'none'`;
  const charset = html.match(/<meta\s+charset="utf-8"\s*\/?\s*>/i)?.[0];
  if (!charset || html.indexOf(charset) > html.indexOf('<script')) throw new Error(`Missing early charset in ${name}`);
  html = html.replace(charset, `${charset}\n  <meta http-equiv="Content-Security-Policy" content="${policy}">`);
  await fs.writeFile(file, html);
}

const entries = {};
for (const name of (await filesWithin(root)).filter(name => name !== 'release-manifest.json')) {
  const bytes = await fs.readFile(path.join(root, name));
  entries[name] = { bytes: bytes.length, sha256: sha256(bytes) };
}
// No timestamps or environment-specific commit IDs: identical inputs give identical bytes.
await fs.writeFile(path.join(root, 'release-manifest.json'), `${JSON.stringify({ version: 1, files: entries }, null, 2)}\n`);
console.log(`Finalized release: script hash policy and SRI on every HTML page; ${Object.keys(entries).length} SHA-256 inventory entries.`);
