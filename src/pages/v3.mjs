import { research } from '../data.mjs';
import { companyFacts, team, plannedRoles } from '../v3-data.mjs';
import { pageHero, researchRows } from '../components.mjs';
import { esc, sectionId } from '../lib/html.mjs';

const rowList = items => `<div class="service-rows">${items.map((item, index) => `<div class="service-row"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(item[0])}</strong><small>${esc(item[1])}</small></span><span></span></div>`).join('')}</div>`;

const prosePage = ({ eyebrow, title, lead, sections, meta = '', description, breadcrumbItems }) => {
  const nav = sections.map(section => section[0]);
  const body = pageHero({ eyebrow, title, lead, meta }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>On this page</span>${nav.map(label => `<a href="#${sectionId(label)}">${esc(label)}</a>`).join('')}</aside><article class="prose">${sections.map(([heading, paragraphs = [], bullets = []]) => `<h2 id="${sectionId(heading)}">${esc(heading)}</h2>${paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}${bullets.length ? `<ul>${bullets.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}`).join('')}</article></div></section>`;
  return { title, description, breadcrumbItems, body };
};

export function methodologyPage() {
  const steps = [
    ['01 / Authority', 'Confirm who can authorize the work, which systems are in scope, and what Blackpine is permitted to do.'],
    ['02 / Objective', 'Define the decision, incident question, or assurance need the engagement must support.'],
    ['03 / Evidence', 'Identify the minimum configuration, logs, interviews, artefacts, and access needed to answer that question.'],
    ['04 / Analysis', 'Trace control paths, test agreed assumptions, and separate observed evidence from interpretation.'],
    ['05 / Findings', 'Write findings around consequence, affected systems, supporting evidence, and limitations.'],
    ['06 / Remediation', 'Put changes in an order that reflects exposure, dependency, ownership, and practical effort.'],
    ['07 / Verification', 'Where included, verify that the material change has actually altered the condition that created the finding.']
  ];
  const body = pageHero({
    eyebrow: 'Methodology',
    title: 'Security work with a visible chain of reasoning.',
    lead: 'Blackpine uses a consistent engagement sequence so scope, evidence, technical conclusions, and remediation decisions can be inspected by the people responsible for acting on them.',
    meta: '<strong>Blackpine V3</strong>Used across assessments, specialist testing, readiness work, and technical advisory engagements.'
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Sequence</div><div><h2>Seven control points.</h2><p>The sequence is deliberately simple. The depth changes with the engagement; the need for authority, evidence, limitations, and ownership does not.</p></div></div>${rowList(steps)}<div class="notice"><strong>Scope is part of the method.</strong><p>Blackpine does not treat a broad security question as permission for unrestricted testing. Active techniques, production access, sensitive evidence, and third-party systems are agreed explicitly.</p></div></div></section>`;
  return {
    title: 'Security Methodology | Blackpine Cybersecurity',
    description: 'How Blackpine structures authority, evidence, analysis, findings, remediation, and verification across cybersecurity engagements.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Methodology', href: '/methodology/' }],
    body
  };
}

export function workPage() {
  const patterns = [
    ['Identity compromise response', 'A time-sensitive engagement can combine account containment, session and recovery review, mail-flow investigation, evidence preservation, and downstream business verification.'],
    ['Cloud administrative review', 'A focused review can map privileged roles, guest access, connected applications, recovery ownership, and the administrative paths that matter most to a cloud environment.'],
    ['Incident readiness exercise', 'A readiness engagement can expose unclear decision authority, evidence gaps, backup assumptions, vendor dependencies, and communication paths before an actual incident tests them.']
  ];
  const body = pageHero({
    eyebrow: 'Work',
    title: 'Client work should show what changed.',
    lead: 'Blackpine publishes client work only when the organization has approved the attribution and the engagement can be described without exposing sensitive systems, evidence, or response details.',
    meta: '<strong>Publication rule</strong>No client quote, logo, outcome, or case-study claim is published simply to make the site look established.'
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Engagement patterns</div><div><h2>What the work can look like.</h2><p>These are illustrative engagement patterns, not claims about named clients. Approved client experiences can be added here later with their real scope and wording.</p></div></div>${rowList(patterns)}<div class="notice"><strong>Testimonials remain gated.</strong><p>Draft testimonial identities that conflict with Blackpine employee names are not being presented as customers. Public client material will require approved attribution or an explicitly approved anonymous description.</p></div><div class="actions"><a class="button" href="/contact/">Discuss an engagement</a><a class="button secondary" href="/methodology/">Review the methodology</a></div></div></section>`;
  return {
    title: 'Client Work & Engagement Outcomes | Blackpine Cybersecurity',
    description: 'How Blackpine describes client work, engagement patterns, outcomes, and publication boundaries without exposing sensitive client information.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Work', href: '/work/' }],
    body
  };
}

export function teamPage() {
  const groups = new Map();
  for (const person of team) {
    if (!groups.has(person.department)) groups.set(person.department, []);
    groups.get(person.department).push(person);
  }
  const body = pageHero({
    eyebrow: 'Company / Team',
    title: 'A 26-person security practice across five technical disciplines.',
    lead: 'Blackpine brings advisory, defensive engineering, incident response, security operations, and governance work into one practice so findings do not have to be translated between disconnected teams.',
    meta: `<strong>Leadership</strong>${esc(companyFacts.owner)}<br>${esc(companyFacts.ownerTitle)}<br><br>Canada`
  }) + `<section class="section"><div class="shell"><div class="team-lead"><span class="eyebrow">CEO & Owner</span><h2>${esc(companyFacts.owner)}</h2><p>Blackpine is organized around technical work that can be scoped, explained, and handed back to accountable owners. Leadership information is limited to facts confirmed for public use.</p></div>${[...groups.entries()].map(([department, people]) => `<section class="team-group"><div class="section-head"><div class="section-label">${esc(department)}</div><div><h2>${esc(department === 'Executive Leadership' ? 'Leadership' : department)}</h2><p>${people.length} ${people.length === 1 ? 'person' : 'people'} in this group.</p></div></div><div class="team-directory">${people.map(person => `<div class="team-person"><strong>${esc(person.name)}</strong><span>${esc(person.title)}</span></div>`).join('')}</div></section>`).join('')}<div class="notice"><strong>Personal contact details are not published here.</strong><p>Client, security, and careers enquiries use the centralized Blackpine contact routes rather than exposing individual employee email addresses.</p></div></div></section>`;
  return {
    title: 'Blackpine Cybersecurity Team | Canada',
    description: 'Meet the 26-person Blackpine Cybersecurity team across leadership, advisory, defensive engineering, incident response, SOC, and GRC functions.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Company', href: '/company/about/' }, { label: 'Team', href: '/company/team/' }],
    body,
    searchTerms: ['employees staff people leadership CEO Michael Calloway SOC GRC engineering incident response']
  };
}

export function advisoriesPage() {
  const related = research.filter(item => ['Incident Response', 'Identity & Email', 'Cloud Security'].includes(item.topic)).slice(0, 4);
  const body = pageHero({
    eyebrow: 'Advisories',
    title: 'Short technical notices when timing matters.',
    lead: 'Blackpine Advisories are reserved for concise, time-sensitive guidance about a security condition that warrants action. Research remains the place for longer analysis and reference material.',
    meta: '<strong>Current status</strong>No standalone Blackpine advisory is published at this time.'
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Publication standard</div><div><h2>Useful before frequent.</h2><p>An advisory should identify the affected condition, what Blackpine can substantiate, who needs to care, and what can be checked safely. The section will not be filled with recycled vulnerability headlines.</p></div></div>${related.length ? `<h3 class="minor-heading">Related current research</h3>${researchRows(related)}` : ''}</div></section>`;
  return { title: 'Security Advisories | Blackpine Cybersecurity', description: 'Time-sensitive Blackpine technical advisories and related security research.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Advisories', href: '/advisories/' }], body };
}

export function reportsPage() {
  return prosePage({
    eyebrow: 'Reports',
    title: 'Formal publications need real evidence behind them.',
    lead: 'Blackpine Reports is the home for future original datasets, benchmarks, and longer technical publications. A report will not be published simply to create a download asset.',
    description: 'Blackpine Reports publication standard for future original cybersecurity benchmarks, datasets, and technical reports.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Reports', href: '/reports/' }],
    sections: [
      ['Current status', ['No formal Blackpine benchmark report is public yet. Research articles remain available while longer report work is developed and reviewed.']],
      ['What qualifies as a report', ['A report needs a defined question, a documented method, enough evidence to support its conclusions, explicit limitations, and a review process that can challenge the result.'], ['Original or clearly licensed data', 'Documented methodology', 'Named scope and assumptions', 'Review before publication', 'Version and correction history where appropriate']],
      ['What will not appear here', ['Invented survey statistics, untraceable industry numbers, and dressed-up marketing PDFs do not meet the publication standard.']]
    ]
  });
}

export function resourcesPage() {
  const guides = research.filter(item => item.type === 'Technical Guide');
  const body = pageHero({ eyebrow: 'Resources', title: 'Practical material for decisions that cannot wait for a full engagement.', lead: 'Resources collect checklists, guides, baseline controls, and reference material that can be used internally without turning every security question into a sales conversation.' }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Start here</div><div><h2>Use the format that fits the question.</h2><p>Guides explain a task in more depth. The Security Baseline defines minimum expectations. Research examines a narrower technical question and links its sources.</p></div></div>${rowList([['Guides', 'Step-by-step operational material drawn from the published research library.'], ['Security Baseline', 'Minimum expectations for identity, email, cloud, endpoints, recovery, logging, vendors, and incident readiness.'], ['Glossary', 'Plain-language definitions that link security terminology back to the systems and decisions it affects.']])}<div class="actions"><a class="button" href="/resources/guides/">Open guides</a><a class="button secondary" href="/security-baseline/">Security baseline</a></div>${guides.length ? `<div class="resource-research"><h2>Published technical guides</h2>${researchRows(guides.slice(0, 4))}</div>` : ''}</div></section>`;
  return { title: 'Cybersecurity Resources | Blackpine Cybersecurity', description: 'Blackpine practical security guides, baseline controls, glossary, and research resources.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources/' }], body };
}

export function guidesPage() {
  const guides = research.filter(item => item.type === 'Technical Guide');
  const body = pageHero({ eyebrow: 'Resources / Guides', title: 'Operational guides written to be used, not collected.', lead: 'Blackpine guides focus on a concrete security task or decision. Source links remain attached to the underlying research so teams can check where the recommendation came from.' }) + `<section class="section"><div class="shell">${guides.length ? researchRows(guides) : '<div class="notice"><strong>No guides are published yet.</strong><p>Only reviewed material will appear here.</p></div>'}</div></section>`;
  return { title: 'Security Guides | Blackpine Cybersecurity', description: 'Practical Blackpine guides for incident response, identity, assessment preparation, recovery, and security administration.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources/' }, { label: 'Guides', href: '/resources/guides/' }], body };
}

