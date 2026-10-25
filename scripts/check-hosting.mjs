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
const searchIndexPaths = ['/search-index.json', '/fr/search-index.json', '/es/search-index.json'];
const searchCacheValue = 'public, max-age=3600, must-revalidate';

const headers = await readDist('./_headers');
for (const [name, value] of sharedHeaders) {
  if (!headers.includes(`  ${name}: ${value}`)) errors.push(`Cloudflare Pages _headers does not exactly match ${name}`);
}
for (const required of [
  '/build/*',
  'Cache-Control: public, max-age=31536000, immutable',
  'https://:project.pages.dev/*',
  'https://:version.:project.pages.dev/*',
  'X-Robots-Tag: noindex'
]) if (!headers.includes(required)) errors.push(`Cloudflare Pages _headers is missing ${required}`);
for (const path of searchIndexPaths) {
  if (!headers.includes(`${path}\n  Cache-Control: ${searchCacheValue}`)) errors.push(`Cloudflare Pages _headers is missing revalidation caching for ${path}`);
}
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
for (const path of searchIndexPaths) {
  if (!netlify.includes(`for = "${path}"\n  [headers.values]\n    Cache-Control = "${searchCacheValue}"`)) errors.push(`portable Netlify config is missing revalidation caching for ${path}`);
}

const cloudflareCsp = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/m)?.[1]?.trim();
const netlifyCsp = netlify.match(/^\s*Content-Security-Policy\s*=\s*"([^"]+)"/m)?.[1]?.trim();
if (cloudflareCsp !== expectedCsp || netlifyCsp !== expectedCsp) errors.push('Cloudflare and Netlify CSP policies are not in exact production parity');

const contact = await readDist('./contact/index.html');
if (!contact.includes('mailto:contact@blackpinecybersecurity.com')) errors.push('contact page is missing the direct email route');
if (!contact.includes('data-contact-compose')) errors.push('contact page is missing the local email-composer integration');
const contactForm = contact.match(/<form\b[^>]*data-contact-form[^>]*>/i)?.[0] || '';
if (!contactForm) errors.push('contact page is missing the local inquiry form shell');
if (/\baction\s*=|\bmethod\s*=/i.test(contactForm)) errors.push('contact form must not have a network-capable action or method; no-JS users must use the explicit direct email route');
if (!/<button\b[^>]*type="button"[^>]*data-contact-compose-button/i.test(contact)) errors.push('contact composer control must remain a non-submitting button');
if (/data-netlify|netlify-honeypot|name="form-name"/i.test(contact)) errors.push('Cloudflare production must not advertise a Netlify-only form backend');

const privacy = await readDist('./legal/privacy/index.html');
if (!privacy.includes('deployed through Cloudflare Pages')) errors.push('privacy notice must identify Cloudflare Pages as the production hosting platform');
if (!privacy.includes('information entered into that inquiry composer is not transmitted to Blackpine merely by typing it into the page')) errors.push('privacy notice must preserve the lawyer-approved no-transmission-on-typing boundary');

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Hosting checks passed: ${sharedHeaders.size} security headers are in exact Cloudflare/Netlify parity, CSP is hardened, all three locale search indexes are revalidated, immutable cache boundaries are preserved, previews remain noindex, migration routes are preserved, and contact remains a local non-submitting email composer.`);
