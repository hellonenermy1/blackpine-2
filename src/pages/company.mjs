import { site } from '../data.mjs';
import { companyFacts, plannedRoles } from '../v3-data.mjs';
import { publicCompany } from '../public-company.mjs';
import { pageHero } from '../components.mjs';
import { esc } from '../lib/html.mjs';

export function aboutPage() {
  const body = pageHero({
    eyebrow: 'Company',
    title: 'Security work should change a decision.',
    lead: `Blackpine is a ${companyFacts.teamSize}-person cybersecurity firm based in ${publicCompany.city}, ${publicCompany.province}, led by CEO and owner Michael Calloway. The practice brings advisory, defensive engineering, incident response, security operations, and governance disciplines into one organization.`,
    meta: `<strong>Blackpine Cybersecurity</strong>${esc(publicCompany.publicLocation)}<br>${esc(companyFacts.teamSize)} people<br><br>${esc(companyFacts.owner)}<br>${esc(companyFacts.ownerTitle)}`
  }) + `<section class="section company-media-intro" aria-label="Company"><div class="shell"><div class="editorial-duo"><figure class="editorial-image editorial-image-landscape"><img src="/assets/editorial/company-architecture-portrait.jpg" srcset="/assets/editorial/company-architecture-portrait-640.jpg 640w, /assets/editorial/company-architecture-portrait-960.jpg 960w, /assets/editorial/company-architecture-portrait-1280.jpg 1280w, /assets/editorial/company-architecture-portrait.jpg 1600w" sizes="(max-width: 820px) 100vw, 55vw" alt="" width="1200" height="1600" loading="lazy" decoding="async" fetchpriority="low"></figure><figure class="editorial-image editorial-image-portrait"><img src="/assets/editorial/company-canada-portrait.jpg" srcset="/assets/editorial/company-canada-portrait-640.jpg 640w, /assets/editorial/company-canada-portrait-960.jpg 960w, /assets/editorial/company-canada-portrait-1280.jpg 1280w, /assets/editorial/company-canada-portrait.jpg 1600w" sizes="(max-width: 820px) 100vw, 40vw" alt="" width="1200" height="1600" loading="lazy" decoding="async" fetchpriority="low"></figure></div></div></section><section class="section"><div class="shell content-grid"><aside class="on-page"><span>Company</span><a href="#position">Position</a><a href="#practice">The practice</a><a href="#location">Location</a><a href="#name">Brand standard</a><a href="#principles">Principles</a><a href="#services-labs">Services & Labs</a><a href="#claims">Publication standard</a></aside><div class="prose"><h2 id="position">The report is not the outcome</h2><p>A useful assessment changes what happens next. It identifies where control is concentrated, shows the evidence behind a finding, explains the consequence, and gives an owner a clear next action. Blackpine is built around that sequence rather than around volume, fear, or decorative security language.</p><h2 id="practice">One practice, several disciplines</h2><p>The team spans advisory leadership, technical assessments and defensive engineering, incident response and triage, security operations, and governance, risk, and compliance. That mix matters when a technical weakness crosses organizational boundaries: the person who finds it should be able to explain what it changes for response, ownership, evidence, or assurance.</p><p>Michael Calloway leads Blackpine as CEO and owner. Anthony Adinolfi serves as Principal Security Consultant & Founder.</p><h2 id="location">Montreal, Quebec</h2><p>Blackpine's public business location is ${esc(publicCompany.publicLocation)}. Current address and phone details are available on the Contact and Company Information pages.</p><h2 id="name">Brand standard</h2><p>The black pine reflects how Blackpine approaches security work: resilient, restrained, and built for difficult conditions. That means clear ownership, fewer unnecessary layers, and systems that remain understandable under pressure.</p><h2 id="principles">Operating principles</h2><ul><li>Define authority and scope before security work begins.</li><li>Separate observed evidence from assumptions.</li><li>Collect the minimum access and information the work requires.</li><li>Write findings for the people who must act on them.</li><li>Connect remediation to ownership and verification.</li><li>State limitations where the evidence or engagement boundary ends.</li></ul><h2 id="services-labs">Services and Labs</h2><p>Client work covers assessment, identity and cloud controls, penetration testing, application security, digital forensics, monitoring, incident response, readiness, compliance preparation, and advisory decisions. Blackpine Labs is separate: technical projects such as Cipher have their own application surface, security model, and verification path.</p><h2 id="claims">Publication standard</h2><p>Public claims are treated like technical claims: they need a source. Client marks, certifications, audits, partnerships, office locations, response commitments, research credentials, and case studies are published only when they are current, verifiable, and permitted for public use.</p><div class="actions"><a class="button" href="/company/team/">Meet the team</a><a class="button secondary" href="/trust/">Review trust documentation</a></div></div></div></section>`;

  return {
    title: `About Blackpine Cybersecurity | ${publicCompany.city}, ${publicCompany.province}`,
    description: `Blackpine Cybersecurity is a ${companyFacts.teamSize}-person cybersecurity firm based in ${publicCompany.publicLocation}, led by CEO and owner Michael Calloway.`,
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'About', href: '/company/about/' }],
    body,
    searchTerms: [`Michael Calloway CEO owner Anthony Adinolfi founder ${companyFacts.teamSize} people ${publicCompany.city} ${publicCompany.province} Canada team company`]
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
    lead: 'Blackpine works best with organizations that depend on a small number of important identities, vendors, applications, or administrative systems. The examples below show the kinds of environments where our work is most relevant.',
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
    lead: 'Blackpine hires people who can explain their reasoning, work carefully with evidence, and leave systems easier to understand than they found them. There are no confirmed open roles being advertised right now; the roles below are future hiring plans, not active vacancies.',
    meta: `<strong>Current hiring state</strong>${esc(publicCompany.currentHiringState)}`
  }) + `<section class="section editorial-split-section careers-editorial" aria-label="Careers at Blackpine"><div class="shell editorial-split"><figure class="editorial-split-media"><img src="/assets/editorial/careers-engineering-landscape.jpg" srcset="/assets/editorial/careers-engineering-landscape-640.jpg 640w, /assets/editorial/careers-engineering-landscape-960.jpg 960w, /assets/editorial/careers-engineering-landscape-1280.jpg 1280w, /assets/editorial/careers-engineering-landscape.jpg 1600w" sizes="(max-width: 820px) 100vw, 58vw" alt="" width="1600" height="2400" loading="lazy" decoding="async" fetchpriority="low"></figure><div class="editorial-split-copy"><span class="eyebrow">Working style</span><h2>Careful work, explained clearly.</h2><p>We value clear reasoning, strong evidence, ownership, and work that leaves systems easier to understand and operate.</p></div></div></section><section class="section"><div class="shell"><div class="section-head"><div class="section-label">Planned hiring</div><div><h2>Roles intended to deepen the practice.</h2><p>The current plan adds commercial ownership, client continuity, offensive security, application security, cloud architecture, forensic depth, and platform engineering rather than simply increasing general analyst headcount.</p></div></div>${groups.map(group => `<section class="career-group"><h3>${esc(group)}</h3>${plannedRoles.filter(role => role.group === group).map(role => `<article class="career-role"><div><span class="career-status">${esc(role.status)}</span><h4>${esc(role.title)}</h4><p>${esc(role.summary)}</p></div><span aria-hidden="true">Planned</span></article>`).join('')}</section>`).join('')}<div class="notice"><strong>Hiring status</strong><p>${esc(publicCompany.currentHiringState)} Open positions will include the role scope, location or working model, requirements, hiring process, and application instructions.</p></div><div class="actions"><a class="button secondary" href="mailto:${site.careersEmail}">Careers contact</a><a class="button" href="/company/team/">Meet the current team</a></div></div></section>`;

  return {
    title: 'Careers at Blackpine Cybersecurity | Planned Roles',
    description: 'Blackpine Cybersecurity careers and seven planned future roles. No confirmed open roles are currently advertised.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Company', href: '/company/about/' }, { label: 'Careers', href: '/company/careers/' }],
    body,
    searchTerms: plannedRoles.map(role => role.title).join(' ')
  };
}