const baselineControls = [
  ['Identity', 'Every business-critical identity has a named owner and a controlled recovery path.', 'Account ownership and recovery determine who can regain control when ordinary authentication fails.', 'Sample privileged, shared, and recovery accounts and verify owner, MFA, recovery method, and last review.'],
  ['MFA', 'Privileged and remote access uses strong MFA, with exceptions documented and reviewed.', 'A password alone should not be enough to exercise broad administrative control.', 'Export authentication policy and compare privileged accounts against enforced methods and exceptions.'],
  ['Privileged access', 'Administrative roles are limited, attributable, and reviewed.', 'Broad or stale privilege increases the consequence of one compromised identity.', 'Enumerate privileged roles, permanent assignments, shared accounts, and recent role changes.'],
  ['Email', 'External forwarding, delegation, mail authentication, and recovery settings are controlled.', 'Email is often both a communication channel and a recovery path for other systems.', 'Review forwarding, inbox rules, delegates, SPF, DKIM, DMARC, and privileged mail administration.'],
  ['Domains & DNS', 'Registrar and DNS control is owned, strongly authenticated, and recoverable.', 'Domain control can redirect websites, mail, and trust relationships at once.', 'Verify registrar ownership, MFA, recovery contacts, DNS administration, and change notification.'],
  ['Endpoints', 'Supported devices receive security updates and administrative rights are constrained.', 'Endpoint compromise can become an identity or lateral-movement problem when local control is broad.', 'Sample patch state, local administrators, endpoint protection, encryption, and device ownership.'],
  ['Cloud & SaaS', 'Administrative roles, guest access, integrations, and recovery ownership are reviewed.', 'Persistent access accumulates as teams, vendors, and connected applications change.', 'Enumerate administrators, guests, high-risk integrations, sharing settings, and stale access.'],
  ['Backups', 'Critical systems have owned backups and a documented restoration test.', 'Backup existence does not prove that recovery will work under incident conditions.', 'Confirm coverage, administrative separation, restoration ownership, and the latest representative restore test.'],
  ['Logging', 'Security-relevant events are retained long enough to support detection and investigation.', 'An incident cannot be reconstructed from telemetry that was never collected or has already expired.', 'Map high-value systems to log sources, retention, alert ownership, and evidence export procedures.'],
  ['Incident readiness', 'Decision authority, communications, evidence, containment, and recovery roles are documented.', 'Response slows down when teams discover responsibilities during the incident itself.', 'Walk through a realistic scenario and record unresolved decisions, contacts, evidence gaps, and recovery dependencies.'],
  ['Vendor access', 'Third-party access has an owner, business reason, review date, and offboarding path.', 'Vendor access often persists after the work that justified it has ended.', 'Sample vendor identities and integrations for owner, scope, last use, review date, and removal procedure.']
];

