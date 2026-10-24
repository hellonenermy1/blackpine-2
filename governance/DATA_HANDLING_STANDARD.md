# Blackpine Client Data Handling Standard

## Purpose

Define the minimum governance requirements for client and prospect information handled by Blackpine.

## Principles

1. **Defined purpose** — collect information only for a documented business, security, legal, or engagement purpose.
2. **Minimum necessary** — request only the data and access reasonably required for the agreed work.
3. **Authorized exchange** — establish the approved transfer method and authorized recipients before sensitive evidence is exchanged.
4. **Least access** — limit access to people who need the information for the engagement or required support functions.
5. **Separation** — do not use public website intake as a general channel for credentials, private keys, regulated records, full log exports, malware samples, or confidential evidence.
6. **Retention by requirement** — retention must reflect written engagement terms, legal obligations, security needs, and business-record requirements rather than an invented universal period.
7. **Controlled deletion** — deletion should be performed and recorded when the applicable requirement or approved request calls for it, subject to legal holds, backups, and contractual obligations.
8. **No unsupported secondary use** — customer information must not be repurposed for marketing claims, public research, training datasets, or AI/model training unless that use is explicitly authorized and legally appropriate.

## Engagement intake

Before requesting sensitive material, the engagement owner should identify:

- the information needed;
- why it is needed;
- sensitivity and applicable contractual/legal requirements;
- authorized Blackpine recipients;
- approved transfer/storage method;
- expected retention or deletion trigger;
- whether credentials or privileged access are required and, if so, how they will be controlled.

## Credentials and secrets

Passwords, MFA secrets, API keys, private keys, recovery codes, and equivalent secrets should not be sent through the public contact flow. When an engagement genuinely requires temporary privileged access, the access method, scope, owner, expiry/revocation process, and handling requirements should be agreed before use.

## Reports, screenshots, logs, and evidence

Assessment and incident-response material can reveal vulnerabilities, identities, system names, network information, business processes, or personal information. Access and distribution should follow the engagement scope and sensitivity of the material. Public examples must use fictional or properly sanitized data and must not expose client information without permission.

## Retention and deletion

Each engagement should identify the applicable retention rule or trigger. Where early deletion is requested, Blackpine should evaluate the request against contractual terms, legal obligations, security needs, backup behavior, and record-keeping requirements, then record the decision and completion where applicable.

## Public-repository boundary

Do not commit client evidence, credentials, personal data, confidential contracts, internal access records, incident evidence, or security-sensitive infrastructure details to this public repository.

## Assurance boundary

This standard defines requirements. It does not prove that every control is implemented or operating effectively. Operational evidence belongs in the controlled evidence system described by `EVIDENCE_REGISTER.md`.
