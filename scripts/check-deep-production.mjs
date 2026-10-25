import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];
const scanned = [];
let scannedLines = 0;

const exists = url => fs.access(url).then(() => true).catch(() => false);
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function walk(dir, predicate, output = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const child = new URL(`./${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) await walk(child, predicate, output);
    else if (predicate(entry.name, child)) output.push(child);
  }
  return output;
}

const sourceRoots = [
  new URL('./src/', root),
  new URL('./scripts/', root),
  new URL('./public/', root),
  new URL('./.github/', root)
];
const sourceFiles = [];
for (const dir of sourceRoots) {
  if (!(await exists(dir))) continue;
  await walk(dir, (name) => /\.(?:js|mjs|css|yml|yaml|json|toml)$/.test(name) || name === '_headers' || name === '_redirects', sourceFiles);
}
for (const relative of ['build.mjs', 'package.json', 'netlify.toml', '_config.yml']) {
  const file = new URL(`./${relative}`, root);
  if (await exists(file)) sourceFiles.push(file);
}

for (const file of sourceFiles) {
  const content = await fs.readFile(file, 'utf8');
  const relative = decodeURIComponent(file.pathname.replace(root.pathname, ''));
  scanned.push(relative);
  scannedLines += content.split(/\r?\n/).length;
  if (content.includes('\u0000')) errors.push(`${relative} contains a NUL byte`);
}

const browserRuntimeFiles = [
  ['./src/site.js', await fs.readFile(new URL('./src/site.js', root), 'utf8')],
  ['./src/tools.js', await fs.readFile(new URL('./src/tools.js', root), 'utf8')],
  ['./src/preferences.js', await fs.readFile(new URL('./src/preferences.js', root), 'utf8')],
  ['./src/theme-init.js', await fs.readFile(new URL('./src/theme-init.js', root), 'utf8')],
  ['./public/a11y-v3.js', await fs.readFile(new URL('./public/a11y-v3.js', root), 'utf8')],
  ['./public/phase2.js', await fs.readFile(new URL('./public/phase2.js', root), 'utf8')],
  ['./public/phase3.js', await fs.readFile(new URL('./public/phase3.js', root), 'utf8')]
];
const browserRuntimeMap = new Map(browserRuntimeFiles);
const dangerousRuntimePatterns = [
  [/\.innerHTML\s*=/, 'innerHTML assignment'],
  [/\.outerHTML\s*=/, 'outerHTML assignment'],
  [/insertAdjacentHTML\s*\(/, 'insertAdjacentHTML'],
  [/document\.write(?:ln)?\s*\(/, 'document.write'],
  [/\beval\s*\(/, 'eval'],
  [/\bnew\s+Function\s*\(/, 'new Function'],
  [/setTimeout\s*\(\s*['"`]/, 'string-evaluated setTimeout'],
  [/setInterval\s*\(\s*['"`]/, 'string-evaluated setInterval']
];
for (const [relative, content] of browserRuntimeFiles) {
  for (const [pattern, label] of dangerousRuntimePatterns) {
    if (pattern.test(content)) errors.push(`${relative} uses prohibited runtime sink: ${label}`);
  }
  if (/<script\b|javascript:/i.test(content)) errors.push(`${relative} contains script-markup or javascript: URL text that requires review`);
}

const siteJs = browserRuntimeMap.get('./src/site.js') || '';
for (const marker of ['overlayRequest', 'pageRequest', 'isCurrent', 'node.inert = enabled']) {
  if (!siteJs.includes(marker)) errors.push(`src/site.js is missing stale-search/modal hardening marker: ${marker}`);
}
const toolsJs = browserRuntimeMap.get('./src/tools.js') || '';
for (const marker of ['data-headers-input', 'data-email-records-input', 'data-dns-records-input', 'data-assessment-run']) {
  if (!toolsJs.includes(marker)) errors.push(`src/tools.js is missing local tool marker: ${marker}`);
}
for (const forbidden of ['fetch(', 'sendBeacon', 'XMLHttpRequest', 'WebSocket(', 'EventSource(', 'document.cookie', 'localStorage', 'sessionStorage', 'indexedDB']) {
  if (toolsJs.includes(forbidden)) errors.push(`src/tools.js introduces forbidden local-tool primitive: ${forbidden}`);
}
const preferencesJs = browserRuntimeMap.get('./src/preferences.js') || '';
for (const marker of ['blackpine.preferences.v1', 'data-language-choice', 'No unique preference identifier is created or transmitted to Blackpine.']) {
  if (!preferencesJs.includes(marker)) errors.push(`src/preferences.js is missing preference/security marker: ${marker}`);
}
for (const forbidden of ['fetch(', 'sendBeacon', 'XMLHttpRequest', 'WebSocket(', 'document.cookie', 'randomUUID', 'indexedDB']) {
  if (preferencesJs.includes(forbidden)) errors.push(`src/preferences.js introduces forbidden preference runtime primitive: ${forbidden}`);
}
const a11yJs = browserRuntimeMap.get('./public/a11y-v3.js') || '';
for (const marker of ['event.stopImmediatePropagation()', "event.key.toLowerCase() !== 'k'", 'overlay.hidden']) {
  if (!a11yJs.includes(marker)) errors.push(`public/a11y-v3.js is missing repeated-shortcut protection marker: ${marker}`);
}
const layoutSource = await fs.readFile(new URL('./src/layout.mjs', root), 'utf8');
const headerOpen = layoutSource.match(/<header\s+class="site-header"\s+data-header[^>]*>/)?.[0];
if (!headerOpen) {
  errors.push('site layout is missing the inertable data-header site header');
} else {
  const headerStart = layoutSource.indexOf(headerOpen);
  const headerEnd = layoutSource.indexOf('</header>', headerStart);
  const skipMatch = layoutSource.slice(headerStart, headerEnd === -1 ? undefined : headerEnd).match(/<a\s+class="skip-link"\s+href="#main">[\s\S]*?<\/a>/);
  if (headerEnd === -1 || !skipMatch) {
    errors.push('skip link must remain inside the inertable site header so the modal background is fully isolated');
  }
}

const htmlFiles = await walk(dist, name => name.endsWith('.html'));
for (const file of htmlFiles) {
  const html = await fs.readFile(file, 'utf8');
  const relative = decodeURIComponent(file.pathname.replace(dist.pathname, ''));
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));

  for (const match of html.matchAll(/<button\b([^>]*)>/gi)) {
    if (!/\btype="(?:button|submit|reset)"/i.test(match[1])) errors.push(`${relative} has a button without explicit type`);
  }
  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = match[1];
    if (!/\balt="[^"]*"/i.test(attrs)) errors.push(`${relative} has an image without alt`);
    if (!/\bwidth="\d+"/i.test(attrs) || !/\bheight="\d+"/i.test(attrs)) errors.push(`${relative} has an image without intrinsic width/height`);
  }
  for (const match of html.matchAll(/\baria-controls="([^"]+)"/gi)) {
    if (!ids.has(match[1])) errors.push(`${relative} aria-controls points to missing #${match[1]}`);
  }
  for (const match of html.matchAll(/<label\b[^>]*\bfor="([^"]+)"[^>]*>/gi)) {
    if (!ids.has(match[1])) errors.push(`${relative} label points to missing #${match[1]}`);
  }
  for (const match of html.matchAll(/href="#([^"]+)"/gi)) {
    if (!ids.has(match[1])) errors.push(`${relative} fragment link points to missing #${match[1]}`);
  }
  for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
    const attrs = match[1];
    if (/\btarget="_blank"/i.test(attrs) && !/\brel="[^"]*noopener[^"]*"/i.test(attrs)) errors.push(`${relative} target=_blank link is missing rel=noopener`);
  }
  if (/href="https:\/\/verify\.blackpinecybersecurity\.com\/?"/i.test(html)) errors.push(`${relative} links to the context-free Verify root, which is not a valid public entry point`);
  if (/\son[a-z]+\s*=/i.test(html)) errors.push(`${relative} contains an inline event handler`);
  if (/<base\b/i.test(html)) errors.push(`${relative} contains a <base> element despite base-uri 'none'`);
  if (/javascript:/i.test(html)) errors.push(`${relative} contains a javascript: URL`);
  const renderedHeader = html.match(/<header\s+class="site-header"\s+data-header[^>]*>([\s\S]*?)<\/header>/i)?.[1] || '';
  if (!/<a\s+class="skip-link"\s+href="#main">[\s\S]*?<\/a>/i.test(renderedHeader)) errors.push(`${relative} does not keep the skip link inside the inertable site header`);
}