export function securityBaselinePage() {
  const body = pageHero({ eyebrow: 'Security Baseline', title: 'Minimum controls should be clear enough to verify.', lead: 'The Blackpine Security Baseline is a practical starting point for smaller and mid-sized organizations. It is not a certification and it does not replace requirements that apply to a specific industry, contract, or risk profile.' }) + `<section class="section"><div class="shell"><div class="baseline-grid">${baselineControls.map((control, index) => `<article class="baseline-control"><span class="baseline-number">${String(index + 1).padStart(2, '0')}</span><h2>${esc(control[0])}</h2><dl><div><dt>Minimum expectation</dt><dd>${esc(control[1])}</dd></div><div><dt>Why it matters</dt><dd>${esc(control[2])}</dd></div><div><dt>How to verify</dt><dd>${esc(control[3])}</dd></div></dl></article>`).join('')}</div><div class="notice"><strong>Baseline means starting point.</strong><p>Organizations with regulated data, safety-critical systems, contractual obligations, or higher threat exposure may need substantially stronger controls.</p></div></div></section>`;
  return { title: 'Blackpine Security Baseline | Practical Cybersecurity Controls', description: 'A practical Blackpine baseline for identity, MFA, privilege, email, domains, endpoints, cloud, backups, logging, incident readiness, and vendor access.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Security Baseline', href: '/security-baseline/' }], body, searchTerms: ['minimum controls MFA backup logging vendor access cyber hygiene'] };
}

