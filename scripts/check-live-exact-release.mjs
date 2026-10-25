import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';

const origin = process.env.BLACKPINE_LIVE_ORIGIN || 'https://blackpinecybersecurity.com';
const timeoutMs = Number(process.env.LIVE_TIMEOUT_MS || 15000);
const retries = Number(process.env.LIVE_MATCH_RETRIES || 12);
const retryDelayMs = Number(process.env.LIVE_MATCH_RETRY_DELAY_MS || 10000);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const sha256 = value => createHash('sha256').update(value).digest('hex');
const normalizeDocumentEnd = value => value.replace(/<\/html>\s*$/i, '</html>');

const forbiddenEdgeMarkers = [
  ['Cloudflare JavaScript Detection', '/cdn-cgi/challenge-platform/scripts/jsd/main.js'],
  ['Cloudflare JavaScript Detection', 'window.__CF$cv$params'],
  ['Cloudflare Web Analytics', 'static.cloudflareinsights.com'],
  ['Cloudflare Web Analytics', 'beacon.min.js'],
  ['Cloudflare Web Analytics', 'data-cf-beacon'],
  ['Rocket Loader', 'rocket-loader'],
  ['Rocket Loader', 'data-cfasync'],
  ['Cloudflare email protection', '/cdn-cgi/l/email-protection'],
  ['Cloudflare email protection', 'data-cfemail'],
  ['Cloudflare email protection', 'email-decode.min.js']
];

function assertNoEdgeInjection(html, label) {
  const lower = html.toLowerCase();
  for (const [feature, marker] of forbiddenEdgeMarkers) {
    if (lower.includes(marker.toLowerCase())) throw new Error(`${label} contains forbidden ${feature} marker ${marker}.`);
  }
}

async function requestText(path) {
  const url = new URL(path, origin).toString();
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      'user-agent': 'Blackpine-Production-Audit/1.0 (+https://blackpinecybersecurity.com/trust/website-security/)'
    }
  });
  return { url, status: response.status, text: await response.text(), headers: response.headers };
}

const mappings = new Map([
  ['/', 'index.html'],
  ['/company/about/', 'company/about/index.html'],
  ['/services/emergency-response/', 'services/emergency-response/index.html'],
  ['/trust/', 'trust/index.html'],
  ['/contact/', 'contact/index.html']
]);

for (let attempt = 1; attempt <= retries; attempt += 1) {
  const mismatches = [];

  for (const [path, relative] of mappings) {
    try {
      const expected = normalizeDocumentEnd(await fs.readFile(new URL(`../dist/${relative}`, import.meta.url), 'utf8'));
      const live = await requestText(path);
      if (live.status !== 200) {
        mismatches.push(`${path} returned ${live.status}; expected 200`);
        continue;
      }

      const cacheControl = String(live.headers.get('cache-control') || '').toLowerCase();
      if (!cacheControl.split(',').map(value => value.trim()).includes('no-transform')) {
        mismatches.push(`${path} is missing Cache-Control no-transform; received ${cacheControl || '<missing>'}`);
        continue;
      }

      assertNoEdgeInjection(live.text, path);
      const liveHtml = normalizeDocumentEnd(live.text);
      const expectedHash = sha256(expected);
      const liveHash = sha256(liveHtml);
      if (liveHash !== expectedHash) mismatches.push(`${path} expected ${expectedHash.slice(0, 12)} got ${liveHash.slice(0, 12)} with edge transformation forbidden`);
    } catch (error) {
      mismatches.push(`${path} ${error.message}`);
    }
  }

  if (!mismatches.length) {
    console.log(`Exact live-release match passed for ${mappings.size} representative routes with Cache-Control no-transform and no Cloudflare JavaScript Detection, Analytics, Rocket Loader, email protection, or other recognized HTML injection.`);
    process.exit(0);
  }

  if (attempt < retries) {
    console.warn(`Exact live-release match attempt ${attempt}/${retries} not ready: ${mismatches.join('; ')}`);
    await sleep(retryDelayMs);
    continue;
  }

  console.error(`ERROR: canonical production does not match the generated release after ${retries} attempt(s): ${mismatches.join('; ')}`);
  process.exit(1);
}
