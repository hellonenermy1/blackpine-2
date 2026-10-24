# Phase 2 — Trust Center & Governance Audit

Date: 2026-10-24

Scope: public Trust Center coverage, security/privacy assurance boundaries, subprocessors/service-provider disclosure, continuity, incident-response governance, retention, security contacts, due-diligence support, security FAQ, control definition, and evidence governance.

## Implemented in Phase 2

### Public Trust Center

Added dedicated public pages for:

- Privacy & Information Handling
- Compliance & Assurance Status
- Subprocessors & Service Providers
- Business Continuity
- Incident Response Governance
- Data Retention & Deletion
- Security & Company Contacts
- Security Reviews & Assurance Requests
- Security FAQ

The pre-existing Security Practices, Client Data Handling, Responsible Disclosure, and Website Security pages remain part of the Trust Center.

### Governance baseline

Added a public-safe governance framework containing:

- security control register;
- evidence register and evidence-quality rules;
- incident-response governance standard;
- client-data handling standard;
- explicit status semantics distinguishing DEFINED, IMPLEMENTED, OPERATING, VERIFIED, and OPEN.

The governance framework explicitly states that a written policy does not prove a control operates effectively.

### Automated verification

Added `scripts/check-phase2-trust.mjs` to the normal `npm run check` pipeline. It validates the new Trust Center routes, required governance artifacts, minimum control-register coverage, and absence of unsupported certification claims on the assurance page.

## Phase 2 control baseline

The control register defines 21 control objectives across:

- MFA and privileged access;
- joiner/mover/leaver access lifecycle;
- periodic access review;
- endpoint management;
- security logging;
- backup and restoration testing;
- incident response and tabletop exercises;
- client-data minimization, secure exchange, and access;
- retention/deletion;
- supplier security;
- vulnerability management;
- controlled production change;
- security awareness;
- business continuity and alternate communications;
- risk and exception management.

All controls begin at **DEFINED** unless operational evidence supports a higher state. No control has been promoted to IMPLEMENTED, OPERATING, or VERIFIED merely because a policy was written.

## Acceptance matrix

| Requirement | Status | Evidence / limitation |
|---|---|---|
| Central Trust Center | PASS (code) | Expanded `/trust/` index and navigation. |
| Security practices | PASS (public baseline) | Existing page retained. Operational-control claims remain evidence-gated. |
| Privacy | PASS (public documentation) | Trust summary + existing legal Privacy Policy. Legal review remains separate. |
| Data handling | PASS (defined) | Public data-handling page + governance standard. Operational evidence remains private/evidence-gated. |
| Subprocessor/service-provider disclosure | PARTIAL | Cloudflare Pages is disclosed from confirmed site architecture. Engagement-specific providers require confirmed vendor data. |
| Business continuity | PASS (defined) | Public principles + BCM controls. No invented RTO/RPO commitments. |
| Incident-response program | PASS (defined) | Public governance page + internal standard + exercise requirement. Operating evidence is still required. |
| Data retention/deletion | PASS (defined) | Purpose/contract-based model; no invented universal retention period. |
| Security contacts | PASS | General, security, and careers routes documented. |
| Assurance/compliance status | PASS | Explicit readiness-vs-certification boundary; no unsupported ISO/SOC claim. |
| Security due-diligence request path | PASS | Public information first; controlled evidence for sensitive assurance material. |
| Security FAQ | PASS | Common security-review questions answered without unsupported claims. |
| Control register | PASS (defined) | 21 control objectives with evidence and cadence expectations. |
| Evidence register | PASS (defined) | Evidence metadata/quality standard created; sensitive evidence prohibited from public repo. |
| MFA / privileged controls actually operating | OPEN EVIDENCE | Requires real configuration and review evidence. |
| Managed endpoints / disk encryption actually operating | OPEN EVIDENCE | Requires device-management evidence. |
| Quarterly access review actually operating | OPEN EVIDENCE | Requires repeated completed review records. |
| Backup restoration testing actually operating | OPEN EVIDENCE | Requires restore-test evidence. |
| Annual incident tabletop actually operating | OPEN EVIDENCE | Requires completed exercise record. |
| Security training actually operating | OPEN EVIDENCE | Requires completion evidence. |
| Supplier reviews actually operating | OPEN EVIDENCE | Requires confirmed supplier register and review records. |

## Items intentionally not claimed

Phase 2 does **not** claim:

- ISO/IEC 27001 certification;
- SOC 2 Type II completion;
- ISO/IEC 27701 certification;
- ISO 22301 certification;
- ISO/IEC 20000-1 certification;
- 24/7 incident-response availability;
- fixed RTO/RPO values;
- universal fixed data-retention periods;
- audited operation of the control register;
- a complete subprocessor list where supplier information has not been confirmed.

## Security design observation

The governance evidence itself can be sensitive. Actual screenshots, identity exports, client records, audit evidence, incident files, credentials, internal recovery procedures, and infrastructure details must not be committed to the public website repository. The public repository defines the control model; sensitive operating evidence belongs in a controlled evidence store.

## Audit conclusion

**Phase 2 is implementation-complete for the public Trust Center and governance framework.** It deliberately remains **evidence-partial** for real-world operational controls. Those controls should move from DEFINED to IMPLEMENTED/OPERATING only after Blackpine has retained objective evidence.

This branch remains unmerged. Per project instruction, `main` must not receive the cumulative credibility-roadmap work until all five phases are complete and the final cross-phase audit passes.
