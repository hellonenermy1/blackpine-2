import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import tls from 'node:tls';
import http2 from 'node:http2';

const origin = process.env.BLACKPINE_LIVE_ORIGIN || 'https://blackpinecybersecurity.com';
const matchDist = process.env.LIVE_MATCH_DIST === '1';
const errors = [];
const warnings = [];
const timeoutMs = Number(process.env.LIVE_TIMEOUT_MS || 15000);
const retries = matchDist ? Number(process.env.LIVE_MATCH_RETRIES || 12) : 1;
const retryDelayMs = Number(process.env.LIVE_MATCH_RETRY_DELAY_MS || 10000);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const sha256 = value => createHash('sha256').update(value).digest('hex');
const normalizeHeader = value => String(value || '').trim().replace(/\s+/g, ' ');

async function request(url, options = {}) {
  return fetch(url, {
    redirect: options.redirect || 'follow',
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      'user-agent': 'Blackpine-Production-Audit/1.0 (+https://blackpinecybersecurity.com/trust/website-security/)',
      ...(options.headers || {})
    }
  });
}

async function body(response) {
  return Buffer.from(await response.arrayBuffer());
}

async function expectStatus(url, expected, options = {}) {
  try {
    const response = await request(url, options);
    if (!expected.includes(response.status)) errors.push(`${url} returned ${response.status}; expected ${expected.join('/')}.`);
    return response;
  } catch (error) {
    errors.push(`${url} failed: ${error.name || 'network error'}: ${error.message}`);
    return null;
  }
}

async function expectedGlobalHeaders() {
  const source = await fs.readFile(new URL('../public/_headers', import.meta.url), 'utf8');
  const lines = source.split(/\r?\n/);
  const headers = new Map();
  let inGlobal = false;
  for (const line of lines) {
    if (line.trim() === '/*') {
      inGlobal = true;
      continue;
    }
    if (inGlobal && !line.trim()) break;
    if (!inGlobal) continue;
    const match = line.match(/^\s{2}([^:]+):\s*(.+)$/);
    if (match) headers.set(match[1].toLowerCase(), match[2].trim());
  }
  return headers;
}

async function verifyHeaders(response, label) {
  if (!response) return;
  const expected = await expectedGlobalHeaders();
  for (const [name, value] of expected) {
    const actual = response.headers.get(name);
    if (!actual) {
      errors.push(`${label} is missing ${name}.`);
      continue;
    }
    if (normalizeHeader(actual) !== normalizeHeader(value)) {
      errors.push(`${label} ${name} differs from public/_headers. Expected "${value}", received "${actual}".`);
    }
  }
}

async function verifyRedirect(url, targetPath) {
  const response = await expectStatus(url, [301, 302, 307, 308], { redirect: 'manual' });
  if (!response) return;
  const location = response.headers.get('location');
  if (!location) {
    errors.push(`${url} redirect has no Location header.`);
    return;
  }
  let resolved;
  try {
    resolved = new URL(location, url);
  } catch {
    errors.push(`${url} returned an invalid redirect Location: ${location}`);
    return;
  }
  if (resolved.origin !== origin || resolved.pathname !== targetPath) {
    errors.push(`${url} redirects to ${resolved.toString()} instead of ${origin}${targetPath}.`);
  }
}

async function verifyTls() {
  const target = new URL(origin);
  await new Promise(resolve => {
    const socket = tls.connect({ host: target.hostname, port: 443, servername: target.hostname, rejectUnauthorized: true, timeout: timeoutMs }, () => {
      if (!socket.authorized) errors.push(`TLS authorization failed: ${socket.authorizationError || 'unknown error'}.`);
      const protocol = socket.getProtocol();
      if (!['TLSv1.2', 'TLSv1.3'].includes(protocol)) errors.push(`Unexpected TLS protocol: ${protocol || 'unknown'}.`);
      const cert = socket.getPeerCertificate();
      const expires = Date.parse(cert.valid_to || '');
      if (!Number.isFinite(expires)) errors.push('Could not read the production certificate expiry.');
      else if (expires - Date.now() < 14 * 24 * 60 * 60 * 1000) errors.push(`Production TLS certificate expires too soon: ${cert.valid_to}.`);
      socket.end();
      resolve();
    });
    socket.on('timeout', () => {
      errors.push('TLS connection timed out.');
      socket.destroy();
      resolve();
    });
    socket.on('error', error => {
      errors.push(`TLS connection failed: ${error.message}`);
      resolve();
    });
  });
}

