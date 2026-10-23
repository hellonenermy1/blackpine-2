import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];
const read = relative => fs.readFile(new URL(relative, root), 'utf8');
const readDist = relative => fs.readFile(new URL(relative, dist), 'utf8');

const headers = await readDist('./_headers');
for (const required of [
  "Strict-Transport-Security: max-age=63072000; includeSubDomains",
  'X-Content-Type-Options: nosniff',
  'X-Frame-Options: DENY',
  "Content-Security-Policy: default-src 'self';",
  'Cross-Origin-Opener-Policy: same-origin',
  'Cross-Origin-Resource-Policy: same-origin',
  '/build/*',
  'Cache-Control: public, max-age=31536000, immutable',
  '/search-index.json',
  'https://:project.pages.dev/*',
  'https://:version.:project.pages.dev/*',
  'X-Robots-Tag: noindex'
]) if (!headers.includes(required)) errors.push(`Cloudflare Pages _headers is missing ${required}`);
if (/\/(?:styles\.css|site\.js|theme-init\.js|a11y-v3\.js|phase2\.js|phase3\.js)\n\s+Cache-Control:/m.test(headers)) errors.push('Cloudflare Pages _headers still carries stable runtime-asset cache aliases');

const redirects = await readDist('./_redirects');
const expectedRedirects = [
  '/services.html /services/ 301',
  '/security-assessment* /services/security-assessments/ 301',
  '/incident-response/ /services/incident-response/ 301',
  '/packages* /engagements/ 301',
  '/resources.html /resources/ 301',
  '/checklist* /research/what-a-useful-security-assessment-report-contains/ 301',
  '/industries* /company/who-we-work-with/ 301',
  '/about* /company/about/ 301',
  '/careers* /company/careers/ 301',
  '/responsible-disclosure* /trust/responsible-disclosure/ 301',
  '/privacy* /legal/privacy/ 301',
  '/terms* /legal/terms/ 301'
];
for (const rule of expectedRedirects) if (!redirects.includes(rule)) errors.push(`Cloudflare Pages _redirects is missing ${rule}`);
if (/^\/resources\*\s/m.test(redirects)) errors.push('Cloudflare Pages _redirects must not shadow the real /resources/ route');

const netlify = await read('./netlify.toml');
for (const legacy of ['/packages*', '/checklist*', '/industries*', '/careers*', '/responsible-disclosure*']) {
  if (!netlify.includes(`from = "${legacy}"`)) errors.push(`portable Netlify redirect ${legacy} is missing`);
}
if (!/for = "\/build\/\*"[\s\S]*?Cache-Control = "public, max-age=31536000, immutable"/.test(netlify)) errors.push('portable Netlify fingerprinted build cache policy is missing');
if (!/for = "\/search-index\.json"[\s\S]*?Cache-Control = "public, max-age=3600, must-revalidate"/.test(netlify)) errors.push('portable Netlify search index must remain revalidated');

const contact = await readDist('./contact/index.html');
if (!contact.includes('mailto:contact@blackpinecybersecurity.com')) errors.push('contact page is missing the direct email route');
if (!contact.includes('data-contact-compose')) errors.push('contact page is missing the local email-composer integration');
if (!contact.includes('action="/contact/"')) errors.push('contact form must fail closed on the same origin if JavaScript is unavailable');
if (/data-netlify|netlify-honeypot|name="form-name"/i.test(contact)) errors.push('Cloudflare production must not advertise a Netlify-only form backend');

const privacy = await readDist('./legal/privacy/index.html');
if (!privacy.includes('deployed through Cloudflare Pages')) errors.push('privacy notice must identify Cloudflare Pages as the production hosting platform');
if (!privacy.includes('third-party website form processor')) errors.push('privacy notice must describe the no-form-processor baseline');

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log('Hosting checks passed: Cloudflare Pages production headers/redirects are present, fingerprinted runtime assets use immutable caching, mutable search remains revalidated, preview indexing is blocked, migration routes are preserved, Netlify config remains portability-only, and contact uses a local email composer rather than an unconfigured form backend.');
