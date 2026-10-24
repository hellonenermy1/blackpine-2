import { site, capabilityFamilies } from './data.mjs';
import { navGroups } from './nav-v4.mjs';
import { breadcrumb } from './components.mjs';
import { esc, safeJson } from './lib/html.mjs';

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    legalName: 'Blackpine Cybersecurity Inc.',
    url: site.url,
    email: site.email,
    description: site.description,
    logo: new URL('/favicon.svg', site.url).toString()
  };
}

function breadcrumbSchema(items) {
  if (!items?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: new URL(item.href, site.url).toString()
    }))
  };
}

function articleSchema(articleMeta, canonical, image) {
  if (!articleMeta) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleMeta.title,
    description: articleMeta.dek,
    datePublished: articleMeta.date,
    dateModified: articleMeta.updated,
    mainEntityOfPage: canonical,
    image: [image],
    author: {
      '@type': 'Organization',
      name: 'Blackpine Research',
      url: `${site.url}/research/`
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: site.url,
      logo: {
        '@type': 'ImageObject',
        url: new URL('/favicon.svg', site.url).toString()
      }
    }
  };
}

const navChildLinks = group => (group.columns || []).flatMap(column => column[1]);
const pathMatches = (path, href) => href !== '/' && (path === href || path.startsWith(href));
const navGroupIsActive = (group, path) => pathMatches(path, group.href) || navChildLinks(group).some(([, href]) => pathMatches(path, href));