async function verifyHttp2() {
  await new Promise(resolve => {
    const client = http2.connect(origin);
    const timer = setTimeout(() => {
      errors.push('HTTP/2 connection timed out.');
      client.destroy();
      resolve();
    }, timeoutMs);
    client.on('error', error => {
      clearTimeout(timer);
      errors.push(`HTTP/2 connection failed: ${error.message}`);
      resolve();
    });
    client.on('connect', () => {
      const req = client.request({ ':path': '/', ':method': 'GET' });
      req.on('response', headers => {
        if (Number(headers[':status']) !== 200) errors.push(`HTTP/2 / returned ${headers[':status']}.`);
        req.close();
        client.close();
        clearTimeout(timer);
        resolve();
      });
      req.on('error', error => {
        errors.push(`HTTP/2 request failed: ${error.message}`);
        client.close();
        clearTimeout(timer);
        resolve();
      });
      req.end();
    });
  });
}

async function verifyCanonicalSurface() {
  const home = await expectStatus(`${origin}/`, [200]);
  await verifyHeaders(home, 'apex home');
  if (home) {
    const html = (await body(home)).toString('utf8');
    if (!/\/build\/[A-Za-z0-9._-]+\.(?:css|js)/.test(html)) errors.push('Live homepage does not reference the fingerprinted /build/ runtime expected from V4.');
    if (!/Blackpine Cybersecurity/.test(html)) errors.push('Live homepage does not contain the Blackpine identity marker.');
  }

  const www = await expectStatus('https://www.blackpinecybersecurity.com/', [301, 302, 307, 308], { redirect: 'manual' });
  if (www) {
    const location = www.headers.get('location');
    if (!location || new URL(location, 'https://www.blackpinecybersecurity.com/').origin !== origin) errors.push(`www does not redirect to the canonical apex: ${location || '<missing>'}.`);
  }

  for (const path of ['/company/about/', '/services/emergency-response/', '/trust/', '/contact/']) {
    const response = await expectStatus(`${origin}${path}`, [200]);
    await verifyHeaders(response, path);
  }

  const missing = await expectStatus(`${origin}/phase6-definitely-not-a-real-route-7f31e4/`, [404], { redirect: 'manual' });
  if (missing) await verifyHeaders(missing, '404 response');

  await verifyRedirect(`${origin}/about`, '/company/about/');
  await verifyRedirect(`${origin}/privacy`, '/legal/privacy/');
}

async function verifyMetadataAndCaching() {
  const robots = await expectStatus(`${origin}/robots.txt`, [200]);
  if (robots) {
    const text = (await body(robots)).toString('utf8');
    if (!text.includes(`Sitemap: ${origin}/sitemap.xml`)) errors.push('robots.txt does not point to the canonical sitemap.');
  }

  const sitemap = await expectStatus(`${origin}/sitemap.xml`, [200]);
  if (sitemap) {
    const text = (await body(sitemap)).toString('utf8');
    for (const marker of [`<loc>${origin}/</loc>`, `<loc>${origin}/company/about/</loc>`, `<loc>${origin}/trust/</loc>`]) {
      if (!text.includes(marker)) errors.push(`sitemap.xml is missing ${marker}.`);
    }
  }

  const security = await expectStatus(`${origin}/.well-known/security.txt`, [200]);
  if (security) {
    const text = (await body(security)).toString('utf8');
    if (!/^Contact:/m.test(text) || !/^Expires:/m.test(text) || !/^Canonical:/m.test(text)) errors.push('security.txt is missing required publication fields.');
    const contentType = security.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('text/plain')) errors.push(`security.txt Content-Type is ${contentType || '<missing>'}.`);
  }

  const liveHome = await request(`${origin}/`);
  const html = (await body(liveHome)).toString('utf8');
  const assets = [...html.matchAll(/(?:src|href)="(\/build\/[^"]+\.(?:css|js))"/g)].map(match => match[1]);
  if (!assets.length) errors.push('No fingerprinted live build assets were found for cache verification.');
  for (const asset of [...new Set(assets)].slice(0, 8)) {
    const response = await expectStatus(`${origin}${asset}`, [200]);
    if (!response) continue;
    const cache = (response.headers.get('cache-control') || '').toLowerCase();
    if (!cache.includes('max-age=31536000') || !cache.includes('immutable')) errors.push(`${asset} is missing immutable one-year caching: ${cache || '<missing>'}.`);
  }

  for (const path of ['/search-index.json', '/fr/search-index.json', '/es/search-index.json']) {
    const response = await expectStatus(`${origin}${path}`, [200]);
    if (!response) continue;
    const cache = (response.headers.get('cache-control') || '').toLowerCase();
    if (!cache.includes('max-age=3600') || !cache.includes('must-revalidate') || cache.includes('immutable')) errors.push(`${path} has incorrect mutable cache policy: ${cache || '<missing>'}.`);
  }

  const compressed = await request(`${origin}/`, { headers: { 'accept-encoding': 'br, gzip' } });
  const encoding = (compressed.headers.get('content-encoding') || '').toLowerCase();
  if (!['br', 'gzip'].includes(encoding)) warnings.push(`Homepage response did not expose br/gzip Content-Encoding to this client; received ${encoding || '<none>'}.`);
  await compressed.body?.cancel().catch(() => {});
}

