# Blackpine Enterprise Assurance Crosswalk

Phase 5 readiness artifact.

This document maps Blackpine control domains across five assurance targets so one operating control environment can support multiple external reviews. It is an internal readiness aid, not a substitute for the licensed standards, legal advice, a certification-body interpretation, or a CPA firm's SOC 2 scoping decision.

## Reference targets recorded for the 2026 program

- ISO/IEC 27001:2022 with Amendment 1:2024 — ISMS requirements.
- SOC 2 Type II — AICPA Trust Services Criteria; planned baseline is Security, with Confidentiality considered where scope warrants it.
- ISO/IEC 27701:2025 — PIMS requirements and guidance.
- ISO 22301:2019 with Amendment 1:2024 — current published BCMS requirements at the time this artifact was created; a new edition is under development.
- ISO/IEC 20000-1:2018 with Amendment 1:2024 — SMS requirements.

Before a formal assessment begins, Blackpine must confirm the version, amendment, transition rules, scope and interpretation accepted by the selected certification body or CPA firm.

## Domain crosswalk

| Blackpine domain | ISO/IEC 27001 | SOC 2 | ISO/IEC 27701 | ISO 22301 | ISO/IEC 20000-1 | Blackpine evidence family |
|---|---|---|---|---|---|---|
| Governance & risk | Supporting | Supporting | Supporting | Supporting | Supporting | risk register, policies, management review, internal audit, corrective actions |
| Identity & access | Supporting | Supporting | Supporting | Context-dependent | Supporting | MFA policy/evidence, privileged-role inventory, access lifecycle, quarterly review |
| Information & privacy | Supporting | Supporting | Primary | Context-dependent | Supporting | classification, data inventory, minimization, access, retention/deletion, privacy records |
| Operations & change | Supporting | Supporting | Supporting | Supporting | Primary | change records, logging, vulnerability records, incident/service workflows |
| Supplier management | Supporting | Supporting | Supporting | Supporting | Supporting | supplier register, due diligence, data exposure, continuity dependency, exit plan |
| Continuity & recovery | Supporting | Supporting | Supporting | Primary | Supporting | BIA assumptions, service dependencies, backup/restore tests, exercises, recovery ownership |
| Service management | Supporting | Supporting | Context-dependent | Supporting | Primary | service catalogue, service ownership, request/incident/change records, service reporting |
| Assurance & improvement | Primary | Supporting | Supporting | Supporting | Supporting | metrics, audit findings, corrective actions, management review, independent evidence |

“Primary” and “Supporting” are planning labels only. They do not represent formal clause mappings or assessor conclusions.

## Evidence rules

1. A policy can establish a requirement but does not prove operation.
2. A one-time record can support implementation but does not prove a recurring control operated throughout an audit period.
3. Self-review does not equal independent verification.
4. Sensitive evidence must remain in controlled internal storage and must not be committed to this public repository.
5. Audit/certification claims require authoritative third-party evidence and exact scope.
6. If a control supports several frameworks, Blackpine should retain one authoritative evidence set and map it to multiple requirements rather than duplicate the process.
