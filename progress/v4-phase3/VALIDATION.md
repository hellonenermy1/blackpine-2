# Phase 3 Validation Record

## Release state

`IMPLEMENTATION IN VALIDATION — DRAFT/UNMERGED`

Phase 3 is isolated on `v4-phase3-engineering` and depends on the reviewed Phase 2 head `6e4eeb8218ba9d4b27195b5e18372141bfe43934`.

## Required validation

The final Phase 3 head must pass:

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

## Phase 3-specific evidence expected

- all six runtime assets have content-matching SHA-256-derived filenames;
- generated HTML references only fingerprinted runtime CSS/JavaScript;
- stable runtime aliases are absent from `dist`;
- `/build/*` uses one-year immutable caching on Cloudflare Pages and Netlify configuration;
- `search-index.json` remains revalidated;
- actual CSS/runtime-JS/search/largest-HTML sizes are printed by CI and stay within explicit budgets;
- no unload/beforeunload runtime handlers are introduced;
- no service worker is introduced;
- selective prefetch stays same-origin, intent-driven, capped, and disabled for Save-Data/slow connections;
- CSP remains self-only for scripts/styles and keeps `worker-src 'none'`;
- runtime JavaScript does not execute against Cipher/Verify/Support hosts;
- security.txt expiry is valid and lifecycle is reported;
- sitemap does not invent `lastmod` values;
- top-level Organization schema is limited to the home/About organization surfaces;
- package remains dependency-free.

## Deliberately outside source-only proof

Cloudflare protocol negotiation, compression behavior, real cache hits, and field Core Web Vitals require a deployed production surface and are deferred to Phase 4 production verification. This record must not claim those as passing based only on repository configuration.

## Merge rule

Keep Phase 3 draft/unmerged until the final branch head is green and the user explicitly approves it.
