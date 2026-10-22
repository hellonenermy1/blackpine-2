import { site, nav, services } from './data.mjs';
import { breadcrumb } from './components.mjs';
import { esc, safeJson } from './lib/html.mjs';

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    email: site.email
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
      url: site.url
    }
  };
}

export function layout({
  title,
  description,
  path = '/',
  body,
  image = site.ogImage,
  imageAlt = 'Blackpine Cybersecurity',
  type = 'website',
  breadcrumbItems = [],
  articleMeta = null,
  noindex = false
}) {
  const canonical = new URL(path, site.url).toString();
  const currentTop = path.split('/').filter(Boolean)[0] || '';
  const schemas = [
    organizationSchema(),
    breadcrumbSchema(breadcrumbItems),
    articleSchema(articleMeta, canonical, image)
  ].filter(Boolean);

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
  <meta property="og:image" content="${esc(image)}">
  <meta property="og:image:alt" content="${esc(imageAlt)}">
  ${articleMeta ? `<meta property="article:published_time" content="${esc(articleMeta.date)}"><meta property="article:modified_time" content="${esc(articleMeta.updated)}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(image)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <script src="/theme-init.js"></script>
  <link rel="stylesheet" href="/styles.css">
  <script src="/site.js" defer></script>
  ${schemas.map(schema => `<script type="application/ld+json">${safeJson(schema)}</script>`).join('\n  ')}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" data-header>
    <div class="header-inner">
      <a class="brand" href="/" aria-label="Blackpine Cybersecurity home">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 5 27h5l6-7 6 7h5L16 2Zm0 8 3 7-3-3.3L13 17l3-7Z"/></svg>
        <span>BLACKPINE</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" data-nav-toggle><span>Menu</span></button>
      <nav id="primary-nav" class="primary-nav" aria-label="Primary" data-nav>
        ${nav.map(item => {
          const itemTop = item.href.split('/').filter(Boolean)[0] || '';
          const active = currentTop && currentTop === itemTop;
          return `<a href="${item.href}"${active ? ' aria-current="page"' : ''}>${esc(item.label)}</a>`;
        }).join('')}
      </nav>
      <div class="header-tools">
        <a class="support-link" href="https://support.blackpinecybersecurity.com">Support ↗</a>
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="Change colour theme">Theme: Auto</button>
      </div>
    </div>
  </header>
  <main id="main">
    ${breadcrumb(breadcrumbItems)}
    ${body}
  </main>
  <footer class="site-footer">
    <div class="footer-top">
      <div class="footer-brand"><span class="footer-mark">BLACKPINE</span><p>Security engineering, assessment, incident response, and research from Canada.</p></div>
      <div class="footer-columns">
        <div><h2>Services</h2>${services.slice(0, 5).map(service => `<a href="/services/${service.slug}/">${esc(service.title)}</a>`).join('')}</div>
        <div><h2>Research</h2><a href="/research/">Latest research</a><a href="/research/?topic=incident-response">Incident response</a><a href="/labs/">Blackpine Labs</a><a href="https://cipher.blackpinecybersecurity.com">Cipher ↗</a></div>
        <div><h2>Blackpine</h2><a href="/company/about/">About</a><a href="/trust/">Trust</a><a href="/company/careers/">Careers</a><a href="/contact/">Contact</a></div>
        <div><h2>Security</h2><a href="/trust/responsible-disclosure/">Responsible disclosure</a><a href="/.well-known/security.txt">security.txt</a><a href="https://verify.blackpinecybersecurity.com">Verify ↗</a><a href="mailto:${esc(site.securityEmail)}">${esc(site.securityEmail)}</a></div>
      </div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getUTCFullYear()} Blackpine Cybersecurity.</span><span>Canada</span><a href="/legal/privacy/">Privacy</a><a href="/legal/terms/">Terms</a></div>
  </footer>
</body>
</html>`;
}
