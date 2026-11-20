# Phase 1 portal security contract

The existing corporate website remains **static and separate**. Nothing in this directory is served publicly by default. Cipher, Verify and Support remain separate trust boundaries. The 30-service catalogue does not imply 30 available services.

## Preconditions before connecting any customer

1. Deploy authenticated portal on a separate hostname and Worker, never as an unauthenticated Pages API.
2. Verify identity on every request. An HTTP header supplied by the browser is NOT authentication. If using Cloudflare Access, validate Access JWT server-side, its issuer, audience, signature and expiry; otherwise use a reviewed first-party MFA-capable session architecture.
3. Resolve tenant membership from server-side records based on verified subject. Ignore client-supplied tenant authority. Every read, update and relationship must be tenant constrained.
4. Enforce roles and engagement-specific permissions on the server. UI hiding is not authorization.
5. Require recorded written authorization and explicit asset scope before any scan, technical change or site investigation.
6. Mutating browser requests require origin validation and appropriate CSRF controls. Session cookies must be Secure, HttpOnly and SameSite with short expiry and revocation.
7. Apply request/body limits, schema validation, rate limits, abuse controls, and centrally safe error handling.
8. Treat customer evidence as restricted: do not put raw secrets, recordings, logs or personal data in the public repository, routine Worker logs or unsecured D1 rows.
9. D1 is suitable for metadata and bounded records, not raw CCTV/video, forensic disks or large evidence. Choose a separately approved restricted evidence store only when needed and available. No R2 or credit-card-dependent services are assumed.
10. Encryption keys must not be hard-coded or committed. Design key rotation, recovery and separation of duties.
11. Audit records must be append-only through server permissions/logic, with tamper detection and review; an ordinary writable SQL table alone is NOT append-only.
12. Establish retention, deletion, export, backups and an actually tested restoration process before production.
13. Keep work environments separate. Require change approval, test evidence, staging and rollback plans.
14. No emergency hotline, 24/7 SOC, regulated installation, qualified penetration-testing, cryptography certification or legal compliance guarantee is enabled by code alone.
15. License and insurance confirmation must precede regulated Québec physical-security activity.
16. Public claims require separate capability-readiness approval and evidence, not a catalogue flag changed without review.

## Integration release gates

- Authenticated user A cannot read, enumerate or mutate tenant B information (including nested finding/asset/work-order relationships).
- Revoked session and membership fail closed. Unauthorized requests leave no side effects.
- A finding cannot reference a foreign tenant's engagement or asset.
- A finding cannot be closed without verified retest; authorization is required for engagement activation.
- Validated backups can actually be restored; stale keys and sessions are rejected.
- Public corporate-site routes, CSP, inquiry behavior, translations and build budgets remain unchanged.
