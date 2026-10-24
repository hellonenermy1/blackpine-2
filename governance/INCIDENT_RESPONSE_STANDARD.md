# Blackpine Incident Response Standard

## Purpose

Define the governance baseline for security incidents affecting Blackpine systems, information, identities, services, or client data handled by Blackpine.

## Lifecycle

1. **Detect and record** — capture the observable condition, time, affected service or identity, reporter, and available evidence.
2. **Triage and escalate** — determine severity, business impact, ownership, required specialists, and whether ordinary communication channels remain safe.
3. **Preserve evidence** — protect relevant logs, alerts, configuration state, messages, timestamps, and other authorized evidence before avoidable changes destroy context.
4. **Contain** — limit ongoing harm using the least destructive action that is appropriate to the incident and operational risk.
5. **Investigate** — establish the timeline, affected identities/systems, actions taken, persistence, data exposure where determinable, and known limitations.
6. **Notification assessment** — identify contractual, legal, regulatory, insurance, customer, or other notification obligations with appropriate qualified input where required.
7. **Eradicate and recover** — remove persistence, rotate affected credentials/keys where required, restore trustworthy service, verify recovery, and monitor for recurrence.
8. **Post-incident review** — document root/contributing causes, control failures, what worked, unresolved uncertainty, remediation owners, and due dates.

## Required incident record

Material incidents should have an incident identifier and record:

- detection time and source;
- incident owner;
- severity and rationale;
- systems and information known to be affected;
- material decisions and timestamps;
- evidence preserved;
- containment and recovery actions;
- notification decisions;
- remaining uncertainty;
- remediation actions, owners, and target dates;
- closure approval.

## Communications

If the normal identity, mailbox, collaboration platform, or device may be compromised, responders should use a pre-established alternate communication route appropriate to the sensitivity of the incident.

## Evidence handling

Incident evidence may contain customer information, credentials, personal information, security-sensitive configuration, or legal material. It must not be committed to the public repository. Collection and access should follow authorization, minimization, confidentiality, and chain-of-custody requirements appropriate to the engagement or incident.

## Exercises

Blackpine should conduct an incident-response tabletop at least annually and after material changes to the response process. The exercise must record participants, scenario, decisions, gaps, action owners, and follow-up status.

## Public-claim boundary

This standard defines a process. It does not establish 24/7 response availability, a contractual response-time commitment, regulatory compliance, or independent verification. Those claims require separate supporting evidence and, where applicable, written customer terms.
