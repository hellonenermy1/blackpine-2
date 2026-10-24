import { site } from '../data.mjs';
import { trustPages } from '../trust-pages.mjs';
import { pageHero } from '../components.mjs';
import { esc, sectionId } from '../lib/html.mjs';

const enterpriseTrustDirectory = [
  ['Enterprise Assurance', '/trust/enterprise-assurance/', 'Readiness mapping across ISO/IEC 27001, SOC 2 Type II, ISO/IEC 27701, ISO 22301 and ISO/IEC 20000-1 without unsupported certification claims.'],
  ['Governance System', '/trust/governance-system/', 'The register, ownership and evidence model used to keep risks, controls, suppliers, incidents, access, recovery and corrective action reviewable.'],
  ['Client Portal Security', '/trust/client-portal-security/', 'Minimum security architecture and release gates for a future production client portal handling sensitive engagement material.'],
  ['Service Standards', '/trust/service-standards/', 'Public service-commitment boundaries designed to match actual operating models and signed agreements.'],
  ['Insurance & Risk Transfer', '/trust/insurance/', 'Evidence-gated publication rules for professional liability, E&O and cyber-liability coverage.']
];

export function labsIndexPage() {
  const body = pageHero({
    eyebrow: 'Labs',
    title: 'Engineering projects, documented in public.',
    lead: 'Blackpine Labs is where we build and document security engineering projects. Each project has its own security model, verification process, documentation, and operating boundary.'
  }) + `<section class="photo-band"><img src="/assets/editorial/labs-hardware-macro.jpg" srcset="/assets/editorial/labs-hardware-macro-640.jpg 640w, /assets/editorial/labs-hardware-macro-960.jpg 960w, /assets/editorial/labs-hardware-macro-1280.jpg 1280w, /assets/editorial/labs-hardware-macro.jpg 1600w" sizes="100vw" alt="" width="1600" height="900" loading="lazy" decoding="async" fetchpriority="low"><div class="photo-band-content"><div class="shell"><span class="eyebrow">Project 01</span><h2>Blackpine Cipher</h2><p>A separate file-encryption application with its own threat model, verification workflow, release-specific documentation, and support surface.</p><div class="actions"><a class="button cipher-primary" href="https://cipher.blackpinecybersecurity.com" rel="noopener">Open Cipher ↗</a><a class="button secondary cipher-secondary" href="/labs/cipher/">Review Cipher</a></div></div></div></section>`;

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
    lead: 'Blackpine Cipher is a separate application for file encryption. Current cryptographic details, verification information, and release notes are maintained with the application documentation.'
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Project</span><a href="#separation">System boundary</a><a href="#principles">Engineering principles</a><a href="#model">Security model</a><a href="#application">Application</a></aside><div class="prose"><h2 id="separation">A separate security surface</h2><p>Cipher is hosted separately from the Blackpine corporate site so the application does not inherit marketing dependencies. Support and verification also operate on separate hostnames.</p><h2 id="principles">Engineering principles</h2><ul><li>Security-sensitive behavior should be documented and testable.</li><li>Threat-model language should describe assumptions and limits rather than rely on absolute security claims.</li><li>Cryptographic claims should trace back to current implementation details, tests, or independent review.</li><li>Marketing, verification, support, and application surfaces should remain distinct where their trust requirements differ.</li></ul><h2 id="model">Security model</h2><p>The current threat model, test vectors, verification workflow, and release-specific cryptographic details are maintained with the project documentation so they stay aligned with the implementation.</p><div class="actions"><a class="button secondary" href="/labs/cipher/security-model/">Public security-model boundary</a></div><h2 id="application">Application</h2><p>Use the dedicated Cipher and Verify hostnames for the application and release verification surfaces.</p><div class="actions"><a class="button" href="https://cipher.blackpinecybersecurity.com">Open Cipher ↗</a><a class="button secondary" href="https://verify.blackpinecybersecurity.com">Verify ↗</a></div></div></div></section>`;

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
    title: 'Cipher security model',
    lead: "An overview of Cipher's public security principles and where to find current implementation and release-specific details."
  }) + `<section class="section"><div class="shell prose"><h2>Authoritative source</h2><p>The corporate website is not the authoritative specification for Cipher cryptography. Implementation details, threat assumptions, test vectors, verification behavior, and release-specific claims must come from the current project repository and release documentation.</p><h2>Stable public statements</h2><ul><li>Cipher is separated from the main corporate marketing site.</li><li>The Cipher surface should not load advertising, marketing analytics, or unrelated third-party JavaScript.</li><li>Verification and support operate on separate hostnames.</li><li>Security claims must remain traceable to tested implementation details and stated assumptions.</li></ul><h2>Why the boundary exists</h2><p>Cryptographic systems evolve. Keeping release-specific details with the implementation reduces the risk that a marketing page silently becomes an outdated specification.</p></div></section>`;

  return {
    title: 'Blackpine Cipher Security Model | Public Overview',
    description: 'Public boundary for Blackpine Cipher security documentation and release-specific technical claims.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Labs', href: '/labs/' }, { label: 'Cipher', href: '/labs/cipher/' }, { label: 'Security Model', href: '/labs/cipher/security-model/' }],
    body
  };
}

export function trustIndexPage() {
  const standardRows = trustPages.map((page, index) => `<a class="service-row" href="/trust/${page.slug}/"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(page.title)}</strong><small>${esc(page.intro)}</small></span><span class="row-arrow">↗</span></a>`).join('');
  const enterpriseRows = enterpriseTrustDirectory.map((page, index) => `<a class="service-row" href="${esc(page[1])}"><span class="service-index">${String(trustPages.length + index + 1).padStart(2, '0')}</span><span><strong>${esc(page[0])}</strong><small>${esc(page[2])}</small></span><span class="row-arrow">↗</span></a>`).join('');
  const body = pageHero({
    eyebrow: 'Trust',
    title: 'Trust, documented.',
    lead: 'Public information about Blackpine security practices, privacy, client-data handling, assurance status, service providers, continuity, incident-response governance, retention, disclosure, and security contacts.'
  }) + `<section class="section"><div class="shell"><div class="service-rows">${standardRows}${enterpriseRows}</div><div class="notice"><strong>Evidence before badges</strong><p>Blackpine publishes certifications, audits, partnerships, insurance, customer marks, control claims, and similar trust information only when the underlying evidence is current, supportable, and approved for disclosure.</p></div></div></section>`;

  return {
    title: 'Blackpine Trust Center | Security, Privacy & Assurance',
    description: 'Blackpine public trust documentation covering security practices, privacy, client-data handling, assurance status, subprocessors, continuity, incident response, retention, disclosure, and security contacts.',
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
