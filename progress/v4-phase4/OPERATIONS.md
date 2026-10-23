# V4 Phase 4 — Operational Reality Gates

Phase 4 treats operational marketing claims as release requirements, not copywriting assumptions.

## Emergency Response / Hotline

Source status:
- Blackpine Emergency Response remains a public problem-first route.
- The public contact form states that it does not confirm immediate response.
- Incident Response does not represent the public website as a 24/7 emergency service.
- `Cybersecurity Emergency Hotline` remains in the internal capability registry as a user-declared business capability.

Publication control applied in Phase 4:
- operational state: `CONTRACT_DEPENDENT`
- publication state: `NOT_PUBLIC`
- the public Emergency Response page must not render the hotline capability while those states remain in effect.

Release requirement before the hotline can be published:
- evidenced monitored emergency contact channel;
- defined coverage and activation process;
- named operational ownership/escalation path;
- approved wording for any coverage or response commitment.

Do not invent a telephone number, 24/7 coverage, response SLA, guaranteed response, or response time.

Current source/publication status: **PASS — unproven hotline wording is withheld from public output.**
Operational hotline launch status: **NOT YET EVIDENCED; capability remains contract-dependent/non-public.**

## Response Retainer

Public wording is acceptable only while it remains bounded:
- pre-established response relationship;
- reduced contracting/environment-discovery friction;
- exact coverage, response windows, priority, activation, access, unused capacity and SLA terms belong in the written agreement.

Do not publish a specific SLA or guaranteed priority response until the contractual/operating basis exists.

Current source wording: **PASS WITH PRODUCTION CONTRACT CHECK REQUIRED.**

## Managed Security / MDR

Public wording defines managed security as an agreed recurring relationship and does not imply universal 24/7 SOC coverage.

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

Current source wording explicitly avoids 24/7, continuous-monitoring and guaranteed-containment claims.

Current source wording: **PASS WITH PRODUCTION SERVICE-DEFINITION CHECK REQUIRED.**

## Security Desk

The public Security Desk route is an intake/routing model for everyday questions such as suspicious email, MFA prompts and ambiguous alerts. It explicitly rejects malware samples, secrets, confidential evidence and sensitive incident material through public intake.

Production release must still verify the actual submission/response process and escalation ownership.

Current source wording: **PASS WITH POST-DEPLOY WORKFLOW CHECK REQUIRED.**

## Form processing

The source includes a static Netlify-compatible form and direct-email fallback. Netlify Form Detection must be enabled on production. Production release must prove the deployed host accepts a safe non-sensitive test submission and that the intended operational recipient/process receives or handles it. Source markup alone is not proof.

Current status: **BLOCKED UNTIL DEPLOYED TEST.**

## Browser evidence

Phase 4 adds a dependency-free rendered-browser audit to CI:
- Chrome/Chromium desktop, tablet and 320 CSS px reflow checks;
- keyboard skip-link order;
- Ctrl+K search open/focus/close/focus-return behavior;
- mobile navigation state and Escape focus return;
- intent-aware contact routing;
- smart 404 routing;
- Firefox rendered smoke screenshot;
- browser screenshots and machine-readable audit output retained as a short-lived workflow artifact.

Safari/WebKit and real mobile-device behavior remain a manual/device production-release check where no equivalent automated environment is available.

## Separate surfaces

Corporate site, Cipher, Verify and Support remain separate trust/execution surfaces. Ordinary navigation links are allowed; runtime JavaScript must not silently call across those origins.

Current source controls: **PASS.**
Live cross-origin/header behavior: **BLOCKED UNTIL PRODUCTION VERIFICATION.**
