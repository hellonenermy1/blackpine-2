# Phase 3 Validation Record

## Release state

`IMPLEMENTATION + TIGHTENED BUDGETS GREEN — TRACKER-ONLY HEAD PENDING FINAL CONFIRMATION — DRAFT/UNMERGED`

Phase 3 is isolated on `v4-phase3-engineering` and depends on reviewed Phase 2 head `6e4eeb8218ba9d4b27195b5e18372141bfe43934`.

## Validation chain

The Phase 3 branch must pass:

1. `npm run build`
2. `scripts/check.mjs`
3. `scripts/check-og-images.mjs`
4. `scripts/check-production.mjs`
5. `scripts/check-v3.mjs`
6. `scripts/check-v3-final.mjs`
7. `scripts/check-v4-phase1.mjs`
8. `scripts/check-v4-phase2.mjs`
9. `scripts/check-v4-phase3.mjs`
10. `scripts/check-hosting.mjs`
11. `scripts/check-pages-safety.mjs`
12. no-runtime-dependency assertion
13. external research-reference validation

## First Phase 3 workflow attempt

- Head: `12d0247e9510a3f403eb1fb6addfa62651f8a3d4`
- Run: `39900743139`
- Build: PASS
- Audit chain: FAIL
- Root cause: the legacy top-level structural checker still attempted to read `dist/styles.css` after Phase 3 intentionally removed stable runtime aliases.
- Repair: update the checker to resolve the content-addressed stylesheet from generated HTML; no stable alias was reintroduced.

## Repaired implementation validation

- Head: `7095b514f83b60979b1e2d81bddab8fc30061193`
- Run: `39900845490`
- `verify`: SUCCESS
- build: SUCCESS
- structural/production audits: SUCCESS
- V3 + V3-final safeguards: SUCCESS
- V4 Phase 1 safeguards: SUCCESS
- V4 Phase 2 safeguards: SUCCESS
- V4 Phase 3 safeguards: SUCCESS
- no-runtime-dependency assertion: SUCCESS
- `external-links`: SUCCESS
- external research-reference validation: SUCCESS

### Measured generated sizes from the first green run

- CSS: `38.0 KiB`
- total runtime JavaScript: `33.2 KiB`
- search index: `154.2 KiB`
- largest generated HTML document: `index.html`, `24.0 KiB`
- security.txt lifecycle: `180 days remaining`

After measuring rather than guessing, Phase 3 tightened the budgets to:

- CSS: `64 KiB`
- total runtime JavaScript: `64 KiB`
- search index: `256 KiB`
- largest HTML: `48 KiB`

These are build-size regression budgets, not Core Web Vitals claims.

## Tightened-budget/documentation validation

- Head: `185f0e9bf69879995357b467fcd81dee0da94c59`
- Run: `39901042239`
- `verify`: SUCCESS
- build: SUCCESS
- structural/production audits: SUCCESS
- V3 + V3-final safeguards: SUCCESS
- V4 Phase 1 safeguards: SUCCESS
- V4 Phase 2 safeguards: SUCCESS
- V4 Phase 3 safeguards with tightened budgets: SUCCESS
- no-runtime-dependency assertion: SUCCESS
- `external-links`: SUCCESS
- external research-reference validation: SUCCESS

## Phase 3-specific evidence established

- six runtime assets use SHA-256-derived 12-hex content hashes in their filenames;
- the Phase 3 gate recomputes each digest and verifies it matches the emitted filename;
- generated HTML references fingerprinted CSS/JavaScript only;
- stable runtime aliases are removed from `dist`;
- `/build/*` uses one-year immutable caching in Cloudflare Pages and Netlify configuration;
- `search-index.json` remains short-lived/revalidated;
- no `unload`/`beforeunload` runtime handlers are allowed;
- no service worker is allowed;
- selective prefetch is same-origin, user-intent driven, capped at two routes, and disabled for Save-Data/slow connections;
- no prerender or custom prefetch network API is used;
- CSP remains self-only for scripts/styles, forbids unsafe inline/eval and keeps `worker-src 'none'`;
- runtime JavaScript is prevented from reaching Cipher, Verify, or Support hosts;
- `security.txt` expiry is parsed and lifecycle checked;
- sitemap `lastmod` is forbidden until backed by a real source modification-date system;
- top-level Organization schema is limited to home/About rather than repeated across generic service pages;
- package/runtime remains dependency-free.

## Deliberately outside source-only proof

Cloudflare protocol negotiation, compression behavior, real cache-hit behavior, and field Core Web Vitals require a deployed production surface and are deferred to Phase 4 production verification. No source-only result is represented as proof of HTTP/3, Brotli/Zstandard, real CDN caching, LCP, INP, or CLS.

No manual screenshot matrix, Safari/iOS/Android device test, or manual 400% zoom run is claimed here.

## Current tracker-only correction

This file and `CHECKLIST.md` were updated after run `39901042239` solely so the durable progress folder records the already-completed tightened-budget validation accurately. The resulting tracker-only branch head must receive one final green workflow before Phase 3 review sign-off. No runtime/application source changed in these tracker-only corrections.

## Merge rule

Keep Phase 3 draft/unmerged until the tracker-only final branch head is green and the user explicitly approves it.
