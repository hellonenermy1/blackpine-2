import { site, nav, services, research } from './content.mjs';

const esc = (value = '') => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

export function topologyGraphic(extraClass = '') {
  return `<svg class="topology ${extraClass}" viewBox="0 0 760 420" aria-hidden="true" focusable="false">
    <g class="topology-lines">
      <path d="M42 330 L180 250 L305 272 L426 178 L576 214 L715 92"/>
      <path d="M180 250 L146 116 L282 72"/>
      <path d="M305 272 L354 350 L510 328"/>
      <path d="M426 178 L405 76 L535 42"/>
      <path d="M576 214 L654 318"/>
    </g>
    <g class="topology-nodes">
      ${[[42,330],[180,250],[305,272],[426,178],[576,214],[715,92],[146,116],[282,72],[354,350],[510,328],[405,76],[535,42],[654,318]].map(([x,y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 5 : 3}"/>`).join('')}
    </g>
  </svg>`;
}

export function breadcrumb(items = []) {
  if (!items.length) return '';
  return `<nav class="breadcrumb" aria-label="Breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
    ${items.map((item, i) => `<span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a itemprop="item" href="${esc(item.href)}"><span itemprop="name">${esc(item.label)}</span></a><meta itemprop="position" content="${i+1}"></span>${i < items.length - 1 ? '<span aria-hidden="true">/</span>' : ''}`).join('')}
  </nav>`;
}

export function layout({ title, description, path = '/', body, image = site.ogImage, type = 'website', breadcrumbItems = [], articleMeta = null, noindex = false }) {
  const canonical = new URL(path, site.url).toString();
  const legalGate = path === '/legal/privacy/' || path === '/legal/terms/';
  const shouldNoindex = noindex || legalGate;
  const currentTop = path.split('/').filter(Boolean)[0] || '';
  let renderedBody = body;

  if (articleMeta) {
    renderedBody = renderedBody
      .replace(
        '<article itemprop="mainEntityOfPage">',
        `<article itemscope itemtype="https://schema.org/Article"><link itemprop="mainEntityOfPage" href="${esc(canonical)}">`
      )
      .replace(
        '<strong itemprop="author">Blackpine Research</strong>',
        `<span itemprop="author" itemscope itemtype="https://schema.org/Organization"><strong itemprop="name">Blackpine Research</strong><link itemprop="url" href="${esc(site.url)}/research/"></span>`
      );
  }

  return `<!doctype html>
<html lang="en" data-theme="auto">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${shouldNoindex ? '<meta name="robots" content="noindex,follow">' : ''}
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
  <meta property="og:image:alt" content="Blackpine Cybersecurity">
  ${articleMeta ? `<meta property="article:published_time" content="${esc(articleMeta.date)}"><meta property="article:modified_time" content="${esc(articleMeta.updated)}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(image)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/styles.css">
  <script src="/site.js" defer></script>
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
    ${renderedBody}
  </main>
  <footer class="site-footer" itemscope itemtype="https://schema.org/Organization">
    <meta itemprop="name" content="${esc(site.name)}">
    <meta itemprop="url" content="${esc(site.url)}">
    <div class="footer-top">
      <div class="footer-brand"><span class="footer-mark">BLACKPINE</span><p>Security engineering, assessment, incident response, and research from Canada.</p></div>
      <div class="footer-columns">
        <div><h2>Services</h2>${services.slice(0,5).map(s => `<a href="/services/${s.slug}/">${esc(s.title)}</a>`).join('')}</div>
        <div><h2>Research</h2><a href="/research/">Latest research</a><a href="/research/?topic=incident-response">Incident response</a><a href="/labs/">Blackpine Labs</a><a href="https://cipher.blackpinecybersecurity.com">Cipher ↗</a></div>
        <div><h2>Blackpine</h2><a href="/company/about/">About</a><a href="/trust/">Trust</a><a href="/company/careers/">Careers</a><a href="/contact/">Contact</a></div>
        <div><h2>Security</h2><a href="/trust/responsible-disclosure/">Responsible disclosure</a><a href="/.well-known/security.txt">security.txt</a><a href="https://verify.blackpinecybersecurity.com">Verify ↗</a><a href="mailto:${esc(site.securityEmail)}" itemprop="email">${esc(site.securityEmail)}</a></div>
      </div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getUTCFullYear()} Blackpine Cybersecurity.</span><span>Canada</span><a href="/legal/privacy/">Privacy</a><a href="/legal/terms/">Terms</a></div>
  </footer>
</body>
</html>`;
}

export function serviceRows(items = services.slice(0,4)) {
  return `<div class="service-rows">${items.map((s,i)=>`<a class="service-row" href="/services/${s.slug}/"><span class="service-index">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(s.title)}</strong><small>${esc(s.short)}</small></span><span class="row-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>`;
}

export function researchRows(items = research.slice(0,4)) {
  return `<div class="research-rows">${items.map(r=>`<a class="research-row" href="/research/${r.slug}/" data-research-card data-type="${esc(r.type)}" data-topic="${esc(r.topic)}"><span class="research-meta">${esc(r.date)} · ${esc(r.type)}</span><strong>${esc(r.title)}</strong><span class="research-topic">${esc(r.topic)} · ${esc(r.readTime)}</span></a>`).join('')}</div>`;
}
