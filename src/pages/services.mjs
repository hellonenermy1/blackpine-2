import { services, research } from '../data.mjs';
import { pageHero, researchRows, serviceRows } from '../components.mjs';
import { esc, sectionId } from '../lib/html.mjs';

const relatedTopicsByService = {
  'security-assessments': ['Security Assessment'],
  'identity-email-security': ['Identity & Email'],
  'cloud-saas-security': ['Cloud Security'],
  'website-administrative-security': ['Web Security'],
  'incident-response': ['Incident Response'],
  'incident-readiness-recovery': ['Incident Readiness'],
  'security-advisory': ['Security Assessment', 'Cloud Security', 'Identity & Email']
};

function relatedResearch(service) {
  const topics = relatedTopicsByService[service.slug] || [];
  return research.filter(item => topics.includes(item.topic)).slice(0, 3);
}

export function servicesIndexPage() {
  const body = pageHero({
    eyebrow: 'Capabilities',
    title: 'Security work around the control points that matter.',
    lead: 'Identity, administrative access, cloud services, public infrastructure, and recovery are treated as connected systems. Engagements are scoped around the decision you need to make.'
  }) + `<section class="section"><div class="shell">${serviceRows(services)}</div></section>
  <section class="section compact"><div class="shell callout"><div><h2>Choose the shape of the work after the problem is clear.</h2><p>Focused reviews, broader assessments, incident work, and ongoing advisory support use different scopes because they answer different questions.</p></div><a class="button secondary" href="/engagements/">Review engagement models</a></div></section>`;

  return {
    title: 'Cybersecurity Capabilities in Canada | Blackpine Cybersecurity',
    description: 'Security assessment, identity and email security, cloud and SaaS security, website administrative security, incident response, readiness, and advisory capabilities.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Capabilities', href: '/services/' }],
    body
  };
}

export function servicePage(service) {
  const navLinks = ['Use cases', 'Review surface', 'Method', 'Deliverables', 'Example finding', 'Scope'];
  const related = relatedResearch(service);
  const body = pageHero({
    eyebrow: 'Capabilities',
    title: service.title,
    lead: service.intro,
    meta: `<strong>Capability</strong>${esc(service.short)}<br><br><a href="/contact/?service=${encodeURIComponent(service.slug)}">Discuss this capability →</a>`
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>On this page</span>${navLinks.map(title => `<a href="#${sectionId(title)}">${esc(title)}</a>`).join('')}</aside><article class="prose">
    <h2 id="${sectionId(navLinks[0])}">${navLinks[0]}</h2><ul>${service.when.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
    <h2 id="${sectionId(navLinks[1])}">${navLinks[1]}</h2><ul>${service.review.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
    <h2 id="${sectionId(navLinks[2])}">${navLinks[2]}</h2><div class="spec-list">${service.method.map((item, index) => `<div class="spec-item"><strong>${String(index + 1).padStart(2, '0')}</strong><span>${esc(item)}</span></div>`).join('')}</div>
    <h2 id="${sectionId(navLinks[3])}">${navLinks[3]}</h2><ul>${service.deliverables.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
    <div class="sample-finding" id="${sectionId(navLinks[4])}"><span class="sample-label">Illustrative finding — not client data</span><div class="sample-grid"><div><small>Area</small><p>${esc(service.sample.area)}</p></div><div><small>Observation</small><p>${esc(service.sample.finding)}</p></div><div><small>Consequence</small><p>${esc(service.sample.consequence)}</p></div><div><small>Example action</small><p>${esc(service.sample.action)}</p></div></div></div>
    <h2 id="${sectionId(navLinks[5])}">${navLinks[5]}</h2><div class="notice"><strong>Engagement boundary</strong><p>${esc(service.boundary)}</p></div>
    ${related.length ? `<h2>Related research</h2>${researchRows(related)}` : ''}
  </article></div></section>
  <section class="section compact"><div class="shell callout"><div><h2>Bring the system, concern, and desired outcome.</h2><p>Scope and authorization are confirmed before review or response work begins.</p></div><a class="button" href="/contact/?service=${encodeURIComponent(service.slug)}">Discuss this capability</a></div></section>`;

  return {
    title: `${service.title} | Blackpine Cybersecurity Canada`,
    description: service.short,
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Capabilities', href: '/services/' }, { label: service.title, href: `/services/${service.slug}/` }],
    body
  };
}

export function engagementsPage() {
  const models = [
    ['Focused Review', 'A narrow review of a defined system, control family, or security question.'],
    ['Security Assessment', 'A broader evidence-led review across agreed systems, controls, and operating processes.'],
    ['Incident Engagement', 'Time-sensitive work covering triage, containment, evidence, recovery, and post-incident priorities within the agreed scope.'],
    ['Advisory Engagement', 'Decision support for roadmaps, vendors, policy, remediation sequencing, and security priorities.'],
    ['Ongoing Review', 'Periodic review tied to defined systems, owners, or milestones when recurring assurance is useful.']
  ];
  const body = pageHero({
    eyebrow: 'Engagements',
    title: 'The problem determines the engagement.',
    lead: 'Scope, access, timing, deliverables, responsibilities, and fees are defined in writing around the decision or incident at hand.'
  }) + `<section class="section"><div class="shell"><div class="service-rows">${models.map((model, index) => `<div class="service-row"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(model[0])}</strong><small>${esc(model[1])}</small></span><span></span></div>`).join('')}</div><div class="notice"><strong>The written scope is the control point.</strong><p>Environment, authorization, data sensitivity, urgency, and required output determine how the work is structured.</p></div></div></section>`;

  return {
    title: 'Cybersecurity Engagement Models | Blackpine Cybersecurity',
    description: 'How Blackpine scopes focused reviews, security assessments, incident engagements, advisory work, and recurring review.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Engagements', href: '/engagements/' }],
    body
  };
}
