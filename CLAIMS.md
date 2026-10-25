# Blackpine public claim controls

This file defines broad publication controls, not marketing copy. The production website may state only claims that are approved for public use and supported by the operating reality of Blackpine Cybersecurity.

For material public claims, the canonical Phase 5 evidence decisions are maintained in `governance/PUBLIC_CLAIM_REGISTER.json` under `governance/PUBLIC_CLAIM_EVIDENCE_STANDARD.md`. `governance/PUBLIC_CLAIM_PUBLICATION_MAP.json` records the public routes where each material claim, qualifier, or not-public boundary appears. These files supplement this control rather than weakening any restriction below.

## V4 release status — 25 October 2026

Approved baseline statements:

- Blackpine Cybersecurity is Canada-based.
- Customers may start with the problem they are experiencing rather than selecting a technical discipline.
- Public website inquiries do not create a professional engagement.
- Scope and authorization are confirmed before security work begins.
- Public intake does not confirm immediate response, a response SLA, or around-the-clock availability.
- The public inquiry path is not an approved channel for passwords, private keys, regulated records, full log exports, confidential client files, malware samples, or sensitive incident evidence.
- The corporate site, Blackpine Cipher, Verify, and Support are separate public technical surfaces.
- The inspected corporate website baseline does not load third-party analytics, advertising networks, tag managers, remote fonts, or externally hosted imagery.
- The six public customer-entry routes are Emergency Response, Investigate, Recover, Protect, Monitor, and Security Desk.
- Blackpine On-Demand, Response Retainer, and Managed Security are separate engagement models whose exact commitments are defined in writing.
- Public capability publication is controlled separately from the internal user-declared capability registry.

## Phase 2 security-evidence boundary — 25 October 2026

The current source/build evidence additionally supports these narrowly defined technical statements about the corporate-site baseline:

- The primary browser preference record is first-party `blackpine.preferences.v1`; the legacy `blackpine-theme` key is migration/cleanup-only under the current runtime.
- The contact composer does not deliberately persist inquiry fields in browser storage and does not transmit them through a website `fetch`, XHR, WebSocket, EventSource, or beacon path.
- The executable corporate-site runtime has one reviewed `fetch()` path for the same-origin local search index; conservative prefetching is also restricted to same-origin allowlisted routes.
- Generated production HTML/CSS does not load third-party executable code, remote fonts, or remote subresources under the current audited build.
- Current production output does not include source maps or the repository's source, scripts, governance, progress, audit, package, or build-configuration files.

These are source/build claims. Statements about headers actually observed on the canonical public response, CDN behavior, DNS, TLS, or an exact production deployment still require deployment/live evidence for the commit being discussed; repository configuration alone is not proof that a host served it.

## Contract-dependent / non-public capability

`Cybersecurity Emergency Hotline` remains recorded as a user-declared Blackpine capability, but V4 does not publish it as a live public offering until the operating model is evidenced.

Current publication control:

- operational state: `CONTRACT_DEPENDENT`
- publication state: `NOT_PUBLIC`

Before it can be made public, Blackpine must confirm the monitored contact channel, coverage model, activation process, ownership, escalation path, and any response commitment that the website would state.

This control does not remove the business capability. It prevents the website from advertising an operational hotline that the release evidence does not yet prove.

## Restricted claims

The following remain unpublished unless the specific claim is supported by current evidence and separately approved for the intended public wording:

- certifications, attestations, audits, or compliance claims not actually held;
- insurance statements not approved for publication;
- client names, logos, testimonials, case studies, or quantitative outcomes without permission and evidence;
- partner or vendor status that is not current;
- office, city, province, or global-presence claims beyond approved public wording;
- a public emergency-hotline number or hotline availability until the operating model is confirmed;
- 24/7 or equivalent coverage claims without confirmed staffing/coverage and written service terms;
- response-time or SLA commitments not contained in the applicable service terms;
- guaranteed priority response, guaranteed containment, or guaranteed recovery;
- continuous/always-on monitoring claims without confirmed telemetry, staffing, escalation, and response ownership;
- real-time dark-web monitoring claims without a real source/provider and defined process;
- team-size, biography, hiring, or qualification claims that are not current;
- release-specific Blackpine Cipher cryptographic or performance claims that are not traceable to current project documentation and tests.

## Prohibited language without exceptional evidence

- “unbreakable”
- vague “military-grade” quality claims
- “world-class”
- fake ratings or review counts
- fabricated breach statistics
- invented client or partner logos
- invented offices or global presence
- decorative dashboards presented as real client metrics

When a material claim changes, update its Phase 5 claim record and publication mapping in the same pull request as the public wording and corresponding release gate.
