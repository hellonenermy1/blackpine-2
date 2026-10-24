# Blackpine Client Portal Security Standard

Phase 5 architecture requirement. This standard defines the minimum controls required before a Blackpine client portal is approved for sensitive engagement material. It does not claim that such a production portal is already deployed.

## Required controls

1. MFA for customer and privileged administrator access.
2. Server-side authorization for every customer-scoped object and action.
3. Tenant-aware RBAC with least privilege and explicit engagement membership.
4. Separate privileged administration and controlled recovery paths.
5. Encrypted transport and controlled storage for customer files and reports.
6. Explicit retention, deletion, revocation and engagement-close workflows.
7. Audit logging for sign-ins, file access, exports, permission changes and administrative actions.
8. Session expiry, token/cookie protection, revocation and re-authentication for sensitive actions.
9. Secure report delivery with version state, access control and revocation/expiry where appropriate.
10. Secure messaging for sensitive material where practical, reducing ordinary email attachments.
11. Vulnerability management and dependency review for the portal itself.
12. Backup and representative restore testing.
13. Monitoring and incident-response integration.
14. Controlled deployment/change process and rollback plan.
15. Security testing covering authentication, authorization, tenant isolation and common web risks before production approval.

## Release gate

The portal must not be described as production-ready until evidence exists for:

- authentication and recovery behavior;
- authorization/tenant-isolation testing;
- security logging and alert ownership;
- backup/restore validation;
- vulnerability/dependency management;
- incident-response integration;
- retention/deletion behavior;
- controlled change and deployment;
- data-flow and supplier review.

Sensitive evidence produced by these checks belongs in controlled internal storage, not the public repository.
