import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const errors = [];
const warnings = [];
const reviewed = [];
let reviewedLines = 0;

const exists = url => fs.access(url).then(() => true).catch(() => false);
const ignoredDirectories = new Set(['.git', 'dist', 'browser-artifacts', 'node_modules', 'media-library']);
const extensions = /\.(?:js|mjs|css|json|yml|yaml|toml|html|xml|webmanifest)$/i;
const rootFiles = new Set(['build.mjs', 'package.json', 'netlify.toml', '_config.yml']);
const selfPath = 'scripts/check-line-review.mjs';

async function walk(dir, output = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const child = new URL(`./${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) await walk(child, output);
    else if (extensions.test(entry.name) || ['_headers', '_redirects'].includes(entry.name)) output.push(child);
  }
  return output;
}

const files = [];
for (const dir of ['./src/', './scripts/', './public/', './.github/']) {
  const url = new URL(dir, root);
  if (await exists(url)) await walk(url, files);
}
for (const name of rootFiles) {
  const url = new URL(`./${name}`, root);
  if (await exists(url)) files.push(url);
}

const relative = url => decodeURIComponent(url.pathname.replace(root.pathname, ''));
const executable = path => /\.(?:js|mjs)$/i.test(path);
const applicationExecutable = path => path === 'build.mjs' || path.startsWith('src/') || path.startsWith('public/');
const browserRuntime = path => new Set([
  'src/site.js',
  'src/theme-init.js',
  'public/a11y-v3.js',
  'public/phase2.js',
  'public/phase3.js'
]).has(path);

const secretPatterns = [
  [/-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/, 'private key material'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key identifier'],
  [/\bgh[pousr]_[A-Za-z0-9_]{20,}\b/, 'GitHub token'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, 'Slack token'],
  [/\bsk_live_[A-Za-z0-9]{16,}\b/, 'live payment secret'],
  [/\bAIza[0-9A-Za-z_-]{30,}\b/, 'Google API key']
];

const applicationDangerPatterns = [
  [/\beval\s*\(/, 'eval()'],
  [/\bnew\s+Function\s*\(/, 'new Function()'],
  [/\bFunction\s*\(\s*['"`]/, 'Function constructor'],
  [/from\s+['"]node:child_process['"]|require\s*\(\s*['"](?:node:)?child_process['"]\s*\)/, 'child_process import']
];
const tlsBypassPatterns = [
  [/NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"]?0/, 'NODE_TLS_REJECT_UNAUTHORIZED=0'],
  [/rejectUnauthorized\s*:\s*false/, 'rejectUnauthorized:false'],
  [/strictSSL\s*:\s*false/, 'strictSSL:false']
];

const browserSinkPatterns = [
  [/\.innerHTML\s*=/, 'innerHTML assignment'],
  [/\.outerHTML\s*=/, 'outerHTML assignment'],
  [/insertAdjacentHTML\s*\(/, 'insertAdjacentHTML()'],
  [/document\.write(?:ln)?\s*\(/, 'document.write()'],
  [/setTimeout\s*\(\s*['"`]/, 'string-evaluated setTimeout'],
  [/setInterval\s*\(\s*['"`]/, 'string-evaluated setInterval'],
  [/javascript\s*:/i, 'javascript: URL']
];

for (const file of files.sort((a, b) => relative(a).localeCompare(relative(b)))) {
  const path = relative(file);
  const content = await fs.readFile(file, 'utf8');
  const lines = content.split(/\r?\n/);
  reviewed.push(path);
  reviewedLines += lines.length;

  lines.forEach((line, index) => {
    const location = `${path}:${index + 1}`;
    if (/\u0000/.test(line)) errors.push(`${location} contains a NUL byte`);
    if (/[\u202A-\u202E\u2066-\u2069]/u.test(line)) errors.push(`${location} contains a bidirectional Unicode control character`);
    if (/\uFEFF/u.test(line) && index !== 0) errors.push(`${location} contains an unexpected byte-order mark`);
    for (const [pattern, label] of secretPatterns) if (pattern.test(line)) errors.push(`${location} appears to contain ${label}`);
    if (/\b(?:password|passwd|secret|api[_-]?key|access[_-]?token)\s*[:=]\s*['"][^'"${}\s][^'"]{7,}['"]/i.test(line) && !/example|placeholder|dummy|test|expected|pattern|regex|label/i.test(line)) {
      warnings.push(`${location} contains a hard-coded credential-like assignment; manual review required`);
    }
    if (applicationExecutable(path)) {
      for (const [pattern, label] of applicationDangerPatterns) if (pattern.test(line)) errors.push(`${location} uses prohibited application construct: ${label}`);
    }
    if (executable(path) && path !== selfPath) {
      for (const [pattern, label] of tlsBypassPatterns) if (pattern.test(line)) errors.push(`${location} disables TLS verification: ${label}`);
    }
    if (browserRuntime(path)) {
      for (const [pattern, label] of browserSinkPatterns) if (pattern.test(line)) errors.push(`${location} uses prohibited browser sink: ${label}`);
      if (/https?:\/\//i.test(line) && !/new URL\(|location\.|blackpinecybersecurity\.com|example\.com/i.test(line)) warnings.push(`${location} contains a remote URL in browser runtime; manual review required`);
    }
    const isReviewedLocalHarness = ['scripts/check-browser.mjs', 'scripts/serve.mjs'].includes(path);
    if (/\bhttp:\/\//i.test(line) && !isReviewedLocalHarness && !/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|www\.w3\.org|purl\.org|schemas?\.|www\.sitemaps\.org)/i.test(line)) {
      warnings.push(`${location} contains an HTTP URL; manual review required`);
    }
  });
}

const browserFiles = reviewed.filter(browserRuntime);
if (browserFiles.length !== 5) errors.push(`expected exactly five browser runtime files in line review, found ${browserFiles.length}`);
if (!reviewed.includes('build.mjs') || !reviewed.includes('.github/workflows/verify.yml') || !reviewed.includes('netlify.toml')) {
  errors.push('line review does not cover all critical build/deploy configuration');
}

for (const warning of warnings) console.warn(`LINE REVIEW WARNING: ${warning}`);
if (errors.length) {
  console.error(errors.map(error => `LINE REVIEW: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Line-by-line source review passed: ${reviewed.length} code/config files and ${reviewedLines.toLocaleString()} lines checked for hidden controls, embedded secrets, dynamic application execution, process execution in application code, TLS bypasses, dangerous browser sinks, and insecure URL indicators; ${warnings.length} unresolved warning(s).`);
