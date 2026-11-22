import { services, research, capabilityFamilies, engagementModels } from '../data.mjs';
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
  'security-assessments': 'We choose the assessment team based on the systems and questions being reviewed. Identity, cloud, incident, or compliance specialists contribute where needed.',
  'identity-email-security': 'The review can involve identity, email, cloud, and incident-response specialists, depending on the access paths being examined.',
  'cloud-saas-security': 'We involve identity, monitoring, incident-response, or governance specialists when the cloud review requires their expertise.',
  'website-administrative-security': 'We review the accounts and providers that control your website, alongside the website itself.',
  'incident-response': 'The incident team coordinates investigation, evidence handling, containment, and recovery with the relevant specialists.',
  'incident-readiness-recovery': 'We review both technical recovery and the people, approvals, and communication paths needed during an incident.',
  'security-advisory': 'When a decision needs technical evidence, we involve the appropriate engineering, response, or risk specialists.',
  'penetration-testing': 'We agree on what can be tested, when testing may happen, and how findings will be documented before any active testing begins.',
  'application-security': 'A review can focus on the specific application, API, accounts, and deployment processes in the agreed scope.',
  'digital-forensics': 'Forensic findings help the incident team understand what happened, which systems were affected, and what should happen next.',
  'security-monitoring': 'The team reviews relevant alerts, detection coverage, and escalation procedures agreed with the customer.',
  'compliance-readiness': 'Governance and technical specialists help prepare the records and control reviews required by the agreed framework.'
}

const familyById = new Map(capabilityFamilies.map(family => [family.id, family]));

function relatedResearch(service) {
  const topics = relatedTopicsByService[service.slug] || [];
  return research.filter(item => topics.includes(item.topic)).slice(0, 3);
}

function familyRows() {
  return `<div class="service-rows family-rows">${capabilityFamilies.map((family, index) => `<a class="service-row" href="${esc(family.path)}"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(family.name)}</strong><small>${esc(family.intent)} ${esc(family.summary)}</small></span><span class="row-arrow">→</span></a>`).join('')}</div>`;
}

