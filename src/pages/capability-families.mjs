import { capabilityFamilies, capabilityRegistry, engagementModels, services } from '../data.mjs';
import { pageHero } from '../components.mjs';
import { esc } from '../lib/html.mjs';

const familyProfiles = {
  'emergency-response': {
    title: 'Blackpine Emergency Response',
    lead: 'Use this route when you believe an attack, compromise, ransomware event, malicious access, or other security incident may be active. You do not need to identify the technical service before contacting Blackpine.',
    eyebrow: 'We think we have been hacked',
    examples: ['A CEO or administrator account shows an unfamiliar login.', 'A ransom note appears or files begin changing unexpectedly.', 'A mailbox is sending or forwarding messages without authorization.', 'A device or server appears infected or under active control.', 'A website, cloud service, or business-critical account has been changed unexpectedly.'],
    sectionTitle: 'Start with the event, not the terminology.',
    sectionCopy: 'Tell Blackpine what changed, what appears affected, whether activity is still happening, and which communication channel is safe to use. Blackpine can triage the situation internally and determine whether response, forensics, recovery, identity, email, malware, or another specialist path is appropriate.',
    boundary: 'Public website intake is for initial triage only. Do not upload passwords, private keys, regulated records, full log exports, confidential client files, or sensitive incident evidence through the public form. Availability and any response commitment are confirmed separately.',
    cta: 'Start an emergency-response inquiry'
  },
  investigate: {
    title: 'Blackpine Investigate',
    lead: 'Use this route when something looks wrong but you do not yet know whether it is an incident, false alarm, configuration issue, phishing attempt, account problem, or ordinary activity.',
    eyebrow: 'Something suspicious is happening',
    examples: ['An employee sees an unexpected MFA prompt.', 'A login appears from an unfamiliar location or device.', 'A security alert does not have a clear owner or explanation.', 'An employee forwards a suspicious email for review.', 'A device, cloud account, or network event behaves differently from normal.'],
    sectionTitle: 'Narrow uncertainty before making disruptive changes.',
    sectionCopy: 'Blackpine starts with the observable facts, available evidence, affected systems, and business context. The investigation can remain focused when the issue is benign or escalate into incident response, digital forensics, recovery, or other specialist work when the evidence supports it.',
    boundary: 'Investigation scope depends on the evidence Blackpine is authorized to review. A suspicious signal is not automatically treated as proof of compromise.',
    cta: 'Ask Blackpine to investigate'
  },
  recover: {
    title: 'Blackpine Recover',
    lead: 'Use this route after control has been lost, access has been disrupted, an account has been compromised, or an incident has left systems that need to be restored and hardened.',
    eyebrow: 'Help us regain control',
    examples: ['A Microsoft 365 or Google Workspace account was taken over.', 'An administrator is locked out or recovery details were changed.', 'Sessions, tokens, forwarding rules, delegates, or other persistence need review.', 'Systems need to be restored after an incident.', 'Credentials and access paths need to be rotated and validated.'],
    sectionTitle: 'Recovery is more than changing a password.',
    sectionCopy: 'The recovery path should establish who controls the affected system now, which sessions or persistence mechanisms remain, what needs to be restored, and which security controls should change before normal operation resumes. Blackpine can connect that work to the incident findings rather than treating recovery as an isolated reset.',
    boundary: 'Recovery outcomes depend on the affected technology, available evidence, access authority, third-party dependencies, and the condition of backups or recovery paths. Blackpine does not represent recovery as guaranteed.',
    cta: 'Discuss recovery'
  },
  protect: {
    title: 'Blackpine Protect',
    lead: 'Use this route when the objective is to reduce risk before the next incident: assess the environment, harden important systems, test attack paths, improve identity and email controls, strengthen recovery, or prepare for a framework review.',
    eyebrow: 'We need better security',
    examples: ['Review our overall security posture and prioritize weaknesses.', 'Harden Microsoft 365, Google Workspace, cloud, websites, endpoints, or email.', 'Test a website, API, network, application, or cloud attack path with written authorization.', 'Review backups and ransomware readiness.', 'Improve policies, vendor risk, awareness, tabletop readiness, or security leadership.'],
    sectionTitle: 'Use the specialist service only after the objective is clear.',
    sectionCopy: 'Blackpine can start from the decision the organization needs to make and then choose the correct mix of assessment, hardening, penetration testing, application security, cloud security, identity, email, advisory, compliance readiness, or recovery work.',
    boundary: 'Active testing requires explicit written authorization. Compliance-readiness work is not a certification, legal opinion, regulatory determination, or attestation unless a separately qualified service provides that outcome.',
    cta: 'Discuss security improvements'
  },
  monitor: {
    title: 'Blackpine Monitor',
    lead: 'Use this route when the organization needs recurring visibility across endpoint, account, vulnerability, external exposure, and security-alert activity rather than a one-time review.',
    eyebrow: 'Watch our environment',
    examples: ['Manage or improve endpoint protection and alert handling.', 'Review recurring vulnerabilities and exposed services.', 'Track external domains, subdomains, certificates, ports, and systems.', 'Review leaked corporate credentials where an agreed monitoring source is available.', 'Provide recurring account-security reviews, Security Desk support, and reporting.'],
    sectionTitle: 'Monitoring needs an owned path from signal to action.',
    sectionCopy: 'Blackpine Managed Security is the recurring commercial model for agreed monitoring and protection services. The specific telemetry, products, coverage, escalation path, response authority, review cadence, and reporting expectations belong in the written service scope rather than being implied by a marketing page.',
    boundary: 'This page does not promise around-the-clock coverage, a particular response time, or guaranteed containment. Those claims require an approved operating model and contract.',
    cta: 'Discuss managed security'
  },
  'security-desk': {
    title: 'Blackpine Security Desk',
    lead: 'Use this route for the everyday security questions that should not require an employee to know whether the issue belongs to identity, email, phishing, endpoint, incident response, or another specialist function.',
    eyebrow: 'We do not know if this is dangerous',
    examples: ['“Is this email real?”', '“Why did I get this MFA prompt?”', '“Is this security alert dangerous?”', '“Can somebody check this suspicious link or message?”', '“Something looks wrong, but we do not know what service to ask for.”'],
    sectionTitle: 'Ask the question in plain language.',
    sectionCopy: 'The Security Desk is the front door for low-friction security questions and suspicious-email checks. If the issue needs deeper investigation or response, Blackpine can route it internally rather than asking the customer to diagnose the problem first.',
    boundary: 'The public website is not intended for malware samples, passwords, private keys, confidential files, or sensitive evidence. File-handling and escalation procedures must follow the agreed customer service process.',
    cta: 'Ask the Security Desk'
  }
};

