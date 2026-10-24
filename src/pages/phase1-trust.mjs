import { site } from '../data.mjs';
import { pageHero } from '../components.mjs';
import { esc } from '../lib/html.mjs';

export function phase1AboutPage() {
  const body = pageHero({
    eyebrow: 'Company',
    title: 'Blackpine Cybersecurity.',
    lead: 'Blackpine Cybersecurity Inc. is a Canada-based cybersecurity firm. Public company information is kept deliberately narrow: facts are published only when they are confirmed for public use.',
    meta: `<strong>Legal name</strong>Blackpine Cybersecurity Inc.<br><br><strong>Country</strong>Canada`
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Company</span><a href="#identity">Identity</a><a href="#verification">Verification</a><a href="#practice">Practice</a><a href="#claims">Publication standard</a></aside><article class="prose"><h2 id="identity">Company identity</h2><p>Blackpine Cybersecurity Inc. operates the public website at <a href="${esc(site.url)}">${esc(site.url.replace('https://', ''))}</a>. General enquiries use <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>. Security reports use <a href="mailto:${esc(site.securityEmail)}">${esc(site.securityEmail)}</a>.</p><h2 id="verification">Public verification</h2><p>Blackpine does not publish a province of incorporation, registration number, office address, leadership biography, certification, partnership, insurance claim, or audit claim until that item has been checked against an authoritative record and approved for public use.</p><p>Verified corporate-registration details will be added to the Legal &amp; Company Information page when the underlying record has been confirmed.</p><h2 id="practice">Security practice</h2><p>Blackpine provides cybersecurity assessment, engineering, incident-response, readiness, and advisory work within an agreed scope and authorization boundary. Separate Blackpine Labs services, including Cipher, operate on separate application and verification surfaces.</p><h2 id="claims">Publication standard</h2><p>Public statements are treated as evidence-bearing claims. Customer identities, employee credentials, response commitments, certifications, audits, technology partnerships, and similar trust signals are published only when they are current, supportable, and permitted for public use.</p><div class="actions"><a class="button" href="/company/team/">Leadership publication status</a><a class="button secondary" href="/legal/company-information/">Legal &amp; company information</a></div></article></div></section>`;
  return {
    title: 'About Blackpine Cybersecurity | Canada',
    description: 'Verified public company information for Blackpine Cybersecurity Inc., a Canada-based cybersecurity firm.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'About', href: '/company/about/' }],
    body
  };
}

export function phase1TeamPage() {
  const body = pageHero({
    eyebrow: 'Company / Leadership',
    title: 'Leadership information must be verifiable.',
    lead: 'Blackpine will publish named leadership profiles only when each person, title, biography, professional history, public profile, and credential included on the site has been confirmed for public use.',
    meta: '<strong>Publication status</strong>Verification-gated'
  }) + `<section class="section"><div class="shell prose"><h2>What a published profile will include</h2><ul><li>Full name and current Blackpine title.</li><li>Professional photograph approved for public use.</li><li>Relevant prior experience and areas of specialization.</li><li>Professional profile links where the individual approves publication.</li><li>Relevant certifications only after they have been verified.</li></ul><h2>Why the directory is gated</h2><p>An unverified staff directory creates more credibility risk than an incomplete one. Blackpine does not use generated biographies, invented employee counts, assumed credentials, or placeholder LinkedIn profiles as trust signals.</p><h2>Contact</h2><p>Company enquiries should use the centralized <a href="/contact/">contact route</a>. Security reports should use <a href="mailto:${esc(site.securityEmail)}">${esc(site.securityEmail)}</a>.</p></div></section>`;
  return {
    title: 'Leadership | Blackpine Cybersecurity',
    description: 'Blackpine leadership publication standard and verification status.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Company', href: '/company/about/' }, { label: 'Leadership', href: '/company/team/' }],
    body
  };
}

export function companyInformationPage() {
  const body = pageHero({
    eyebrow: 'Legal / Company',
    title: 'Legal & company information',
    lead: 'The public identity record for Blackpine is intentionally limited to information that has been confirmed for publication.',
    meta: '<strong>Legal name</strong>Blackpine Cybersecurity Inc.<br><strong>Country</strong>Canada'
  }) + `<section class="section"><div class="shell prose"><h2>Public company record</h2><ul><li><strong>Legal name:</strong> Blackpine Cybersecurity Inc.</li><li><strong>Country:</strong> Canada</li><li><strong>Official website:</strong> <a href="${esc(site.url)}">${esc(site.url)}</a></li><li><strong>General contact:</strong> <a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li><li><strong>Security contact:</strong> <a href="mailto:${esc(site.securityEmail)}">${esc(site.securityEmail)}</a></li></ul><h2>Registration details</h2><p>Province of incorporation, corporate registration number, and registered-office information are not published on this page until they have been verified against the authoritative corporate record and approved for public disclosure. Blackpine does not fill those fields from assumptions or generated data.</p><h2>Professional engagements</h2><p>Professional cybersecurity work is governed by separate written engagement terms defining scope, authorization, responsibilities, fees, communications, and applicable limitations. A website inquiry by itself does not authorize security testing.</p><h2>Verification requests</h2><p>Organizations performing vendor due diligence can contact <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> for company information that is appropriate to disclose for the review.</p></div></section>`;
  return {
    title: 'Legal & Company Information | Blackpine Cybersecurity',
    description: 'Public legal identity and company verification information for Blackpine Cybersecurity Inc.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Legal', href: '/legal/company-information/' }, { label: 'Company information', href: '/legal/company-information/' }],
    body
  };
}

export function acceptableUsePage() {
  const body = pageHero({
    eyebrow: 'Legal',
    title: 'Acceptable Use Policy',
    lead: 'Blackpine public services and tools may be used only in ways that are lawful, authorized, and consistent with the security boundaries described for the relevant service.'
  }) + `<section class="section"><div class="shell prose"><h2>Authorized use</h2><p>Users are responsible for ensuring they have the authority required for any system, data, file, account, domain, or environment they submit to or assess with a Blackpine service. Public availability of a tool does not grant permission to test a third party.</p><h2>Prohibited use</h2><ul><li>Unauthorized access, exploitation, credential use, or security testing.</li><li>Malware distribution, destructive payload delivery, denial-of-service activity, or attempts to impair availability.</li><li>Collection, submission, or disclosure of data that the user is not authorized to handle.</li><li>Using Blackpine services to facilitate fraud, impersonation, harassment, abuse, or other unlawful activity.</li><li>Attempts to bypass service safeguards, usage boundaries, verification controls, or security restrictions for an unauthorized purpose.</li></ul><h2>Security research</h2><p>Research involving Blackpine-owned public systems must follow the Responsible Disclosure Policy. That policy does not create authorization to access customer systems, third-party services, unrelated accounts, or non-public infrastructure.</p><h2>Service protection</h2><p>Blackpine may restrict or block activity that creates a material security, legal, privacy, or availability risk. Any contractual customer rights and obligations remain governed by the applicable written engagement terms.</p><h2>Questions</h2><p>Questions about authorized use can be directed to <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>. Potential security issues should be reported to <a href="mailto:${esc(site.securityEmail)}">${esc(site.securityEmail)}</a>.</p></div></section>`;
  return {
    title: 'Acceptable Use Policy | Blackpine Cybersecurity',
    description: 'Acceptable-use rules for Blackpine public websites, tools, and services.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Acceptable Use', href: '/legal/acceptable-use/' }],
    body
  };
}

export function responsibleDisclosurePage() {
  const body = pageHero({
    eyebrow: 'Trust / Security',
    title: 'Responsible Disclosure Policy',
    lead: 'Blackpine welcomes good-faith reports about suspected security issues in Blackpine-owned public systems when research stays within the boundaries below.',
    meta: `<strong>Security contact</strong>${esc(site.securityEmail)}`
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Disclosure</span><a href="#report">Report</a><a href="#scope">Scope</a><a href="#allowed">Allowed testing</a><a href="#prohibited">Prohibited testing</a><a href="#researchers">Good-faith research</a><a href="#process">Process</a></aside><article class="prose"><h2 id="report">How to report</h2><p>Email <a href="mailto:${esc(site.securityEmail)}">${esc(site.securityEmail)}</a> with the affected hostname or URL, a concise description, reproduction steps, likely impact, and a safe way to contact you. Do not include unrelated personal or customer data.</p><h2 id="scope">Systems in scope</h2><p>Blackpine-owned public systems are in scope only to the extent that testing can be performed safely and lawfully. The public corporate website, Blackpine-controlled support and verification surfaces, and other Blackpine-owned public endpoints may have different technical boundaries. A vulnerability report does not authorize access to customer systems, third-party services, employee accounts, private infrastructure, or physical locations.</p><h2 id="allowed">Allowed testing</h2><ul><li>Non-destructive observation and validation needed to demonstrate a suspected issue.</li><li>Use of your own accounts and data where a service permits account creation or submission.</li><li>Minimal proof-of-concept activity needed to establish security impact without persistence, lateral movement, or unnecessary data access.</li></ul><h2 id="prohibited">Prohibited testing</h2><ul><li>Denial-of-service, load testing, deliberate resource exhaustion, or availability disruption.</li><li>Social engineering, phishing, credential theft, or targeting employees or customers.</li><li>Accessing, modifying, deleting, downloading, or retaining data that does not belong to you beyond the minimum unavoidable exposure needed to recognize the issue.</li><li>Persistence, malware deployment, destructive actions, lateral movement, or attempts to compromise unrelated systems.</li><li>Testing third-party infrastructure merely because it is connected to or used by Blackpine.</li></ul><h2 id="researchers">Good-faith research</h2><p>Blackpine welcomes good-faith security research that follows this policy, minimizes harm, respects privacy, and stops when further action could create risk. This policy is not permission to break applicable law or contractual restrictions, and it does not grant access rights to systems Blackpine does not own or control.</p><h2 id="process">Disclosure process</h2><p>Blackpine will review reports sent to the security contact and may request clarification or additional evidence. Please allow a reasonable opportunity to investigate and remediate before publishing sensitive technical details. Specific response-time guarantees are not published unless Blackpine has an operational process capable of meeting them.</p><h2>Recognition</h2><p>Researcher recognition may be offered only with the researcher’s permission and after the report has been validated and disclosure timing is agreed. Blackpine does not promise payment or a bug bounty unless a separate program explicitly states otherwise.</p><h2>Machine-readable contact</h2><p>The canonical security contact is published at <a href="/.well-known/security.txt">/.well-known/security.txt</a>.</p></article></div></section>`;
  return {
    title: 'Responsible Disclosure Policy | Blackpine Cybersecurity',
    description: 'Scope, allowed testing, prohibited testing, reporting guidance, and disclosure expectations for suspected vulnerabilities in Blackpine-owned public systems.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Trust', href: '/trust/' }, { label: 'Responsible Disclosure', href: '/trust/responsible-disclosure/' }],
    body
  };
}