const glossaryTerms = [
  ['Attack surface', 'The systems, identities, interfaces, and trust paths that could provide a way to affect an environment.'],
  ['BEC', 'Business email compromise: misuse of a business identity or mailbox to influence communications, payments, access, or trust.'],
  ['CSP', 'Content Security Policy: a browser policy that restricts which sources a web page may load or execute.'],
  ['DFIR', 'Digital forensics and incident response: preserving and analyzing evidence while containing and recovering from an incident.'],
  ['DKIM', 'A domain-level email signing mechanism that lets receiving systems verify that a message was signed by an authorized domain key.'],
  ['DMARC', 'A policy and reporting layer that builds on SPF and DKIM to help domain owners control and observe email authentication.'],
  ['DNS', 'The naming system that maps domain names to services and records such as websites and mail routing.'],
  ['IAM', 'Identity and access management: the systems and processes used to establish identities and control what they can access.'],
  ['Incident', 'A security event that requires investigation or response because confidentiality, integrity, availability, or control may be affected.'],
  ['Least privilege', 'Giving an identity only the access it needs for its current responsibility rather than broad standing access.'],
  ['MFA', 'Multi-factor authentication: authentication that requires more than one independent factor.'],
  ['Pentest', 'Penetration test: authorized active testing intended to demonstrate whether defined attack paths can be exploited.'],
  ['Privileged account', 'An identity able to make security-relevant or high-impact administrative changes.'],
  ['Recovery path', 'The people, systems, and procedures that can restore access or control when normal authentication or operation fails.'],
  ['Risk acceptance', 'A documented decision to retain a known risk rather than remediate, transfer, or avoid it at that time.'],
  ['SOC', 'Security operations center: a function responsible for monitoring, triage, escalation, and operational security response.'],
  ['SPF', 'A DNS-based mechanism that declares which sending systems are authorized for a domain.'],
  ['Threat model', 'A structured description of assets, trust boundaries, adversary capabilities, attack paths, and assumptions relevant to a system.'],
  ['Vulnerability', 'A weakness that can contribute to an unwanted security outcome when the required conditions are present.'],
  ['Zero trust', 'An architectural approach that avoids granting trust solely because a user or device is inside a traditional network boundary.']
];

