# Blackpine Localization — Phase 4 Working Record

Date started: 2026-10-25

Status: PRE-MERGE IMPLEMENTATION COMPLETE — final documentation/release-state head still requires exact-head CI before merge. Do not call Phase 4 production-complete until merge, post-merge `main` verification and exact Cloudflare Pages deployment evidence are complete.

Branch: `phase4-multilingual-hardening`

PR: #31

Base commit: `7e2584eb2ce069ac15e07a473e55b9b01aa2e1d0` (Phase 3 merged `main`)

Last fully green implementation head before the final rollout/documentation commits: `276efd7e20ea800dc62aa0d7042860f38b87c896`

Verified workflow run on that implementation head: `40157678370`

## Objective

Treat English (`en-CA`), Canadian French (`fr-CA`) and reviewed international Spanish (`es`) as one production localization system and harden publication, drift detection, SEO equivalence, claim integrity, accessibility/failure behavior, performance and release discipline.

## Non-negotiable boundaries preserved

- The site remains a dependency-free static build with shared fingerprinted CSS/JavaScript and locale-separated search indexes.
- Existing performance budgets were not raised to make localization pass.
- Spanish lawyer-controlled Terms and Privacy remain unpublished until separately approved Spanish legal sources exist.
- Approved English/French lawyer-controlled Terms and Privacy source documents were not modified by Phase 4.
- Cipher, Verify and Support remain separate hostnames and trust surfaces.
- No third-party translation service, analytics, advertising, tracking identifier or localization JavaScript was introduced.
- No localization may strengthen security, certification, availability, response, recovery, client-evidence or other operational claims beyond the approved English source.

## Translation lifecycle, publication authority and provenance

Phase 4 establishes the lifecycle:

`DRAFT → TRANSLATED → TECHNICAL_REVIEWED → LEGAL_REVIEWED (where applicable) → APPROVED → PUBLISHED → STALE`

Translation-file or catalog existence is no longer publication authority. `src/routes.mjs` generates French or Spanish counterparts only when the frozen localization registry marks that source/locale pair `PUBLISHED`.

The Phase 4 approval baseline was generated from exact Phase 3 production source revision `7e2584eb2ce069ac15e07a473e55b9b01aa2e1d0`. The bootstrap artifact contained:

- 87 English source units;
- 87 French published approvals;
- 85 Spanish published approvals;
- 50 critical source units;
- 2 lawyer-controlled legal source units;
- no Spanish approval for `/legal/privacy/` or `/legal/terms/`.

The frozen approval registry is split into reviewable governance shards under `governance/localization-status/` for core flows, Services, Trust, research/proof, resources/Labs/tools, and company/legal content.

Each locale approval stores the exact English source SHA-256 it was reviewed against. Current English route content is deterministically hashed from its public route/page representation, excluding localization-only metadata.

When current English content no longer matches the approved source hash, the effective translation state is `STALE`:

- `critical` and `legal` stale translations block production;
- `standard` stale translations are surfaced in the Phase 4 translation-status report and can be handled editorially without silently pretending they are current.

A deterministic drift fixture proves that changed critical/legal content blocks, changed standard content reports without blocking, matching approvals remain current, and DRAFT translations do not become public.

The permanent CI report is `phase4-artifacts/translation-status-report.json`. The bootstrap generator remains a manual utility and is deliberately not part of release verification so current English content cannot silently redefine the approval baseline.

## Three-language SEO and system hardening

`scripts/check-i18n-phase4-system.mjs` compares EN/FR/ES as one publication system and checks:

- rendered document-language semantics and locale identity;
- self-canonical URLs;
- reciprocal `hreflang` and `x-default` only for published counterparts;
- localized title/description/Open Graph/Twitter metadata;
- locale-neutral page-family and social-image selection;
- crawlable ordinary language-selector links to equivalent routes;
- explicit unavailable-counterpart states;
- BreadcrumbList targets against localized breadcrumbs;
- Article JSON-LD canonical/headline/description/locale-aware author targets;
- locale-dependent structured-data parity while preserving the existing narrow Organization-schema policy;
- exact sitemap membership with no synthetic build-time `<lastmod>` freshness;
- locale-pure search membership, family classification and metadata.

Phase 4 found and corrected a real shared-rendering asymmetry: `/fr/` had been normalized to its base route for page-family decisions while `/es/` was not. Spanish pages now use the same locale-neutral route family for shared page context and Open Graph image selection.

The existing Organization JSON-LD boundary remains intentionally narrow: it is present only on the canonical English Home/About routes. Phase 4 does not weaken that established production rule by duplicating top-level Organization schema across every localized page.

The existing document-language behavior is also preserved deliberately: ordinary English pages render `lang="en"`, lawyer-controlled English Terms/Privacy retain `lang="en-CA"`, French uses `fr-CA`, and Spanish uses `es`; locale identity, routing and `hreflang` continue to use `en-CA`, `fr-CA` and `es`.

