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
- Added `governance/CLOUDFLARE_CANONICAL_HOST_CONTROL.md` for the host-level `www` to apex control that cannot be implemented by a Pages `_redirects` rule.

## Phase 6 findings

### P6-001 — FIXED — no independent live-origin release gate

Before Phase 6, Blackpine had strong source/build, browser, deployment-status and external-link checks, but no release gate that independently requested the canonical production origin and compared live behavior with the approved policy.

Phase 6 adds a dedicated live-production CI job. On pushes to `main`, it also compares representative public HTML byte-for-byte with the locally generated release after bounded deployment-propagation retries.

### P6-002 — OPEN / RELEASE-BLOCKING — `www` does not redirect to the canonical apex

The GitHub-runner live audit received HTTP `200` from:

`https://www.blackpinecybersecurity.com/`

The required behavior is a permanent redirect to:

`https://blackpinecybersecurity.com/`

The same run otherwise reached the canonical apex and completed the remaining live checks without reporting another live-origin defect.

This cannot be correctly repaired in the static site because Cloudflare Pages `_redirects` does not support domain-level source matching. The required change is an account/zone Redirect Rule or Bulk Redirect. See `governance/CLOUDFLARE_CANONICAL_HOST_CONTROL.md`.

Phase 6 must remain open while this finding is unresolved.

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

## Live-origin evidence observed so far

On the corrected Phase 6 live run, no failure was reported for:

- TLS authorization/protocol and certificate-lifetime check;
- HTTP/2 root request;
- canonical apex homepage and V4 fingerprinted-runtime marker;
- representative About, Emergency Response, Trust and Contact routes;
- exact deployed global security headers/CSP on tested routes;
- a real HTTP 404 for a random unknown path;
- legacy `/about` and `/privacy` redirects;
- `robots.txt`, sitemap and `/.well-known/security.txt`;
- immutable caching on fingerprinted `/build/*` assets;
- revalidating mutable cache policy on English/French/Spanish search indexes;
- the documented local contact/email-composer surface;
- Cipher, Verify and Support reachability/separation after applying the known Verify root-response boundary.

The only reported live-production failure in that corrected run was the `www` canonical-host redirect.

## Known evidence boundaries

- `main` is not protected and no repository ruleset is enabled. This is a real governance gap, not a site-code defect.
- Current automated browser coverage includes Chromium interaction/reflow/accessibility checks plus Firefox rendering smoke.
- Safari/WebKit has not been proven by the current CI and remains a manual/device requirement.
- Responsive emulation is not a physical-phone test; real mobile-device evidence remains outstanding.
- No same-method pre-V4 performance baseline exists in current repository evidence, so Phase 6 will not manufacture a before/after performance claim.
- The largest lawyer-controlled legal page is below the existing 64 KiB budget but remains close to the ceiling and should continue to be monitored.

## Live-origin caution

A search/crawler retrieval during Phase 6 surfaced older Blackpine content from a stale cache. That is not sufficient evidence that the canonical origin is stale, and it is not sufficient evidence that the new release is current. The GitHub-runner live-origin audit is the deciding release evidence because it requests the public hosts directly rather than relying on crawler cache state.

The direct live audit found the apex V4 markers and did not report an apex build/header/route mismatch. The stale crawler result is therefore recorded as crawler/index freshness evidence, not as proof of the current production origin.

## Current status

**BLOCKED ON ONE LIVE HOST CONFIGURATION CONTROL.**

Source/build verification and external-link validation are passing on the Phase 6 branch. The live-production gate now isolates one genuine blocker: `www` serves 200 instead of redirecting to the apex. PR #38 remains draft and must not be merged while `LIVE-004` is OPEN under the current release policy.

After the Cloudflare `www` redirect is corrected, Phase 6 still requires:

1. a green live-origin run on the final implementation head;
2. green source/browser/external checks on that exact final PR head;
3. a completed sign-off record identifying the implementation candidate;
4. merge with an expected-head guard;
5. post-merge Cloudflare and GitHub Pages success for the exact merge commit;
6. post-merge source/browser/external success;
7. post-merge live-origin success with exact generated-HTML match to the merged build.

Safari/WebKit, real-device coverage, branch protection and the unavailable historical performance comparison remain explicit deferred/non-pass evidence items unless qualifying evidence is actually supplied before closeout.