export function glossaryPage() {
  const body = pageHero({ eyebrow: 'Glossary', title: 'Security terms without decorative jargon.', lead: 'Definitions are written for the way Blackpine uses these terms in services, research, reports, and incident work. They are short references, not substitutes for the full technical context.' }) + `<section class="section"><div class="shell glossary">${glossaryTerms.map(([term, definition]) => `<article id="${sectionId(term)}"><h2>${esc(term)}</h2><p>${esc(definition)}</p></article>`).join('')}</div></section>`;
  return { title: 'Cybersecurity Glossary | Blackpine Cybersecurity', description: 'Plain-language definitions for cybersecurity, identity, incident response, email security, cloud, and administrative security terms.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Glossary', href: '/glossary/' }], body, searchTerms: glossaryTerms.map(item => item[0]).join(' ') };
}

export function toolsPage() {
  const tools = [
    ['Security Headers', 'Review pasted HTTP response headers locally in your browser. The corporate site does not scan the target for you.', '/tools/security-headers/'],
    ['Email Security', 'Review pasted SPF, DKIM, and DMARC records and get a plain-language checklist of what is present.', '/tools/email-security/'],
    ['Domain & DNS', 'Review pasted DNS records for administrative and email-security signals without sending the domain to Blackpine.', '/tools/domain-dns/'],
    ['Security Self-Assessment', 'Answer a short set of control questions and receive category-level observations in the browser.', '/assessment/']
  ];
  const body = pageHero({ eyebrow: 'Public Tools', title: 'Small tools with a deliberately small trust boundary.', lead: 'V3 public tools process the information you paste into the page. They do not turn the corporate site into an unrestricted scanner, proxy, or background monitoring service.' }) + `<section class="section"><div class="shell"><div class="tool-directory">${tools.map(tool => `<a class="tool-row" href="${tool[2]}"><span><strong>${esc(tool[0])}</strong><small>${esc(tool[1])}</small></span><span aria-hidden="true">→</span></a>`).join('')}</div><div class="notice"><strong>Local by default.</strong><p>The browser-side tools are designed so ordinary use does not require transmitting the entered target or pasted records to Blackpine.</p></div></div></section>`;
  return { title: 'Public Security Tools | Blackpine Labs', description: 'Privacy-conscious Blackpine browser tools for security headers, email security, DNS records, and security self-assessment.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Tools', href: '/tools/' }], body };
}

export function securityHeadersToolPage() {
  const body = pageHero({ eyebrow: 'Tools / Security Headers', title: 'Review HTTP security headers from text you already have.', lead: 'Paste response headers below. Analysis runs in the browser and checks for a small set of controls that are commonly relevant to a public web surface.' }) + `<section class="section"><div class="shell tool-workspace"><div class="tool-input"><label for="headers-input">Response headers</label><textarea id="headers-input" data-headers-input spellcheck="false" placeholder="content-security-policy: default-src 'self'\nstrict-transport-security: max-age=63072000\nx-content-type-options: nosniff"></textarea><button class="button" type="button" data-headers-run>Review headers</button></div><div class="tool-output" data-headers-output role="status" aria-live="polite"><p>Nothing is sent for analysis until you choose to process the text, and processing remains in this browser.</p></div></div></section>`;
  return { title: 'Security Headers Review Tool | Blackpine Labs', description: 'A local browser tool for reviewing pasted HTTP security headers including CSP, HSTS, content type, framing, referrer, and permissions policy.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Tools', href: '/tools/' }, { label: 'Security Headers', href: '/tools/security-headers/' }], body, searchTerms: ['CSP HSTS X-Content-Type-Options frame ancestors referrer permissions policy'] };
}

