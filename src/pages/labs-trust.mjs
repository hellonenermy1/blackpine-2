import { site, trustPages } from '../data.mjs';
import { pageHero } from '../components.mjs';
import { esc, sectionId } from '../lib/html.mjs';

export function labsIndexPage() {
  const body = pageHero({
    eyebrow: 'Labs',
    title: 'Engineering projects, documented in public.',
    lead: 'Blackpine Labs is the project layer of the company: build something real, define the security model, expose the verification surface, and document where the system stops. Labs sits alongside the client practice but does not silently inherit the scope, data, or trust assumptions of a client engagement.'
  }) + `<section class="photo-band"><img src="${site.infrastructureImage}" alt="Abstract Blackpine infrastructure and control-path diagram" width="1600" height="900" loading="eager" decoding="async"><div class="photo-band-content"><div class="shell"><span class="eyebrow">Project 01</span><h2>Blackpine Cipher</h2><p>A separate file-encryption application with its own threat model, verification workflow, release-specific documentation, and support surface.</p><div class="actions"><a class="button cipher-primary" href="https://cipher.blackpinecybersecurity.com" rel="noopener">Open Cipher ↗</a><a class="button secondary cipher-secondary" href="/labs/cipher/">Review Cipher</a></div></div></div></section>`;

  return {
    title: 'Blackpine Labs | Security Engineering Projects',
    description: 'Blackpine Labs documents security engineering projects including Blackpine Cipher, with project boundaries and verification surfaces kept separate from the corporate site.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Labs', href: '/labs/' }],
    body
  };
}

export function cipherPage() {
  const body = pageHero({
    eyebrow: 'Labs / Cipher',
    title: 'Blackpine Cipher',
    lead: 'A separate Blackpine application for file encryption. The corporate site describes the project boundary; release-specific cryptographic claims belong to the current application documentation and verified implementation.'
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Project</span><a href="#separation">System boundary</a><a href="#principles">Engineering principles</a><a href="#model">Security model</a><a href="#application">Application</a></aside><div class="prose"><h2 id="separation">A separate security surface</h2><p>Cipher is hosted separately from the Blackpine corporate site so the application does not inherit marketing dependencies. Support and verification also operate on separate hostnames.</p><h2 id="principles">Engineering principles</h2><ul><li>Security-sensitive behavior should be documented and testable.</li><li>Threat-model language should describe assumptions and limits rather than rely on absolute security claims.</li><li>Cryptographic claims should trace back to current implementation details, tests, or independent review.</li><li>Marketing, verification, support, and application surfaces should remain distinct where their trust requirements differ.</li></ul><h2 id="model">Security model</h2><p>The public project overview stays intentionally stable. The current threat model, test vectors, verification workflow, and release-specific cryptographic details belong with the project documentation so they can change with the implementation instead of drifting out of sync.</p><div class="actions"><a class="button secondary" href="/labs/cipher/security-model/">Public security-model boundary</a></div><h2 id="application">Application</h2><p>Use the dedicated Cipher and Verify hostnames for the application and release verification surfaces.</p><div class="actions"><a class="button" href="https://cipher.blackpinecybersecurity.com">Open Cipher ↗</a><a class="button secondary" href="https://verify.blackpinecybersecurity.com">Verify ↗</a></div></div></div></section>`;

  return {
    title: 'Blackpine Cipher | Blackpine Labs',
    description: 'Project overview for Blackpine Cipher and the separation between corporate, application, verification, and support surfaces.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Labs', href: '/labs/' }, { label: 'Cipher', href: '/labs/cipher/' }],
    body
  };
}

export function cipherSecurityModelPage() {
  const body = pageHero({
    eyebrow: 'Labs / Cipher',
    title: 'Cipher security model — public boundary',
    lead: 'This page defines which Cipher claims belong on the corporate site and which must come from the current project implementation and release documentation.'
  }) + `<section class="section"><div class="shell prose"><h2>Authoritative source</h2><p>The corporate website is not the authoritative specification for Cipher cryptography. Implementation details, threat assumptions, test vectors, verification behavior, and release-specific claims must come from the current project repository and release documentation.</p><h2>Stable public statements</h2><ul><li>Cipher is separated from the main corporate marketing site.</li><li>The Cipher surface should not load advertising, marketing analytics, or unrelated third-party JavaScript.</li><li>Verification and support operate on separate hostnames.</li><li>Security claims must remain traceable to tested implementation details and stated assumptions.</li></ul><h2>Why the boundary exists</h2><p>Cryptographic systems evolve. Keeping release-specific details with the implementation reduces the risk that a marketing page silently becomes an outdated specification.</p></div></section>`;

  return {
    title: 'Blackpine Cipher Security Model | Public Overview',
    description: 'Public boundary for Blackpine Cipher security documentation and release-specific technical claims.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Labs', href: '/labs/' }, { label: 'Cipher', href: '/labs/cipher/' }, { label: 'Security Model', href: '/labs/cipher/security-model/' }],
    body
  };
}

export function trustIndexPage() {
  const body = pageHero({
    eyebrow: 'Trust',
    title: 'Trust, documented.',
    lead: 'Public information about website security, client-data handling, responsible disclosure, and the boundaries between Blackpine corporate, support, verification, and Cipher systems. These pages describe controls and boundaries Blackpine can state directly; they are not substitutes for certifications, audits, or assurances that have not been independently established.'
  }) + `<section class="section"><div class="shell"><div class="service-rows">${trustPages.map((page, index) => `<a class="service-row" href="/trust/${page.slug}/"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(page.title)}</strong><small>${esc(page.intro)}</small></span><span class="row-arrow">↗</span></a>`).join('')}</div><div class="notice"><strong>Publication standard</strong><p>Certifications, audits, partnerships, insurance, customer marks, and similar trust claims are published only when they are current, verifiable, and permitted for public use.</p></div></div></section>`;

  return {
    title: 'Blackpine Trust Center | Security, Data & Disclosure',
    description: 'Blackpine security practices, data-handling principles, responsible disclosure guidance, and website-security documentation.',
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
