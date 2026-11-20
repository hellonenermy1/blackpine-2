import { pageHero } from '../components.mjs';
import { esc } from '../lib/html.mjs';
import { assuranceTargets, governanceRegisters, assuranceCrosswalk, serviceStandards, portalSecurityRequirements, insuranceEvidence } from '../phase5-enterprise-data.mjs';

const rows = items => `<div class="service-rows">${items.map((item, index) => `<div class="service-row"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(item[0])}</strong><small>${esc(item[1])}</small></span><span></span></div>`).join('')}</div>`;

export function assuranceFrameworkPage() {
  const targetRows = assuranceTargets.filter(target => !['ISO27001', 'SOC2'].includes(target.id)).map(target => [
    target.name,
    `${target.area}. Reference: ${target.amendment}. ${target.note}`
  ]);
  const crosswalkRows = assuranceCrosswalk.map(([domain, standards, purpose]) => [domain, `${standards.join(', ')} — ${purpose}`]);
  const body = pageHero({
    eyebrow: 'Trust / Enterprise assurance',
    title: 'Assurance and security governance.'
    lead: 'Blackpine reports completed organizational assurance credentials alongside ongoing governance and mapping activities. Supporting audit reports, certificate scopes and validity records are shared confidentially with qualified customers.'
    meta: '<strong>Evidence access</strong>Confidential customer due diligence'
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Assurance</div><div><h2>Declared credentials and further standards work.</h2><p>Blackpine reports an ISO/IEC 27001 certificate, a SOC 2 Type II examination report and CREST accreditation. The relevant audit period, certified scope, issuer and current validity are checked in private due diligence. Other standards below are governance references or readiness objectives, not additional certificates.</p><p><a href="/trust/compliance/">Certifications &amp; Professional Credentials</a> · <a href="mailto:contact@blackpinecybersecurity.com?subject=Confidential%20Credential%20Verification%20Request">Request documentation</a></p></div></div>${rows(targetRows)}<div class="section-head"><div class="section-label">Crosswalk</div><div><h2>Map controls by domain, not by duplicating work.</h2><p>A control can support more than one assurance objective when its ownership, evidence, cadence, exceptions, and operating history are actually demonstrated.</p></div></div>${rows(crosswalkRows)}<div class="notice"><strong>Scope and confidentiality.</strong><p>Audit opinion, reporting period, certificate status and accredited disciplines must be confirmed against the relevant source documents. The website does not publish sensitive assurance reports or employee identifiers.</p></div></div></section>`;
  return {
    title: 'Enterprise Assurance Framework | Blackpine Cybersecurity',
    description: 'Blackpine organizational assurance overview, confidential credential verification and security governance mapping.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Trust', href: '/trust/' }, { label: 'Enterprise Assurance', href: '/trust/enterprise-assurance/' }],
    body,
    searchTerms: ['ISO 27001 SOC 2 Type II ISO 27701 ISO 22301 ISO 20000 enterprise assurance governance readiness']
  };
}

export function governanceSystemPage() {
  const body = pageHero({
    eyebrow: 'Trust / Governance system',
    title: 'Evidence has an owner, a cadence, and a place to live.',
    lead: 'Enterprise readiness depends on repeatable operating records, not a folder of policies created just before an audit. Blackpine’s governance model defines the records used to keep risks, controls, suppliers, incidents, access, training, recovery, change and corrective action reviewable.',
    meta: `<strong>Governance records described</strong>${governanceRegisters.length}`
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Records</div><div><h2>Core governance records.</h2><p>Sensitive operational and client evidence is kept in controlled systems. This page explains the information Blackpine expects those records to contain without publishing confidential evidence.</p></div></div>${rows(governanceRegisters)}<div class="notice"><strong>Accountability and review.</strong><p>Material findings are assigned an owner, due date and closure record. Internal review is kept distinct from independent verification.</p></div></div></section>`;
  return {
    title: 'Security Governance System | Blackpine Cybersecurity',
    description: 'Blackpine governance record architecture for risks, controls, suppliers, incidents, access, training, recovery, change, audit and corrective action.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Trust', href: '/trust/' }, { label: 'Governance System', href: '/trust/governance-system/' }],
    body
  };
}

