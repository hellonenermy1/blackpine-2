# Blackpine Deep Production Audit — 2026-10-24

## Scope

This audit starts from production `main` at `69e8bbfe3d43f3b77a24a8fe7d9540d959b9dad0` after the credibility-roadmap merge. It is a release-readiness audit, not a certification or independent assurance report.

The review covers the source generators, browser runtime, CSS, route/content modules, hosting configuration, CI checks, public static assets, generated HTML, external-reference checks, responsive browser rendering, keyboard interactions, contact intake, search, and noncanonical publication surfaces.

## Pass 1 — implementation quality

The first pass reviewed source and configuration for better alternatives, not only functional correctness. Confirmed strengths include a dependency-free static build, escaped generated content, no runtime advertising/analytics, self-hosted assets, fingerprinted runtime files, strict CSP, no generic DOM HTML insertion, claim gates, route/sitemap/search consistency, and explicit Cipher/Verify/Support boundaries.

Issues selected for correction:

1. Five homepage testimonials were selected in data but CSS hid the fifth on desktop and the fourth/fifth on mobile.
2. Phase 5 trust routes existed and were in the mega-menu but were missing from the Trust Center directory.
3. GitHub Pages safety exclusions did not cover governance, progress, docs, media-library, or Phase audit records.
4. First-load asynchronous search could let an older query finish after a newer query and overwrite newer results.
5. The modal search trapped focus but did not remove the page background from sequential focus/accessibility exposure using `inert`.
6. External-link CI only scanned research pages instead of the full generated site.
7. Cloudflare and Netlify security-header policies were duplicated without an exact parity gate.
8. CSP could be tightened because the site requires no inline event handlers and no `<base>` element.
9. Existing automated checks could confirm testimonial records were present in HTML while missing the fact that CSS hid them.

## Corrections

- render all five selected homepage testimonials on desktop and mobile;
- list all enterprise-readiness pages in `/trust/` and in the Trust footer path;
- expand GitHub Pages exclusions and enforce them in CI;
- make search result rendering generation-aware so stale asynchronous requests cannot overwrite newer queries;
- make header, main and footer inert while the modal search is open, while retaining the existing focus trap and focus restoration;
- change the visible search shortcut hint to `Ctrl/⌘ K`;
- add `script-src-attr 'none'`, set `base-uri 'none'`, and explicitly disable legacy XSS filtering with `X-XSS-Protection: 0` on both supported hosting policies;
- enforce exact production security-header parity across Cloudflare Pages and the Netlify portability configuration;
- expand the external-link job to every generated HTML page and include separate Blackpine application/support hostnames as external destinations;
- add `check-deep-production.mjs`, which inventories executable/config files and generated pages, checks browser runtimes for dangerous evaluation/HTML sinks, and validates generated control/label/fragment/image/button relationships;
- expand the rendered-browser audit so all five featured testimonials must be visible at both desktop and 320px and modal background isolation must be observable in the browser.

## Pass 2 — bug-oriented review

After the corrections, the exact changed tree must receive a second review focused on failure modes: stale async completion, hidden content, focus leakage, invalid control relationships, deployment-policy drift, accidental noncanonical publication, dangerous browser sinks, broken external destinations, responsive overflow, runtime exceptions and regression of existing Phase 1–5 evidence boundaries.

## Release gate

The corrected head is production-ready only if all of the following pass on the same final commit:

- build and structural checks;
- legacy/V4/Phase 1–5 regression gates;
- final roadmap claim gate;
- new deep-production audit;
- hosting and GitHub Pages safety checks;
- site-wide external destination audit;
- rendered Chrome audit of every indexed route at desktop and 320px plus representative tablet routes and key noindex/404 states;
- keyboard/modal/contact/search interaction tests;
- Firefox render smoke;
- no unresolved high-severity finding from the second audit.

Real-world assurance remains separate. This work does not create ISO certification, SOC 2 attestation, insurance evidence, customer-logo rights, third-party reviews, CVEs, partnerships, or operating-effectiveness evidence.
