# Blackpine Localization — Phase 4 Final Closeout

Date: 2026-10-25

Status: CLOSED — production release verified.

## Final production release

Phase 4 was implemented on PR #31 (`phase4-multilingual-hardening`) and merged to `main`.

- Final pre-merge candidate: `a0aac3adb30faf1deb53775d3647c17fca078326`
- PR #31 merge commit: `22dc84eab98a9f2167f3898f76f8b0dd6c2b09a0`
- Post-merge `main` verification workflow: `40159169588`
- GitHub Pages safety deployment workflow: `40159169138`
- Cloudflare Pages check-run: `121066939905`
- Cloudflare deployment/check ID: `f0719eae-9d6a-42bb-a19a-e836a12d1739`
- Cloudflare preview URL: `https://f0719eae.blackpine-cybersecurity.pages.dev`
- Cloudflare result: `Deployed successfully`
- Cloudflare reported latest commit: `22dc84e`

The canonical production deployment requirement is satisfied by Cloudflare's own GitHub App check on the exact merged commit. GitHub Pages remains a noncanonical safety surface only.

## Phase 4 controls delivered

### Translation lifecycle, publication authority and drift prevention

The multilingual system now uses a frozen English-source approval registry and a durable lifecycle:

`DRAFT → TRANSLATED → TECHNICAL_REVIEWED → LEGAL_REVIEWED (where applicable) → APPROVED → PUBLISHED → STALE`

A translation is not public merely because a translation file exists. Locale routes are generated only when the approval registry authorizes `PUBLISHED` state.

Each approved French/Spanish unit stores the English source hash/revision against which it was reviewed. Current English is deterministically hashed and compared with that frozen approval. Effective drift rules are:

- critical/legal stale translations block release;
- standard-risk stale translations are reported without automatically blocking;
- pre-publication states remain non-public.

A deterministic fixture test proves both the blocking and reporting paths, preventing future refactors from silently disabling drift protection.

Final production status:

- 87 English source units
- 87 French published routes
- 85 Spanish published routes
- 172 published locale approvals
- 0 non-published locale records in the current release set
- 0 blocking stale translations
- 0 standard-risk stale translations

Spanish lawyer-controlled Terms and Privacy remain deliberately unpublished because no approved Spanish lawyer source exists.

### Three-language SEO and system parity

Phase 4 validates EN/FR/ES as one system instead of three independent sites. The permanent gate checks:

- document-language semantics;
- self-canonical URLs;
- reciprocal `hreflang` and `x-default` for actually published counterparts;
- localized titles, descriptions, Open Graph and Twitter metadata;
- locale-dependent structured-data parity while preserving the existing narrow Organization-schema scope;
- exact sitemap membership;
- breadcrumb and internal-link targets;
- crawlable language-selector equivalents;
- locale-pure search indexes;
- source-backed freshness instead of synthetic build timestamps;
- absence of unpublished Spanish lawyer legal routes.

The final system gate passed across 259 published routes.

### Cross-language claim protection

The permanent claim gate checks critical English qualifiers against the approved French and Spanish counterparts. It specifically prevents localization from strengthening Blackpine's claims.

Final production checks confirm:

- contract-dependent qualifiers remain present;
- certification/assurance `OPEN` states do not become affirmative certification claims;
- recovery/containment/coverage language is not inflated into guarantees;
- non-public capabilities do not appear accidentally in translated output;
- Spanish lawyer legal routes remain unadvertised.

Eight critical English qualifier families are protected by the cross-language release gate.

### Preference and failure hardening

The Phase 4 browser harness attacks the preference/localization system rather than only testing happy paths. It covers:

- fresh/incognito-style state;
- unavailable/corrupted storage;
- unknown locale values;
- unavailable translated pages;
- direct deep links;
- Back/Forward navigation;
- explicit URL precedence over saved preferences;
- no-JavaScript progressive access;
- blocked storage reads/writes;
- keyboard-only operation;
- focus trapping and restoration;
- accessibility-tree dialog semantics;
- reduced-motion behavior;
- 320 px rendering.

This audit found one real production defect: the preferences dialog relied on native `<dialog>` focus behavior and allowed Tab to leave the modal after the last focusable control in the headless-browser path. The production runtime now has a compact explicit Tab/Shift+Tab loop scoped only to the preferences dialog. The corrected browser audit passes.

