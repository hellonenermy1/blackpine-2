import { fileURLToPath } from 'node:url';
import { verifyRelease } from './lib/release-integrity.mjs';

const root = process.argv[2] || fileURLToPath(new URL('../dist/', import.meta.url));
const manifest = await verifyRelease(root);
console.log(`Release integrity verified: ${Object.keys(manifest.files).length} files; no missing, extra or modified files.`);
