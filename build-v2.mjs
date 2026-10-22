import fs from 'node:fs/promises';
import { research } from './src/content.mjs';

// Extend the reviewed launch research set before the static generator evaluates it.
await import('./src/research-extra.mjs');

// Keep production references current even when an upstream publisher moves a page.
const sourceUrlRewrites = new Map([
  ['https://www.cyber.gc.ca/en/guidance/baseline-cyber-security-controls-small-medium-organizations', 'https://www.cyber.gc.ca/en/guidance/baseline-cyber-security-controls-small-and-medium-organizations'],
  ['https://www.cisa.gov/resources-tools/resources/implementing-phishing-resistant-mfa', 'https://www.cisa.gov/sites/default/files/2023-01/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf']
]);

for (const item of research) {
  if (!Array.isArray(item.sources)) continue;
  item.sources = item.sources.map(([label, url]) => [label, sourceUrlRewrites.get(url) || url]);
}

await import('./build.mjs');

const root = new URL('./', import.meta.url);
const dist = new URL('./dist/', root);

// Append reviewed hardening rules to the generated stylesheet. This keeps one
// production CSS request while allowing the base design system to stay readable.
const styleUrl = new URL('./styles.css', dist);
const hardeningCss = await fs.readFile(new URL('./src/hardening.css', root), 'utf8');
await fs.appendFile(styleUrl, `\n\n${hardeningCss.trim()}\n`);

// Google only recommends lastmod when it represents a meaningful page change.
// The base generator stamps every URL with one universal date, so omit it until
// evergreen pages track real modification dates individually.
const sitemapUrl = new URL('./sitemap.xml', dist);
let sitemap = await fs.readFile(sitemapUrl, 'utf8');
sitemap = sitemap.replace(/<lastmod>[^<]*<\/lastmod>/g, '');

// Privacy and Terms remain accessible for review but are intentionally noindex
// until qualified legal review is completed. Keep them out of the sitemap too.
for (const route of ['/legal/privacy/', '/legal/terms/']) {
  const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const urlPattern = new RegExp(`\\s*<url><loc>https://blackpinecybersecurity\\.com${escaped}<\\/loc><\\/url>`, 'g');
  sitemap = sitemap.replace(urlPattern, '');
}
await fs.writeFile(sitemapUrl, sitemap);

// Defensive output pass: fail-safe URL rewrites in generated HTML in case a
// future content module reintroduces a known moved official reference.
const htmlFiles = [];
async function walk(url) {
  for (const entry of await fs.readdir(url, { withFileTypes: true })) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, url);
    if (entry.isDirectory()) await walk(child);
    else if (entry.name.endsWith('.html')) htmlFiles.push(child);
  }
}
await walk(dist);

for (const file of htmlFiles) {
  let html = await fs.readFile(file, 'utf8');
  let changed = false;
  for (const [from, to] of sourceUrlRewrites) {
    if (html.includes(from)) {
      html = html.replaceAll(from, to);
      changed = true;
    }
  }
  if (changed) await fs.writeFile(file, html);
}
