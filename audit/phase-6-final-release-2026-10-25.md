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
- Added a GitHub Actions `live-production-audit` job.
- Pull requests and scheduled/manual runs test the current canonical production invariants.
- Pushes to `main` additionally require exact generated HTML match between the merged build and representative canonical production routes, with bounded retry for deployment propagation.
- The live audit verifies TLS authorization/certificate lifetime, HTTP/2, apex/`www`, representative routes, real 404 behavior, required legacy redirects, deployed security headers/CSP, robots/sitemap/security.txt, immutable build caching, mutable search-index caching, contact-surface constraints, and Cipher/Verify/Support reachability/separation.

## Known evidence boundaries at phase start

- `main` is not protected and no repository ruleset is enabled. This is a real governance gap, not a site-code defect.
- Current automated browser coverage includes Chromium interaction/reflow/accessibility checks plus Firefox rendering smoke.
- Safari/WebKit has not been proven by the current CI and remains a manual/device requirement.
- Responsive emulation is not a physical-phone test; real mobile-device evidence remains outstanding.
- No same-method pre-V4 performance baseline exists in current repository evidence, so Phase 6 will not manufacture a before/after performance claim.
- The largest lawyer-controlled legal page is below the existing 64 KiB budget but remains close to the ceiling and should continue to be monitored.

## Live-origin caution

A search/crawler retrieval during Phase 6 surfaced older Blackpine content from a stale cache. That is not sufficient evidence that the canonical origin is stale, and it is not sufficient evidence that the new release is current. The new GitHub-runner live-origin audit is the deciding release evidence because it requests the public hosts directly rather than relying on crawler cache state.

## Status

Phase 6 is in progress. Final result must not be recorded until the Phase 6 branch passes source, browser, external-link and live-origin CI; the final PR head passes again; the PR is merged with an expected-head guard; and the exact merge commit passes post-merge source, browser, external-link, live-origin exact-build, Cloudflare production and GitHub Pages checks.
