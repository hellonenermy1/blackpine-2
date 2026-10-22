import { site } from '../data.mjs';
import { pageHero } from '../components.mjs';
import { esc } from '../lib/html.mjs';

export function aboutPage() {
  const body = pageHero({
    eyebrow: 'Company',
    title: 'Security work should change a decision.',
    lead: 'Blackpine is a Canadian cybersecurity firm focused on systems where identity, administrative control, cloud access, public infrastructure, and recovery carry operational consequence.'
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Company</span><a href="#position">Position</a><a href="#name">Why Blackpine</a><a href="#principles">Principles</a><a href="#services-labs">Services & Labs</a><a href="#claims">Publication standard</a></aside><div class="prose"><h2 id="position">The report is not the outcome</h2><p>A useful assessment changes what happens next. It identifies where control is concentrated, shows the evidence behind a finding, explains the operational consequence, and gives an owner a clear next action. Blackpine is built around that sequence rather than around volume, fear, or decorative security language.</p><h2 id="name">Why Blackpine</h2><p>The name comes from the image of northern pine: spare, resilient, and built for difficult conditions. It is a useful design standard for the company as well — fewer unnecessary parts, clear lines of responsibility, and systems that are easier to inspect when pressure arrives.</p><h2 id="principles">Operating principles</h2><ul><li>Define authority and scope before security work begins.</li><li>Separate observed evidence from assumptions.</li><li>Collect the minimum access and information the work requires.</li><li>Write findings for the people who must act on them.</li><li>Connect remediation to ownership and verification.</li><li>State limitations where the evidence or engagement boundary ends.</li></ul><h2 id="services-labs">Services and Labs</h2><p>Client work covers assessment, identity and cloud controls, public administrative surfaces, incident response, readiness, and advisory decisions. Blackpine Labs is separate: it is where technical projects such as Cipher are documented as engineering work with their own security model and verification surface.</p><h2 id="claims">Publication standard</h2><p>Public claims are treated like technical claims: they need a source. Client marks, certifications, audits, partnerships, office locations, response commitments, and research credentials are published only when they are current, verifiable, and permitted for public use.</p><div class="actions"><a class="button secondary" href="/trust/">Review trust documentation</a><a class="button" href="/contact/">Contact Blackpine</a></div></div></div></section>`;

  return {
    title: 'About Blackpine Cybersecurity | Canada',
    description: 'Blackpine Cybersecurity is a Canadian security firm focused on assessment, identity and cloud controls, incident response, readiness, and inspectable technical work.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Company', href: '/company/about/' }, { label: 'About', href: '/company/about/' }],
    body
  };
}

export function whoWeWorkWithPage() {
  const groups = [
    ['Enterprise & internal IT teams', 'Independent assessment, identity and cloud review, incident readiness, and decisions that need defensible technical documentation.'],
    ['Growing technology companies', 'Security foundations, administrative-access review, cloud and SaaS exposure, customer diligence preparation, and incident readiness.'],
    ['Professional services', 'Email, identity, client-data workflows, vendor access, administrative systems, and continuity dependencies.'],
    ['Legal and confidentiality-sensitive teams', 'Account security, email-compromise exposure, remote access, vendor dependencies, and incident preparation.'],
    ['Healthcare and private clinics', 'Identity, cloud services, staff access, operational resilience, and sensitive information workflows within an agreed scope.'],
    ['Commerce and transaction-driven teams', 'Email impersonation, payment-change workflows, cloud access, administrative accounts, and recovery readiness.']
  ];
  const body = pageHero({
    eyebrow: 'Company',
    title: 'Organizations with concentrated digital control.',
    lead: 'The common denominator is not industry. It is dependence on systems where a small number of identities, vendors, or administrative paths can affect a much larger part of the operation.'
  }) + `<section class="section"><div class="shell"><div class="service-rows">${groups.map((group, index) => `<div class="service-row"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(group[0])}</strong><small>${esc(group[1])}</small></span><span></span></div>`).join('')}</div><div class="notice"><strong>Scope follows the environment.</strong><p>Industry context matters when it changes systems, obligations, evidence, or response decisions. Engagement scope is built around those facts rather than around a generic sector template.</p></div></div></section>`;

  return {
    title: 'Who Blackpine Works With | Cybersecurity Services',
    description: 'Organizations and technology environments where Blackpine assessment, identity, cloud, incident response, and advisory work may be relevant.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Company', href: '/company/about/' }, { label: 'Who we work with', href: '/company/who-we-work-with/' }],
    body
  };
}

export function careersPage() {
  const body = pageHero({
    eyebrow: 'Company',
    title: 'Careers',
    lead: 'Blackpine recruits against real work. Open roles appear here with a defined scope, location model, responsibilities, and application process.'
  }) + `<section class="section"><div class="shell"><div class="callout"><div><h2>No public openings at the moment.</h2><p>When a role opens, this page will describe the work and working arrangement directly.</p></div><a class="button secondary" href="mailto:${site.careersEmail}">Careers contact</a></div></div></section>`;

  return {
    title: 'Careers | Blackpine Cybersecurity',
    description: 'Current career opportunities and recruiting information for Blackpine Cybersecurity.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Company', href: '/company/about/' }, { label: 'Careers', href: '/company/careers/' }],
    body
  };
}
