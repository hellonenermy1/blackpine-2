import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];

const read = relative => fs.readFile(new URL(relative, root), 'utf8');
const readDist = relative => fs.readFile(new URL(relative, dist), 'utf8');
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'browser-artifacts', 'phase4-artifacts']);

async function walk(dir, output = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const child = new URL(`./${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) await walk(child, output);
    else output.push(child);
  }
  return output;
}

const relative = (url, base = root) => decodeURIComponent(url.pathname.replace(base.pathname, ''));

const gitignore = await read('./.gitignore');
for (const required of ['.env', '.env.*', '!.env.example', '.dev.vars', '.dev.vars.*', '!.dev.vars.example', '.wrangler/', 'phase4-artifacts/']) {
  if (!gitignore.split(/\r?\n/).includes(required)) errors.push(`.gitignore is missing secret/build guard ${required}`);
}

const repositoryFiles = await walk(root);
const sensitiveNamePatterns = [
  [/(^|\/)\.env(?:\.|$)/, '.env-style secret file'],
  [/(^|\/)\.dev\.vars(?:\.|$)/, 'Cloudflare local secret file'],
  [/(^|\/)id_(?:rsa|dsa|ecdsa|ed25519)(?:\.pub)?$/i, 'SSH key file'],
  [/\.(?:p12|pfx|jks|keystore)$/i, 'credential/key-store file']
];
for (const file of repositoryFiles) {
  const path = relative(file);
  const allowedExample = /(?:^|\/)\.env\.example$/.test(path) || /(?:^|\/)\.dev\.vars\.example$/.test(path);
  if (allowedExample) continue;
  for (const [pattern, label] of sensitiveNamePatterns) if (pattern.test(path)) errors.push(`${path} is a tracked/working-tree ${label}`);
}

const textExtensions = /\.(?:md|txt|js|mjs|css|json|yml|yaml|toml|html|xml|webmanifest|svg)$/i;
const textSpecialNames = new Set(['_headers', '_redirects', '.npmrc']);
const secretPatterns = [
  [/-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/, 'private key material'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key identifier'],
  [/\bgh[pousr]_[A-Za-z0-9_]{20,}\b/, 'GitHub token'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, 'Slack token'],
  [/\bsk_live_[A-Za-z0-9]{16,}\b/, 'live payment secret'],
  [/\bAIza[0-9A-Za-z_-]{30,}\b/, 'Google API key']
];
for (const file of repositoryFiles) {
  const path = relative(file);
  const name = path.split('/').at(-1);
  if (!textExtensions.test(path) && !textSpecialNames.has(name)) continue;
  const content = await fs.readFile(file, 'utf8');
  for (const [pattern, label] of secretPatterns) if (pattern.test(content)) errors.push(`${path} appears to contain ${label}`);
}

const runtimePaths = [
  './src/site.js',
  './src/tools.js',
  './src/preferences.js',
  './src/theme-init.js',
  './public/a11y-v3.js',
  './public/phase2.js',
  './public/phase3.js'
];
const runtimeEntries = await Promise.all(runtimePaths.map(async path => [path, await read(path)]));
const runtime = Object.fromEntries(runtimeEntries);
const combinedRuntime = runtimeEntries.map(([, content]) => content).join('\n');

for (const forbidden of ['sessionStorage', 'indexedDB', 'document.cookie', 'cookieStore']) {
  if (combinedRuntime.includes(forbidden)) errors.push(`browser runtime unexpectedly uses ${forbidden}`);
}
for (const path of ['./src/tools.js', './public/a11y-v3.js', './public/phase2.js', './public/phase3.js']) {
  if (runtime[path].includes('localStorage')) errors.push(`${path} must not persist browser state`);
}
const persistedKeys = new Set([...combinedRuntime.matchAll(/['"](blackpine(?:\.[a-z0-9.-]+|-theme))['"]/gi)].map(match => match[1]));
for (const key of persistedKeys) if (!new Set(['blackpine.preferences.v1', 'blackpine-theme']).has(key)) errors.push(`unexpected Blackpine browser-storage key ${key}`);
for (const expected of ['blackpine.preferences.v1', 'blackpine-theme']) if (!persistedKeys.has(expected)) errors.push(`expected browser-storage key ${expected} is missing from runtime`);

for (const api of ['XMLHttpRequest', 'WebSocket', 'EventSource', 'sendBeacon']) {
  if (combinedRuntime.includes(api)) errors.push(`browser runtime introduces unreviewed network API ${api}`);
}
const fetchCount = (combinedRuntime.match(/\bfetch\s*\(/g) || []).length;
if (fetchCount !== 1) errors.push(`expected exactly one reviewed fetch() call in browser runtime, found ${fetchCount}`);
if (!runtime['./src/site.js'].includes("fetch(indexPath, { credentials: 'same-origin' })")) errors.push('the reviewed fetch() call must remain the same-origin local search-index request');
if (!runtime['./public/phase3.js'].includes('url.origin !== window.location.origin')) errors.push('prefetch runtime must retain an explicit same-origin guard');

const toolsRuntime = runtime['./src/tools.js'];
if (/localStorage|sessionStorage|indexedDB|document\.cookie|cookieStore/.test(toolsRuntime)) errors.push('local tools runtime must not persist pasted/tool data');
if (/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon/.test(toolsRuntime)) errors.push('local tools runtime must not transmit pasted/tool data over a website network API');

const contactRuntime = runtime['./public/phase2.js'];
if (/localStorage|sessionStorage|indexedDB|document\.cookie|cookieStore/.test(contactRuntime)) errors.push('contact runtime must not persist inquiry data');
if (/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon/.test(contactRuntime)) errors.push('contact runtime must not transmit inquiry data over a website network API');
if (!contactRuntime.includes('mailto:contact@blackpinecybersecurity.com')) errors.push('contact composer recipient is not fixed to the published Blackpine mailbox');
if (!contactRuntime.includes('encodeURIComponent(inquiry.subject)')) errors.push('contact email subject must be percent-encoded before it is placed in the mailto URI');
if (/mailto:[^`'"\n]*[?&]body=/i.test(contactRuntime) || /encodeURIComponent\(.*body/i.test(contactRuntime)) errors.push('contact composer must not place inquiry body content in the mailto URI');
if (!contactRuntime.includes("value('#message').slice(0, 2000)")) errors.push('contact composer message length bound is missing');
for (const marker of ['data-contact-prepared-output', 'data-contact-copy', 'data-contact-open-email', 'navigator.clipboard?.writeText']) {
  if (!contactRuntime.includes(marker) && !marker.startsWith('data-contact-')) errors.push(`contact fallback runtime is missing ${marker}`);
}

const contact = await readDist('./contact/index.html');
const contactForm = contact.match(/<form\b[^>]*data-contact-form[^>]*>/i)?.[0] || '';
if (!contactForm) errors.push('generated contact form shell is missing');
if (/\baction\s*=|\bmethod\s*=/i.test(contactForm)) errors.push('generated contact form must not have a network-capable action or method');
if (/data-netlify|netlify-honeypot|name="form-name"/i.test(contact)) errors.push('generated contact page must not contain dormant Netlify form markers');
if (!/<button\b[^>]*type="button"[^>]*data-contact-compose-button/i.test(contact)) errors.push('generated contact composer control must remain a non-submitting button');
for (const marker of ['data-contact-prepared', 'data-contact-prepared-output', 'data-contact-copy', 'data-contact-open-email']) {
  if (!contact.includes(marker)) errors.push(`generated contact page is missing local fallback control ${marker}`);
}

const distFiles = await walk(dist, []);
const forbiddenOutputSegments = new Set(['src', 'scripts', 'docs', 'governance', 'progress', 'audit', 'node_modules', 'browser-artifacts', 'phase4-artifacts']);
const forbiddenOutputNames = new Set(['package.json', '_config.yml', 'build.mjs', 'netlify.toml', 'README.md', 'AUDIT.md', 'CLAIMS.md', 'SECURITY.md']);
for (const file of distFiles) {
  const path = relative(file, dist);
  const parts = path.split('/');
  if (parts.some(part => forbiddenOutputSegments.has(part))) errors.push(`production output leaks internal directory in ${path}`);
  if (forbiddenOutputNames.has(parts.at(-1))) errors.push(`production output leaks internal file ${path}`);
  if (/\.(?:md|mjs|toml|ya?ml|map|env)$/i.test(path)) errors.push(`production output contains source/development artifact ${path}`);
  if (/\.html$/i.test(path) && !/(^|\/)(?:index|404)\.html$/i.test(path)) errors.push(`production output contains duplicate legacy-style HTML route ${path}`);
}

const htmlFiles = distFiles.filter(file => /\.html$/i.test(relative(file, dist)));
const firstPartyOrigin = 'https://blackpinecybersecurity.com';
for (const file of htmlFiles) {
  const path = relative(file, dist);
  const html = await fs.readFile(file, 'utf8');
  const tags = [...html.matchAll(/<(script|img|iframe|source|video|audio|embed|object|link)\b[^>]*>/gi)].map(match => match[0]);
  for (const tag of tags) {
    const urls = [];
    for (const match of tag.matchAll(/\b(?:src|href|data|poster)="(https?:\/\/[^"\s]+)"/gi)) urls.push(match[1]);
    for (const match of tag.matchAll(/\bsrcset="([^"]+)"/gi)) {
      for (const candidate of match[1].split(',')) {
        const value = candidate.trim().split(/\s+/)[0];
        if (/^https?:\/\//i.test(value)) urls.push(value);
      }
    }
    for (const value of urls) {
      let url;
      try { url = new URL(value); } catch { errors.push(`${path} contains malformed subresource URL ${value}`); continue; }
      if (url.origin !== firstPartyOrigin) errors.push(`${path} loads third-party subresource ${url.origin}`);
    }
  }
}

for (const file of distFiles.filter(file => /\.css$/i.test(relative(file, dist)))) {
  const path = relative(file, dist);
  const css = await fs.readFile(file, 'utf8');
  if (/(?:url\(|@import\s+)[^;\n]*https?:\/\//i.test(css)) errors.push(`${path} contains a remote CSS dependency`);
}

const redirects = await readDist('./_redirects');
if (/^\/\*\s+\/(?:index\.html)?\s+200\s*$/m.test(redirects)) errors.push('Cloudflare redirects contain a catch-all 200 rewrite that would create soft 404s');
const netlify = await read('./netlify.toml');
if (/from\s*=\s*"\/\*"[\s\S]{0,160}?status\s*=\s*200/m.test(netlify)) errors.push('portable hosting config contains a catch-all 200 rewrite that would create soft 404s');

if (errors.length) {
  console.error(errors.map(error => `PHASE2 SECURITY: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Phase 2 security hardening checks passed: repository secret guards, seven reviewed browser runtime sources, two approved browser-storage keys, one reviewed same-origin fetch, local/non-persisting tool and contact behavior, bounded contact content with no inquiry body in mailto URLs, no third-party subresources, no source-map/internal production leakage, and no catch-all soft-404 rewrite.`);
