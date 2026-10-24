import { site } from '../data.mjs';
import { companyFacts, plannedRoles } from '../v3-data.mjs';
import { pageHero } from '../components.mjs';
import { esc } from '../lib/html.mjs';

export function aboutPage() {
  const body = pageHero({
    eyebrow: 'Company',
    title: 'Security work should change a decision.',
    lead: 'Blackpine is a 26-person Canadian cybersecurity firm led by CEO and owner Michael Calloway. The practice brings advisory, defensive engineering, incident response, security operations, and governance disciplines into one organization.',
    meta: `<strong>Blackpine Cybersecurity</strong>${esc(companyFacts.country)}<br>${esc(companyFacts.teamSize)} people<br><br>${esc(companyFacts.owner)}<br>${esc(companyFacts.ownerTitle)}`
  }) + `<section class="section company-media-intro" aria-label="Company visual studies"><div class="shell"><div class="editorial-duo"><figure class="editorial-image editorial-image-landscape"><img src="/assets/editorial/company-architecture-portrait.jpg" alt="Dark modern urban architecture with strong vertical geometry" width="1200" height="1600" loading="eager" decoding="async"></figure><figure class="editorial-image editorial-image-portrait"><img src="/assets/editorial/company-canada-portrait.jpg" alt="Snowy Toronto street at night, used as Canadian urban context rather than as an office photograph" width="1200" height="1600" loading="lazy" decoding="async"></figure></div></div></section><section class="section"><div class="shell content-grid"><aside class="on-page"><span>Company</span><a href="#position">Position</a><a href="#practice">The practice</a><a href="#name">Brand standard</a><a href="#principles">Principles</a><a href="#services-labs">Services & Labs</a><a href="#claims">Publication standard</a></aside><div class="prose"><h2 id="position">The report is not the outcome</h2><p>A useful assessment changes what happens next. It identifies where control is concentrated, shows the evidence behind a finding, explains the consequence, and gives an owner a clear next action. Blackpine is built around that sequence rather than around volume, fear, or decorative security language.</p><h2 id="practice">One practice, several disciplines</h2><p>The team spans advisory leadership, technical assessments and defensive engineering, incident response and triage, security operations, and governance, risk, and compliance. That mix matters when a technical weakness crosses organizational boundaries: the person who finds it should be able to explain what it changes for response, ownership, evidence, or assurance.</p><p>Michael Calloway is Blackpine's CEO and owner. Anthony Adinolfi is listed separately as Principal Security Consultant & Founder; those titles are preserved as distinct public facts rather than being turned into a company-history narrative that has not been established for publication.</p><h2 id="name">Brand standard</h2><p>As a brand image, black pine suggests restraint, resilience, and systems built for difficult conditions. The website uses that idea as a design standard: fewer unnecessary parts, clear lines of responsibility, and systems that are easier to inspect when pressure arrives. This is a brand interpretation, not a claim about the historical origin of the company name.</p><h2 id="principles">Operating principles</h2><ul><li>Define authority and scope before security work begins.</li><li>Separate observed evidence from assumptions.</li><li>Collect the minimum access and information the work requires.</li><li>Write findings for the people who must act on them.</li><li>Connect remediation to ownership and verification.</li><li>State limitations where the evidence or engagement boundary ends.</li></ul><h2 id="services-labs">Services and Labs</h2><p>Client work covers assessment, identity and cloud controls, penetration testing, application security, digital forensics, monitoring, incident response, readiness, compliance preparation, and advisory decisions. Blackpine Labs is separate: technical projects such as Cipher have their own application surface, security model, and verification path.</p><h2 id="claims">Publication standard</h2><p>Public claims are treated like technical claims: they need a source. Client marks, certifications, audits, partnerships, office locations, response commitments, research credentials, and case studies are published only when they are current, verifiable, and permitted for public use.</p><div class="actions"><a class="button" href="/company/team/">Meet the team</a><a class="button secondary" href="/trust/">Review trust documentation</a></div></div></div></section>`;

  return {
    title: 'About Blackpine Cybersecurity | Canada',
    description: 'Blackpine Cybersecurity is a 26-person Canadian security firm led by CEO and owner Michael Calloway, spanning advisory, engineering, incident response, SOC, and GRC work.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'About', href: '/company/about/' }],
    body,
    searchTerms: ['Michael Calloway CEO owner Anthony Adinolfi founder 26 people Canada team company']
  };
}

