# V4 Phase 4 — Implementation Log

## 2026-10-23 — Phase 4 foundation

- Branch `v4-phase4-release` started from final green Phase 3 head `990d1dc0fe83e02255623fc77a1cdf558ed88ac1`.
- Phase 4 remains draft/unmerged and does not implicitly merge earlier phases.
- Added Phase 4 release records and `scripts/check-v4-phase4.mjs`.

## 2026-10-23 — first source-gate findings

Initial Phase 4 workflow `39923770282` built successfully but exposed:
1. a real issue: Security Desk safety-boundary text existed in source but was not rendered on its special page;
2. a checker issue: the hidden/wrapped Netlify honeypot was incorrectly treated as a visible unlabeled control.

Repairs:
- Security Desk now visibly publishes its public-intake boundary;
- the accessibility exemption is limited to the intentional honeypot.

Repaired source workflows passed.

## 2026-10-23 — “fix all issues” hardening pass

### Unsupported hotline publication

- Preserved `Cybersecurity Emergency Hotline` in the 31-capability internal registry.
- Changed its operational/publication state to `CONTRACT_DEPENDENT` + `NOT_PUBLIC` because no monitored public hotline/coverage/activation evidence exists in the release record.
- Updated family rendering and Phase 4 checks so unproven/non-public capabilities cannot leak into public output.
- Did not invent a phone number, 24/7 coverage, SLA, guaranteed response, response time, containment, or recovery claim.

### CI workflow

- Fixed pull-request validation so stacked PRs validate on their real base branch rather than only when pointed at `main`.
- Added a dependency-free rendered-browser CI job.
- Browser evidence is stored as a short-lived artifact.

### Browser/reflow validation

- Added direct Chrome DevTools Protocol tests without new npm dependencies.
- Added Firefox headless render smoke.
- Initial browser run exposed a test-assumption error around Ctrl+K focus return; the UI correctly returned focus to the invoking skip link.
- Strengthened the test to verify both shortcut-origin and Search-button-origin focus restoration.
- Expanded reflow coverage from representative routes to every indexed route plus key noindex/404 routes.

All-route run `39927082217` passed:
- `verify`: SUCCESS;
- `browser-audit`: SUCCESS;
- `external-links`: SUCCESS;
- 59 indexed routes;
- 62 routes audited;
- 131 reflow checks;
- zero overflow;
- zero missing H1s;
- zero missing main landmarks;
- zero browser warnings/errors.

Evidence artifact:
- ID `12488904521`;
- SHA-256 `678f4da5d2564ac3bdd97ec145d744de39041c0392d49a516662ccc3c6d19bf0`.

### Documentation and reproducibility

- Replaced stale V2 release language in README, DEPLOYMENT, AUDIT and CLAIMS with the actual V4 architecture and release rules.
- Documented capability publication state separately from user-declared business scope.
- Removed build-clock year insertion from the shared footer so generated output does not drift only because the calendar year changes.

### Public baseline verification

- Public-web retrieval on 23 October 2026 still shows the older pre-V4 site.
- The existing live contact page still advertises a `1–2 business days` response time.
- V4 does not publish that response-time promise.
- This confirms the live site remains a baseline and production cannot be marked fixed until V4 is deployed.

## Current source/browser audit result

- BUILD: PASS
- STRUCTURAL: PASS
- SECURITY: PASS at source/build level
- CLAIMS: PASS for V4 public output
- Chrome rendered interaction/reflow audit: PASS
- Firefox render smoke: PASS
- External research references: PASS
- Runtime dependencies: none
- Phase 3 size budgets: PASS
- Public hotline claim: safely withheld while operational evidence is absent

## Remaining release-only gates

These are not source bugs and cannot be manufactured before deployment:
- actual deployed V4 apex/www behavior;
- live response headers/CSP;
- actual HTTP protocol/compression/CDN caching;
- production Netlify form delivery/operational handling;
- live Cipher/Verify/Support boundary checks;
- Safari/WebKit and real-device/screen-reader/manual zoom pass;
- same-method pre-V4 vs V4 production performance comparison;
- final deployed human visual/editorial/navigation review.

No merge to `main` has been performed.
