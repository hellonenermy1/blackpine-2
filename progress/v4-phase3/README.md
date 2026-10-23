# Blackpine V4 — Phase 3 Progress

Phase 3 starts from the reviewed, green Phase 2 head `6e4eeb8218ba9d4b27195b5e18372141bfe43934`.

## Goal

Improve speed, caching, navigation behavior, security boundaries, SEO hygiene, and release guardrails without changing Blackpine's established visual language or introducing a framework/runtime dependency.

## Planned Phase 3 work

1. fingerprint generated CSS/JavaScript assets and give only fingerprinted build assets long immutable caching;
2. keep HTML/search/security metadata revalidated rather than dangerously immutable;
3. add conservative intent-driven same-origin prefetching without prerendering the whole site;
4. add bfcache-safety regression checks and forbid unload-style blockers/service workers unless explicitly reviewed;
5. add build-size/performance budgets and report actual generated sizes in CI;
6. preserve the strict CSP and reject new third-party runtime origins/dependencies;
7. add cross-surface isolation checks so corporate code does not execute code from Cipher/Verify/Support;
8. add `security.txt` lifecycle reporting/warnings without inventing signing infrastructure;
9. keep sitemap modification dates absent unless a real source-backed modification date exists;
10. keep Organization structured data narrow rather than multiplying schema purely for SEO;
11. record Cloudflare/live delivery items that cannot be truthfully proven from branch source for Phase 4 production validation.

## Explicit non-goals

- no React/Next/framework rewrite;
- no service worker cache layer;
- no third-party analytics/tag manager;
- no indiscriminate prerender/prefetch-everything behavior;
- no fake Core Web Vitals claim from source-only checks;
- no fake sitemap `lastmod` timestamps;
- no weakening of CSP/security headers to make an optimization easier.