async function verifyContactSurface() {
  const response = await expectStatus(`${origin}/contact/`, [200]);
  if (!response) return;
  const html = (await body(response)).toString('utf8');
  if (!html.includes('contact@blackpinecybersecurity.com')) errors.push('Live contact page is missing the fixed Blackpine contact mailbox.');
  if (!/mailto:/i.test(html)) errors.push('Live contact page does not expose the documented local email-composer/direct-email path.');
  if (/<form\b[^>]*\baction\s*=\s*["']https?:/i.test(html)) errors.push('Live contact page contains a network-capable external form action.');
  if (/netlify|formspree|hubspot|marketo|mailchimp/i.test(html)) errors.push('Live contact page contains an unapproved hosted form/marketing processor marker.');
}

async function verifyCrossDomainBoundaries() {
  const hosts = ['cipher.blackpinecybersecurity.com', 'verify.blackpinecybersecurity.com', 'support.blackpinecybersecurity.com'];
  for (const host of hosts) {
    try {
      const response = await request(`https://${host}/`, { redirect: 'manual' });
      if (![200, 204, 301, 302, 303, 307, 308, 401, 403].includes(response.status)) errors.push(`${host} is not acceptably reachable; received ${response.status}.`);
      const location = response.headers.get('location');
      if (location) {
        const target = new URL(location, `https://${host}/`);
        if (target.hostname === 'blackpinecybersecurity.com' || target.hostname === 'www.blackpinecybersecurity.com') errors.push(`${host} redirects into the corporate marketing origin instead of remaining operationally separate.`);
      }
      await response.body?.cancel().catch(() => {});
    } catch (error) {
      errors.push(`${host} reachability failed: ${error.name || 'network error'}: ${error.message}`);
    }
  }
}

async function exactDistMatches() {
  const mappings = new Map([
    ['/', 'index.html'],
    ['/company/about/', 'company/about/index.html'],
    ['/services/emergency-response/', 'services/emergency-response/index.html'],
    ['/trust/', 'trust/index.html'],
    ['/contact/', 'contact/index.html']
  ]);

  for (const attempt of Array.from({ length: retries }, (_, index) => index + 1)) {
    const mismatches = [];
    for (const [path, relative] of mappings) {
      try {
        const expected = await fs.readFile(new URL(`../dist/${relative}`, import.meta.url));
        const response = await request(`${origin}${path}`);
        const actual = await body(response);
        if (response.status !== 200 || sha256(actual) !== sha256(expected)) mismatches.push(`${path} expected ${sha256(expected).slice(0, 12)} got ${sha256(actual).slice(0, 12)} status ${response.status}`);
      } catch (error) {
        mismatches.push(`${path} ${error.message}`);
      }
    }
    if (!mismatches.length) return;
    if (attempt < retries) {
      console.warn(`Live exact-build match attempt ${attempt}/${retries} not ready: ${mismatches.join('; ')}`);
      await sleep(retryDelayMs);
      continue;
    }
    errors.push(`Canonical production does not match the built release after ${retries} attempt(s): ${mismatches.join('; ')}`);
  }
}

await verifyTls();
await verifyHttp2();
await verifyCanonicalSurface();
await verifyMetadataAndCaching();
await verifyContactSurface();
await verifyCrossDomainBoundaries();
if (matchDist) await exactDistMatches();

if (warnings.length) console.warn(warnings.map(message => `WARN: ${message}`).join('\n'));
if (errors.length) {
  console.error(errors.map(message => `ERROR: ${message}`).join('\n'));
  process.exit(1);
}

console.log(`Phase 6 live-production audit passed for ${origin}: TLS, HTTP/2, apex/www, representative routes, real 404, legacy redirects, deployed security headers, metadata endpoints, cache policy, contact surface and cross-domain reachability${matchDist ? ', with exact built-HTML match' : ''}.`);
