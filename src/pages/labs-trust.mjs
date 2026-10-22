import { site, trustPages } from '../data.mjs';
import { pageHero } from '../components.mjs';
import { esc, sectionId } from '../lib/html.mjs';

export function labsIndexPage() {
  const body = pageHero({
    eyebrow: 'Labs',
    title: 'Security work should include building and testing ideas — not only describing them.',
    lead: 'Blackpine Labs is the home for genuine technical projects. It stays intentionally small: a project appears here only when there is something real to document.'
  }) + `<section class="photo-band"><img src="${site.infrastructureImage}" alt="Dark server hardware representing engineered digital infrastructure" width="1600" height="1067" loading="eager" decoding="async"><div class="photo-band-content"><div class="shell"><span class="eyebrow">Project 01</span><h2>Blackpine Cipher</h2><p>A separate encryption application with its own threat model, verification surfaces, and technical documentation.</p><div class="actions"><a class="button" href="/labs/cipher/">Project overview</a><a class="button secondary" href="https://cipher.blackpinecybersecurity.com">Open Cipher ↗</a></div></div></div></section>`;

  return {
    title: 'Blackpine Labs | Security Engineering Projects',
    description: 'Blackpine Labs documents genuine security engineering projects including Blackpine Cipher.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Labs', href: '/labs/' }],
    body
  };
}

export function cipherPage() {
  const body = pageHero({
    eyebrow: 'Labs / Cipher',
    title: 'Blackpine Cipher',
    lead: 'A separate Blackpine security application for file encryption. The corporate site introduces the project; technical claims belong in the project’s security model and application documentation.'
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Project</span><a href="#separation">Separation</a><a href="#principles">Principles</a><a href="#model">Security model</a><a href="#application">Application</a></aside><div class="prose"><h2 id="separation">Separated by design</h2><p>Cipher is hosted separately from the Blackpine corporate site. Marketing analytics, advertising scripts, and unrelated third-party JavaScript must not be inherited by the cryptographic application.</p><h2 id="principles">Project principles</h2><ul><li>Threat-model language should remain precise and avoid absolute claims such as “unbreakable”.</li><li>Security-sensitive behavior should be documented and testable.</li><li>Cryptographic design and implementation claims should be supported by the repository, tests, or independent review — not marketing copy.</li><li>Verification and support surfaces remain separate from the corporate site and from the Cipher application.</li></ul><h2 id="model">Security model</h2><p>The project security model is maintained as its own documentation because it changes with the application architecture. The corporate website should not duplicate rapidly changing cryptographic details that could become inconsistent.</p><div class="actions"><a class="button secondary" href="/labs/cipher/security-model/">Security model overview</a></div><h2 id="application">Application</h2><p>Use the dedicated Cipher hostname for the application itself.</p><div class="actions"><a class="button" href="https://cipher.blackpinecybersecurity.com">Open Cipher ↗</a><a class="button secondary" href="https://verify.blackpinecybersecurity.com">Verify ↗</a></div></div></div></section>`;

  return {
    title: 'Blackpine Cipher | Blackpine Labs',
    description: 'Project overview for Blackpine Cipher and its separation from the corporate website, verification, and support surfaces.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Labs', href: '/labs/' }, { label: 'Cipher', href: '/labs/cipher/' }],
    body
  };
}

export function cipherSecurityModelPage() {
  const body = pageHero({
    eyebrow: 'Labs / Cipher',
    title: 'Cipher security model — public overview',
    lead: 'This page intentionally describes boundaries and documentation principles rather than making cryptographic claims that belong to the application repository and verified technical documentation.'
  }) + `<section class="section"><div class="shell prose"><h2>Public boundary</h2><p>The corporate website does not act as the authoritative specification for Cipher cryptography. Cipher’s implementation, threat model, test vectors, verification workflow, and release-specific security claims must be derived from the current project repository and release documentation.</p><h2>What this site can state safely</h2><ul><li>Cipher is separated from the main marketing site.</li><li>The Cipher surface should not load advertising, marketing analytics, or unrelated third-party JavaScript.</li><li>Verification and support operate on separate hostnames.</li><li>Security claims must avoid absolute language and must remain traceable to tested implementation details.</li></ul><h2>Why the distinction matters</h2><p>Cryptographic systems change. A marketing page that copies implementation details can silently become wrong after an engineering change. Blackpine therefore treats the current application documentation as the authoritative source.</p></div></section>`;

  return {
    title: 'Blackpine Cipher Security Model | Public Overview',
    description: 'Public overview of the documentation and trust boundaries for Blackpine Cipher.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Labs', href: '/labs/' }, { label: 'Cipher', href: '/labs/cipher/' }, { label: 'Security Model', href: '/labs/cipher/security-model/' }],
    body
  };
}

export function trustIndexPage() {
  const body = pageHero({
    eyebrow: 'Trust',
    title: 'Trust should be documented, not decorated.',
    lead: 'Blackpine publishes public information about website security, client-data handling, responsible disclosure, and the boundaries between corporate, support, verification, and Cipher systems.'
  }) + `<section class="section"><div class="shell"><div class="service-rows">${trustPages.map((page, index) => `<a class="service-row" href="/trust/${page.slug}/"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(page.title)}</strong><small>${esc(page.intro)}</small></span><span class="row-arrow">↗</span></a>`).join('')}</div><div class="notice"><strong>No borrowed trust badges.</strong><p>Blackpine does not display SOC 2, ISO, audit, partner, insurance, award, or certification claims unless they are actually held and publishable.</p></div></div></section>`;

  return {
    title: 'Blackpine Trust Center | Security, Data & Disclosure',
    description: 'Public Blackpine security practices, data-handling principles, responsible disclosure guidance, and website security information.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Trust', href: '/trust/' }],
    body
  };
}

export function trustPage(page) {
  const body = pageHero({ eyebrow: 'Trust', title: page.title, lead: page.intro }) +
    `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>On this page</span>${page.sections.map(([heading]) => `<a href="#${sectionId(heading)}">${esc(heading)}</a>`).join('')}</aside><div class="prose">${page.sections.map(([heading, paragraphs]) => `<h2 id="${sectionId(heading)}">${esc(heading)}</h2>${paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}`).join('')}</div></div></section>`;

  return {
    title: `${page.title} | Blackpine Trust`,
    description: page.intro,
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Trust', href: '/trust/' }, { label: page.title, href: `/trust/${page.slug}/` }],
    body
  };
}