export function clientPortalSecurityPage() {
  const body = pageHero({
    eyebrow: 'Trust / Client portal',
    title: 'A secure client portal must be a security boundary, not a file-sharing skin.',
    lead: 'Before a client portal is used for sensitive assessment material, Blackpine expects authentication, authorization, tenant isolation, logging, retention and operational controls to be validated. Blackpine does not currently present a production client portal as an available customer channel.',
    meta: '<strong>Current availability</strong>Not offered as a production customer channel'
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Requirements</div><div><h2>Minimum portal security requirements.</h2><p>Authentication, tenant isolation, authorization and lifecycle controls are treated as first-order requirements because a portal can concentrate confidential reports, evidence and client identities.</p></div></div>${rows(portalSecurityRequirements)}<div class="notice"><strong>Before production use.</strong><p>Security review, authorization testing, logging, backup and restore validation, vulnerability management, incident-response integration and data-retention behavior must be validated before the portal is used for sensitive customer material.</p></div></div></section>`;
  return {
    title: 'Client Portal Security Architecture | Blackpine Cybersecurity',
    description: 'Minimum Blackpine client-portal security requirements for MFA, RBAC, tenant isolation, secure files, audit logging, lifecycle and operations.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Trust', href: '/trust/' }, { label: 'Client Portal Security', href: '/trust/client-portal-security/' }],
    body
  };
}

export function serviceStandardsPage() {
  const body = pageHero({
    eyebrow: 'Trust / Service standards',
    title: 'Service commitments should match the operating model and the contract.',
    lead: 'Blackpine defines service standards conservatively so public descriptions do not create commitments that staffing, tooling or an engagement agreement cannot support.',
    meta: '<strong>Service commitments</strong>Defined by the applicable agreement'
  }) + `<section class="section"><div class="shell">${rows(serviceStandards)}<div class="notice"><strong>Contractual commitments.</strong><p>Where a signed agreement establishes a response target, delivery date, service window, RTO/RPO, escalation path or availability commitment, that agreement governs the engagement. The public website does not broaden those terms.</p></div></div></section>`;
  return {
    title: 'Service Standards | Blackpine Cybersecurity',
    description: 'Blackpine service-standard boundaries for enquiries, engagements, critical findings, incidents, assurance requests and contractual service commitments.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Trust', href: '/trust/' }, { label: 'Service Standards', href: '/trust/service-standards/' }],
    body
  };
}

export function insuranceAssurancePage() {
  const body = pageHero({
    eyebrow: 'Trust / Insurance',
    title: 'Insurance evidence is disclosed only when current coverage can be substantiated.',
    lead: 'Professional liability and cyber liability can be important parts of enterprise risk transfer, but a website should not invent an insurer, policy, limit, certificate or coverage period.',
    meta: `<strong>Public coverage details</strong>Not currently published<br><strong>Coverage categories reviewed</strong>${insuranceEvidence.categories.length}`
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Coverage categories</div><div><h2>Insurance information.</h2><p>${esc(insuranceEvidence.publicationRule)}</p></div></div>${rows(insuranceEvidence.categories.map(category => [category, 'Coverage details are published only after current authoritative insurer documentation has been reviewed and approved for disclosure.']))}<div class="notice"><strong>Controlled disclosure.</strong><p>Where insurance evidence exists, full policy documents or certificates may still be provided only to qualified customers or counterparties through an appropriate due-diligence process.</p></div></div></section>`;
  return {
    title: 'Insurance & Risk Transfer | Blackpine Cybersecurity',
    description: 'Blackpine insurance evidence policy for professional liability, E&O and cyber liability without unsupported coverage claims.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Trust', href: '/trust/' }, { label: 'Insurance', href: '/trust/insurance/' }],
    body
  };
}
