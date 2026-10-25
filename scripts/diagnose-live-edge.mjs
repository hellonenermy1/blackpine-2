import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';

const canonical = 'https://blackpinecybersecurity.com/';
const pagesDomain = 'https://blackpine-cybersecurity.pages.dev/';
const sha256 = value => createHash('sha256').update(value).digest('hex');
const markers = [
  '/cdn-cgi/l/email-protection',
  'data-cfemail',
  'email-decode.min.js',
  'cloudflareinsights.com',
  'beacon.min.js',
  'data-cf-beacon',
  'challenge-platform',
  '__cf_chl',
  'rocket-loader',
  'data-cfasync'
];

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
    headers: { 'user-agent': 'Blackpine-Production-Audit/1.0 (+https://blackpinecybersecurity.com/trust/website-security/)' }
  });
  return { status: response.status, text: await response.text(), headers: response.headers };
}

function firstDiff(a, b) {
  const limit = Math.min(a.length, b.length);
  let index = 0;
  while (index < limit && a[index] === b[index]) index += 1;
  if (index === limit && a.length === b.length) return null;
  const start = Math.max(0, index - 120);
  const endA = Math.min(a.length, index + 220);
  const endB = Math.min(b.length, index + 220);
  const clean = value => value.slice(start, endA).replace(/\s+/g, ' ').slice(0, 360);
  const cleanB = value => value.slice(start, endB).replace(/\s+/g, ' ').slice(0, 360);
  return { index, a: clean(a), b: cleanB(b) };
}

function markerReport(text) {
  return Object.fromEntries(markers.map(marker => [marker, text.toLowerCase().split(marker.toLowerCase()).length - 1]));
}

const local = await fs.readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const live1 = await fetchText(canonical);
const live2 = await fetchText(canonical);
let pages = null;
try {
  pages = await fetchText(pagesDomain);
} catch (error) {
  console.warn(`Pages-domain diagnostic fetch failed: ${error.message}`);
}

console.log(JSON.stringify({
  local: { bytes: Buffer.byteLength(local), sha256: sha256(local) },
  live1: { status: live1.status, bytes: Buffer.byteLength(live1.text), sha256: sha256(live1.text), markers: markerReport(live1.text) },
  live2: { status: live2.status, bytes: Buffer.byteLength(live2.text), sha256: sha256(live2.text), markers: markerReport(live2.text) },
  pages: pages ? { status: pages.status, bytes: Buffer.byteLength(pages.text), sha256: sha256(pages.text), markers: markerReport(pages.text) } : null,
  localMarkers: markerReport(local),
  diffLocalLive: firstDiff(local, live1.text),
  diffLiveLive: firstDiff(live1.text, live2.text),
  diffLocalPages: pages ? firstDiff(local, pages.text) : null
}, null, 2));
