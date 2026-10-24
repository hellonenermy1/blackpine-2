import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];
const read = relative => fs.readFile(new URL(relative, root), 'utf8');
const readDist = relative => fs.readFile(new URL(relative, dist), 'utf8');

const expectedCsp = "default-src 'self'; script-src 'self'; script-src-attr 'none'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self'; worker-src 'none'; manifest-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests";
const sharedHeaders = new Map([
  ['Strict-Transport-Security', 'max-age=63072000; includeSubDomains'],
  ['X-Content-Type-Options', 'nosniff'],
  ['X-Frame-Options', 'DENY'],
  ['X-XSS-Protection', '0'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()'],
  ['Content-Security-Policy', expectedCsp],
  ['Cross-Origin-Opener-Policy', 'same-origin'],
  ['Cross-Origin-Resource-Policy', 'same-origin'],
  ['X-Permitted-Cross-Domain-Policies', 'none']
]);

const headers = await readDist('./_headers');
for (const [name, value] of sharedHeaders) {
  if (!headers.includes(`  ${name}: ${value}`)) errors.push(`Cloudflare Pages _headers does not exactly match ${name}`);
}
for (const required of [
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
for (const [name, value] of sharedHeaders) {
  if (!netlify.includes(`    ${name} = "${value}"`)) errors.push(`Netlify portability headers do not exactly match ${name}`);
}
for (const legacy of ['/packages*', '/checklist*', '/industries*', '/careers*', '/responsible-disclosure*']) {
  if (!netlify.includes(`from = "${legacy}"`)) errors.push(`portable Netlify redirect ${legacy} is missing`);
}
if (!/for = "\/build\/\*"[\s\S]*?Cache-Control = "public, max-age=31536000, immutable"/.test(netlify)) errors.push('portable Netlify fingerprinted build cache policy is missing');
if (!/for = "\/search-index\.json"[\s\S]*?Cache-Control = "public, max-age=3600, must-revalidate"/.test(netlify)) errors.push('portable Netlify search index must remain revalidated');

const cloudflareCsp = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/m)?.[1]?.trim();
const netlifyCsp = netlify.match(/^\s*Content-Security-Policy\s*=\s*"([^"]+)"/m)?.[1]?.trim();
if (cloudflareCsp !== expectedCsp || netlifyCsp !== expectedCsp) errors.push('Cloudflare and Netlify CSP policies are not in exact production parity');

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

console.log(`Hosting checks passed: ${sharedHeaders.size} security headers are in exact Cloudflare/Netlify parity, CSP is hardened, immutable/revalidation cache boundaries are preserved, previews remain noindex, migration routes are preserved, and contact uses the local email composer.`);
