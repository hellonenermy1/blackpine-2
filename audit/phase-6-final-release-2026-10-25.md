# Phase 6 Final Release Audit — 2026-10-25

## Scope

Phase 6 is the final release-validation phase of the six-phase Blackpine production audit. It starts from production `main` commit `10ab205c707ab6952d7a66992e9402361d28e2b3`, the signed Phase 5 merge.

This phase does not redesign the website. It verifies whether the reviewed build is actually the release being served, whether live hosting behavior matches the documented security/deployment policy, and which remaining browser/device/governance items can or cannot be proven.

## Acceptance model

Phase 6 separates seven evidence classes:

1. source/build;
2. deployment status;
3. live origin;
4. browser engine;
5. manual/physical device;
6. repository governance;
7. historical performance.

A passing source check or hosting deployment badge is not treated as live-origin evidence.

## Implemented in Phase 6

- Added `governance/RELEASE_EVIDENCE_STANDARD.md`.
- Added `governance/RELEASE_EVIDENCE_REGISTER.json`.
- Added `scripts/check-phase6-release.mjs` and wired it into the structural release gate.
- Added `scripts/check-live-production.mjs` and `npm run check:live`.
- Added `scripts/check-www-canonical.mjs` for deep-path and query-string preservation on the canonical-host redirect.
- Added a GitHub Actions `live-production-audit` job.
- Pull requests and scheduled/manual runs test the current canonical production invariants.
- Pushes to `main` additionally require exact generated HTML match between the merged build and representative canonical production routes, with bounded retry for deployment propagation.
- The live audit verifies TLS authorization/certificate lifetime, HTTP/2, apex/`www`, representative routes, real 404 behavior, required legacy redirects, deployed security headers/CSP, robots/sitemap/security.txt, immutable build caching, mutable search-index caching, contact-surface constraints, and Cipher/Verify/Support reachability/separation.
- Added `governance/CLOUDFLARE_CANONICAL_HOST_CONTROL.md` for the host-level `www` to apex control that cannot be implemented by a Pages `_redirects` rule.
- Added a release sign-off record that distinguishes observed PASS evidence from post-merge, manual, governance, and unavailable-historical items.

## Phase 6 findings

### P6-001 — FIXED — no independent live-origin release gate

Before Phase 6, Blackpine had strong source/build, browser, deployment-status and external-link checks, but no release gate that independently requested the canonical production origin and compared live behavior with the approved policy.

Phase 6 adds a dedicated live-production CI job. On pushes to `main`, it also compares representative public HTML byte-for-byte with the locally generated release after bounded deployment-propagation retries.

### P6-002 — FIXED / VERIFIED — canonical `www` redirect

The first GitHub-runner live audit found `https://www.blackpinecybersecurity.com/` serving HTTP 200 instead of redirecting to the apex.

The required fix was correctly applied at the Cloudflare zone/account layer rather than faked in Pages `_redirects`.

A fresh external GitHub-runner validation then passed both:

- the full Phase 6 live-production audit, including apex/`www` behavior; and
- the deep-path canonical-host test proving path and query-string preservation.

The successful job explicitly reported:

`Phase 6 live-production audit passed for https://blackpinecybersecurity.com: TLS, HTTP/2, apex/www, representative routes, real 404, legacy redirects, deployed security headers, metadata endpoints, cache policy, contact surface and cross-domain reachability.`

and:

`Phase 6 deep-path canonical-host check passed: www redirects to apex while preserving path and query string.`

`LIVE-004` is therefore VERIFIED. Final post-merge live-origin proof is still required for the exact Phase 6 merge commit.

### P6-003 — FIXED — Verify bare-root response was initially classified too narrowly

The first live-audit implementation assumed every Blackpine subdomain root must return a normal landing-page status. `verify.blackpinecybersecurity.com/` returned HTTP `400`.

The Verify surface is purpose-specific and may reject a generic bare-root request. The live gate was corrected to treat the established root-level 400 response as reachable without broadening accepted behavior for Cipher or Support. This change does not claim that the Verify application itself has been security-audited by the corporate-site Phase 6 work.

### P6-004 — DEFERRED MANUAL — Safari/WebKit

Current CI provides Chromium interaction/reflow/accessibility coverage and a Firefox rendering smoke. No equivalent Safari/WebKit runner is currently part of the repository evidence.

Phase 6 does not convert Chromium success into a Safari claim. A real Safari/WebKit pass remains outstanding.

### P6-005 — DEFERRED MANUAL — physical mobile device

320 px and 390 px browser emulation provides useful reflow and interaction evidence, but it is not a physical-phone test. A real mobile-device pass remains outstanding.

### P6-006 — DEFERRED GOVERNANCE — `main` is unprotected

GitHub currently reports `main` as unprotected and the repository has no ruleset. This means the release process is documented and CI-backed but not technically enforced at the branch-control layer.

The available repository connection can inspect this state but does not provide repository-administration mutation capability. This remains an explicit governance gap until protection/rules are enabled in GitHub administration.

### P6-007 — UNAVAILABLE HISTORICAL — controlled pre-V4 performance comparison

The repository does not contain a same-tool, same-region, same-device/network-method pre-V4 baseline that can be honestly compared with the current V4 release. Phase 6 will not manufacture a percentage improvement from unlike measurements.

Current production performance may be measured and recorded independently, but a controlled historical comparison remains unavailable.

