export const assuranceTargets = [
  {
    id: 'ISO27001',
    name: 'ISO/IEC 27001:2022',
    amendment: 'Amd 1:2024',
    area: 'Information Security Management System (ISMS)',
    publicState: 'READINESS',
    evidenceState: 'OPEN',
    note: 'Blackpine may use this standard as an ISMS readiness target. Certification must not be claimed until an accredited certification process is complete and independently verifiable.'
  },
  {
    id: 'SOC2',
    name: 'SOC 2 Type II',
    amendment: 'AICPA Trust Services Criteria — 2017 criteria with revised points of focus (2022)',
    area: 'Service-organization control attestation',
    publicState: 'READINESS',
    evidenceState: 'OPEN',
    note: 'The planned baseline is Security, with Confidentiality considered where customer information and service scope justify it. A Type II report requires an independent CPA examination over an operating period.'
  },
  {
    id: 'ISO27701',
    name: 'ISO/IEC 27701:2025',
    amendment: 'Edition 2',
    area: 'Privacy Information Management System (PIMS)',
    publicState: 'READINESS',
    evidenceState: 'OPEN',
    note: 'Privacy-management readiness extends the governance system for PII controller and processor responsibilities. Certification is not claimed without independent evidence.'
  },
  {
    id: 'ISO22301',
    name: 'ISO 22301:2019',
    amendment: 'Amd 1:2024; next edition under development as of 2026',
    area: 'Business Continuity Management System (BCMS)',
    publicState: 'READINESS',
    evidenceState: 'OPEN',
    note: 'Blackpine should maintain continuity requirements against the applicable published edition used by its certification body at the time of assessment.'
  },
  {
    id: 'ISO20000',
    name: 'ISO/IEC 20000-1:2018',
    amendment: 'Amd 1:2024',
    area: 'Service Management System (SMS)',
    publicState: 'READINESS',
    evidenceState: 'OPEN',
    note: 'Service-management readiness applies where Blackpine operates recurring managed or service-delivery processes. Certification is not claimed without independent evidence.'
  }
];

export const governanceRegisters = [
  ['Asset register', 'Owned systems, information assets, services, accountable owner, classification, criticality, lifecycle state.'],
  ['Risk register', 'Risk statement, affected asset/service, likelihood, impact, owner, treatment, due date, residual risk and review date.'],
  ['Control register', 'Control objective, owner, evidence requirement, cadence, implementation state, exception linkage and framework mapping.'],
  ['Supplier register', 'Provider, service purpose, information exposure, location where confirmed, owner, review status, contract/DPA status and exit dependency.'],
  ['Incident register', 'Incident ID, detection, severity, owner, decisions, evidence, containment, recovery, notification assessment and post-incident actions.'],
  ['Access-review register', 'System, reviewer, population reviewed, exceptions, removals, approvals and completion date.'],
  ['Training register', 'Person/role, required training, completion date, evidence location, exception and next due date.'],
  ['Vulnerability register', 'Affected asset, source, severity, owner, remediation/accepted-risk decision, target date, verification and closure evidence.'],
  ['Backup & recovery register', 'System, backup coverage, administrative separation, last successful restore test, issues, owner and next test.'],
  ['Change register', 'Change ID, affected service, owner, risk, review/approval where required, deployment evidence, rollback and validation.'],
  ['Exception register', 'Control exception, rationale, compensating control, approving owner, expiry/review date and closure.'],
  ['Management-review register', 'Review date, attendees, inputs, risk/control performance, incidents, audit findings, decisions and assigned actions.'],
  ['Internal-audit register', 'Scope, criteria, reviewer independence, evidence sampled, findings, severity, owners and closure verification.'],
  ['Corrective-action register', 'Source finding, root cause, corrective action, owner, target date, effectiveness check and closure.']
];