## Cross-language claim integrity

`scripts/check-i18n-phase4-claims.mjs` requires approved French and Spanish counterparts for critical English qualifiers covering:

- OPEN evidence state meaning not claimed;
- readiness not being certification/attestation/legal or regulatory determination;
- conditional recovery and no recovery guarantee;
- no public around-the-clock/response-time/containment commitment without an approved operating model and contract;
- the corporate Cipher page not being the authoritative cryptographic specification;
- testimonial confidentiality/translation and non-inference boundaries;
- planned roles not being represented as confirmed current vacancies.

The localized rendered corpus is also scanned for prohibited certification, guaranteed-recovery and 24/7-coverage inflation and for accidental advertising of unpublished Spanish lawyer legal routes.

## Preference failure and accessibility hardening

Phase 4 extends the rendered-browser release gate with:

- fresh/incognito-style storage state;
- corrupted preference JSON;
- unknown saved locale;
- saved-locale versus explicit deep-link precedence;
- EN→ES equivalent-route navigation;
- browser Back/Forward behavior;
- unavailable Spanish lawyer legal counterparts and direct 404 behavior;
- blocked localStorage writes and reads;
- no-JavaScript progressive access from server-rendered content and ordinary language links;
- keyboard-only dialog activation;
- repeated Tab focus containment;
- accessibility-tree named-dialog semantics;
- Escape close/focus restoration;
- reduced-motion rendering;
- 320 px modal/page behavior.

This audit exposed a genuine focus-containment defect: after cycling through all preference controls, a sixth Tab could leave the modal. `src/preferences.js` now explicitly wraps forward Tab from the last usable control to the first and Shift+Tab from the first to the last while preserving normal intermediate Tab behavior, Escape and opener-focus restoration.

The Phase 4 browser gate is now part of the ordinary `check:browser` job; it is not a one-off manual test.

## Performance and architecture evidence

On exact implementation head `276efd7e20ea800dc62aa0d7042860f38b87c896`, the original caps still pass:

- CSS: 49.0 KiB / 64.0 KiB
- runtime JS: 63.6 KiB / 64.0 KiB
- search: 239.4 KiB / 256.0 KiB
- largest ordinary HTML: `fr/index.html` at 38.2 KiB / 48.0 KiB
- largest lawyer legal HTML: `fr/legal/privacy/index.html` at 63.9 KiB / 64.0 KiB

Runtime JavaScript is therefore close to its existing ceiling and is a release watch item. Phase 4 did not increase that ceiling.

The guarded legal-preference compactor continues to compact shared preferences chrome only outside lawyer-controlled `<main id="main">` content and aborts if the approved legal main content changes.

## Pre-merge implementation verification evidence

Workflow run `40157678370` on exact implementation head `276efd7e20ea800dc62aa0d7042860f38b87c896` completed with:

- `verify`: SUCCESS
- `external-links`: SUCCESS
- `browser-audit`: SUCCESS

That run included:

- 0 Phase 2/French localization gaps;
- 0 Phase 3/Spanish localization gaps;
- Phase 4 status: 172 published locale approvals, 0 blocking stale, 0 standard-risk stale;
- Phase 4 drift fixture: PASS;
- Phase 4 publication/drift gate: PASS;
- Phase 4 three-language SEO/system gate: PASS across 259 published route outputs;
- Phase 4 cross-language claim gate: PASS;
- all established security, legal, privacy, hosting, roadmap, client-proof, Trust and performance checks;
- line-by-line source review with 0 unresolved warnings;
- rendered general, French, Spanish and Phase 4 failure/accessibility browser audits;
- external destination validation.

The Phase 4 browser artifact from that run has SHA-256 `e9fce74c1839271af4c1e0d6d52a9c61b8465ba3d41daca384819dcc3a65f7bf` and artifact ID `12584792423`.

The Spanish locale metadata is now moved from the Phase 3 `partial` rollout marker to `published`; the actual legal boundary remains unchanged because Spanish Terms/Privacy still have no PUBLISHED registry approval and no generated route.

## Remaining release sequence

1. Run the complete exact-head suite for the final rollout/documentation-inclusive candidate head.
2. Confirm PR #31 has no unresolved review threads/submitted review blockers and remains mergeable.
3. Mark PR #31 Ready and merge using the exact tested head SHA as a merge lock.
4. Confirm `main` equals the resulting merge commit and run the complete post-merge verify/external/browser suite.
5. Verify Cloudflare Pages reports successful deployment of that exact merge commit before calling Phase 4 production-complete.
6. Treat independent custom-domain observation as a separate proof. If this environment cannot resolve or fetch `blackpinecybersecurity.com`, record that limitation rather than fabricating live-origin parity.
