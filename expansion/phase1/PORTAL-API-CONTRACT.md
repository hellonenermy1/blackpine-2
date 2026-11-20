# Phase 1 portal API contract — design only, not exposed or deployed

Auth on every route: verified server-side subject, active membership and required role. Never trust caller-supplied tenant ID as proof of authority. All resource identifiers must be resolved against the authorized tenant, including relationships, list filtering and exports.

## Proposed endpoints (all under /api/v1)
| Method | Route | Minimum role | Enforcement |
|---|---|---|---|
| GET | /me | active member | return membership and permitted tenants only |
| GET | /catalogue | active member | internally defined offers; no implicit public release |
| GET, POST | /engagements | VIEWER / ENGAGEMENT_LEAD | mandatory server-derived tenant scope; create DRAFT only |
| GET, PATCH | /engagements/:id | VIEWER / ENGAGEMENT_LEAD | verify tenant ownership; status transition graph |
| POST | /engagements/:id/authorize | OWNER / ENGAGEMENT_LEAD | signed scope ref, explicit authorization date, immutable approved scope snapshot |
| GET, POST | /engagements/:id/assets | VIEWER / ASSESSOR | verify asset in same authorized engagement |
| GET, POST | /engagements/:id/findings | VIEWER / ASSESSOR | only scoped assets and engagement; restricted evidence refs |
| PATCH | /findings/:id | ASSESSOR / REVIEWER | closure requires independently reviewed retest evidence |
| POST | /findings/:id/actions | ENGAGEMENT_LEAD | write owner and due date; log change |
| POST | /engagements/:id/approvals | OWNER / ENGAGEMENT_LEAD | immutable decision event; no self-approval on critical changes |
| GET | /engagements/:id/report | VIEWER | re-authorize access to all referenced data; redaction |
| GET | /audit-events | OWNER / REVIEWER | strict tenant filtering, bounded pagination |

**Not covered by this contract:** credential upload, executable scanning, file evidence upload, public form submission, webhook ingestion, customer chat or realtime 24/7 monitoring. Add only after explicit separate designs and tests.

## Response/error and privacy rules
- Typed JSON request schemas; reject unknown keys, oversize arrays/body, unsafe URLs, invalid state transitions.
- Deny unauthenticated requests with 401; unauthorized tenant/resource access should generally return 404 to prevent enumeration.
- Do not expose stack traces, SQL errors, secrets or raw customer evidence.
- Mutations require approved origins, CSRF protection appropriate to session design, idempotency keys where retries can duplicate work and audit event recording.
- Scope changes require reauthorization; approved engagement scope must not be silently expanded.
- API returns no long-lived signed evidence URLs by default. All export/report operations require fresh authorization.
- Paginate/filter server-side; cap query complexity and response size.
- Explicitly test simultaneous tenant actions, ID swapping, stale/revoked sessions, approval races, duplicate requests and error logging.

## Test gate before any portal production deployment
1. Unauthenticated no data; verified members access only their tenant.
2. Owner/lead/reviewer/assessor/viewer permissions tested for every endpoint.
3. Cross-tenant nested IDs, exports, reports and approval routes denied.
4. Revoked membership/session fails instantly within documented cache bounds.
5. Authorization, in-scope asset and change gates cannot be bypassed.
6. Payload and pagination limits hold under hostile input.
7. Audit contains successful and denied sensitive mutations without raw secrets.
8. Database backup/restore and encryption key recovery demonstrated.
9. CSP, session cookies, CORS, CSRF, secrets and environment separation verified.
10. Existing static corporate-site regression suite stays green.