export const assuranceCrosswalk = [
  ['Governance & risk', ['ISO27001', 'SOC2', 'ISO27701', 'ISO22301', 'ISO20000'], 'Risk ownership, policies, objectives, management review, exceptions, internal audit and corrective action.'],
  ['Identity & access', ['ISO27001', 'SOC2', 'ISO27701', 'ISO20000'], 'MFA, privileged access, joiner/mover/leaver controls, access reviews and accountability.'],
  ['Information & privacy', ['ISO27001', 'SOC2', 'ISO27701'], 'Classification, minimization, authorized access, secure exchange, retention, deletion and privacy responsibilities.'],
  ['Operations & change', ['ISO27001', 'SOC2', 'ISO20000'], 'Controlled change, logging, vulnerability management, service operation, incident records and release evidence.'],
  ['Supplier management', ['ISO27001', 'SOC2', 'ISO27701', 'ISO22301', 'ISO20000'], 'Supplier ownership, due diligence, information exposure, contracts, dependencies and exit planning.'],
  ['Continuity & recovery', ['ISO27001', 'SOC2', 'ISO22301', 'ISO20000'], 'Business-impact assumptions, backup/restore evidence, continuity ownership, exercises and recovery dependencies.'],
  ['Service management', ['SOC2', 'ISO20000'], 'Service definition, ownership, request/incident/change workflows, service reporting and continual improvement.'],
  ['Assurance & improvement', ['ISO27001', 'SOC2', 'ISO27701', 'ISO22301', 'ISO20000'], 'Metrics, internal review, independent assurance evidence, findings, corrective action and continual improvement.']
];

export const serviceStandards = [
  ['Business enquiries', 'Acknowledge through the published business-contact process. No universal response time is promised unless an applicable agreement states one.'],
  ['Active engagements', 'Scope, communication cadence, deliverables, dependencies and dates are governed by the applicable statement of work or engagement agreement.'],
  ['Critical findings', 'Material findings should be escalated through the agreed engagement contacts when the engagement terms and staffing model support that escalation path.'],
  ['Security incidents affecting Blackpine', 'Handled through the documented incident-response lifecycle, including notification assessment against legal and contractual obligations.'],
  ['Assurance requests', 'Public Trust Center information is provided first; sensitive evidence, reports, certificates or insurance documents are disclosed only through an appropriate controlled process.'],
  ['Service commitments', 'No “24/7”, guaranteed remediation time, RTO, RPO, uptime percentage or response SLA is published unless it is contractually approved and operationally supported.']
];

export const portalSecurityRequirements = [
  ['Authentication', 'MFA required for customer and privileged administrative access; recovery paths must not be weaker than the access they recover.'],
  ['Authorization', 'Tenant-aware RBAC, least privilege, explicit engagement membership and separate administrative privileges.'],
  ['File handling', 'Encrypted transport, controlled storage, malware/content handling appropriate to the service, explicit retention/deletion state and no public-bucket exposure.'],
  ['Report delivery', 'Access-controlled delivery with optional expiry, revocation, controlled download and clear version state.'],
  ['Auditability', 'Security-relevant sign-ins, administrative actions, file access, permission changes and high-risk exports logged with appropriate retention.'],
  ['Session security', 'Secure cookies/tokens, session expiry, revocation, re-authentication for sensitive actions and protection against common web-session attacks.'],
  ['Tenant isolation', 'Authorization checks performed server-side for every customer-scoped object; no trust in client-supplied tenant identifiers.'],
  ['Secure messaging', 'Customer-sensitive messages kept inside the controlled portal where practical instead of ordinary email attachments.'],
  ['Lifecycle', 'Invite, activation, role change, engagement close, account expiry and deletion/revocation must be explicit and reviewable.'],
  ['Operations', 'Vulnerability management, dependency review, backups, restoration testing, monitoring, incident response and controlled change apply to the portal itself.']
];

export const insuranceEvidence = {
  state: 'OPEN',
  categories: ['Professional liability / Errors & Omissions', 'Cyber liability'],
  publicationRule: 'Do not claim coverage, limits, insurer, policy number, dates, or certificate availability until current authoritative insurance evidence has been reviewed and approved for disclosure.'
};
