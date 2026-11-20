# Blackpine Phase 1 — implementation handoff

Work branch: `feat/blackpine-expansion-phase1`  
Review: PR #48 (draft); do not merge as a production portal.

## Implemented in repository (not deployed)

1. 30-entry proposed-only service catalogue and report reconciliation.
2. D1 SQLite metadata model: tenants, memberships, services, engagements, assets, findings, actions, approvals, restricted evidence metadata, partners, work orders and audit log.
3. Automated catalogue, SQLite constraint and deterministic seed checks.
4. Staging SQLite in-memory snapshot/restore smoke check (NOT Cloudflare production restore).
5. Restricted portal JWT RS256 verification, issuer/audience/expiry checks and configured signing-key retrieval.
6. Tenant membership/role enforcement and fail-closed origin validation for mutations.
7. Private APIs for current memberships, tenant engagement listing, draft engagement creation, per-engagement findings reads and draft report export.
8. Transactional engagement creation and audit event via D1 batch.
9. Read-only authenticated landing view and safe confidential draft HTML report renderer.
10. Tests of forged/expired tokens, tenant-ID swapping, unsafe origin, invalid payload, HTML escaping and private report download.
11. Québec licensing and partner evidence requirements, engagement/evidence lifecycle, customer forms and draft API contract.
12. Independent PR CI workflow for the expanded foundation.

## Verified vs unverified

- Foundation GitHub Actions checks passed on commit `1601e3d3b7d8ba920148e1c495bbdc19a5904148`.
- Full corporate-site regression workflow may finish separately; check the exact current head commit rather than relying on older success.
- No Worker, Access app, D1 database or portal hostname has been provisioned.
- No real Cloudflare JWT or staging deployment has been tested.
- No customer data has been loaded. No sensitive evidence file upload is enabled.
- No public capability has been added to the existing website.
- No claims of 24/7 monitoring or licence approvals.

## Phase 1 exit blockers

A. Provision private staging Worker, verified identity app/MFA policy, D1 binding, team-member bootstrap and separate protected hostname.
B. Validate real Access JWT claims/JWKS under Cloudflare and review cache/rotation behavior.
C. Complete authorization-approval process and create authenticated APIs for scopes, assets, findings, actions, retests and reviewer approvals.
D. Implement hardened audit immutability/tamper detection, redaction, retention/deletion, key management, evidence handling and controls against duplicate mutations.
E. Build complete protected client and assessor interface (current view is read-only).
F. Exercise real Cloudflare D1 export/backup/restore and recovery, not just local SQLite snapshot.
G. Run customer-free staging penetration/security regression, browser QA and deploy exact audited commit to a private staging host.
H. Verify Québec service-specific regulatory/partner/insurance gates; do not publish new physical services prematurely.
I. Obtain required real pilot, licensing and customer-delivery evidence before commercial claims.

## Next recommended engineering slice

Implement explicit engagement authorization approvals and immutable authorized-scope snapshots, then findings/action lifecycle with reviewer roles and genuine portal UI. Keep public corporate site separate and do not use R2.
