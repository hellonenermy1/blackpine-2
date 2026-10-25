# Blackpine new production audit — Phase 3 engineering quality

Date: 2026-10-25
Branch: `audit/phase-3-engineering-quality`
Baseline production commit: `7af71cd3835408c85582c3e044482e9f6c5304f2`
Validated implementation candidate: `9c365928da1ea29283b487deebe804b24f4fdd12`
PR: #35

## Phase result

**PASS WITH DEFERRED RELEASE / GOVERNANCE ITEMS**

Phase 3 met its engineering-quality exit criteria on the immutable implementation candidate identified above. No Critical or High findings remain open from this phase, and no Phase 3 Medium finding remains unresolved.

This record intentionally treats `9c365928da1ea29283b487deebe804b24f4fdd12` as the implementation evidence point. The documentation commit that adds this file is not itself treated as a Phase 3 implementation SHA, preventing a self-referential closeout loop.

## Exact-head evidence

GitHub Actions workflow `Verify Blackpine` run `40176362271` completed successfully for implementation candidate `9c365928da1ea29283b487deebe804b24f4fdd12`.

Candidate checks:

- `verify`: PASS
- `external-links`: PASS
- `browser-audit`: PASS
- Cloudflare Pages preview: PASS / deployed successfully

Cloudflare reported:

- latest commit: `9c36592`;
- commit preview: `https://04dbd724.blackpine-cybersecurity.pages.dev`;
- branch preview: `https://audit-phase-3-engineering-qu.blackpine-cybersecurity.pages.dev`.

The browser job log explicitly reports:

- generic rendered-browser audit: PASS;
- `Phase 3 engineering browser checks passed: one-way legacy theme migration, primary preference persistence, extracted header/email/DNS tools, assessment behavior, and French/Spanish route-scoped runtime smoke.`;
- French localization browser audit: PASS;
- Spanish localization browser audit: PASS;
- Phase 4 failure/accessibility browser audit: PASS.

Browser artifact for the candidate:

- name: `blackpine-browser-audit`;
- artifact ID: `12592336331`;
- SHA-256 digest: `95de76aebe89056994e8c4a60c21b7cafa1ec4a7447ce4884cee25d879151e86`.

## Measured engineering result

Before Phase 3, ordinary pages referenced approximately **63.6 KiB** of JavaScript.

The validated Phase 3 candidate references approximately **34.0 KiB** across **5 JavaScript assets** on ordinary pages, a reduction of roughly **46%** in globally referenced JavaScript.

Measured candidate state:

- ordinary-page JS: ~34.0 KiB;
- ordinary-page JS requests: 5;
- contact route JS: ~49.1 KiB;
- local tool route JS: ~49.2 KiB;
- CSS: ~49.0 KiB / 64 KiB budget;
- English search index: ~239.4 KiB / 256 KiB budget;
- largest ordinary HTML: `fr/index.html`, ~38.2 KiB / 48 KiB budget;
- largest lawyer-controlled legal HTML: `fr/legal/privacy/index.html`, ~63.9 KiB / 64 KiB budget.

The build remains dependency-free at runtime and does not require a package installation step.

## Source/build audit evidence

The validated candidate passed the full existing structural, production, trust, claims, legal, hosting, pages-safety and localization gate set plus the new Phase 3 engineering gates.

The final candidate audit reported:

- 253 indexable routes + 9 noindex/error routes;
- 85 English, 85 French and 83 Spanish search-index routes;
- seven reviewed browser runtime source files;
- eight content-addressed build assets across shared and route-scoped runtimes;
- 172 code/config files and 19,050 lines in the line-by-line review;
- **0 unresolved line-review warnings**;
- no runtime dependency install required.

## Phase 3 findings and disposition

### P3-001 — globally shipped contact / smart-404 runtime

Severity: Medium
Disposition: **FIXED**

`phase2.js` was previously referenced by every generated page despite being needed only for the contact composer and smart 404 behavior.

The build is now route-aware:

- `/contact/`, `/fr/contact/`, `/es/contact/` retain the feature runtime;
- generated EN/FR/ES 404 pages retain the feature runtime;
- ordinary routes do not reference it.

Regression gates verify both sides of that boundary, including the existing contact privacy/security assertions and smart-404 behavior.

### P3-002 — split / implicit theme-preference ownership

Severity: Medium
Disposition: **FIXED**

Previously theme state was implicitly coordinated across `theme-init.js`, `site.js`, and `preferences.js`, including live writes to both `blackpine.preferences.v1` and legacy `blackpine-theme` plus microtask ordering.

After Phase 3:

- `blackpine.preferences.v1` is the only live preference write store;
- `site.js` changes presentation state and emits `blackpine:themechange` but does not own browser storage;
- `preferences.js` persists theme changes into the primary record;
- `theme-init.js` performs pre-paint restore and one-way migration of valid legacy dark/light values;
- the legacy key is cleanup/migration-only and is not written again;
- migration remains fail-safe when storage is blocked.

