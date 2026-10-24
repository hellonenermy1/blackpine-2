# Blackpine Security Evidence Register

This document defines the metadata required for control evidence. The actual evidence repository must be access-controlled and must not be this public GitHub repository when evidence contains sensitive information.

## Required evidence record fields

Each evidence item should record:

- Evidence ID
- Related control ID(s)
- Evidence title
- System or process in scope
- Evidence owner
- Collection date
- Period covered
- Source / system of record
- Reviewer
- Review date
- Result: supports control / exception / gap / not applicable
- Expiry or next-review date where relevant
- Sensitivity classification
- Controlled storage location
- Related remediation or exception ID where relevant

## Evidence quality rules

Evidence should be:

1. **Relevant** — it demonstrates the specific control or requirement being assessed.
2. **Current** — it covers the period required by the control cadence.
3. **Attributable** — the source and accountable owner are known.
4. **Complete enough** — it is not a screenshot fragment that removes the context needed to interpret it.
5. **Protected** — access is limited according to sensitivity and client obligations.
6. **Repeatable** — another authorized reviewer can understand how the evidence was produced.

## Example evidence index

| Evidence ID | Control | Description | Expected cadence | Repository status |
|---|---|---|---|---|
| EV-IAM-01 | IAM-01 | MFA policy/configuration evidence and exceptions | Quarterly | NOT STORED HERE |
| EV-IAM-04 | IAM-04 | Completed access review and follow-up actions | Quarterly | NOT STORED HERE |
| EV-END-01 | END-01 | Managed-device and encryption compliance evidence | Quarterly | NOT STORED HERE |
| EV-LOG-01 | LOG-01 | Log-source/retention review | Quarterly | NOT STORED HERE |
| EV-BAK-01 | BAK-01 | Representative restoration test | At least annually | NOT STORED HERE |
| EV-IR-01 | IR-01 | Incident record and post-incident actions | Per incident | NOT STORED HERE |
| EV-IR-02 | IR-02 | Tabletop exercise record | At least annually | NOT STORED HERE |
| EV-DATA-02 | DATA-02 | Approved secure-exchange method for engagement | Per sensitive engagement | NOT STORED HERE |
| EV-RET-01 | RET-01 | Retention/deletion record | Per trigger | NOT STORED HERE |
| EV-SUP-01 | SUP-01 | Supplier security review | Before use / periodic | NOT STORED HERE |
| EV-SEC-01 | SEC-01 | Security-training completion | Annual / onboarding | NOT STORED HERE |
| EV-BCM-01 | BCM-01 | Continuity/recovery exercise record | Annual | NOT STORED HERE |
| EV-GOV-01 | GOV-01 | Reviewed security risk register | Quarterly | NOT STORED HERE |

## Review rule

A control cannot be represented publicly as independently verified merely because evidence exists. Independent assurance requires an appropriate external reviewer and a scope that actually covers the claim being made.
