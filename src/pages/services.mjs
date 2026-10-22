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
  'security-advisory': ['Security Assessment', 'Cloud Security', 'Identity & Email'],
  'penetration-testing': ['Security Assessment', 'Web Security'],
  'application-security': ['Web Security', 'Identity & Email'],
  'digital-forensics': ['Incident Response'],
  'security-monitoring': ['Incident Response', 'Identity & Email'],
  'compliance-readiness': ['Security Assessment']
};

const practiceContextByService = {
  'security-assessments': 'Assessment work sits across Practice Leadership & Advisory and Technical Assessments & Defensive Engineering, with specialist input added when identity, cloud, incident, or compliance questions change the scope.',
  'identity-email-security': 'This work draws on Blackpine IAM engineering, cloud security, email-compromise response, and advisory experience rather than treating mailbox settings as a stand-alone checklist.',
  'cloud-saas-security': 'Cloud reviews are anchored in Technical Assessments & Defensive Engineering, with IAM, incident, monitoring, or GRC input added when the control path crosses those functions.',
  'website-administrative-security': 'Website work is handled as an administrative system spanning domains, DNS, hosting, applications, identity, recovery, and third-party ownership rather than as a cosmetic web scan.',
  'incident-response': 'Blackpine maintains a dedicated Incident Response & Triage function, including incident leadership, digital forensics, email-compromise work, and response coordination.',
  'incident-readiness-recovery': 'Readiness work connects Incident Response & Triage with advisory and risk disciplines because response plans fail as often at authority and handoffs as they do at technical controls.',
  'security-advisory': 'Advisory work is led through Practice Leadership & Advisory and can pull in engineering, response, SOC, or GRC specialists when the decision depends on their evidence.',
  'penetration-testing': 'Authorized active testing sits within Technical Assessments & Defensive Engineering, where Blackpine already maintains a lead penetration-testing function and separates exploit validation from general assessment work.',
  'application-security': 'Application-security work sits within Technical Assessments & Defensive Engineering and is scoped around the application, API, identity, deployment, and data paths that actually need review.',
  'digital-forensics': 'Digital forensics is part of Blackpine Incident Response & Triage, where evidence preservation and analysis are connected to containment, recovery, and the questions an incident owner needs answered.',
  'security-monitoring': 'Monitoring work connects directly to Blackpine Security Operations Center functions, including SOC operations, threat analysis, tiered triage, and threat-intelligence work.',
  'compliance-readiness': 'Readiness work is supported by Blackpine GRC roles spanning compliance architecture, framework audit, GRC analysis, policy documentation, and technical evidence mapping.'
};

function relatedResearch(service) {
  const topics = relatedTopicsByService[service.slug] || [];
  return research.filter(item => topics.includes(item.topic)).slice(0, 3);
}

export function servicesIndexPage() {
  const body = pageHero({
    eyebrow: 'Capabilities',
    title: 'Security work around the control points that matter.',
    lead: 'Blackpine combines assessment, identity, cloud, application security, penetration testing, forensics, monitoring, readiness, compliance preparation, and advisory work inside one practice. Engagements are scoped around the decision or incident rather than around a fixed package.'
  }) + `<section class="section"><div class="shell">${serviceRows(services)}</div></section>
  <section class="section compact"><div class="shell callout"><div><h2>Choose the shape of the work after the problem is clear.</h2><p>Focused reviews, broader assessments, active testing, incident work, and ongoing advisory support use different scopes because they answer different questions.</p></div><div class="actions"><a class="button secondary" href="/engagements/">Engagement models</a><a class="button secondary" href="/methodology/">Methodology</a></div></div></section>`;

  return {
    title: 'Cybersecurity Capabilities in Canada | Blackpine Cybersecurity',
    description: 'Blackpine capabilities across assessment, identity, cloud, application security, penetration testing, forensics, monitoring, incident response, readiness, compliance preparation, and advisory work.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Capabilities', href: '/services/' }],
    body,
    searchTerms: 'penetration testing appsec digital forensics DFIR SOC compliance monitoring cloud identity incident response'
  };
}

export function servicePage(service) {
  const navLinks = ['Use cases', 'Review surface', 'Method', 'Deliverables', 'Practice context', 'Example finding', 'Scope'];
  const related = relatedResearch(service);
  const practiceContext = practiceContextByService[service.slug] || 'The capability is delivered through the Blackpine practice responsible for the systems and evidence in the agreed scope.';
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
    <h2 id="${sectionId(navLinks[4])}">${navLinks[4]}</h2><p>${esc(practiceContext)}</p>
    <div class="sample-finding" id="${sectionId(navLinks[5])}"><span class="sample-label">Illustrative finding — not client data</span><div class="sample-grid"><div><small>Area</small><p>${esc(service.sample.area)}</p></div><div><small>Observation</small><p>${esc(service.sample.finding)}</p></div><div><small>Consequence</small><p>${esc(service.sample.consequence)}</p></div><div><small>Example action</small><p>${esc(service.sample.action)}</p></div></div></div>
    <h2 id="${sectionId(navLinks[6])}">${navLinks[6]}</h2><div class="notice"><strong>Engagement boundary</strong><p>${esc(service.boundary)}</p></div>
    ${related.length ? `<h2>Related research</h2>${researchRows(related)}` : ''}
  </article></div></section>
  <section class="section compact"><div class="shell callout"><div><h2>Bring the system, concern, and desired outcome.</h2><p>Scope and authorization are confirmed before review, active testing, or response work begins.</p></div><a class="button" href="/contact/?service=${encodeURIComponent(service.slug)}">Discuss this capability</a></div></section>`;

  return {
    title: `${service.title} | Blackpine Cybersecurity Canada`,
    description: service.short,
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Capabilities', href: '/services/' }, { label: service.title, href: `/services/${service.slug}/` }],
    body,
    searchTerms: `${service.title} ${service.short} ${practiceContext}`
  };
}

export function engagementsPage() {
  const models = [
    ['Focused Review', 'A narrow review of a defined system, control family, or security question.'],
    ['Security Assessment', 'A broader evidence-led review across agreed systems, controls, and operating processes.'],
    ['Active Testing', 'Authorized penetration or application testing with explicit targets, exclusions, timing, evidence handling, and stop conditions.'],
    ['Incident Engagement', 'Time-sensitive work covering triage, containment, evidence, recovery, and post-incident priorities within the agreed scope.'],
    ['Advisory Engagement', 'Decision support for roadmaps, vendors, policy, remediation sequencing, compliance preparation, and security priorities.'],
    ['Ongoing Review', 'Periodic review tied to defined systems, monitoring outcomes, owners, or milestones when recurring assurance is useful.']
  ];
  const body = pageHero({
    eyebrow: 'Engagements',
    title: 'The problem determines the engagement.',
    lead: 'Scope, access, timing, deliverables, responsibilities, and fees are defined in writing around the decision or incident at hand. Blackpine does not force active testing, advisory work, and incident response into the same commercial package.'
  }) + `<section class="section"><div class="shell"><div class="service-rows">${models.map((model, index) => `<div class="service-row"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(model[0])}</strong><small>${esc(model[1])}</small></span><span></span></div>`).join('')}</div><div class="notice"><strong>The written scope is the control point.</strong><p>Environment, authorization, data sensitivity, urgency, testing method, and required output determine how the work is structured.</p></div></div></section>`;

  return {
    title: 'Cybersecurity Engagement Models | Blackpine Cybersecurity',
    description: 'How Blackpine scopes focused reviews, assessments, active testing, incident engagements, advisory work, and recurring review.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Engagements', href: '/engagements/' }],
    body
  };
}
