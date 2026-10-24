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

## Pass 1 corrections

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

The first corrected-head verification completed successfully across the core build/regression suite, the expanded site-wide external-link audit, and the rendered Chrome/Firefox browser audit. That run was treated as intermediate evidence only because the second audit below produced additional corrections.

## Pass 2 — independent bug-oriented review

The second pass reviewed the changed tree again from a failure-mode perspective instead of assuming the first green run proved release readiness. It specifically challenged asynchronous completion, repeated user input, focus return, modal isolation, hidden content, deployment-policy drift, accidental publication, audit-code blind spots, cross-browser runner behavior, public external entry points, and CI wording that could misrepresent coverage.

Additional issues found and corrected:

1. Pressing `Ctrl/⌘ K` again while the search dialog was already open could overwrite the original return-focus target with the search input itself. The accessibility runtime now intercepts repeated open-shortcut presses while the dialog is open, keeps focus in the search field, and preserves the original return target. The browser audit now exercises the repeated shortcut.
2. The skip link originally sat outside the header/main/footer elements that became inert for the modal. It is now inside the inertable site header, so the complete page chrome is removed from interaction while the modal is active and is restored before focus return.
3. The newly added deep-audit record itself was initially omitted from the noncanonical GitHub Pages exclusion list. It is now explicitly excluded and covered by both Pages-safety and deep-production gates.
4. The external-link CI step label still described the older research-only scope after the checker had been expanded site-wide. The workflow label now accurately states that it checks external site destinations.
5. A temporary audit marker file was removed so the final branch contains only durable audit evidence and production-relevant changes.
6. A later exact-head browser run rendered all 86 audited Chrome routes successfully but exposed a flaky Firefox smoke implementation: the runner hit the old 30-second process timeout and produced no Firefox screenshot. The smoke test now uses an isolated Firefox profile, a longer bounded timeout, and screenshot existence as the actual render-success criterion while retaining diagnostics for abnormal process exits. This fixes the test reliability problem without weakening the requirement for real Firefox render evidence.
7. The broadened external-link audit exposed a visitor-facing problem that a 404-only checker would have missed: `https://verify.blackpinecybersecurity.com/` returned HTTP 400 when used as a generic root link. Verification is release/workflow-specific, so the corporate site no longer guesses that the Verify root is a valid landing page. Generic Verify navigation now points to internal verification guidance, and the external-link audit hard-fails future public destinations returning HTTP 400/404/410. The deep-production gate separately prevents the context-free Verify root href from returning to generated pages.

The second pass also re-examined the new hardening for unintended regressions. It did not identify a reason to add heavier client frameworks, remote analytics, Trusted Types policy plumbing, or new dependencies: the current static architecture has no dynamic HTML/eval sinks, and adding machinery without an actual sink would increase complexity rather than reduce demonstrated risk.

## Release gate

The corrected head is production-ready only if all of the following pass on the same final commit after the second-pass corrections:

- build and structural checks;
- legacy/V4/Phase 1–5 regression gates;
- final roadmap claim gate;
- deep-production audit across the executable/config surface and all generated HTML;
- hosting and GitHub Pages safety checks;
- site-wide external destination audit, including no public 400/404/410 entry-point failures;
- rendered Chrome audit of every indexed route at desktop and 320px plus representative tablet routes and key noindex/404 states;
- keyboard/modal/contact/search interaction tests, including repeated search-shortcut handling;
- verified Firefox screenshot smoke;
- no unresolved high-severity finding from the second audit.

The authoritative pass/fail evidence for the final tree is the GitHub Actions run attached to the exact PR head commit; this document deliberately does not hard-code a future CI result that could become stale if the head changes.

Real-world assurance remains separate. This work does not create ISO certification, SOC 2 attestation, insurance evidence, customer-logo rights, third-party reviews, CVEs, partnerships, or operating-effectiveness evidence.