### Static architecture and performance

Phase 4 preserves the existing static, dependency-free architecture. No framework, translation runtime service, analytics SDK, advertising script or third-party localization JavaScript was introduced.

Final measured budgets remain unchanged:

- CSS: 49.0 KiB / 64.0 KiB
- runtime JS: 63.6 KiB / 64.0 KiB
- largest locale search index: 239.4 KiB / 256.0 KiB
- largest ordinary HTML: 38.2 KiB / 48.0 KiB
- largest lawyer-controlled legal HTML: 63.9 KiB / 64.0 KiB

Runtime JS and the largest lawyer legal page have little remaining headroom and are future capacity watch items. No Phase 4 threshold was increased to obtain a pass.

### Security, legal and source integrity

The final production suite reports:

- 262 generated HTML files
- 253 indexable canonical routes
- 7 content-addressed runtime assets
- 0 unresolved line-review warnings
- no runtime dependency install required
- exact EN/FR lawyer-controlled source hashes preserved
- all four lawyer legal documents retain their 150/150 ordered clauses and expected sections/anchors/dates
- Cloudflare/Netlify security-header parity preserved
- CSP, cache, privacy, external-reputation, company-consistency and cross-surface boundaries passed
- Cipher, Verify and Support remain separate trust surfaces

## Exact pre-merge evidence

Final pre-merge candidate: `a0aac3adb30faf1deb53775d3647c17fca078326`.

Workflow `40157957558` passed all jobs on that exact head:

- `verify`: success
- `external-links`: success
- `browser-audit`: success

The pre-merge browser matrix included the original site audit, French audit, Spanish audit and Phase 4 failure/accessibility audit.

## Exact post-merge evidence

`main` points to signed merge commit `22dc84eab98a9f2167f3898f76f8b0dd6c2b09a0`.

Post-merge workflow `40159169588` passed on that exact commit:

- `verify`: success
- `external-links`: success
- `browser-audit`: success

Post-merge browser artifact:

- artifact ID: `12585704193`
- SHA-256: `bc0a9410d71810b84335b8493b9e5c3eb876bfe0b3fae4d5c82c57759108070f`

Post-merge translation-status artifact:

- artifact ID: `12584774175`
- SHA-256: `0c01a9ae72891d05cc92b42c7ecb82bf02860996ab6c5880d9838228a57edd25`

Cloudflare Pages independently reported success for the exact merge commit through check-run `121066939905`:

- status: completed
- conclusion: success
- output title: `Deployed successfully`
- reported latest commit: `22dc84e`
- deployment/check ID: `f0719eae-9d6a-42bb-a19a-e836a12d1739`
- preview: `https://f0719eae.blackpine-cybersecurity.pages.dev`

GitHub Pages workflow `40159169138` also completed successfully on the same SHA, but it is retained only as noncanonical safety evidence.

## Known non-blocking observations

- The JavaScript budget has only about 0.4 KiB remaining. Future runtime features should prefer build-time/static data or deduplication before adding executable code.
- The lawyer-controlled legal HTML ceiling is also very tight; shared chrome additions should remain compact and must never modify lawyer-controlled `<main>` content.
- The existing English `/legal/company-information/` telemetry can show approximately 2 px horizontal overflow at 320 px; this remains within the established browser-audit tolerance and was not introduced by multilingual work.
- Repository `main` branch protection is not enabled. This is a repository-governance hardening opportunity rather than a Phase 4 release defect; future releases should continue using the exact-head PR/CI discipline documented here.

## Closeout conclusion

Phase 4 achieved its planned scope:

- EN/FR/ES are treated as one production localization system;
- publication is approval-state controlled;
- translation drift is source-hash detected;
- stale high-risk translations block release;
- lower-risk stale content is reportable;
- SEO/system parity is enforced;
- critical claims are cross-language guarded;
- preference failure/accessibility behavior is browser-tested;
- current performance/security/legal boundaries remain intact;
- exact pre-merge and post-merge candidates passed the complete release suite;
- Cloudflare Pages reports successful deployment of the exact merged production commit.

Phase 4 is CLOSED with no known release-blocking error in the audited scope.