const engagementById = new Map(engagementModels.map(model => [model.id, model]));
const serviceByRoute = new Map(services.map(service => [`/services/${service.slug}/`, service]));

export const familyPath = family => family.path;

function offeringsForFamily(familyId) {
  return capabilityRegistry.filter(item => item.primaryFamily === familyId && item.operationalStatus === 'LIVE');
}

function engagementNames(offerings) {
  const ids = [...new Set(offerings.flatMap(item => item.engagements || []))];
  return ids.map(id => engagementById.get(id)).filter(Boolean);
}

function offeringRows(family, offerings) {
  return `<div class="service-rows family-offerings">${offerings.map((item, index) => {
    const existing = item.currentRoute ? serviceByRoute.get(item.currentRoute) : null;
    const href = existing ? item.currentRoute : `/contact/?intent=${encodeURIComponent(family.id)}&capability=${encodeURIComponent(item.id)}#inquiry`;
    const detail = existing ? existing.short : `Available through ${item.engagements.map(id => engagementById.get(id)?.name).filter(Boolean).join(', ')}.`;
    return `<a class="service-row" href="${esc(href)}"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(item.name)}</strong><small>${esc(detail)}</small></span><span class="row-arrow">→</span></a>`;
  }).join('')}</div>`;
}

function engagementStrip(offerings) {
  const models = engagementNames(offerings);
  return `<div class="family-models">${models.map(model => `<div><strong>${esc(model.name)}</strong><p>${esc(model.summary)}</p></div>`).join('')}</div>`;
}

export function capabilityFamilyPage(family) {
  const profile = familyProfiles[family.id];
  const offerings = offeringsForFamily(family.id);
  if (!profile) throw new Error(`Missing Phase 2 family profile for ${family.id}`);

  const examples = `<ul class="family-examples">${profile.examples.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
  const contactHref = `/contact/?intent=${encodeURIComponent(family.id)}#inquiry`;

  let middle;
  if (family.id === 'emergency-response') {
    middle = `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Emergency response</span><a href="#recognize">When to use this</a><a href="#start">What to tell us</a><a href="#services">Response services</a><a href="#boundary">Boundary</a></aside><article class="prose"><h2 id="recognize">When to use this</h2>${examples}<h2 id="start">${esc(profile.sectionTitle)}</h2><p>${esc(profile.sectionCopy)}</p><div class="notice"><strong>Before sending incident details</strong><p>Use a safe email address or callback number if the normal account may be compromised. Preserve relevant evidence where safe and avoid unnecessary destructive changes.</p></div><h2 id="services">Specialist response services</h2>${offeringRows(family, offerings)}<h2>How Blackpine can be engaged</h2>${engagementStrip(offerings)}<h2 id="boundary">Response boundary</h2><p>${esc(profile.boundary)}</p></article></div></section>`;
  } else if (family.id === 'security-desk') {
    middle = `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Everyday security</div><div><h2>${esc(profile.sectionTitle)}</h2><p>${esc(profile.sectionCopy)}</p></div></div><div class="family-question-grid">${profile.examples.map(item => `<blockquote>${esc(item)}</blockquote>`).join('')}</div><div class="notice"><strong>Escalation is internal.</strong><p>If the question indicates a genuine compromise, Blackpine can route the issue into Investigate, Emergency Response, or Recover instead of making the customer choose another technical menu.</p></div><h2 class="minor-heading">Security Desk services</h2>${offeringRows(family, offerings)}<div class="notice"><strong>Public intake boundary</strong><p>${esc(profile.boundary)}</p></div></div></section>`;
  } else if (family.id === 'protect') {
    middle = `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Protect</div><div><h2>${esc(profile.sectionTitle)}</h2><p>${esc(profile.sectionCopy)}</p></div></div>${examples}<h2 class="minor-heading">Specialist services</h2>${offeringRows(family, offerings)}<div class="notice"><strong>Scope before tools.</strong><p>${esc(profile.boundary)}</p></div><h2 class="minor-heading">Engagement models</h2>${engagementStrip(offerings)}</div></section>`;
  } else {
    middle = `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>${esc(family.name.replace('Blackpine ', ''))}</span><a href="#signals">When this fits</a><a href="#approach">How it works</a><a href="#services">Services</a><a href="#boundary">Boundary</a></aside><article class="prose"><h2 id="signals">When this fits</h2>${examples}<h2 id="approach">${esc(profile.sectionTitle)}</h2><p>${esc(profile.sectionCopy)}</p><h2 id="services">What Blackpine can provide</h2>${offeringRows(family, offerings)}<h2>Engagement models</h2>${engagementStrip(offerings)}<h2 id="boundary">Boundary</h2><p>${esc(profile.boundary)}</p></article></div></section>`;
  }

  const body = pageHero({
    eyebrow: profile.eyebrow,
    title: profile.title,
    lead: profile.lead,
    meta: `<strong>Start here</strong>${esc(family.intent)}<br><br><a href="${esc(contactHref)}">${esc(profile.cta)} →</a>`
  }) + middle + `<section class="section compact"><div class="shell callout"><div><h2>You do not need to diagnose the problem first.</h2><p>Describe what happened or what you need. Blackpine can assign the appropriate specialist path internally.</p></div><a class="button" href="${esc(contactHref)}">${esc(profile.cta)}</a></div></section>`;

  const searchTerms = [family.intent, family.summary, ...offerings.flatMap(item => [item.name, ...(item.searchAliases || [])])].join(' ');
  return {
    title: `${profile.title} | Blackpine Cybersecurity Canada`,
    description: family.summary,
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Capabilities', href: '/services/' }, { label: profile.title, href: family.path }],
    body,
    searchTerms
  };
}

export { familyProfiles };
