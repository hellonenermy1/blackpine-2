import { site } from '../data.mjs';
import { pageHero } from '../components.mjs';
import { esc } from '../lib/html.mjs';

export function aboutPage() {
  const body = pageHero({
    eyebrow: 'Company',
    title: 'Blackpine Cybersecurity',
    lead: 'A Canada-based cybersecurity firm focused on clear scope, technically defensible work, and security decisions that can be acted on.'
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Company</span><a href="#position">Position</a><a href="#principles">Principles</a><a href="#services-labs">Services & Labs</a><a href="#claims">Claims</a></aside><div class="prose"><h2 id="position">Security engineering rather than security theatre</h2><p>Blackpine is being built around a simple idea: competence should be demonstrated through scope, evidence, engineering, documentation, and useful outputs instead of exaggerated security language. The corporate site is designed to communicate with business owners, enterprise IT teams, and security professionals at different depths without pretending those audiences need the same amount of detail.</p><h2 id="principles">Operating principles</h2><ul><li>Confirm scope and authorization before security work begins.</li><li>Use evidence and stated assumptions instead of fear-based claims.</li><li>Minimize collection of sensitive information during public intake.</li><li>Write findings so technical teams and decision-makers can act on them.</li><li>State limitations directly. No assessment guarantees future security.</li><li>Keep security-sensitive products separated from marketing dependencies.</li></ul><h2 id="services-labs">Services and Labs</h2><p>Services address client security requirements such as assessment, identity and cloud controls, incident response, readiness, and advisory work. Blackpine Labs exists for genuine technical projects such as Cipher. Labs material is not used to inflate the scope of consulting services that Blackpine does not actually provide.</p><h2 id="claims">A strict rule for claims</h2><p>Blackpine does not invent client logos, office locations, awards, certifications, response commitments, partnerships, team scale, or research credentials to look larger. Any such claim must be verified before publication.</p><div class="actions"><a class="button secondary" href="/trust/">Review Trust Center</a><a class="button" href="/contact/">Contact Blackpine</a></div></div></div></section>`;

  return {
    title: 'About Blackpine Cybersecurity | Canada',
    description: 'About Blackpine Cybersecurity, its security engineering approach, operating principles, services, labs, and public trust standards.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Company', href: '/company/about/' }, { label: 'About', href: '/company/about/' }],
    body
  };
}

export function whoWeWorkWithPage() {
  const groups = [
    ['Enterprise & internal IT teams', 'Independent assessment, identity and cloud review, incident readiness, and security decisions that need clear technical documentation.'],
    ['Growing technology companies', 'Security foundations, administrative-access review, cloud/SaaS risk, customer diligence preparation, and incident readiness.'],
    ['Professional services', 'Email, identity, client-data workflows, vendor access, administrative systems, and business continuity.'],
    ['Legal and confidentiality-sensitive teams', 'Account security, email compromise exposure, remote access, vendor dependencies, and incident preparation.'],
    ['Healthcare and private clinics', 'Identity, cloud services, staff access, operational resilience, and sensitive information workflows — with scope defined around applicable obligations.'],
    ['Commerce and transaction-driven teams', 'Email impersonation, payment-change workflows, cloud and SaaS access, administrative accounts, and recovery readiness.']
  ];
  const body = pageHero({
    eyebrow: 'Company',
    title: 'Who we work with',
    lead: 'Blackpine does not create an “industry practice” page simply because a sector name is useful for SEO. This page describes environments where the current service model can be relevant without pretending to hold experience that has not been verified.'
  }) + `<section class="section"><div class="shell"><div class="service-rows">${groups.map((group, index) => `<div class="service-row"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(group[0])}</strong><small>${esc(group[1])}</small></span><span></span></div>`).join('')}</div><div class="notice"><strong>Sector claims require evidence.</strong><p>Dedicated industry pages should be created only when Blackpine has enough unique experience, regulatory context, case material, or research to make the page genuinely useful.</p></div></div></section>`;

  return {
    title: 'Who Blackpine Works With | Cybersecurity Services',
    description: 'Business and technology environments where Blackpine cybersecurity assessment, identity, cloud, incident response, and advisory services may be relevant.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Company', href: '/company/about/' }, { label: 'Who we work with', href: '/company/who-we-work-with/' }],
    body
  };
}

export function careersPage() {
  const body = pageHero({
    eyebrow: 'Company',
    title: 'Careers',
    lead: 'Blackpine does not publish placeholder vacancies. Current openings will appear here only when there is a real role, scope, location model, and application process.'
  }) + `<section class="section"><div class="shell"><div class="callout"><div><h2>No public openings listed.</h2><p>If Blackpine begins recruiting, this page will describe the actual role and working arrangement rather than collecting speculative applications indefinitely.</p></div><a class="button secondary" href="mailto:${site.careersEmail}">Careers contact</a></div></div></section>`;

  return {
    title: 'Careers | Blackpine Cybersecurity',
    description: 'Current career opportunities and recruiting information for Blackpine Cybersecurity.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Company', href: '/company/about/' }, { label: 'Careers', href: '/company/careers/' }],
    body
  };
}
