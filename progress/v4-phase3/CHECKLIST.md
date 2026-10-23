# Phase 3 Checklist

Legend: `DONE`, `IN PROGRESS`, `PENDING`, `BLOCKED`, `NOT APPLICABLE`.

| Item | Status | Evidence / note |
|---|---|---|
| Branch Phase 3 from reviewed green Phase 2 head | DONE | `v4-phase3-engineering` from `6e4eeb8218ba9d4b27195b5e18372141bfe43934` |
| Create Phase 3 progress folder | DONE | `progress/v4-phase3/` |
| Fingerprint generated CSS/JS assets | DONE | Six SHA-256-derived runtime assets under `/build/`; content hash verified by Phase 3 gate |
| Remove stable runtime aliases from built output | DONE | `styles.css`, `site.js`, `theme-init.js`, `a11y-v3.js`, `phase2.js`, `phase3.js` absent from `dist` |
| Add immutable cache rule only for fingerprinted build assets | DONE | `/build/*` one-year immutable in `_headers` and `netlify.toml` |
| Keep search index and mutable metadata revalidated | DONE | `search-index.json` remains 1-hour must-revalidate; other public metadata unchanged from short/revalidation policies |
| Add selective same-origin prefetch | DONE | Intent-driven family/contact allowlist; maximum two routes; no prerender/custom fetch |
| Respect Save-Data / slow connections | DONE | Phase 3 enhancement disables prefetch for Save-Data and slow/2G effective types |
| Add bfcache safety gate | DONE | Reject unload/beforeunload handlers, `no-store`, and service-worker regressions |
| Add performance/build-size budgets | DONE | Measured baseline: CSS 38.0 KiB, JS 33.2 KiB, search 154.2 KiB, largest HTML 24.0 KiB; tightened ceilings 64/64/256/48 KiB |
| Preserve strict CSP/security headers | DONE | Phase 3 gate enforces self-only script/style, no unsafe-inline/eval, worker-src none |
| Enforce no new third-party runtime origins | DONE | Generated executable scripts/styles and runtime channels are scanned |
| Enforce corporate/Cipher/Verify/Support execution isolation | DONE | Runtime JS cannot contain/reach separate-surface hosts; ordinary navigation remains allowed |
| Add security.txt lifecycle reporting | DONE | Green validation measured 180 days remaining; fail under 30 days, warn under 90 |
| Keep sitemap lastmod truthful | DONE | Gate rejects `lastmod` until a source-backed route modification-date system exists |
| Narrow Organization schema placement | DONE | Top-level Organization schema on home/About; Article publisher remains where relevant |
| Keep static MPA / no framework | DONE | Package remains dependency-free; no runtime install required |
| Keep service worker absent | DONE | Automated guard |
| Preserve Phase 1/2/V3 regression coverage under hashed assets | DONE | Shared runtime-asset helper used by legacy checks rather than restoring stable aliases |
| First Phase 3 CI attempt | DONE | Run `39900743139` failed because legacy `check.mjs` still opened `dist/styles.css`; build itself succeeded |
| Repaired implementation validation | DONE | Head `7095b514f83b60979b1e2d81bddab8fc30061193`, run `39900845490`; `verify` and `external-links` succeeded |
| Tightened-budget/documentation validation | DONE | Head `185f0e9bf69879995357b467fcd81dee0da94c59`, run `39901042239`; `verify` and `external-links` succeeded |
| Cloudflare live protocol/compression audit | BLOCKED | Branch source cannot prove live HTTP/3/compression/CDN behavior; Phase 4 production check |
| Actual field Core Web Vitals | BLOCKED | Requires deployed traffic/field tooling; do not infer from source |
| Browser screenshot / manual device matrix | PENDING | Not claimed in Phase 3 source-only work |
| Phase 3 review-status tracker correction | DONE | This update makes the durable checklist match the already-green Phase 3 evidence; the resulting tracker-only head is validated separately before review sign-off |
| Phase 3 approval for merge | PENDING | Keep draft/unmerged until explicit user approval |