export function emailSecurityToolPage() {
  const body = pageHero({ eyebrow: 'Tools / Email Security', title: 'Read SPF, DKIM, and DMARC records without turning the page into a DNS scanner.', lead: 'Paste the relevant DNS TXT records. V3 evaluates the text locally and explains which email-authentication signals are present and which questions still need an administrator to answer.' }) + `<section class="section"><div class="shell tool-workspace"><div class="tool-input"><label for="email-records-input">Email security records</label><textarea id="email-records-input" data-email-records-input spellcheck="false" placeholder="v=spf1 include:example.net -all\nv=DMARC1; p=quarantine; rua=mailto:dmarc@example.com\nv=DKIM1; k=rsa; p=..."></textarea><button class="button" type="button" data-email-records-run>Review records</button></div><div class="tool-output" data-email-records-output role="status" aria-live="polite"><p>Paste only records you are comfortable processing in your browser. No DNS lookup is performed by this corporate site.</p></div></div></section>`;
  return { title: 'Email Security Record Review | Blackpine Labs', description: 'A browser-side review tool for pasted SPF, DKIM, and DMARC DNS records.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Tools', href: '/tools/' }, { label: 'Email Security', href: '/tools/email-security/' }], body, searchTerms: ['SPF DKIM DMARC email authentication TXT record'] };
}

export function domainDnsToolPage() {
  const body = pageHero({ eyebrow: 'Tools / Domain & DNS', title: 'Review a DNS record set as an administrative control surface.', lead: 'Paste records exported from a DNS provider or lookup tool. Blackpine V3 looks for common website, mail, DNSSEC, and ownership signals without querying the domain itself.' }) + `<section class="section"><div class="shell tool-workspace"><div class="tool-input"><label for="dns-records-input">DNS records</label><textarea id="dns-records-input" data-dns-records-input spellcheck="false" placeholder="example.com. A 192.0.2.10\nexample.com. MX 10 mail.example.net.\nexample.com. TXT v=spf1 ...\n_dmarc.example.com. TXT v=DMARC1; p=reject"></textarea><button class="button" type="button" data-dns-records-run>Review record set</button></div><div class="tool-output" data-dns-records-output role="status" aria-live="polite"><p>This is a record-set review, not an authoritative DNS or registrar audit.</p></div></div></section>`;
  return { title: 'Domain & DNS Review Tool | Blackpine Labs', description: 'A local browser tool for reviewing pasted DNS record sets for website, mail, DNSSEC, and administrative security signals.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Tools', href: '/tools/' }, { label: 'Domain & DNS', href: '/tools/domain-dns/' }], body, searchTerms: ['DNS DNSSEC registrar MX TXT CAA domain security'] };
}

const assessmentQuestions = [
  ['identity', 'Privileged accounts use MFA and have controlled recovery methods.'],
  ['identity', 'Administrative roles are reviewed and stale privileged access is removed.'],
  ['email', 'External forwarding and mailbox delegation are restricted or reviewed.'],
  ['cloud', 'Guest access and connected cloud applications have named owners and review dates.'],
  ['recovery', 'A representative restore test has been completed for critical systems.'],
  ['logging', 'Security-relevant logs are retained long enough to support investigation.'],
  ['vendors', 'Vendor access has an offboarding process and accountable owner.'],
  ['incident', 'Incident authority, escalation contacts, and out-of-band communications are documented.']
];

