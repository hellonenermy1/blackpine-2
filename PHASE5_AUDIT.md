# Phase 5 — Enterprise Readiness & Assurance Audit

Date: 2026-10-24

Scope: enterprise assurance architecture, governance registers, control/evidence reuse, certification claim boundaries, service standards, client-portal security architecture, insurance evidence, and readiness for final cross-phase verification.

## Implemented in Phase 5

### One governance system across five assurance targets

Blackpine now maintains a single readiness architecture for:

1. ISO/IEC 27001:2022 with Amendment 1:2024.
2. SOC 2 Type II using the AICPA Trust Services Criteria as the attestation reference; Security is the baseline category and Confidentiality is considered where scope warrants it.
3. ISO/IEC 27701:2025.
4. ISO 22301:2019 with Amendment 1:2024; the next edition is under development as of this audit date.
5. ISO/IEC 20000-1:2018 with Amendment 1:2024.

The crosswalk is deliberately domain-level rather than a copied clause-by-clause reproduction of licensed standards. Formal scoping and interpretation remain the responsibility of the applicable certification body, CPA firm, legal counsel, or other qualified assessor.

### Governance records

Fourteen required enterprise registers are defined:

- asset;
- risk;
- control;
- supplier;
- incident;
- access review;
- training;
- vulnerability;
- backup/recovery;
- change;
- exception;
- management review;
- internal audit;
- corrective action.

The existing DEFINED / IMPLEMENTED / OPERATING / VERIFIED / OPEN status model is preserved. Public repository artifacts define requirements and evidence schemas only; sensitive operating evidence must live in controlled internal storage.

### Assurance evidence gate

A dedicated assurance-evidence register now keeps all five certification/attestation targets OPEN until authoritative independent evidence exists. It also tracks professional liability / E&O and cyber liability evidence as OPEN rather than implying current coverage.

Certificate/report publication requires exact scope, dates, issuer/auditor, verification path, and approved wording. SOC 2 report distribution is treated as controlled due-diligence material rather than automatically public content.

### Secure client portal architecture

A minimum portal-security standard is defined covering:

- MFA;
- privileged access and recovery;
- tenant-aware RBAC;
- server-side object authorization;
- tenant isolation;
- encrypted transport and controlled storage;
- secure report delivery;
- audit logging;
- session security;
- secure messaging;
- account/engagement lifecycle;
- vulnerability/dependency management;
- backup/restore testing;
- monitoring and incident response;
- controlled change and deployment;
- pre-production authentication/authorization/tenant-isolation testing.

This is an architecture/release gate. Blackpine does not claim that a production portal implementing these controls is already deployed.

### Service standards

Public service commitments now have a formal evidence gate. The site does not invent:

- 24/7 availability;
- guaranteed response/remediation times;
- uptime percentages;
- RTO/RPO commitments;
- unsupported public SLAs.

Measurable commitments require a named owner, measurement definition, staffing/escalation coverage, monitoring/reporting source, exception handling, applicable approval, and operating evidence.

### Insurance

Professional liability / E&O and cyber liability are tracked as desired enterprise risk-transfer evidence classes. Current coverage, insurer, limits, policy numbers, dates, or certificates are not claimed without authoritative evidence.

## Public pages added

- `/trust/enterprise-assurance/`
- `/trust/governance-system/`
- `/trust/client-portal-security/`
- `/trust/service-standards/`
- `/trust/insurance/`

## Governance artifacts added

- `governance/ASSURANCE_CROSSWALK.md`
- `governance/ENTERPRISE_GOVERNANCE_SYSTEM.md`
- `governance/CLIENT_PORTAL_SECURITY_STANDARD.md`
- `governance/SERVICE_STANDARDS.md`
- `governance/ASSURANCE_EVIDENCE_REGISTER.md`

## Automated verification

`scripts/check-phase5-enterprise.mjs` is part of the normal `npm run check` pipeline. It verifies:

- all five target standards/reports are represented;
- all five remain OPEN without independent evidence;
- insurance evidence remains OPEN;
- all fourteen governance registers exist;
- all five governance states remain defined;
- eight shared assurance domains are mapped;
- the portal release gate contains authentication, authorization, tenant isolation, audit, backup, incident and security-testing requirements;
- no deployed production portal is falsely claimed;
- public service commitments stay conservative;
- enterprise-assurance pages preserve the readiness/certification boundary.

## Acceptance matrix

| Requirement | Status | Evidence / limitation |
|---|---|---|
| Unified governance framework | PASS (defined) | One governance system and shared status model. |
| ISO/IEC 27001 readiness architecture | PASS (defined) | Target/reference recorded; independent certificate remains OPEN. |
| SOC 2 Type II readiness architecture | PASS (defined) | Attestation target/evidence gate recorded; CPA report remains OPEN. |
| ISO/IEC 27701 readiness architecture | PASS (defined) | Target/reference recorded; independent certificate remains OPEN. |
| ISO 22301 readiness architecture | PASS (defined) | Current published reference and revision warning recorded; certificate remains OPEN. |
| ISO/IEC 20000-1 readiness architecture | PASS (defined) | Target/reference recorded; independent certificate remains OPEN. |
| Asset/risk/control/supplier registers | PASS (defined) | Schema and review expectations defined. |
| Incident/access/training/vulnerability registers | PASS (defined) | Schema and review expectations defined. |
| Backup/change/exception registers | PASS (defined) | Schema and review expectations defined. |
| Management review/internal audit/corrective action | PASS (defined) | Governance cycle defined. |
| Secure client portal | PASS (architecture only) | Security standard/release gate defined; deployed portal not claimed. |
| Measurable service standards | PASS (gated) | Unsupported SLAs prohibited; contractual commitments remain engagement-specific. |
| Professional liability / E&O evidence | OPEN EVIDENCE | No authoritative policy/certificate supplied. |
| Cyber liability evidence | OPEN EVIDENCE | No authoritative policy/certificate supplied. |
| Actual certification/attestation | OPEN EVIDENCE | No certificate/SOC report supplied in the repository workstream. |
| Operating effectiveness of recurring controls | OPEN/PARTIAL EVIDENCE | Requires real operating records over the applicable period. |

## Audit conclusion

Phase 5 is implementation-complete as an enterprise-readiness framework. It does not convert planned standards into achieved certifications, written policies into operating effectiveness, or desired insurance into actual coverage.

The cumulative branch must receive a final cross-phase regression, browser, external-reference and claim-boundary audit before it is eligible to merge into `main`.
