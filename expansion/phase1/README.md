# Blackpine 30-Service Expansion — Phase 1 foundation

**Current state:** IMPLEMENTATION IN PROGRESS — NOT DEPLOYED.

## Confirmed starting point
- Corporate source: `hellonenermy1/blackpine-2`, static Cloudflare Pages website.
- Preserve the public site's existing six problem-first entry routes, service/publication claim controls, i18n, CSP and browser tests.
- Keep Cipher, Verify and Support independent.
- No paid Cloudflare features, R2 or credit-card-dependent infrastructure assumed.

## Contents
- `service-catalogue.json`: all 30 research offers; proposed-only and not public.
- `migrations/0001_foundation.sql`: D1/SQLite data model; not deployed.
- `SECURITY-BOUNDARIES.md`: implementation gates and trust boundaries.
- `DELIVERY-WORKFLOW.md`: shared seven-stage work process.
- `TEMPLATES.md`: initial client and partner paperwork.
- `tests/`: offline source/schema integrity tests.

## Run local checks
```bash
node expansion/phase1/tests/check-catalogue.mjs
python3 expansion/phase1/tests/check-sqlite.py
```

## Research reconciliation
The report's summary on page 7 states 14 A / 12 B / 4 C. Individual service cards on pages 8–13 count to **17 A / 11 B / 2 C** when A/B mixed gates are represented by the primary advisory gate. These figures are inconsistent. The catalogue records the per-service card gates, not the summary aggregate. Service #15 is A for advisory and B for modifications; #19 is A for policy and B for door integrations. Neither the aggregate nor the per-card gate represents legal approval.

## Remaining Phase 1 delivery
1. Confirm live repository/deployment baseline and run old website regression checks.
2. Implement and independently test real portal identity verification, revocation, user membership, RBAC, CSRF/origin protections and cross-tenant API isolation.
3. Implement customer/engagement/findings APIs with explicit authenticated tenant scope and audited mutations.
4. Build a portal UI and approved evidence metadata/report workflow.
5. Establish safe restricted evidence storage, encryption key management, privacy retention/deletion and tested backup/restore.
6. Run staging smoke tests, recovery exercises, browser/security checks and actual deployment review.
7. Complete readiness gate, Québec legal/licensing determination, pilot and pricing checks before public service promotion.

No Phase 1 completion, operational service availability or production portal security is claimed by adding these files.