export function assessmentPage() {
  const body = pageHero({ eyebrow: 'Self-Assessment', title: 'A short control check, not a fake security score.', lead: 'Answer eight questions about the current environment. Results are calculated in the browser and identify which control areas deserve a closer look; they are not an assessment, certification, or risk guarantee.' }) + `<section class="section"><div class="shell assessment" data-assessment>${assessmentQuestions.map((question, index) => `<fieldset data-category="${esc(question[0])}"><legend><span>${String(index + 1).padStart(2, '0')}</span>${esc(question[1])}</legend><label><input type="radio" name="q${index}" value="yes"> Yes</label><label><input type="radio" name="q${index}" value="partial"> Partly / unsure</label><label><input type="radio" name="q${index}" value="no"> No</label></fieldset>`).join('')}<div class="actions"><button class="button" type="button" data-assessment-run>Review answers</button><button class="button secondary" type="reset" data-assessment-reset>Reset</button></div><div class="assessment-output" data-assessment-output role="status" aria-live="polite"><p>Answer the questions to produce category-level observations.</p></div></div></section>`;
  return { title: 'Security Self-Assessment | Blackpine Cybersecurity', description: 'A privacy-conscious browser self-assessment covering identity, email, cloud access, recovery, logging, vendors, and incident readiness.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Self-Assessment', href: '/assessment/' }], body, searchTerms: ['questionnaire checklist security posture assessment cyber hygiene'] };
}

export function incidentPage() {
  const incidentTypes = [
    ['Account compromise', 'Preserve the alert and relevant sign-in context, regain control using the authorized recovery process, then review sessions, authentication methods, recovery changes, and privileged actions.'],
    ['Business email compromise', 'Protect the mailbox and the business workflows that trusted it. Preserve suspicious messages, forwarding, delegation, sign-ins, and payment or instruction changes.'],
    ['Ransomware', 'Prioritize safety, containment, evidence, business continuity, and recovery coordination. Avoid destroying evidence simply to make systems appear clean quickly.'],
    ['Website compromise', 'Preserve hosting, deployment, CMS, DNS, and administrator evidence before unnecessary changes. Confirm who controls the domain and recovery paths.'],
    ['Suspicious administrator activity', 'Record the account, time, alert source, role changes, high-impact actions, and available logs before sessions or evidence are removed.'],
    ['Lost or stolen privileged device', 'Use the organization’s device and identity procedures to revoke relevant access, assess local data exposure, and review credentials or sessions that could survive the device loss.']
  ];
  const body = pageHero({ eyebrow: 'Incident', title: 'If an incident is active, start by protecting control and evidence.', lead: 'This page provides general first actions and an intake path. The public website is not a 24/7 emergency hotline, and Blackpine does not promise an immediate response unless that commitment exists in a separate engagement.', meta: '<strong>Do not send through the public form</strong>Passwords, private keys, full database exports, regulated records, or sensitive incident evidence.' }) + `<section class="section"><div class="shell"><div class="incident-grid">${incidentTypes.map(([name, copy]) => `<article><h2>${esc(name)}</h2><p>${esc(copy)}</p></article>`).join('')}</div><div class="notice"><strong>Use a trusted channel for high-impact verification.</strong><p>If email itself may be compromised, do not rely on that mailbox alone to verify payment, recovery, legal, or administrative instructions.</p></div><div class="actions"><a class="button" href="/contact/?service=incident-response">Contact Blackpine about an incident</a><a class="button secondary" href="/research/?topic=incident-response">Incident response research</a></div></div></section>`;
  return { title: 'Active Cybersecurity Incident | Blackpine Cybersecurity', description: 'General first actions and Blackpine intake guidance for account compromise, business email compromise, ransomware, website compromise, and suspicious administrator activity.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Incident', href: '/incident/' }], body, searchTerms: ['emergency ransomware BEC compromise hacked breach suspicious admin help'] };
}

export function searchPage() {
  const body = pageHero({ eyebrow: 'Search', title: 'Search the public Blackpine site.', lead: 'Search runs against a static index of public pages. The query is processed in your browser and is not sent to a third-party search provider.' }) + `<section class="section"><div class="shell search-page"><label for="search-page-input">Search Blackpine</label><input id="search-page-input" type="search" autocomplete="off" data-search-page-input placeholder="Try: privileged access, DMARC, ransomware, careers"><div class="search-page-results" data-search-page-results role="status" aria-live="polite"><p>Type a keyword or phrase to search public pages.</p></div></div></section>`;
  return { title: 'Search | Blackpine Cybersecurity', description: 'Private browser-side search across public Blackpine Cybersecurity pages.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Search', href: '/search/' }], body };
}

export { plannedRoles };