### P6-008 — VERIFIED / MONITORED — legal-page size ceiling

The largest lawyer-controlled legal HTML remains below the established 64 KiB release ceiling, but close enough to the budget that future growth should continue to be release-gated rather than treated as permanently solved.

### P6-009 — FIXED — defensive homepage evidence copy

The final human review found customer-facing evidence wording that was technically careful but unnecessarily defensive: “Evidence before case-study theatre,” a longer defensive client-proof disclaimer, and “without pretending to be client work.”

The English homepage was tightened to neutral professional wording without weakening the evidence boundary. Reviewed French and Spanish counterparts were added, and the homepage translation approval was re-anchored to the exact new source hash. The translation system returned to 172 published approvals with zero stale records.

### P6-010 — FIXED — Spanish editorial override key mismatch

The homepage copy update exposed an existing Spanish editorial mismatch. The intended final override for the team description used an English source key missing the word “it,” so the older regional phrase “respuesta y triaje de incidentes” survived in the effective catalog.

The editorial gate was improved to report the exact English source key for forbidden Spanish fragments. The override was then corrected to match the real source sentence exactly, preserving the approved “respuesta a incidentes y clasificación inicial” wording. The gate was not weakened.

## Browser and visual evidence

A Phase 6 browser artifact was manually reviewed in addition to the automated browser result. The recorded audit covered 85 indexed routes and 183 viewport checks across desktop, 320 px mobile, representative tablet reflow, and Firefox rendering. It reported zero horizontal overflow, zero missing main landmarks, zero missing or hidden H1s, and zero browser-audit warnings/errors.

The Firefox full-page homepage capture showed a pale reserved rectangle below the company statement. Source review confirmed this was the explicitly sized, self-hosted `home-infrastructure-landscape.jpg` using responsive `srcset` and `loading="lazy"`, not a missing remote component. A full-page headless capture can preserve the reserved layout box before the lazy image enters its loading threshold.

The Phase 6 implementation candidate is `f7c22e9b3e926dd7463dba51216a4198e9a1f466`. Later branch commits contain audit/sign-off documentation rather than production behavior changes. The branch has repeatedly passed source/build, localization, browser, external-link and live-origin checks after the external redirect control was corrected.

## Live-origin evidence

The corrected live-production audit now passes the canonical production origin.

Observed pre-merge PASS evidence includes:

- TLS authorization/protocol and certificate-lifetime check;
- HTTP/2 root request;
- canonical apex homepage and V4 fingerprinted-runtime marker;
- `www` redirect to the apex;
- deep-path/query-string preservation through the `www` redirect;
- representative About, Emergency Response, Trust and Contact routes;
- exact deployed global security headers/CSP on tested routes;
- a real HTTP 404 for a random unknown path;
- legacy `/about` and `/privacy` redirects;
- `robots.txt`, sitemap and `/.well-known/security.txt`;
- immutable caching on fingerprinted `/build/*` assets;
- revalidating mutable cache policy on English/French/Spanish search indexes;
- the documented local contact/email-composer surface;
- Cipher, Verify and Support reachability/separation after applying the known Verify root-response boundary.

## Known evidence boundaries

- `main` is not protected and no repository ruleset is enabled. This is a real governance gap, not a site-code defect.
- Current automated browser coverage includes Chromium interaction/reflow/accessibility checks plus Firefox rendering smoke.
- Safari/WebKit has not been proven by the current CI and remains a manual/device requirement.
- Responsive emulation is not a physical-phone test; real mobile-device evidence remains outstanding.
- No same-method pre-V4 performance baseline exists in current repository evidence, so Phase 6 will not manufacture a before/after performance claim.
- The largest lawyer-controlled legal page is below the existing 64 KiB budget but remains close to the ceiling and should continue to be monitored.

## Live-origin caution

A search/crawler retrieval during Phase 6 surfaced older Blackpine content from a stale cache. That is not sufficient evidence that the canonical origin is stale, and it is not sufficient evidence that the new release is current. The GitHub-runner live-origin audit is the deciding release evidence because it requests the public hosts directly rather than relying on crawler cache state.

The direct live audit found the apex V4 markers and no apex build/header/route mismatch. The stale crawler result is therefore recorded as crawler/index freshness evidence, not as proof of the current production origin.

## Current status

**PRE-MERGE RELEASE GATES GREEN; FINAL DOCUMENTATION HEAD REVALIDATION REQUIRED.**

The previous live release blocker is resolved and verified. The fully green pre-closeout branch state was `70834bfad2658b54b72ba0f417cdb42564e7e011`, where verify, browser-audit, external-links and live-production all passed.

This audit/sign-off update intentionally creates a later documentation-only branch head. That exact final PR head must pass the same source/browser/external/live gates before PR #38 leaves draft state.

After exact final-head validation, the Phase 6 merge sequence is:

1. mark PR #38 ready for review;
2. merge with an expected-head SHA guard;
3. confirm `main` points to the exact signed merge commit;
4. require Cloudflare production deployment and GitHub Pages build/deploy/report for that exact merge commit;
5. require post-merge source/browser/external checks;
6. require post-merge live-origin success with representative generated HTML matching the exact merged build after bounded deployment propagation.

Safari/WebKit, real-device coverage, branch protection and the unavailable historical performance comparison remain explicit deferred/non-pass evidence items unless qualifying evidence is supplied later.
