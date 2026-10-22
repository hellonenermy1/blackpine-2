import fs from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];

const read = relative => fs.readFile(new URL(relative, root), 'utf8');
const readDist = relative => fs.readFile(new URL(relative, dist), 'utf8');

const home = await readDist('./index.html');
const styles = await readDist('./styles.css');
const siteJs = await readDist('./site.js');
const sitemap = await readDist('./sitemap.xml');
const netlify = await read('./netlify.toml');

if (!/<script src="\/site\.js" defer><\/script>/.test(home)) errors.push('site.js must be deferred');

// Progressive enhancement: base CSS may contain the historical reveal rule, but
// the production hardening override must come later and force content visible.
const oldReveal = styles.indexOf('[data-reveal] { opacity:0');
const safeReveal = styles.lastIndexOf('[data-reveal], [data-reveal].is-visible');
if (safeReveal === -1 || (oldReveal !== -1 && safeReveal < oldReveal)) errors.push('reveal content can still depend on JavaScript');
if (!/\[data-reveal\], \[data-reveal\]\.is-visible\s*\{[^}]*opacity:\s*1;[^}]*transform:\s*none;/s.test(styles)) errors.push('reveal hardening override is missing');

// Sticky navigation must not sit inside an overflow:hidden scrolling ancestor.
const unsafeMain = styles.lastIndexOf('main { overflow:hidden; }');
const safeMain = styles.lastIndexOf('main {\n  overflow-x: clip;\n  overflow-y: visible;');
if (safeMain === -1 || safeMain < unsafeMain) errors.push('main overflow still risks breaking sticky in-page navigation');
if (!styles.includes('scroll-padding-top: calc(var(--header) + 24px)')) errors.push('sticky-header anchor offset is missing');

// The Netlify honeypot remains in markup but must not enter the accessibility tree.
if (!/\.hidden-field\s*\{\s*display:\s*none\s*!important;/s.test(styles)) errors.push('honeypot is still focusable/announced');

// WCAG normal-text contrast for metadata tokens on both main and surface backgrounds.
const luminance = hex => {
  const rgb = hex.replace('#', '').match(/../g).map(part => parseInt(part, 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};
const contrast = (a, b) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
};
for (const [label, foreground, background] of [
  ['dark faint/main', '#748982', '#07100f'],
  ['dark faint/surface', '#748982', '#0e1c19'],
  ['light faint/main', '#5f716a', '#f1f4f1'],
  ['light faint/surface', '#5f716a', '#f7f9f7']
]) {
  if (contrast(foreground, background) < 4.5) errors.push(`${label} contrast is below 4.5:1`);
}

// localStorage may throw SecurityError when browser storage is blocked. The
// script must still initialize without taking down navigation/content behavior.
try {
  vm.runInNewContext(siteJs, {
    window: {
      localStorage: {
        getItem() { throw new Error('SecurityError'); },
        setItem() { throw new Error('SecurityError'); },
        removeItem() { throw new Error('SecurityError'); }
      }
    },
    document: {
      documentElement: { dataset: {} },
      readyState: 'loading',
      addEventListener() {}
    },
    URLSearchParams,
    URL,
    console
  });
} catch (error) {
  errors.push(`site.js crashes when storage is blocked: ${error.message}`);
}

if (!siteJs.includes("params.get('topic')")) errors.push('research topic deep-linking is not implemented');
if (!siteJs.includes("params.get('type')")) errors.push('research type deep-linking is not implemented');
if (!siteJs.includes("'incident-response': 'Incident response'")) errors.push('service-to-contact preselection mapping is missing');

// Legal pages remain reviewable but must not be indexed until qualified review.
for (const route of ['legal/privacy', 'legal/terms']) {
  const html = await readDist(`./${route}/index.html`);
  if (!/<meta name="robots" content="noindex,follow">/.test(html)) errors.push(`${route} must remain noindex until legal review`);
  if (sitemap.includes(`https://blackpinecybersecurity.com/${route}/`)) errors.push(`${route} must not appear in sitemap before legal approval`);
}

// Article microdata should scope the Article on <article>, provide a URL-valued
// mainEntityOfPage, and type the author rather than treating a body element as Article.
const researchDir = new URL('./research/', dist);
const researchEntries = (await fs.readdir(researchDir, { withFileTypes: true })).filter(entry => entry.isDirectory());
if (!researchEntries.length) errors.push('no generated research articles found');
else {
  const sample = await fs.readFile(new URL(`./${researchEntries[0].name}/index.html`, researchDir), 'utf8');
  if (/<body[^>]*itemtype="https:\/\/schema\.org\/Article"/.test(sample)) errors.push('Article scope must not be attached to body');
  if (!/<article itemscope itemtype="https:\/\/schema\.org\/Article">/.test(sample)) errors.push('research article is missing Article scope');
  if (!/<link itemprop="mainEntityOfPage" href="https:\/\/blackpinecybersecurity\.com\/research\//.test(sample)) errors.push('Article mainEntityOfPage is not a URL property');
  if (!/itemprop="author" itemscope itemtype="https:\/\/schema\.org\/Organization"/.test(sample)) errors.push('Article author is not typed as Organization');
}

// Known moved official references must not leak into generated content.
const generatedFiles = [];
async function walk(url) {
  for (const entry of await fs.readdir(url, { withFileTypes: true })) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, url);
    if (entry.isDirectory()) await walk(child);
    else if (entry.name.endsWith('.html')) generatedFiles.push(child);
  }
}
await walk(dist);
const allHtml = (await Promise.all(generatedFiles.map(file => fs.readFile(file, 'utf8')))).join('\n');
for (const stale of [
  'https://www.cyber.gc.ca/en/guidance/baseline-cyber-security-controls-small-medium-organizations',
  'https://www.cisa.gov/resources-tools/resources/implementing-phishing-resistant-mfa'
]) {
  if (allHtml.includes(stale)) errors.push(`stale official reference remains in generated HTML: ${stale}`);
}

if (!netlify.includes('from = "https://www.blackpinecybersecurity.com/*"')) errors.push('canonical www-to-apex redirect is missing');
if (!/for = "\/styles\.css"[\s\S]*?Cache-Control = "public, max-age=3600, must-revalidate"/.test(netlify)) errors.push('styles.css cache policy is missing');
if (!/for = "\/site\.js"[\s\S]*?Cache-Control = "public, max-age=3600, must-revalidate"/.test(netlify)) errors.push('site.js cache policy is missing');
if (/Strict-Transport-Security\s*=\s*"[^"]*preload/.test(netlify)) errors.push('HSTS preload must not be committed accidentally');

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log('Production regression checks passed: JS failure safety, progressive enhancement, contrast, sticky anchors, honeypot accessibility, legal noindex gates, article semantics, source rewrites, redirects, and cache policy.');
