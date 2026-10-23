# V4 Phase 4 — Validation Record

## Release state

`SOURCE + RENDERED-BROWSER RELEASE-READINESS GREEN — PRODUCTION / REMAINING MANUAL GATES BLOCKED — DRAFT/UNMERGED`

Phase 4 remains isolated on `v4-phase4-release` and depends on final green Phase 3 head `990d1dc0fe83e02255623fc77a1cdf558ed88ac1`.

## Source validation chain

The normal release chain includes:

1. static build;
2. structural/SEO/security checks;
3. OG validation;
4. production regression checks;
5. V3 + V3-final safeguards;
6. V4 Phase 1, 2, 3 and 4 safeguards;
7. hosting / GitHub Pages safety checks;
8. no-runtime-dependency assertion;
9. external research-reference validation.

Current source result before this tracker synchronization: **PASS**.

Measured Phase 3 budgets on the hardened V4 candidate:
- CSS: 38.0 KiB / 64.0 KiB;
- JS: 33.2 KiB / 64.0 KiB;
- search index: 154.2 KiB / 256.0 KiB;
- largest HTML: 24.0 KiB / 48.0 KiB.

## Phase 4 fixes applied after the initial source-green state

### Public hotline claim

The registry still records `Cybersecurity Emergency Hotline` as a user-declared Blackpine capability, but the release evidence does not prove a monitored public hotline operating model.

Phase 4 therefore changed only its release/publication state:
- `operationalStatus: CONTRACT_DEPENDENT`
- `publicationStatus: NOT_PUBLIC`

Public family rendering now requires a capability to be both `LIVE` and publishable. Phase 4 checks fail if the hotline name leaks into generated public output.

Result: **PASS for public claim integrity; operational hotline launch remains not evidenced and not public.**

### Security Desk intake boundary

The first Phase 4 gate found that the Security Desk profile had a safety boundary in source but its special renderer omitted it. The public page now visibly rejects malware samples, passwords, private keys, confidential files and sensitive evidence through public intake.

Result: **PASS.**

### Contact honeypot checker

The first accessibility checker incorrectly treated the intentionally hidden/wrapped Netlify honeypot as a visible unlabeled field. The exemption is now limited to that honeypot; visible controls still require explicit labels.

Result: **PASS.**

### Stacked PR validation

The workflow previously validated pull requests only when their base was `main`, forcing stacked Phase PRs to be temporarily retargeted just to run CI. `pull_request:` now validates all pull requests while push validation remains restricted to `main`.

Result: **PASS; PR #12 can remain based on `v4-phase3-engineering`.**

### Deterministic build output

The footer no longer inserts the build-clock year. An otherwise identical source tree will not change rendered HTML merely because a calendar year rolls over.

Result: **PASS.**

### Release documentation

README, DEPLOYMENT, AUDIT and CLAIMS were updated from stale V2/release descriptions to the actual V4 capability/publication/browser/release architecture.

Result: **PASS.**

## Rendered-browser validation

A dependency-free Chrome DevTools Protocol audit now runs in CI, with a Firefox headless render smoke test and short-lived evidence artifact.

The initial browser run correctly failed one test because the test assumed Ctrl+K should always return focus to the Search button. Actual site behavior returns focus to the exact element that invoked the shortcut; in that test it was the skip link. The test was fixed and strengthened rather than weakening the UI requirement:
- shortcut-opened search must return to the invoking focused element;
- button-opened search must return to the Search button.

### Successful representative browser run

Run `39926698198` on head `f250698a3a912deec303ea773d730cf3d378a6a5`:
- `verify`: SUCCESS;
- `browser-audit`: SUCCESS;
- `external-links`: SUCCESS;
- zero browser warnings/errors.

### Successful all-route browser run

Run `39927082217` on head `0916f5d7caf47ffe7bd6200e26b47d208fe99aba`:
- `verify`: SUCCESS;
- `browser-audit`: SUCCESS;
- `external-links`: SUCCESS.

Browser evidence:
- 59 indexed routes discovered from the generated search index;
- 62 routes audited including key noindex/404 paths;
- 131 rendered reflow checks;
- desktop 1440px + 320px for the full route set;
- representative 768px tablet routes;
- zero horizontal overflow;
- zero missing visible H1s;
- zero missing main landmarks;
- zero warnings;
- zero errors;
- skip link is first useful keyboard focus;
- Ctrl+K search opens, searches locally, closes on Escape, and restores shortcut-origin focus;
- Search-button-opened dialog restores focus to the Search button;
- mobile navigation/group state and Escape focus return pass;
- Emergency Response contact intent/capability routing passes;
- non-urgent Protect contact routing passes;
- smart 404 routes ransomware-like paths toward Emergency Response;
- Firefox rendered screenshot smoke passes.

Artifact for all-route run:
- ID `12488904521`;
- digest `sha256:678f4da5d2564ac3bdd97ec145d744de39041c0392d49a516662ccc3c6d19bf0`;
- contains machine-readable browser report plus Chrome/Firefox screenshots.

Representative screenshots were manually inspected during Phase 4 and showed no obvious broken layout, accidental horizontal clipping, or unsupported hotline wording.

## Current live-production baseline

As of 23 October 2026, public-web retrieval still shows the older pre-V4 corporate website. Its existing contact page publicly states a `1–2 business days` response time. V4 intentionally removes that unsupported response-time promise.

The live pre-V4 site is therefore a baseline, not V4 production evidence.

## Remaining production/manual validation

The following cannot be truthfully marked PASS before deployment or a compatible real browser/device environment exists:

- deployed apex serves the exact approved V4 commit;
- `www` redirects correctly;
- representative routes and real 404 status work on production;
- `robots.txt`, sitemap and `/.well-known/security.txt` are reachable with expected production content;
- actual CSP/security headers are present on live responses;
- immutable/mutable CDN cache behavior matches policy;
- actual HTTP protocol/compression behavior is measured;
- production contact form safely submits and reaches the intended operational process;
- Cipher, Verify and Support remain reachable and separated on production;
- Safari/WebKit and real mobile/device behavior receive a manual pass;
- real screen-reader/manual zoom review is completed;
- pre-V4 and V4 production performance are compared using the same measurement method;
- final deployed human visual/editorial/navigation review is completed.

## Final release rule

Do not merge/release V4 until **BUILD, STRUCTURAL, SECURITY, ACCESSIBILITY, PERFORMANCE, CONTENT, CLAIMS, and PRODUCTION** are all PASS and the user explicitly approves the release.

After this evidence update, run one final exact-head workflow. That exact-head run becomes the canonical Phase 4 source/browser validation record.