Real-browser tests verify legacy migration, cleanup, theme change and primary-store persistence.

### P3-003 — Spanish active-navigation state inconsistency

Severity: Low / Medium accessibility-context issue
Disposition: **FIXED**

The earlier concern was narrowed after tracing the whole render pipeline: Spanish body page-family and social-image selection were already corrected downstream and were not broken.

The real defect was active/current navigation state. Shared navigation hardening now normalizes rendered locale hrefs through `basePathForLocale()` and applies context/current state from the normalized route for EN, FR and ES consistently.

Generated-output checks verify that `/es/services/protect/` marks the Capabilities parent as active and the current child with `aria-current="page"` while retaining the `page-services` family.

### P3-004 — route-specific local tools bundled globally

Severity: Medium
Disposition: **FIXED**

The security-header checker, email-security checker, DNS checker and self-assessment previously lived in the global `site.js` bundle and no-op'd on unrelated routes.

They are now isolated in fingerprinted `src/tools.js` and loaded only on the 12 EN/FR/ES tool/assessment routes.

The global site runtime now focuses on shared behavior: theme UI, primary navigation, research filters and local site search.

Security invariants are enforced across the Phase 3, Phase 2 security and deep-production gates:

- tool input is not persisted;
- tool input is not sent using `fetch`, XHR, WebSocket, EventSource or beacon APIs;
- no cookie / IndexedDB / localStorage / sessionStorage use is permitted in the tools runtime;
- no unsafe dynamic HTML/eval sink was introduced.

Real-browser tests exercise header, email, DNS and assessment behavior, plus French assessment and Spanish tool smoke.

### P3-005 — accessibility specialist runtime overlaps shared keyboard handling

Severity: Low maintainability observation
Disposition: **ACCEPTED INTENTIONALLY**

`public/a11y-v3.js` overlaps conceptually with navigation/search keyboard handling in `site.js`, but it is not dead duplicate code.

It owns specialist guards that are not equivalently provided by the shared runtime:

- capture-phase repeated Cmd/Ctrl+K protection;
- search-dialog Tab focus trapping;
- post-Escape navigation focus restoration.

The generic browser audit directly exercises repeated search-shortcut handling, modal isolation, focus restoration and navigation/Escape behavior.

Consolidating this small guard layer would save little while increasing regression risk, so the separation is intentionally retained and covered by tests.

## Test-harness issues found during Phase 3

Two failures encountered while adding the focused Phase 3 browser suite were test-harness defects rather than website defects:

1. an evaluated CSP sample originally had unsafe nested quoting; it was replaced with JSON-encoded sample injection;
2. Chrome profile cleanup could race the Chrome process and raise `ENOTEMPTY`; teardown now waits for child process exit and uses bounded recursive cleanup retries.

The final implementation candidate passed after both harness defects were corrected.

## Preserved security / architecture boundaries

Phase 3 did not introduce:

- third-party analytics;
- ad networks;
- tag managers;
- remote fonts;
- third-party form processors;
- runtime frameworks or package dependencies;
- cross-surface corporate runtime dependencies into Cipher, Verify or Support;
- a service worker;
- external runtime scripts/styles;
- additional browser-storage keys;
- contact or local-tool data persistence/network submission.

Cipher, Verify, Support and the corporate site remain separate trust surfaces.

## Deferred items not falsely closed by Phase 3

The following remain intentionally open because they belong to repository governance or later audit phases:

- `main` branch protection / required-status enforcement remains off (P1-001);
- Safari/WebKit and real-device release evidence remains outstanding for Phase 6;
- lawyer-controlled legal HTML remains near its 64 KiB budget (~63.9 KiB on the largest page);
- the previously reproduced ~2 px 320 px overflow on `/legal/company-information/` remains a later UI/reflow item unless separately demonstrated fixed;
- first-visit preference-dialog UX and verbose privacy/customer-facing copy remain Phase 4/5 targets;
- the full per-claim definition → evidence → test → wording register remains a Phase 5 deliverable.

## Exit-gate result

Critical findings: **0**
High findings: **0**
Phase 3 Medium findings: **0 open**
Phase 3 accepted-intentional items: **1 low maintainability item (P3-005)**
Unresolved line-review warnings: **0**
Ordinary-page JavaScript: **~34.0 KiB**
Unexpected third-party runtime subresources: **none identified**
Unexpected new browser persistence mechanisms: **none identified**
Local tool data persistence/network submission: **absent by enforced gate and browser architecture**
Runtime dependency installation: **not required**

## Handoff

This file closes the implementation-candidate portion of Phase 3. The documentation commit containing this record must itself pass the same verify, external-link, browser and Cloudflare preview checks before PR #35 is eligible to merge.

After PR #35 merges, verify the exact resulting `main` commit, Cloudflare production deployment and GitHub Pages build/deployment before declaring Phase 3 complete.
