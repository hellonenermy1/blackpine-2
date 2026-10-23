# V4 Phase 4 — Operational Reality Gates

Phase 4 treats operational marketing claims as release requirements, not copywriting assumptions.

## Emergency Response / Hotline

Source status:
- Blackpine Emergency Response is a public problem-first route.
- The public contact form states that it does not confirm immediate response.
- Incident Response states that the website is not a 24/7 emergency service.
- The capability registry includes `Cybersecurity Emergency Hotline` as a user-declared offering.

Release requirement:
- Before production release of the **hotline** wording, Blackpine must have an evidenced monitored emergency contact channel and defined coverage/activation process.
- Do not invent a telephone number, 24/7 coverage, response SLA, guaranteed response, or response time.
- If the operating model is not confirmed, the release must either keep the hotline capability non-public or use wording that accurately describes the actual intake channel. That decision requires user approval; Phase 4 does not silently redefine the service.

Current status: **BLOCKED — operational evidence not present in the repository or current Phase 4 evidence set.**

## Response Retainer

Public wording is acceptable only while it remains bounded:
- pre-established response relationship;
- reduced contracting/environment-discovery friction;
- exact coverage, response windows, priority, activation, access, unused capacity and SLA terms belong in the written agreement.

Do not publish a specific SLA or guaranteed priority response until the contractual/operating basis exists.

Current source wording: **PASS WITH PRODUCTION CONTRACT CHECK REQUIRED.**

## Managed Security / MDR

Public wording must define managed security as an agreed recurring relationship, not imply universal 24/7 SOC coverage.

Production contract/service definition must establish, where applicable:
- supported endpoint/security products;
- telemetry sources;
- alert ownership;
- triage/escalation responsibility;
- response authority;
- monitoring/review cadence;
- reporting cadence;
- customer responsibilities;
- coverage hours and exclusions.

Current source wording explicitly avoids 24/7, continuous monitoring and guaranteed containment claims.

Current source wording: **PASS WITH PRODUCTION SERVICE-DEFINITION CHECK REQUIRED.**

## Security Desk

The public Security Desk route is an intake/routing model for everyday questions such as suspicious email, MFA prompts and ambiguous alerts. It must not imply that the public website accepts malware samples, secrets, confidential evidence or regulated records.

Production release must verify the actual submission/response process and escalation ownership.

Current source wording: **PASS WITH POST-DEPLOY WORKFLOW CHECK REQUIRED.**

## Form processing

The source includes a static Netlify-compatible form and direct-email fallback. Production release must prove the actually deployed host accepts a safe non-sensitive test submission and that the intended operational recipient/process receives or handles it. Source markup alone is not proof.

Current status: **BLOCKED UNTIL DEPLOYED TEST.**

## Separate surfaces

Corporate site, Cipher, Verify and Support remain separate trust/execution surfaces. Ordinary navigation links are allowed; runtime JavaScript must not silently call across those origins.

Current source controls: **PASS.**
Live cross-origin/header behavior: **BLOCKED UNTIL PRODUCTION VERIFICATION.**
