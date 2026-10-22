import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const files = [];
const errors = [];
const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const indexableCanonicals = new Set();
let totalWords = 0;

async function walk(url) {
  for (const entry of await fs.readdir(url, { withFileTypes: true })) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, url);
    if (entry.isDirectory()) await walk(child);
    else files.push(child);
  }
}

await walk(dist);
const htmlFiles = files.filter(file => file.pathname.endsWith('.html'));
const knownFiles = new Set(files.map(file => `/${path.relative(dist.pathname, file.pathname).replaceAll('\\', '/')}`));

const requiredRoutes = [
  '/', '/services/', '/services/security-assessments/', '/services/identity-email-security/',
  '/services/cloud-saas-security/', '/services/website-administrative-security/', '/services/incident-response/',
  '/services/incident-readiness-recovery/', '/services/security-advisory/', '/engagements/', '/research/',
  '/labs/', '/labs/cipher/', '/labs/cipher/security-model/', '/trust/', '/trust/security-practices/',
  '/trust/data-handling/', '/trust/responsible-disclosure/', '/trust/website-security/', '/company/about/',
  '/company/who-we-work-with/', '/company/careers/', '/contact/', '/legal/privacy/', '/legal/terms/'
];

const toDistPath = route => route === '/' ? '/index.html' : `${route}index.html`;
for (const route of requiredRoutes) if (!knownFiles.has(toDistPath(route))) errors.push(`missing required route ${route}`);

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const prohibitedMarketing = [
  ['world-class', /\bworld-class\b/i],
  ['100% secure', /\b100%\s+secure\b/i],
  ['cutting-edge solutions', /\bcutting-edge solutions\b/i],
  ['unbreakable security claim', /\b(?:blackpine|our)\b[^.!?]{0,35}\b(?:is|are)\s+unbreakable\b/i],
  ['military-grade security claim', /\bmilitary-grade\s+(?:encryption|security|protection)\b/i]
];

