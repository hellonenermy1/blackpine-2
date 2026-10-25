# Blackpine new production audit — Phase 4 customer experience

Date: 2026-10-25
Branch: `audit/phase-4-customer-experience`
Baseline production commit: `8a5b6eb120e945dd0e5e7ebbd5255e8293749f1d`
Validated implementation candidate: `6650165675342737db8215606ca7763869901e7b`
PR: #36

## Phase result

**PASS WITH DEFERRED RELEASE / GOVERNANCE ITEMS**

Phase 4 met its customer-experience, responsive-layout and humanisation exit criteria on the immutable implementation candidate identified above. No Critical or High finding remains open from this phase, and no Phase 4 Medium finding remains unresolved.

This record intentionally treats `6650165675342737db8215606ca7763869901e7b` as the implementation evidence point. The documentation commit that adds this file is not itself treated as the Phase 4 implementation SHA.

## Exact-head evidence

GitHub Actions workflow `Verify Blackpine` run `40178659667` completed successfully for implementation candidate `6650165675342737db8215606ca7763869901e7b`.

Candidate checks:

- `verify`: PASS
- `external-links`: PASS
- `browser-audit`: PASS
- Cloudflare Pages preview: PASS / deployed successfully

Cloudflare reported:

- latest commit: `6650165`;
- commit preview: `https://04245406.blackpine-cybersecurity.pages.dev`;
- branch preview: `https://audit-phase-4-customer-exper.blackpine-cybersecurity.pages.dev`.

The browser job log explicitly reports:

- generic rendered-browser audit: PASS;
- Phase 3 engineering browser checks: PASS;
- `Phase 4 customer-experience browser checks passed: non-interruptive first visit, user-invoked EN/FR/ES preferences, save/reset behavior, and zero 320px company-information/preferences overflow.`;
- French localization browser audit: PASS with user-invoked preferences and corrupt-storage recovery;
- Spanish localization browser audit: PASS with user-invoked preference navigation and unavailable-lawyer-route handling;
- Phase 4 localization failure/accessibility browser audit: PASS, including blocked storage reads/writes, no-JavaScript progressive access, keyboard focus trapping/restoration, accessibility-tree dialog semantics, reduced motion and 320px rendering.

Browser artifact for the candidate:

- name: `blackpine-browser-audit`;
- artifact ID: `12592389444`;
- SHA-256 digest: `732b0fcee09267325658206215f1945f42281e3e391659e28417378580ef9426`.

## Measured customer-experience / performance state

Phase 4 preserved and slightly improved the Phase 3 performance envelope while changing shared customer-facing preference UI.

Measured candidate state:

- CSS: ~49.1 KiB / 64 KiB budget;
- ordinary-page JS: ~33.1 KiB / 64 KiB budget;
- ordinary-page JS requests: 5;
- contact route JS: ~48.2 KiB;
- local tool route JS: ~48.3 KiB;
- search index: ~239.4 KiB / 256 KiB budget;
- largest ordinary HTML: `fr/index.html`, ~37.5 KiB / 48 KiB budget;
- largest lawyer-controlled legal HTML: `fr/legal/privacy/index.html`, ~63.8 KiB / 64 KiB budget.

The shorter preference copy reduced shared HTML pressure and the preference-runtime cleanup reduced ordinary-page JavaScript relative to the Phase 3 closeout state.

## Source/build audit evidence

The validated candidate passed the full existing structural, production, trust, claims, legal, hosting, pages-safety, security, engineering and localization gate set plus the new Phase 4 customer-experience gates.

The candidate audit reported:

- 253 indexable routes + 9 noindex/error routes;
- 85 English, 85 French and 83 Spanish search-index routes;
- 172 published locale approvals with 0 blocking stale and 0 standard-risk stale translations;
- seven reviewed browser runtime source files;
- 174 code/config files and 19,451 lines in the line-by-line review;
- **0 unresolved line-review warnings**;
- no runtime dependency install required.

## Phase 4 findings and disposition

### P4-001 — first visit was interrupted by a preference modal

Severity: Medium
Disposition: **FIXED**

The previous preference runtime could automatically open a modal on a new visit and infer a preferred locale from browser language settings even though the corporate site has no consent-dependent advertising or analytics behavior that requires an interruption.

After Phase 4:

- preferences do not auto-open on first visit;
- no preference record is created until the user makes a choice;
- the preference runtime no longer reads `navigator.language` or `navigator.languages` to make a pre-emptive locale choice;
- users can open preferences from the language menu or footer when they want to change language or appearance;
- explicit URLs remain authoritative over saved language preferences.

Real-browser checks prove fresh EN/FR/ES arrivals remain non-interruptive and user-invoked preference controls still work.

### P4-002 — preference copy foregrounded implementation details instead of the user choice

Severity: Medium / usability
Disposition: **FIXED**

The previous dialog used longer implementation-inventory language about site technologies. Phase 4 rewrote the shared preference UI around the actual customer decision: language, appearance and what is stored locally.

