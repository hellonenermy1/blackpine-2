import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];
const warnings = [];

const consumerEmailDomains = [
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'yahoo.com',
  'icloud.com',
  'me.com',
  'proton.me',
  'protonmail.com',
  'students.edu.sg',
  'moe.edu.sg'
];

const allowedGeneratedMailDomains = new Set(['blackpinecybersecurity.com', 'example.com']);
const textExtensions = /\.(?:md|txt|html|css|js|mjs|json|yml|yaml|toml|xml|svg|webmanifest)$/i;
const ignoredDirectories = new Set(['.git', 'dist', 'browser-artifacts', 'node_modules']);

async function walk(dir, output = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const child = new URL(`./${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) await walk(child, output);
    else if (textExtensions.test(entry.name) || ['_headers', '_redirects', '_config.yml'].includes(entry.name)) output.push(child);
  }
  return output;
}

function relative(url) {
  return decodeURIComponent(url.pathname.replace(root.pathname, ''));
}

function findConsumerEmails(content) {
  const matches = new Set();
  for (const match of content.matchAll(/\b[A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,})\b/gi)) {
    const domain = match[1].toLowerCase();
    if (consumerEmailDomains.includes(domain)) matches.add(match[0]);
  }
  return [...matches];
}

for (const file of await walk(root)) {
  const content = await fs.readFile(file, 'utf8').catch(() => null);
  if (content === null) continue;
  for (const address of findConsumerEmails(content)) errors.push(`${relative(file)} contains a personal/consumer email address: ${address}`);
}

let htmlCount = 0;
async function walkDist(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const child = new URL(`./${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) await walkDist(child);
    else if (entry.name.endsWith('.html')) {
      htmlCount += 1;
      const html = await fs.readFile(child, 'utf8');
      const name = decodeURIComponent(child.pathname.replace(dist.pathname, ''));
      if (/https?:\/\/(?:www\.)?github\.com\//i.test(html) || /githubusercontent\.com/i.test(html)) {
        errors.push(`${name} exposes a GitHub destination`);
      }
      for (const match of html.matchAll(/mailto:([^"'<>\s?]+)/gi)) {
        const address = decodeURIComponent(match[1]).toLowerCase();
        const domain = address.split('@').pop();
        if (!allowedGeneratedMailDomains.has(domain)) errors.push(`${name} exposes a non-approved mail address: ${address}`);
      }
      const owner = String(process.env.GITHUB_REPOSITORY_OWNER || '').trim();
      const repository = String(process.env.GITHUB_REPOSITORY || '').trim();
      if (owner && html.toLowerCase().includes(owner.toLowerCase())) errors.push(`${name} exposes the repository account identifier`);
      if (repository && html.toLowerCase().includes(repository.toLowerCase())) errors.push(`${name} exposes the repository identifier`);
    }
  }
}
await walkDist(dist);

const searchIndex = await fs.readFile(new URL('./search-index.json', dist), 'utf8');
if (/https?:\/\/(?:www\.)?github\.com\//i.test(searchIndex) || /githubusercontent\.com/i.test(searchIndex)) errors.push('search-index.json exposes a GitHub destination');
const owner = String(process.env.GITHUB_REPOSITORY_OWNER || '').trim();
const repository = String(process.env.GITHUB_REPOSITORY || '').trim();
if (owner && searchIndex.toLowerCase().includes(owner.toLowerCase())) errors.push('search-index.json exposes the repository account identifier');
if (repository && searchIndex.toLowerCase().includes(repository.toLowerCase())) errors.push('search-index.json exposes the repository identifier');

if (warnings.length) console.warn(warnings.map(item => `WARN: ${item}`).join('\n'));
if (errors.length) {
  console.error(errors.map(item => `PRIVACY: ${item}`).join('\n'));
  process.exit(1);
}

console.log(`Privacy exposure check passed: ${htmlCount} generated HTML pages contain no GitHub destinations/repository identifiers, generated mail links use Blackpine-owned or reserved example addresses, and repository text files contain no consumer/personal email addresses.`);