function primaryNavigation(path) {
  return navGroups.map((group, index) => {
    const active = navGroupIsActive(group, path);
    const current = path === group.href;
    if (!group.columns?.length) return `<a class="nav-direct${active ? ' is-context-active' : ''}" href="${esc(group.href)}"${current ? ' aria-current="page"' : ''}>${esc(group.label)}</a>`;
    const panelId = `nav-panel-${index}`;
    return `<div class="nav-group" data-nav-group>
      <div class="nav-group-head"><a class="nav-parent${active ? ' is-context-active' : ''}" href="${esc(group.href)}"${current ? ' aria-current="page"' : ''}>${esc(group.label)}</a><button class="nav-group-toggle" type="button" aria-expanded="false" aria-controls="${panelId}" data-nav-group-toggle><span class="sr-only">Toggle ${esc(group.label)} menu</span><span aria-hidden="true">⌄</span></button></div>
      <div class="mega-panel" id="${panelId}" data-nav-panel>
        <div class="mega-inner">${group.columns.map(([heading, links]) => `<div class="mega-column"><span>${esc(heading)}</span>${links.map(([label, href]) => `<a href="${esc(href)}"${path === href ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('')}</div>`).join('')}<div class="mega-footer"><a href="${esc(group.href)}"${current ? ' aria-current="page"' : ''}>View ${esc(group.label.toLowerCase())} →</a></div></div>
      </div>
    </div>`;
  }).join('');
}

const defaultAssets = {
  styles: '/styles.css',
  themeInit: '/theme-init.js',
  site: '/site.js',
  a11y: '/a11y-v3.js',
  phase2: '/phase2.js',
  phase3: '/phase3.js'
};

export function layout({
  title,
  description,
  path = '/',
  body,
  image = null,
  imageAlt = null,
  type = 'website',
  breadcrumbItems = [],
  articleMeta = null,
  noindex = false,
  assets = defaultAssets
}) {
  const canonical = new URL(path, site.url).toString();
  const currentTop = path.split('/').filter(Boolean)[0] || '';
  const pageFamily = currentTop || 'home';
  const socialImage = image || site.ogImages?.[pageFamily] || site.ogImage;
  const socialImageAlt = imageAlt || `${site.name} — ${title}`;
  const includeOrganization = path === '/' || path === '/company/about/';
  const schemas = [includeOrganization ? organizationSchema() : null, breadcrumbSchema(breadcrumbItems), articleSchema(articleMeta, canonical, socialImage)].filter(Boolean);

  return `<!doctype html>
<html lang="en" data-theme="auto">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex,follow">' : ''}
  <meta name="color-scheme" content="dark light">
  <meta name="theme-color" content="#07100f" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#f1f4f1" media="(prefers-color-scheme: light)">
  <link rel="canonical" href="${esc(canonical)}">
  <meta property="og:type" content="${esc(type)}">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(socialImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(socialImageAlt)}">
  ${articleMeta ? `<meta property="article:published_time" content="${esc(articleMeta.date)}"><meta property="article:modified_time" content="${esc(articleMeta.updated)}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(socialImage)}">
  <meta name="twitter:image:alt" content="${esc(socialImageAlt)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <script src="${esc(assets.themeInit)}"></script>
  <link rel="stylesheet" href="${esc(assets.styles)}">
  <script src="${esc(assets.site)}" defer></script>
  <script src="${esc(assets.a11y)}" defer></script>
  <script src="${esc(assets.phase2)}" defer></script>
  <script src="${esc(assets.phase3)}" defer></script>
  ${schemas.map(schema => `<script type="application/ld+json">${safeJson(schema)}</script>`).join('\n  ')}
</head>
<body class="page-${esc(pageFamily)}">
  <header class="site-header" data-header>
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="header-inner">
      <a class="brand" href="/" aria-label="Blackpine Cybersecurity home">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 5 27h5l6-7 6 7h5L16 2Zm0 8 3 7-3-3.3L13 17l3-7Z"/></svg>
        <span>BLACKPINE</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" data-nav-toggle><span>Menu</span></button>
      <nav id="primary-nav" class="primary-nav" aria-label="Primary" data-nav>${primaryNavigation(path)}</nav>
      <div class="header-tools">
        <button class="search-trigger" type="button" data-search-open aria-haspopup="dialog"><span>Search</span><kbd>Ctrl/⌘ K</kbd></button>
        <a class="header-contact" href="/contact/">Contact</a>
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="Change colour theme">Theme: Auto</button>
      </div>
    </div>
  </header>
  <div class="search-overlay" data-search-overlay hidden role="dialog" aria-modal="true" aria-labelledby="site-search-title">
    <div class="search-dialog">
      <div class="search-dialog-head"><div><span class="eyebrow">Blackpine</span><h2 id="site-search-title">Search the public site</h2></div><button class="search-close" type="button" data-search-close aria-label="Close search">Close</button></div>
      <label class="sr-only" for="site-search-input">Search Blackpine</label>
      <input id="site-search-input" class="site-search-input" type="search" autocomplete="off" maxlength="120" data-search-input placeholder="Try: CEO account hacked, weird MFA, ransomware, DMARC">
      <div class="search-hint"><span>↑↓ Navigate</span><span>Enter Open</span><span>Esc Close</span><a href="/search/">Full search page</a></div>
      <div class="search-results" data-search-results role="status" aria-live="polite"><p>Type a keyword or phrase to search public Blackpine pages.</p></div>
    </div>
  </div>
  <main id="main">
    ${breadcrumb(breadcrumbItems)}
    ${body}
  </main>
  <footer class="site-footer">
    <div class="footer-top">
      <div class="footer-brand"><span class="footer-mark">BLACKPINE</span><p>Canadian security engineering, incident response, security operations, and technical research.</p></div>
      <div class="footer-columns">
        <div><h2>Capabilities</h2>${capabilityFamilies.map(family => `<a href="${esc(family.path)}">${esc(family.name.replace('Blackpine ', ''))}</a>`).join('')}<a href="/services/">All capabilities</a></div>
        <div><h2>Knowledge</h2><a href="/research/">Research</a><a href="/advisories/">Advisories</a><a href="/resources/">Resources</a><a href="/security-baseline/">Security Baseline</a><a href="/tools/">Tools</a></div>
        <div><h2>Blackpine</h2><a href="/company/about/">About</a><a href="/company/team/">Leadership</a><a href="/work/">Work</a><a href="/company/careers/">Careers</a><a href="/contact/">Contact</a></div>
        <div><h2>Trust</h2><a href="/trust/">Trust Center</a><a href="/trust/security-practices/">Security Practices</a><a href="/trust/enterprise-assurance/">Enterprise Assurance</a><a href="/trust/responsible-disclosure/">Responsible Disclosure</a><a href="/.well-known/security.txt">security.txt</a></div>
        <div><h2>Surfaces</h2><a href="https://cipher.blackpinecybersecurity.com" rel="noopener">Cipher ↗</a><a href="/labs/cipher/security-model/">Verification guidance</a><a href="https://support.blackpinecybersecurity.com" rel="noopener">Support ↗</a><a href="/services/emergency-response/">Emergency Response</a></div>
      </div>
    </div>
    <div class="footer-bottom"><span>© Blackpine Cybersecurity Inc.</span><span>Canada</span><a href="/legal/company-information/">Company information</a><a href="/legal/privacy/">Privacy</a><a href="/legal/terms/">Terms</a><a href="/legal/acceptable-use/">Acceptable Use</a><a href="/search/">Search</a></div>
  </footer>
</body>
</html>`;
}