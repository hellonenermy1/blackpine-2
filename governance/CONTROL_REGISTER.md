# Blackpine Security Control Register

Phase 2 baseline. This register defines what evidence Blackpine should retain for each control. Unless separately supported by evidence, entries below are **DEFINED**, not independently verified.

| ID | Control | Objective | Minimum evidence | Cadence / trigger | Phase 2 state |
|---|---|---|---|---|---|
| IAM-01 | Workforce MFA | Business-critical accounts require appropriate MFA. | Identity-policy export or screenshots; exception register. | Continuous; review quarterly | DEFINED |
| IAM-02 | Privileged access | Privileged roles are limited, attributable, and separately controlled where practical. | Privileged-role inventory; approvals; admin-account records. | Quarterly and on change | DEFINED |
| IAM-03 | Access lifecycle | Joiner, mover, and leaver events update access promptly. | Access request/approval and deprovisioning records. | Each personnel change | DEFINED |
| IAM-04 | Access review | Material access is periodically reviewed by accountable owners. | Dated review output, exceptions, remediation actions. | Quarterly | DEFINED |
| END-01 | Managed endpoints | Business endpoints use supported software, encryption, and security controls appropriate to the device. | Device inventory; encryption/security status; exception register. | Continuous; review quarterly | DEFINED |
| LOG-01 | Security logging | Security-relevant systems retain logs sufficient for detection and investigation according to risk and contractual needs. | Log-source inventory; retention settings; alert ownership. | Quarterly and on system change | DEFINED |
| BAK-01 | Backup and restore | Critical information and systems have owned backups and representative restoration testing. | Backup coverage record; restore-test result; unresolved actions. | According to system criticality; representative test at least annually | DEFINED |
| IR-01 | Incident response | Security incidents follow a defined escalation, containment, investigation, recovery, and review lifecycle. | Incident records; decision log; post-incident actions. | Each incident | DEFINED |
| IR-02 | Incident exercise | Blackpine tests response assumptions before a real incident. | Tabletop scenario, participants, decisions, gaps, action owners. | At least annually and after material process change | DEFINED |
| DATA-01 | Data minimization | Client and enquiry information is collected only for a defined purpose. | Engagement scope; data-request record; exceptions. | Each engagement / data request | DEFINED |
| DATA-02 | Secure exchange | Sensitive engagement material uses an exchange method approved for the sensitivity and scope. | Approved transfer method; authorized recipient list; access evidence. | Each sensitive engagement | DEFINED |
| DATA-03 | Data access | Client information is limited to authorized people with a need for the work. | Access list; approval record; periodic review. | On access change; review during engagement | DEFINED |
| RET-01 | Retention and deletion | Retention follows contractual, legal, security, and business requirements; deletion is recorded where required. | Retention requirement; deletion record; exception/legal-hold record. | Engagement close and applicable trigger | DEFINED |
| SUP-01 | Supplier security | Material providers are identified, assigned an owner, and reviewed for relevant security/privacy risk. | Supplier register; purpose; data exposure; review/approval. | Before material use and periodically | DEFINED |
| VUL-01 | Vulnerability management | Blackpine-owned systems have a process for receiving, prioritizing, and remediating vulnerabilities. | Vulnerability record; severity/priority; remediation or accepted-risk decision. | Continuous | DEFINED |
| CHG-01 | Controlled change | Material production/security changes are attributable and reviewable. | Version-control history, approvals where required, deployment records. | Each material change | DEFINED |
| SEC-01 | Security awareness | Personnel receive security guidance appropriate to their access and responsibilities. | Training content; completion evidence; role-specific guidance. | Onboarding and at least annually | DEFINED |
| BCM-01 | Continuity ownership | Critical services have identified dependencies, decision owners, and recovery responsibilities. | Service/dependency inventory; recovery owner; continuity exercise. | Annual and on material change | DEFINED |
| BCM-02 | Alternate communications | Response and continuity planning considers communication when primary identity/email systems are unavailable or compromised. | Documented alternate-contact method held in controlled storage; exercise evidence. | Annual test | DEFINED |
| GOV-01 | Risk register | Material information-security risks have an owner, treatment decision, and review date. | Risk register and treatment records. | Quarterly and on material change | DEFINED |
| GOV-02 | Control exceptions | Security exceptions are explicit, approved, time-bounded where possible, and reviewed. | Exception record, owner, rationale, expiry/review date. | On exception; review at expiry | DEFINED |

## Rules

1. Do not promote a control to **IMPLEMENTED** without evidence.
2. Do not promote a recurring control to **OPERATING** from a single example when the stated cadence requires repetition.
3. Do not promote a control to **VERIFIED** merely because Blackpine reviewed itself.
4. Evidence containing customer data, credentials, internal infrastructure details, staff personal data, or incident material must not be committed to this public repository.
5. Evidence gaps remain visible; they are not rewritten as marketing claims.
