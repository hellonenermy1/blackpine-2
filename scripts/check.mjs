import fs from 'node:fs/promises';
import path from 'node:path';

const root = new URL('../dist/', import.meta.url);
const files = [];
async function walk(url) {
  for (const entry of await fs.readdir(url, {withFileTypes:true})) {
    const child = new URL(`${entry.name}${entry.isDirectory()?'/':''}`, url);
    if (entry.isDirectory()) await walk(child);
    else files.push(child);
  }
}
await walk(root);
const html = files.filter(f=>f.pathname.endsWith('.html'));
const known = new Set(files.map(f => '/' + path.relative(root.pathname, f.pathname).replaceAll('\\','/')));
let errors = [];
let titles = new Map();
let canonicals = new Map();
for (const file of html) {
  const text = await fs.readFile(file,'utf8');
  const rel = path.relative(root.pathname, file.pathname).replaceAll('\\','/');
  const h1s = (text.match(/<h1[\s>]/g)||[]).length;
  if (h1s !== 1) errors.push(`${rel}: expected 1 H1, got ${h1s}`);
  if (!text.includes('<link rel="canonical"')) errors.push(`${rel}: missing canonical`);
  if (!text.includes('meta name="description"')) errors.push(`${rel}: missing description`);
  if (!text.includes('property="og:image"')) errors.push(`${rel}: missing og:image`);
  if (/href="[^"#?]+\.html/.test(text)) errors.push(`${rel}: contains .html internal link`);
  const title = text.match(/<title>(.*?)<\/title>/s)?.[1];
  if (title) {
    if (titles.has(title) && !rel.endsWith('404.html')) errors.push(`${rel}: duplicate title with ${titles.get(title)}`);
    titles.set(title, rel);
  }
  const canonical = text.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical && !rel.endsWith('404.html')) {
    if (canonicals.has(canonical)) errors.push(`${rel}: duplicate canonical with ${canonicals.get(canonical)}`);
    canonicals.set(canonical, rel);
  }
  const ids = [...text.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  const seen = new Set();
  for (const id of ids) { if (seen.has(id)) errors.push(`${rel}: duplicate id ${id}`); seen.add(id); }
  for (const m of text.matchAll(/href="(\/[^"]*)"/g)) {
    const href = m[1].split('#')[0].split('?')[0];
    if (!href || href.startsWith('//') || href.startsWith('/.well-known/')) continue;
    const target = href.endsWith('/') ? `${href}index.html` : href;
    if (!known.has(target) && href !== '/favicon.svg' && href !== '/site.webmanifest' && href !== '/styles.css' && href !== '/site.js') {
      errors.push(`${rel}: broken internal href ${href}`);
    }
  }
}
const sec = await fs.readFile(new URL('./.well-known/security.txt', root),'utf8');
for (const required of ['Contact:','Expires:','Canonical:']) if (!sec.includes(required)) errors.push(`security.txt missing ${required}`);
const robots = await fs.readFile(new URL('./robots.txt', root),'utf8');
if (!robots.includes('Sitemap: https://blackpinecybersecurity.com/sitemap.xml')) errors.push('robots.txt missing canonical sitemap');
const sitemap = await fs.readFile(new URL('./sitemap.xml', root),'utf8');
if (sitemap.includes('/contact/thanks/') || sitemap.includes('/404/')) errors.push('sitemap contains noindex route');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Checks passed: ${html.length} HTML files; unique titles/canonicals; internal links; sitemap; robots; security.txt.`);