for (const file of htmlFiles) {
  const html = await fs.readFile(file, 'utf8');
  const rel = path.relative(dist.pathname, file.pathname).replaceAll('\\', '/');
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  const is404 = rel === '404.html';

  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) errors.push(`${rel}: expected exactly 1 H1, got ${h1Count}`);
  if (!html.includes('<link rel="canonical"')) errors.push(`${rel}: missing canonical`);
  if (!html.includes('meta name="description"')) errors.push(`${rel}: missing description`);
  if (!html.includes('property="og:image"')) errors.push(`${rel}: missing og:image`);
  if (!html.includes('name="twitter:card"')) errors.push(`${rel}: missing Twitter card metadata`);
  if (/meta\s+name=["']keywords["']/i.test(html)) errors.push(`${rel}: obsolete meta keywords found`);
  if (/href="[^"#?]+\.html(?:[?#][^"]*)?"/.test(html)) errors.push(`${rel}: contains .html internal link`);

  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
  if (!title) errors.push(`${rel}: missing title`);
  else if (!is404) {
    if (titles.has(title)) errors.push(`${rel}: duplicate title with ${titles.get(title)}`);
    titles.set(title, rel);
  }

  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]?.trim();
  if (!description) errors.push(`${rel}: empty description`);
  else if (!is404 && !noindex) {
    if (descriptions.has(description)) errors.push(`${rel}: duplicate description with ${descriptions.get(description)}`);
    descriptions.set(description, rel);
  }

  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  if (canonical) {
    if (!canonical.startsWith('https://blackpinecybersecurity.com/')) errors.push(`${rel}: canonical uses unexpected host ${canonical}`);
    if (!is404 && !noindex) {
      if (canonicals.has(canonical)) errors.push(`${rel}: duplicate canonical with ${canonicals.get(canonical)}`);
      canonicals.set(canonical, rel);
      indexableCanonicals.add(canonical);
    }
  }

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  const seenIds = new Set();
  for (const id of ids) {
    if (seenIds.has(id)) errors.push(`${rel}: duplicate id ${id}`);
    seenIds.add(id);
  }

  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = match[1].split('#')[0].split('?')[0];
    if (!href || href.startsWith('//') || href.startsWith('/.well-known/')) continue;
    const target = href.endsWith('/') ? `${href}index.html` : href;
    const generatedAssets = new Set(['/favicon.svg', '/site.webmanifest', '/styles.css', '/site.js', '/theme-init.js']);
    if (!knownFiles.has(target) && !generatedAssets.has(href)) errors.push(`${rel}: broken internal href ${href}`);
  }

  const schemas = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = match[1];
    const body = match[2].trim();
    const isJsonLd = /type=["']application\/ld\+json["']/i.test(attrs);
    if (!/\bsrc=["']/i.test(attrs) && body && !isJsonLd) errors.push(`${rel}: executable inline script found`);
    const src = attrs.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    if (src && !src.startsWith('/')) errors.push(`${rel}: third-party script ${src}`);
    if (isJsonLd) {
      try { schemas.push(JSON.parse(body)); } catch { errors.push(`${rel}: invalid JSON-LD`); }
    }
  }
  if (!schemas.some(schema => schema['@type'] === 'Organization')) errors.push(`${rel}: missing Organization JSON-LD`);
  if (html.includes('class="breadcrumb"') && !schemas.some(schema => schema['@type'] === 'BreadcrumbList')) errors.push(`${rel}: visible breadcrumb is missing BreadcrumbList JSON-LD`);

  for (const match of html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)) {
    if (!match[1].startsWith('/')) errors.push(`${rel}: third-party stylesheet ${match[1]}`);
  }

  const lower = visibleText(html).toLowerCase();
  for (const [label, pattern] of prohibitedMarketing) if (pattern.test(lower)) errors.push(`${rel}: prohibited marketing pattern “${label}”`);
  totalWords += lower.split(/\s+/).filter(Boolean).length;
}

const securityText = await fs.readFile(new URL('./.well-known/security.txt', dist), 'utf8');
for (const required of ['Contact:', 'Expires:', 'Canonical:', 'Policy:']) if (!securityText.includes(required)) errors.push(`security.txt missing ${required}`);
const expiryRaw = securityText.match(/^Expires:\s*(.+)$/mi)?.[1]?.trim();
if (expiryRaw) {
  const expiry = new Date(expiryRaw);
  const days = (expiry.getTime() - Date.now()) / 86400000;
  if (!Number.isFinite(expiry.getTime())) errors.push('security.txt Expires is not a valid date');
  else {
    if (days < 30) errors.push(`security.txt expires too soon (${Math.floor(days)} days)`);
    if (days > 370) errors.push(`security.txt expiry is more than about one year away (${Math.ceil(days)} days)`);
  }
}
if (!securityText.includes('Canonical: https://blackpinecybersecurity.com/.well-known/security.txt')) errors.push('security.txt canonical is incorrect');

const robots = await fs.readFile(new URL('./robots.txt', dist), 'utf8');
if (!robots.includes('Sitemap: https://blackpinecybersecurity.com/sitemap.xml')) errors.push('robots.txt missing canonical sitemap');

const sitemap = await fs.readFile(new URL('./sitemap.xml', dist), 'utf8');
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]));
for (const canonical of indexableCanonicals) if (!sitemapUrls.has(canonical)) errors.push(`sitemap missing ${canonical}`);
for (const sitemapUrl of sitemapUrls) if (!indexableCanonicals.has(sitemapUrl)) errors.push(`sitemap has unexpected URL ${sitemapUrl}`);

const netlify = await fs.readFile(new URL('./netlify.toml', root), 'utf8');
const csp = netlify.match(/Content-Security-Policy\s*=\s*"([^"]+)"/)?.[1] || '';
if (!csp) errors.push('netlify.toml missing Content-Security-Policy');
for (const directive of ['default-src', 'script-src', 'style-src', 'img-src', 'font-src', 'connect-src', 'frame-src', 'object-src', 'base-uri', 'form-action', 'frame-ancestors']) {
  if (!csp.includes(`${directive} `)) errors.push(`CSP missing ${directive}`);
}
if (csp.includes("'unsafe-inline'")) errors.push("CSP contains 'unsafe-inline'");
if (csp.includes("'unsafe-eval'")) errors.push("CSP contains 'unsafe-eval'");