Reviewed shared copy is now concise in English, Canadian French and Spanish. The privacy statement remains explicit that Blackpine stores only language/theme preferences in that browser and does not create or transmit a unique preference identifier.

The change did not add tracking, analytics, advertising, cookies, new storage mechanisms or external runtime resources.

### P4-003 — 320 px company-information page overflowed horizontally by approximately 2 px

Severity: Medium responsive-layout defect
Disposition: **FIXED**

The dedicated Phase 4 browser gate reproduced the previous issue exactly. At a 320 px viewport:

- document client width: 320 px;
- document scroll width: 322 px;
- offending element: the `security@blackpinecybersecurity.com` link;
- measured link right edge: approximately 322.4 px.

The fix is content-safe rather than cosmetic clipping: prose links now use `overflow-wrap: anywhere`, allowing long email addresses and URLs to wrap naturally while remaining selectable and clickable.

The final Phase 4 browser candidate reports **zero** horizontal overflow on `/legal/company-information/` at 320 px, and the preference dialog also remains inside the viewport.

### P4-004 — regression gates encoded obsolete first-visit UX and source-comment wording

Severity: Medium maintainability / test-quality issue
Disposition: **FIXED**

Several older localization/deep-production checks treated the previous forced first-visit modal and long privacy sentence as permanent behavior, including one assertion that effectively required a privacy guarantee to remain inside an explanatory source comment.

Phase 4 moved the privacy assertion to the rendered customer-facing disclosure and updated EN/FR/ES browser tests to require the new behavior without reducing their existing coverage for:

- locale routing and explicit-URL precedence;
- EN/FR lawyer-controlled legal counterparts;
- unavailable Spanish lawyer routes;
- local search isolation;
- contact and 404 behavior;
- blocked/corrupt browser storage;
- keyboard focus containment/restoration;
- no-JavaScript access;
- reduced motion;
- 320 px rendering.

Dedicated `check-phase4-customer-experience.mjs` and `check-phase4-customer-experience-browser.mjs` gates now make the new Phase 4 contract explicit.

### P4-005 — focus, reduced-motion and contact-form fundamentals

Severity: Low review item
Disposition: **ACCEPTED INTENTIONALLY / NO DUPLICATE IMPLEMENTATION**

Phase 4 reviewed these foundations before adding new code.

Existing behavior already provides:

- global `:focus-visible` treatment;
- `prefers-reduced-motion: reduce` handling that disables smooth scrolling and effectively suppresses animation/transition duration;
- modal keyboard focus trapping and Escape focus restoration;
- explicit contact-form labels;
- appropriate `autocomplete`, `inputmode`, `type=email` and `type=tel` attributes;
- local-only inquiry composition with clear sensitive-data guidance.

Adding a second accessibility/focus/motion layer would increase duplication and regression risk without solving a demonstrated problem, so these systems were retained and covered by the existing + Phase 4 browser audits.

## Preserved security / architecture boundaries

Phase 4 did not introduce:

- third-party analytics;
- advertising networks;
- tag managers;
- remote fonts;
- third-party form processors;
- external runtime scripts or styles;
- runtime frameworks or package dependencies;
- new browser-storage keys;
- hidden preference identifiers;
- contact-form data persistence or website submission;
- local security-tool persistence or network transmission;
- cross-surface dependencies between the corporate site and Cipher, Verify or Support.

Cipher, Verify, Support and the corporate website remain separate trust surfaces.

## Deferred items not falsely closed by Phase 4

The following remain intentionally open because they belong to repository governance or later audit phases:

- `main` branch protection / required-status enforcement remains off (P1-001);
- Safari/WebKit and real-device release evidence remains outstanding for Phase 6;
- lawyer-controlled legal HTML remains close to its 64 KiB budget (~63.8 KiB on the largest page);
- the full per-claim definition → evidence → test → wording register remains a Phase 5 deliverable;
- any future analytics, consent, authentication or preference expansion must trigger a new privacy/storage review rather than reusing this Phase 4 decision by assumption.

## Exit-gate result

Critical findings: **0**
High findings: **0**
Phase 4 Medium findings: **0 open**
Unresolved line-review warnings: **0**
320 px company-information horizontal overflow: **0 px on the validated browser candidate**
First-visit forced preference modal: **removed**
Browser-language preselection before user choice: **removed**
Unexpected third-party runtime subresources: **none identified**
Unexpected new browser persistence mechanisms: **none identified**
Runtime dependency installation: **not required**

## Handoff

This file closes the implementation-candidate portion of Phase 4. The documentation commit containing this record must itself pass the same verify, external-link, browser and Cloudflare preview checks before PR #36 is eligible to merge.

After PR #36 merges, verify the exact resulting `main` commit, Cloudflare production deployment and GitHub Pages build/deployment before declaring Phase 4 complete.

Phase 5 should begin from that verified production state and focus on the claim/evidence register rather than reopening Phase 4 UX work unless a regression is found.