export function whoWeWorkWithPage() {
  const groups = [
    ['Enterprise & internal IT teams', 'Independent assessment, identity and cloud review, incident readiness, monitoring, and decisions that need defensible technical documentation.'],
    ['Growing technology companies', 'Application security, administrative-access review, cloud and SaaS exposure, customer diligence preparation, and incident readiness.'],
    ['Professional services', 'Email, identity, client-data workflows, vendor access, administrative systems, and continuity dependencies.'],
    ['Legal and confidentiality-sensitive teams', 'Account security, email-compromise exposure, remote access, vendor dependencies, and incident preparation.'],
    ['Healthcare and private clinics', 'Identity, cloud services, staff access, recovery, and sensitive information workflows within an agreed scope.'],
    ['Commerce and transaction-driven teams', 'Email impersonation, payment-change workflows, cloud access, administrative accounts, and recovery readiness.'],
    ['Industrial and operational businesses', 'Administrative segmentation, connected equipment boundaries, vendor access, office IT dependencies, and recovery planning where Blackpine has an authorized scope.']
  ];
  const body = pageHero({
    eyebrow: 'Company',
    title: 'Where Blackpine work can fit.',
    lead: 'The common denominator is not an industry label. It is dependence on systems where a small number of identities, vendors, applications, or administrative paths can affect a much larger part of the operation. The examples below describe environments Blackpine can support; they are not a public client list or a claim of sector-specific client history.',
    meta: '<strong>Typical starting point</strong>A system, incident, assurance requirement, or decision that needs a defined technical scope.'
  }) + `<section class="section"><div class="shell"><div class="service-rows">${groups.map((group, index) => `<div class="service-row"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(group[0])}</strong><small>${esc(group[1])}</small></span><span></span></div>`).join('')}</div><div class="notice"><strong>Scope follows the environment.</strong><p>Industry context matters when it changes systems, obligations, evidence, safety, or response decisions. Engagement scope is built around those facts rather than around a generic sector template.</p></div><div class="actions"><a class="button" href="/contact/#inquiry">Discuss the environment</a><a class="button secondary" href="/work/">Review engagement patterns</a></div></div></section>`;

  return {
    title: 'Where Blackpine Can Help | Cybersecurity Services',
    description: 'Examples of organization and technology environments where Blackpine assessment, engineering, incident response, security operations, and advisory work can be relevant.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Company', href: '/company/about/' }, { label: 'Who we work with', href: '/company/who-we-work-with/' }],
    body
  };
}

export function careersPage() {
  const groups = [...new Set(plannedRoles.map(role => role.group))];
  const body = pageHero({
    eyebrow: 'Company / Careers',
    title: 'Careers at Blackpine.',
    lead: 'Blackpine hires people who can explain their reasoning, work carefully with evidence, and leave systems easier to understand than they found them. Planned roles are shown separately from positions that are actually open for applications.',
    meta: '<strong>Current hiring state</strong>Seven roles are planned. They are not represented as open positions until an application process is published.'
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Planned hiring</div><div><h2>Roles intended to deepen the practice.</h2><p>The current plan adds commercial ownership, client continuity, offensive security, application security, cloud architecture, forensic depth, and platform engineering rather than simply increasing general analyst headcount.</p></div></div>${groups.map(group => `<section class="career-group"><h3>${esc(group)}</h3>${plannedRoles.filter(role => role.group === group).map(role => `<article class="career-role"><div><span class="career-status">${esc(role.status)}</span><h4>${esc(role.title)}</h4><p>${esc(role.summary)}</p></div><span aria-hidden="true">Planned</span></article>`).join('')}</section>`).join('')}<div class="notice"><strong>Planned does not mean open.</strong><p>When a position opens, Blackpine will publish its scope, responsibilities, location or working model, requirements, hiring process, and application instructions. Until then, no JobPosting structured data is emitted for these roles.</p></div><div class="actions"><a class="button secondary" href="mailto:${site.careersEmail}">Careers contact</a><a class="button" href="/company/team/">Meet the current team</a></div></div></section>`;

  return {
    title: 'Careers at Blackpine Cybersecurity | Planned Roles',
    description: 'Blackpine Cybersecurity careers, hiring principles, and seven planned roles across growth, client operations, offensive security, cloud, application security, DFIR, and platform engineering.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Company', href: '/company/about/' }, { label: 'Careers', href: '/company/careers/' }],
    body,
    searchTerms: plannedRoles.map(role => role.title).join(' ')
  };
}
