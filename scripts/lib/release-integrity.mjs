import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export const sri = bytes => `sha384-${createHash('sha384').update(bytes).digest('base64')}`;

export function releasePath(value) {
  if (typeof value !== 'string' || !value || value.startsWith('/') || value.includes('\\') || /[\x00-\x20%?#]/.test(value)) throw new Error('Invalid release path');
  if (value.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('Invalid release path segment');
  return value;
}

export async function filesWithin(root, prefix = '') {
  const files = [];
  for (const entry of await fs.readdir(path.join(root, prefix), { withFileTypes: true })) {
    const name = releasePath(prefix ? `${prefix}/${entry.name}` : entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Release contains a symbolic link: ${name}`);
    if (entry.isDirectory()) files.push(...await filesWithin(root, name));
    else if (entry.isFile()) files.push(name);
    else throw new Error(`Release contains a non-regular file: ${name}`);
  }
  return files.sort();
}

export async function readManifest(root) {
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'release-manifest.json'), 'utf8'));
  if (manifest.version !== 1 || !manifest.files || Array.isArray(manifest.files) || typeof manifest.files !== 'object') throw new Error('Invalid release manifest');
  for (const [name, record] of Object.entries(manifest.files)) {
    releasePath(name);
    if (!record || !/^[a-f0-9]{64}$/.test(record.sha256) || !Number.isSafeInteger(record.bytes) || record.bytes < 0) throw new Error(`Invalid manifest entry: ${name}`);
  }
  return manifest;
}

export async function verifyRelease(root) {
  const manifest = await readManifest(root);
  const actual = (await filesWithin(root)).filter(name => name !== 'release-manifest.json');
  const expected = Object.keys(manifest.files).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error('Release file inventory differs from manifest');
  for (const name of expected) {
    const bytes = await fs.readFile(path.join(root, name));
    const record = manifest.files[name];
    if (bytes.length !== record.bytes || sha256(bytes) !== record.sha256) throw new Error(`Release integrity mismatch: ${name}`);
  }
  return manifest;
}
