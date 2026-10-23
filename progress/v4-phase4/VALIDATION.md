# V4 Phase 4 — Validation Record

## Release state

`SOURCE RELEASE-READINESS GREEN — PRODUCTION / MANUAL GATES BLOCKED — DRAFT/UNMERGED`

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

## First Phase 4 workflow attempt

- Head: `48ca0553b5b0a9a46c75b0afdfa4c1f417863c8d`
- Run: `39923770282`
- Build: SUCCESS
- Inherited V3 / Phase 1 / Phase 2 / Phase 3 gates: SUCCESS through the point Phase 4 ran
- Phase 4 gate: FAILURE
- Findings:
  1. The Security Desk profile contained a public-intake safety boundary in source data, but its special page renderer did not output that boundary. The generated public page therefore omitted the warning against malware samples, passwords, private keys, confidential files and sensitive evidence.
  2. The new accessibility checker treated the intentionally hidden/wrapped `company-website` honeypot as a visible control requiring an `id`; that was a checker false positive.

Repairs:
- `ca75ebcdc142d6318f9e2c52d527d1495b33d091`: render the Security Desk public-intake safety boundary.
- `8a7c0981117225c7775fc2f1c23081edd8588c7b`: exempt only the intentional honeypot while preserving explicit-label checks for visible controls.

## Repaired Phase 4 source validation

- Head: `8a7c0981117225c7775fc2f1c23081edd8588c7b`
- Run: `39923953793`
- `verify`: SUCCESS
- static build: SUCCESS
- structural/production audit chain: SUCCESS
- V3 + V3-final safeguards: SUCCESS
- V4 Phase 1 safeguards: SUCCESS
- V4 Phase 2 safeguards: SUCCESS
- V4 Phase 3 safeguards: SUCCESS
- V4 Phase 4 source-release gate: SUCCESS
- no-runtime-dependency assertion: SUCCESS
- `external-links`: SUCCESS
- external research-reference validation: SUCCESS

## Documentation-inclusive validation

- Head: `cfbcca3e3ebc3c68c87fdc8b3dd5bd0c76e0df37`
- Run: `39924206599`
- `verify`: SUCCESS
- static build: SUCCESS
- complete inherited + Phase 4 audit chain: SUCCESS
- no-runtime-dependency assertion: SUCCESS
- `external-links`: SUCCESS
- external research-reference validation: SUCCESS

The subsequent tracker synchronization changes only Phase 4 progress metadata. It does not alter runtime/product source; the current branch-head GitHub workflow status is the canonical proof that this metadata-only head remains green.

The Phase 4 source gate proves:
- all 31 user-declared offerings remain mapped across six customer-facing families and three engagement models;
- Emergency Response, ransomware, Security Desk and Monitor/Managed Security source journeys retain the required safety/claim boundaries;
- the Security Desk page visibly publishes its public-intake safety boundary;
- contact intent/safe-contact controls remain present without an unapproved response-time promise;
- visible contact controls retain explicit labels without disturbing the hidden honeypot;
- generated HTML retains baseline structural accessibility checks;
- non-public R&D candidates remain non-public;
- generic/AI-style phrase gates remain active;
- Phase 4 records cannot silently claim PRODUCTION PASS before deployment evidence exists.

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
7. A final human visual/content/navigation review remains required.

## Final release rule

Do not merge/release V4 until **BUILD, STRUCTURAL, SECURITY, ACCESSIBILITY, PERFORMANCE, CONTENT, CLAIMS, and PRODUCTION** are all PASS and the user explicitly approves the release.