const home = await fs.readFile(new URL('./index.html', dist), 'utf8');
const featuredCount = (home.match(/class="client-quote"/g) || []).length;
if (featuredCount !== 5) errors.push(`homepage must render exactly five featured testimonials, found ${featuredCount}`);
const phase4Css = await fs.readFile(new URL('./src/styles/phase4.css', root), 'utf8');
if (/testimonial-grid-home[^\n{]*\.client-quote:nth-child\([^)]*n\+/i.test(phase4Css) && /display\s*:\s*none/i.test(phase4Css)) {
  errors.push('homepage testimonial CSS contains count-based hiding that can suppress selected client evidence');
}

const trust = await fs.readFile(new URL('./trust/index.html', dist), 'utf8');
for (const route of ['/trust/enterprise-assurance/', '/trust/governance-system/', '/trust/client-portal-security/', '/trust/service-standards/', '/trust/insurance/']) {
  if (!trust.includes(`href="${route}"`)) errors.push(`Trust Center directory is missing ${route}`);
}

const config = await fs.readFile(new URL('./_config.yml', root), 'utf8');
for (const path of ['docs', 'governance', 'media-library', 'progress', 'PHASE1_AUDIT.md', 'PHASE2_AUDIT.md', 'PHASE3_AUDIT.md', 'PHASE4_AUDIT.md', 'PHASE5_AUDIT.md', 'DEEP_PRODUCTION_AUDIT.md']) {
  if (!new RegExp(`(?:^|\\n)\\s*-\\s+${escapeRegex(path)}\\s*(?:$|\\n)`).test(config)) errors.push(`GitHub Pages exclusion missing ${path}`);
}

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Deep production audit passed: ${scanned.length} source/config files (${scannedLines.toLocaleString()} lines) scanned, ${browserRuntimeFiles.length} browser runtimes checked for dangerous sinks, and ${htmlFiles.length} generated HTML pages checked for control/link/accessibility integrity and production regressions.`);