const redirectBlocks = netlify.split('[[redirects]]').slice(1);
const servicesIndexRedirect = redirectBlocks.find(block => block.includes('from = "/services/index.html"')) || '';
if (!servicesIndexRedirect.includes('status = 301') || !servicesIndexRedirect.includes('force = true')) {
  errors.push('/services/index.html redirect must be a forced 301 because the generated file exists');
}

const headerBlocks = netlify.split('[[headers]]').slice(1);
const assetsHeader = headerBlocks.find(block => block.includes('for = "/assets/*"')) || '';
if (!assetsHeader) errors.push('netlify.toml missing /assets/* cache policy');
else if (/\bimmutable\b/i.test(assetsHeader)) errors.push('unhashed /assets/* files must not use immutable caching');

const researchIndex = await fs.readFile(new URL('./research/index.html', dist), 'utf8');
const featuredTags = [...researchIndex.matchAll(/<a\s+class="research-feature"([^>]*)>/g)].map(match => match[1]);
if (!featuredTags.length) errors.push('research index is missing selected publications');
for (const attrs of featuredTags) {
  if (!attrs.includes('data-research-card') || !attrs.includes('data-type=') || !attrs.includes('data-topic=')) {
    errors.push('featured research publications must participate in type/topic filtering');
    break;
  }
}

const homeHtml = await fs.readFile(new URL('./index.html', dist), 'utf8');
if (homeHtml.includes('Dark server hardware')) errors.push('homepage still contains stale server-photo alt text');
if (!/src="\/assets\/visuals\/infrastructure\.svg"[^>]*width="1600"[^>]*height="900"/.test(homeHtml)) {
  errors.push('homepage infrastructure artwork must declare its 1600x900 intrinsic dimensions');
}

const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ogNames = ['home', 'capabilities', 'research', 'labs', 'trust', 'company', 'contact', 'legal'];
const ogHashes = new Set();
for (const name of ogNames) {
  const file = new URL(`./assets/og/${name}.png`, dist);
  let png;
  try { png = await fs.readFile(file); } catch {
    errors.push(`missing social preview ${name}.png`);
    continue;
  }
  if (png.length < 32 || !png.subarray(0, 8).equals(pngSignature)) {
    errors.push(`${name}.png is not a valid PNG file`);
    continue;
  }
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  if (width !== 1200 || height !== 630) errors.push(`${name}.png must be 1200x630, got ${width}x${height}`);
  if (png.subarray(-8, -4).toString('ascii') !== 'IEND') errors.push(`${name}.png is truncated or missing its IEND chunk`);
  ogHashes.add(crypto.createHash('sha256').update(png).digest('hex'));
}
if (ogHashes.size !== ogNames.length) errors.push('page-family social previews must be distinct files');

const pagesConfig = await fs.readFile(new URL('./_config.yml', root), 'utf8');
for (const internalDoc of ['BRAND_SYSTEM.md', 'DEPLOYMENT.md', 'CLAIMS.md', 'MEDIA.md']) {
  if (!pagesConfig.includes(`- ${internalDoc}`)) errors.push(`GitHub Pages exclusion missing ${internalDoc}`);
}

const css = await fs.readFile(new URL('./styles.css', dist), 'utf8');
const genericCardSelectors = (css.match(/\.card\b/g) || []).length;
if (genericCardSelectors) errors.push(`generic .card selector reintroduced (${genericCardSelectors})`);
const radiusDeclarations = (css.match(/border-radius\s*:/g) || []).length;
const gradientDeclarations = (css.match(/gradient\(/g) || []).length;

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Checks passed: ${htmlFiles.length} HTML files; ${indexableCanonicals.size} indexable canonical routes; unique titles/descriptions; internal links; exact sitemap coverage; robots; RFC 9116 fields; CSP; JSON-LD; redirects; cache policy; social previews.`);
console.log(`Telemetry only: ~${totalWords.toLocaleString()} visible words; ${radiusDeclarations} border-radius declarations; ${gradientDeclarations} gradient declarations; ${genericCardSelectors} generic .card selectors.`);
