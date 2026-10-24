import { pageHero } from '../components.mjs';
import { esc } from '../lib/html.mjs';
import { assuranceTargets, governanceRegisters, assuranceCrosswalk, serviceStandards, portalSecurityRequirements, insuranceEvidence } from '../phase5-enterprise-data.mjs';

const rows = items => `<div class="service-rows">${items.map((item, index) => `<div class="service-row"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(item[0])}</strong><small>${esc(item[1])}</small></span><span></span></div>`).join('')}</div>`;

export function assuranceFrameworkPage() {
  const targetRows = assuranceTargets.map(target => [
    target.name,
    `${target.area}. Reference: ${target.amendment}. Public state: ${target.publicState}; independent evidence: ${target.evidenceState}. ${target.note}`
  ]);
  const crosswalkRows = assuranceCrosswalk.map(([domain, standards, purpose]) => [domain, `${standards.join(', ')} — ${purpose}`]);
  const body = pageHero({
    eyebrow: 'Trust / Enterprise assurance',
    title: 'One governance system, mapped across five assurance targets.',
    lead: 'Blackpine uses one control-and-evidence model rather than building disconnected compliance programs. The mapping is a readiness aid; it is not a certification, attestation, audit opinion, or substitute for the licensed standards and an independent assessor.',
    meta: '<strong>Current public state</strong>Readiness framework<br><strong>Certification evidence</strong>OPEN unless independently verified'
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Targets</div><div><h2>Five assurance targets, one control environment.</h2><p>The reference editions below are recorded so the program does not silently drift. Before any certification or examination starts, Blackpine should confirm the edition and transition rules accepted by the relevant certification body or CPA firm.</p></div></div>${rows(targetRows)}<div class="section-head"><div class="section-label">Crosswalk</div><div><h2>Map controls by domain, not by duplicating work.</h2><p>A control can support more than one assurance objective when its ownership, evidence, cadence, exceptions, and operating history are actually demonstrated.</p></div></div>${rows(crosswalkRows)}<div class="notice"><strong>Claim boundary.</strong><p>Blackpine must not publish “certified”, “SOC 2 Type II compliant”, “audited”, or equivalent language until authoritative independent evidence exists and the exact scope is approved for public disclosure.</p></div></div></section>`;
  return {
    title: 'Enterprise Assurance Framework | Blackpine Cybersecurity',
    description: 'Blackpine enterprise assurance readiness across ISO/IEC 27001, SOC 2 Type II, ISO/IEC 27701, ISO 22301 and ISO/IEC 20000-1 without unsupported certification claims.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Trust', href: '/trust/' }, { label: 'Enterprise Assurance', href: '/trust/enterprise-assurance/' }],
    body,
    searchTerms: ['ISO 27001 SOC 2 Type II ISO 27701 ISO 22301 ISO 20000 enterprise assurance governance readiness']
  };
}

export function governanceSystemPage() {
  const body = pageHero({
    eyebrow: 'Trust / Governance system',
    title: 'Evidence has an owner, a cadence, and a place to live.',
    lead: 'Enterprise readiness depends on repeatable operating records, not a folder of policies created just before an audit. Blackpine’s governance model defines the registers needed to keep risks, controls, suppliers, incidents, access, training, recovery, change and corrective action reviewable.',
    meta: `<strong>Register catalogue</strong>${governanceRegisters.length}<br><strong>Status rule</strong>Defined is not the same as operating`
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Registers</div><div><h2>Minimum governance records.</h2><p>Actual sensitive evidence belongs in controlled internal systems, not in this public repository. The public repository defines the schema and evidence boundary only.</p></div></div>${rows(governanceRegisters)}<div class="notice"><strong>Management-system rule.</strong><p>Every material finding should be traceable to an owner, due date, decision and closure/effectiveness record. Internal review does not become independent verification merely because it is documented.</p></div></div></section>`;
  return {
    title: 'Security Governance System | Blackpine Cybersecurity',
    description: 'Blackpine governance register architecture for risks, controls, suppliers, incidents, access, training, recovery, change, audit and corrective action.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Trust', href: '/trust/' }, { label: 'Governance System', href: '/trust/governance-system/' }],
    body
  };
}

export function clientPortalSecurityPage() {
  const body = pageHero({
    eyebrow: 'Trust / Client portal',
    title: 'A secure client portal must be a security boundary, not a file-sharing skin.',
    lead: 'This page defines the minimum architecture Blackpine should require before a client portal is treated as an approved channel for sensitive assessment material. It does not claim that a production portal with these controls is already operating.',
    meta: '<strong>Current state</strong>Security architecture defined<br><strong>Production portal</strong>Not claimed here'
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Requirements</div><div><h2>Minimum portal security requirements.</h2><p>Authentication, tenant isolation, authorization and lifecycle controls are treated as first-order requirements because a portal can concentrate confidential reports, evidence and client identities.</p></div></div>${rows(portalSecurityRequirements)}<div class="notice"><strong>Release gate.</strong><p>A portal should not be described as production-ready until security review, authorization testing, logging, backup/restore validation, vulnerability management, incident-response integration and data-retention behavior have evidence behind them.</p></div></div></section>`;
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
    lead: 'Blackpine defines service standards conservatively so marketing language does not create commitments that staffing, tooling or an engagement agreement cannot support.',
    meta: '<strong>Public posture</strong>No invented 24/7, uptime, RTO, RPO or response SLA'
  }) + `<section class="section"><div class="shell">${rows(serviceStandards)}<div class="notice"><strong>Contract controls commitments.</strong><p>Where a signed agreement establishes a response target, delivery date, service window, RTO/RPO, escalation path or availability commitment, that agreement governs the engagement. The public website should not silently broaden it.</p></div></div></section>`;
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
    meta: `<strong>Evidence status</strong>${esc(insuranceEvidence.state)}<br><strong>Categories tracked</strong>${insuranceEvidence.categories.length}`
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Tracked evidence</div><div><h2>Coverage classes.</h2><p>${esc(insuranceEvidence.publicationRule)}</p></div></div>${rows(insuranceEvidence.categories.map(category => [category, 'Evidence remains OPEN until a current authoritative policy/certificate has been reviewed and approved for disclosure.']))}<div class="notice"><strong>Controlled disclosure.</strong><p>Where insurance evidence exists, full policy documents or certificates may still be provided only to qualified customers or counterparties through an appropriate due-diligence process.</p></div></div></section>`;
  return {
    title: 'Insurance & Risk Transfer | Blackpine Cybersecurity',
    description: 'Blackpine insurance evidence policy for professional liability, E&O and cyber liability without unsupported coverage claims.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Trust', href: '/trust/' }, { label: 'Insurance', href: '/trust/insurance/' }],
    body
  };
}
