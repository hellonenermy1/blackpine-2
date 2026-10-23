# V4 Phase 4 — Validation Record

## Release state

`SOURCE RELEASE-READINESS IN VALIDATION — PRODUCTION BLOCKED — DRAFT/UNMERGED`

Phase 4 is isolated on `v4-phase4-release` and depends on final green Phase 3 head `990d1dc0fe83e02255623fc77a1cdf558ed88ac1`.

## Required source validation chain

1. `npm run build`
2. `scripts/check.mjs`
3. `scripts/check-og-images.mjs`
4. `scripts/check-production.mjs`
5. `scripts/check-v3.mjs`
6. `scripts/check-v3-final.mjs`
7. `scripts/check-v4-phase1.mjs`
8. `scripts/check-v4-phase2.mjs`
9. `scripts/check-v4-phase3.mjs`
10. `scripts/check-v4-phase4.mjs`
11. `scripts/check-hosting.mjs`
12. `scripts/check-pages-safety.mjs`
13. no-runtime-dependency assertion
14. external research-reference validation

## Required Phase 4 production validation

These are separate from source CI and must not be marked PASS merely because the branch is green:

- deployed canonical apex returns the V4 release;
- `www` redirects to canonical apex;
- representative core/family/specialist/research/trust/legal routes return correctly;
- `robots.txt`, `sitemap.xml`, and `/.well-known/security.txt` are reachable with expected content;
- live CSP/security headers match the intended restrictive policy;
- fingerprinted `/build/*` assets receive long immutable caching while mutable search/metadata remain revalidated;
- actual HTTP protocol/compression/cache behavior is measured rather than inferred;
- public contact form accepts a safe non-sensitive production test and reaches the intended operational process;
- Emergency Response, ransomware and Security Desk customer journeys are manually tested end to end;
- Cipher, Verify and Support remain separate origins and ordinary navigation works without corporate runtime cross-origin execution;
- browser matrix covers current Chromium/Chrome, Firefox, Safari/WebKit and mobile behavior where evidence is available;
- keyboard-only navigation, focus, search dialog/menu behavior, reduced motion/forced colors as applicable, 200% zoom and 400% zoom are manually checked;
- V3/pre-V4 baseline is compared with deployed V4 using the same measurement method;
- final human pass checks copy, credibility, claim boundaries, visual sanity and AI-template feel.

## Operational release blockers currently retained

1. `Cybersecurity Emergency Hotline` is a user-declared offering, but this release record does not yet evidence a monitored emergency channel and coverage/activation model.
2. V4 is not deployed, so PRODUCTION cannot be PASS.
3. Production form delivery/handling is not yet proven.
4. Live HTTP/3/compression/CDN caching behavior is not yet proven.
5. Browser/device/400%-zoom evidence is not yet present.
6. V3-vs-V4 live performance comparison is not yet possible on the same production surface.

## Final release rule

Do not merge/release V4 until **BUILD, STRUCTURAL, SECURITY, ACCESSIBILITY, PERFORMANCE, CONTENT, CLAIMS, and PRODUCTION** are all PASS and the user explicitly approves the release.
