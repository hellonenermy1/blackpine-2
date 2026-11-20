# Private portal API — Phase 1 implementation slice

This code is a **non-deployed staging prototype**. It is intentionally not imported by the existing corporate website.

### Implemented
- Cloudflare Access RS256 JWT checks via WebCrypto with configured JWKS, exact issuer, audience, expiry, optional nbf/iat and kid.
- Server-side tenant membership and per-operation role checks.
- Scoped GET /api/v1/me, GET /api/v1/tenants/:tenant/engagements, GET /api/v1/tenants/:tenant/engagements/:id/findings.
- Scoped POST /api/v1/tenants/:tenant/engagements for **DRAFT only**, with exact same-origin mutation requirement, bounded JSON payload, strict fields, transactional engagement+audit D1 batch.
- No CORS wildcard, no cookie authorization shortcut, generic no-store errors, fixed request/response security headers.

### Design tradeoffs / remaining risks
- JWKS fetched for each request (fail-closed). Optimize with bounded cache only after tests; outages cause auth unavailability.
- This does **not** implement user provisioning, interactive login, MFA policy administration, approved engagement activation, evidence storage, reports, data export, or protected UI.
- Tenant membership must be provisioned by trusted administrator processes; this API does not create users or grant roles.
- Application routes need staging security QA and real Cloudflare Access configuration before any customer traffic.
- No D1 schema has been migrated and no Cloudflare Worker deployed by these commits.
- Database connection is bound as `DB`; AUTH_ISSUER, AUTH_AUDIENCE, AUTH_JWKS_URL, and PORTAL_ORIGIN must be configured through a reviewed private deployment.
- If Access is unavailable without a credit card in the target account, **do not bypass authentication**. Use another properly verified identity system in a separate implementation before launching.
- This initial draft API cannot operate as a complete portal. No change to the public marketing site or service availability claims.

### Local test
```bash
node expansion/phase1/tests/check-portal.mjs
```
