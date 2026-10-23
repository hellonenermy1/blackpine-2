# Phase 3 Implementation Log

## 2026-10-23 — reviewed base

- Started `v4-phase3-engineering` from reviewed Phase 2 head `6e4eeb8218ba9d4b27195b5e18372141bfe43934`.
- Phase 1 review head `5bbcd0172aaf1240516a4a729c8bd9ac38959ce7` had already passed GitHub Actions run `39899671009`.
- Phase 2 review head passed run `39899909332`, including the corrected no-JavaScript safe-contact fallback and malformed-URL-safe 404 behavior.
- Phase 1 and Phase 2 remain draft/unmerged.

## 2026-10-23 — asset fingerprinting and caching

- Updated `build.mjs` to hash generated runtime CSS/JavaScript with SHA-256 and use a 12-hex content digest in each filename.
- Runtime assets target `/build/` with names for styles, theme initialization, site behavior, accessibility, Phase 2 behavior, and Phase 3 behavior.
- Stable runtime copies are removed from the built output after the public tree is copied.
- Updated `src/layout.mjs` so generated pages load the fingerprinted assets supplied by the build.
- Added immutable one-year caching for `/build/*` in both Cloudflare Pages `_headers` and `netlify.toml`.
- Kept `search-index.json`, manifest, favicon, other public assets, and security.txt on revalidation/shorter policies rather than incorrectly making them immutable.

## 2026-10-23 — structured data hygiene

- Narrowed top-level Organization JSON-LD to the homepage and About page.
- Research Article JSON-LD still carries its publisher/author organization context where appropriate.
- Did not add fake LocalBusiness addresses, ratings, reviews, offices, opening hours, or contact points.

## 2026-10-23 — selective prefetch

- Added `public/phase3.js` as a small self-hosted progressive enhancement.
- Prefetch occurs only after pointer/focus intent on a small allowlist of same-origin customer-action routes.
- Maximum two prefetched routes per page.
- Prefetch disables itself for Save-Data and slow/2G connections.
- No prerender, custom fetch, analytics call, or cross-origin request is used.

## 2026-10-23 — regression architecture

- Added `scripts/lib/runtime-assets.mjs` so existing checks can resolve content-addressed runtime assets from generated HTML.
- Updated structural, production, V3, V3-final, Phase 2, and hosting checks to preserve their previous coverage under fingerprinted asset names.
- Added `scripts/check-v4-phase3.mjs` and wired it into `npm run check`.
- The Phase 3 gate verifies content hashes, asset count, stable-alias removal, byte-size budgets, bfcache blockers, service-worker absence, conservative prefetch behavior, CSP, same-origin/cross-surface execution boundaries, security.txt expiry, sitemap freshness honesty, Organization schema placement, and dependency-free architecture.

## 2026-10-23 — CI findings

- First Phase 3 run `39900743139` built the fingerprinted site successfully but failed when the old top-level structural checker tried to open removed `dist/styles.css`.
- The repair updated that checker to resolve the hashed stylesheet from generated HTML rather than reintroducing a stable alias.
- Repaired implementation head `7095b514f83b60979b1e2d81bddab8fc30061193` passed GitHub Actions run `39900845490` completely, including `verify`, all historical gates, the Phase 3 gate, no-runtime-dependency verification, and external links.

## 2026-10-23 — measured budgets

The first green Phase 3 run measured:

- CSS: 38.0 KiB
- total runtime JavaScript: 33.2 KiB
- search index: 154.2 KiB
- largest generated HTML: 24.0 KiB (`index.html`)
- security.txt: 180 days remaining

After measuring rather than guessing, the provisional budget ceilings were tightened to:

- CSS: 64 KiB
- total runtime JavaScript: 64 KiB
- search index: 256 KiB
- largest HTML: 48 KiB

These budgets are build-bloat guardrails. They are not field-performance or Core Web Vitals measurements.

## Not claimed from source-only work

- No field Core Web Vitals claim.
- No assertion that Cloudflare production currently negotiates HTTP/3, Brotli/Zstandard, or a CDN cache hit; those require live production evidence.
- No browser screenshot matrix or pixel-level comparison yet.
