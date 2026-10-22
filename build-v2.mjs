import fs from 'node:fs/promises';

// Extend the core content model before the static generator evaluates it.
// Keeping the additional launch research separate makes editorial review easier
// while preserving a single generated Research index.
await import('./src/research-extra.mjs');
await import('./build.mjs');

// Google only recommends lastmod when it represents a meaningful page change.
// The base generator previously stamped every URL with one universal date.
// Until per-page modification dates are tracked for evergreen pages, omission is
// more accurate than a site-wide synthetic timestamp.
const sitemapUrl = new URL('./dist/sitemap.xml', import.meta.url);
const sitemap = await fs.readFile(sitemapUrl, 'utf8');
await fs.writeFile(sitemapUrl, sitemap.replace(/<lastmod>[^<]*<\/lastmod>/g, ''));