export function servicesIndexPage() {
  const body = pageHero({
    eyebrow: 'Capabilities',
    title: 'Start with what is happening.',
    lead: 'Tell us what you need help with. We can work out whether that calls for incident response, investigation, protection, monitoring, engineering, or advice.'
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Start here</div><div><h2>Choose the situation that fits best.</h2><p>Start with the closest match. We can narrow the technical scope once we understand the facts and the outcome you need.</p></div></div>${familyRows()}</div></section>
  <section class="media-section services-editorial-break" aria-hidden="true"><div class="shell"><div class="editorial-wide editorial-wide-shallow editorial-wide-services"><img src="/assets/editorial/services-infrastructure-landscape.jpg" srcset="/assets/editorial/services-infrastructure-landscape-640.jpg 640w, /assets/editorial/services-infrastructure-landscape-960.jpg 960w, /assets/editorial/services-infrastructure-landscape-1280.jpg 1280w, /assets/editorial/services-infrastructure-landscape.jpg 1600w" sizes="(max-width: 820px) 100vw, min(1180px, 92vw)" alt="" width="1600" height="900" loading="lazy" decoding="async" fetchpriority="low"></div></div></section>
  <section class="section"><div class="shell"><div class="section-head"><div class="section-label">Specialist services</div><div><h2>Already know what you need?</h2><p>Explore specialist services for assessments, testing, forensics, monitoring, identity, cloud, application security, readiness, compliance, and advisory work.</p></div></div>${serviceRows(services)}</div></section>
  <section class="section compact"><div class="shell callout"><div><h2>Choose the commercial model after the problem is clear.</h2><p>Blackpine On-Demand, Response Retainer, and Managed Security cover different relationships. Scope, authority, service levels, and recurring responsibilities are defined in writing.</p></div><div class="actions"><a class="button secondary" href="/engagements/">Engagement models</a><a class="button secondary" href="/methodology/">Methodology</a></div></div></section>`;

  return {
    title: 'Cybersecurity Services in Canada | Blackpine',
    description: 'Blackpine cybersecurity services in Canada: incident response, digital forensics, security assessments, identity, cloud and readiness. Explore the options.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Capabilities', href: '/services/' }],
    body,
    searchTerms: 'hacked suspicious activity recover better security managed security security desk incident response penetration testing appsec digital forensics DFIR SOC compliance monitoring cloud identity'
  };
}

export function servicePage(service) {
  const navLinks = ['Use cases', 'Review surface', 'Method', 'Deliverables', 'Practice context', 'Example finding', 'Scope'];
  const related = relatedResearch(service);
  const practiceContext = practiceContextByService[service.slug] || 'The team responsible for this service is confirmed when we agree which systems and questions the engagement will cover.';
  const families = (service.capabilityFamilies || []).map(id => familyById.get(id)).filter(Boolean);
  const familyLinks = families.length ? `<br><br><strong>Problem routes</strong>${families.map(family => `<a href="${esc(family.path)}">${esc(family.name.replace('Blackpine ', ''))} →</a>`).join('<br>')}` : '';
  const contactHref = `/contact/?service=${encodeURIComponent(service.slug)}#inquiry`;
  const body = pageHero({
    eyebrow: 'Specialist capability',
    title: service.title,
    lead: service.intro,
    meta: `<strong>Capability</strong>${esc(service.short)}<br><br><a href="${contactHref}">Ask about this service →</a>${familyLinks}`
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>On this page</span>${navLinks.map(title => `<a href="#${sectionId(title)}">${esc(title)}</a>`).join('')}</aside><article class="prose">
    <h2 id="${sectionId(navLinks[0])}">${navLinks[0]}</h2><ul>${service.when.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
    <h2 id="${sectionId(navLinks[1])}">${navLinks[1]}</h2><ul>${service.review.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
    <h2 id="${sectionId(navLinks[2])}">${navLinks[2]}</h2><div class="spec-list">${service.method.map((item, index) => `<div class="spec-item"><strong>${String(index + 1).padStart(2, '0')}</strong><span>${esc(item)}</span></div>`).join('')}</div>
    <h2 id="${sectionId(navLinks[3])}">${navLinks[3]}</h2><ul>${service.deliverables.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
    <h2 id="${sectionId(navLinks[4])}">${navLinks[4]}</h2><p>${esc(practiceContext)}</p>
    <div class="sample-finding" id="${sectionId(navLinks[5])}"><span class="sample-label">Example finding</span><div class="sample-grid"><div><small>Area</small><p>${esc(service.sample.area)}</p></div><div><small>Observation</small><p>${esc(service.sample.finding)}</p></div><div><small>Consequence</small><p>${esc(service.sample.consequence)}</p></div><div><small>Example action</small><p>${esc(service.sample.action)}</p></div></div></div>
    <h2 id="${sectionId(navLinks[6])}">${navLinks[6]}</h2><div class="notice"><strong>Engagement boundary</strong><p>${esc(service.boundary)}</p></div>
    ${related.length ? `<h2>Related research</h2>${researchRows(related)}` : ''}
  </article></div></section>
  <section class="section compact"><div class="shell callout"><div><h2>Tell us what you need help with.</h2><p>Scope and authorization are confirmed before review, active testing, or response work begins.</p></div><a class="button" href="${contactHref}">Discuss this capability</a></div></section>`;

  return {
    title: `${service.title} | Blackpine Cybersecurity Canada`,
    description: service.short,
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Capabilities', href: '/services/' }, { label: service.title, href: `/services/${service.slug}/` }],
    body,
    searchTerms: `${service.title} ${service.short} ${practiceContext} ${families.map(family => `${family.name} ${family.intent}`).join(' ')}`
  };
}

export function engagementsPage() {
  const body = pageHero({
    eyebrow: 'Engagements',
    title: 'Three ways to work with Blackpine.',
    lead: 'Tell us what needs attention. Before any work begins, we agree on what is included, who can authorize it, the timing, what you will receive, and the terms.'
  }) + `<section class="section"><div class="shell"><div class="service-rows">${engagementModels.map((model, index) => `<div class="service-row"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(model.name)}</strong><small>${esc(model.summary)}</small></span><span></span></div>`).join('')}</div><div class="notice"><strong>Service commitments are agreed in writing.</strong><p>Each engagement defines response windows, coverage hours, supported products, monitoring responsibilities, escalation, access, data handling, and retainer terms where applicable.</p></div></div></section>
  <section class="section compact"><div class="shell callout"><div><h2>Not sure which model fits?</h2><p>Describe the problem first. Blackpine can determine whether the work is best handled on demand, through a response retainer, or as a recurring managed-security relationship.</p></div><a class="button" href="/contact/#inquiry">Discuss the requirement</a></div></section>`;

  return {
    title: 'Blackpine On-Demand, Response Retainer & Managed Security',
    description: 'Blackpine engagement models for pay-as-needed cybersecurity work, pre-established incident-response relationships, and recurring managed security.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Engagements', href: '/engagements/' }],
    body,
    searchTerms: 'Blackpine On-Demand Response Retainer Managed Security pay as needed recurring security incident retainer'
  };
}
