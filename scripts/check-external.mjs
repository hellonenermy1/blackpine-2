import fs from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
const canonicalOrigin = 'https://blackpinecybersecurity.com';
const urls = new Set();
let htmlFiles = 0;

async function walk(url) {
  for (const entry of await fs.readdir(url, { withFileTypes: true })) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, url);
    if (entry.isDirectory()) await walk(child);
    else if (entry.name.endsWith('.html')) {
      htmlFiles += 1;
      const html = await fs.readFile(child, 'utf8');
      for (const match of html.matchAll(/href="(https:\/\/[^"<]+)"/g)) {
        try {
          const target = new URL(match[1].replace(/&amp;/g, '&'));
          if (target.origin === canonicalOrigin) continue;
          target.hash = '';
          urls.add(target.toString());
        } catch {
          // Generated absolute links should already be URL-valid; structural checks cover internal links.
        }
      }
    }
  }
}

await walk(dist);

const dead = [];
const warnings = [];

for (const url of [...urls].sort()) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
      headers: {
        'user-agent': 'Blackpine-Link-Audit/1.0 (+https://blackpinecybersecurity.com/trust/website-security/)'
      }
    });
    await response.body?.cancel().catch(() => {});

    if (response.status === 404 || response.status === 410) dead.push(`${response.status} ${url}`);
    else if (response.status >= 500) warnings.push(`${response.status} ${url}`);
    else if (response.status >= 400 && ![401, 403, 405, 429].includes(response.status)) warnings.push(`${response.status} ${url}`);
  } catch (error) {
    warnings.push(`${url} — ${error.name || 'network error'}: ${error.message}`);
  }
}

if (warnings.length) console.warn(warnings.map(item => `WARN: ${item}`).join('\n'));
if (dead.length) {
  console.error(dead.map(item => `DEAD: ${item}`).join('\n'));
  process.exit(1);
}

console.log(`External site-wide link audit completed: ${htmlFiles} generated HTML files scanned, ${urls.size} unique external HTTPS destinations checked; no confirmed 404/410 responses.`);
