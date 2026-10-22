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
    eyebrow: 'Services',
    title: 'Security work with defined scope and useful outputs.',
    lead: 'Blackpine organizes services around the systems, identities, and response decisions that create practical business risk — not around a catalogue of fashionable security terms.'
  }) + `<section class="section"><div class="shell">${serviceRows(services)}</div></section>
  <section class="section compact"><div class="shell callout"><div><h2>Need a defined starting point?</h2><p>Engagement models explain how focused reviews, broader assessments, incident support, and advisory work can be scoped without forcing every organization into a preset package.</p></div><a class="button secondary" href="/engagements/">Engagement models</a></div></section>`;

  return {
    title: 'Cybersecurity Services in Canada | Blackpine Cybersecurity',
    description: 'Security assessments, identity and email security, cloud and SaaS security, website administrative security, incident response, readiness, and advisory services.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services/' }],
    body
  };
}

export function servicePage(service) {
  const navLinks = ['When to involve Blackpine', 'What we review', 'How the engagement works', 'What you receive', 'Illustrative finding', 'Boundaries'];
  const related = relatedResearch(service);
  const body = pageHero({
    eyebrow: 'Services',
    title: service.title,
    lead: service.intro,
    meta: `<strong>Service area</strong>${esc(service.short)}<br><br><a href="/contact/?service=${encodeURIComponent(service.slug)}">Discuss this service →</a>`
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>On this page</span>${navLinks.map(title => `<a href="#${sectionId(title)}">${esc(title)}</a>`).join('')}</aside><article class="prose">
    <h2 id="${sectionId(navLinks[0])}">${navLinks[0]}</h2><ul>${service.when.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
    <h2 id="${sectionId(navLinks[1])}">${navLinks[1]}</h2><ul>${service.review.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
    <h2 id="${sectionId(navLinks[2])}">${navLinks[2]}</h2><div class="spec-list">${service.method.map((item, index) => `<div class="spec-item"><strong>${String(index + 1).padStart(2, '0')}</strong><span>${esc(item)}</span></div>`).join('')}</div>
    <h2 id="${sectionId(navLinks[3])}">${navLinks[3]}</h2><ul>${service.deliverables.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
    <div class="sample-finding" id="${sectionId(navLinks[4])}"><span class="sample-label">Illustrative finding — not client data</span><div class="sample-grid"><div><small>Area</small><p>${esc(service.sample.area)}</p></div><div><small>Observation</small><p>${esc(service.sample.finding)}</p></div><div><small>Why it matters</small><p>${esc(service.sample.consequence)}</p></div><div><small>Example action</small><p>${esc(service.sample.action)}</p></div></div></div>
    <h2 id="${sectionId(navLinks[5])}">${navLinks[5]}</h2><div class="notice"><strong>Scope matters.</strong><p>${esc(service.boundary)}</p></div>
    ${related.length ? `<h2>Related research</h2>${researchRows(related)}` : ''}
  </article></div></section>
  <section class="section compact"><div class="shell callout"><div><h2>Discuss ${esc(service.title.toLowerCase())}.</h2><p>Start with the system, concern, and business context. Scope and authorization are confirmed before review work begins.</p></div><a class="button" href="/contact/?service=${encodeURIComponent(service.slug)}">Contact Blackpine</a></div></section>`;

  return {
    title: `${service.title} | Blackpine Cybersecurity Canada`,
    description: service.short,
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services/' }, { label: service.title, href: `/services/${service.slug}/` }],
    body
  };
}

export function engagementsPage() {
  const models = [
    ['Focused Review', 'A narrowly scoped review of a defined system, control family, or security question.'],
    ['Security Assessment', 'A broader evidence-based review across agreed systems, controls, and business processes.'],
    ['Incident Engagement', 'Time-sensitive support for triage, containment, evidence, recovery, and post-incident priorities within an agreed scope.'],
    ['Advisory Engagement', 'Decision support for roadmaps, vendors, policies, remediation, and security priorities.'],
    ['Ongoing Review', 'Periodic review can be scoped when there is a real recurring need; it is not positioned as a generic subscription by default.']
  ];
  const body = pageHero({
    eyebrow: 'Engagements',
    title: 'Scope the work around the problem — not a package name.',
    lead: 'Blackpine uses engagement models as starting points. Exact scope, access, timing, deliverables, responsibilities, and fees belong in the written engagement terms.'
  }) + `<section class="section"><div class="shell"><div class="service-rows">${models.map((model, index) => `<div class="service-row"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(model[0])}</strong><small>${esc(model[1])}</small></span><span></span></div>`).join('')}</div><div class="notice"><strong>No one-size-fits-all promises.</strong><p>An inquiry does not create a client relationship. The correct engagement depends on the environment, authorization, data sensitivity, urgency, and the outcome required.</p></div></div></section>`;

  return {
    title: 'Cybersecurity Engagement Models | Blackpine Cybersecurity',
    description: 'How Blackpine scopes focused reviews, security assessments, incident support, advisory work, and recurring reviews.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Engagements', href: '/engagements/' }],
    body
  };
}
