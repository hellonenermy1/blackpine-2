# Blackpine Localization — Phase 4 Working Record

Date started: 2026-10-25

Status: IMPLEMENTATION IN PROGRESS — do not treat Phase 4 as production-complete until exact-head pre-merge verification, merge, post-merge `main` verification, and exact Cloudflare Pages deployment evidence are complete.

Branch: `phase4-multilingual-hardening`

PR: #31

Base commit: `7e2584eb2ce069ac15e07a473e55b9b01aa2e1d0` (Phase 3 merged `main`)

## Objective

Treat English (`en-CA`), Canadian French (`fr-CA`) and reviewed international Spanish (`es`) as one production localization system and harden publication, drift detection, SEO equivalence, claim integrity, accessibility/failure behavior, performance and release discipline.

## Non-negotiable boundaries

- The site remains a dependency-free static build with shared fingerprinted CSS/JavaScript and locale-separated search indexes.
- Existing performance budgets are not raised merely to make localization pass.
- Spanish lawyer-controlled Terms and Privacy remain unpublished until separately approved Spanish legal sources exist.
- Approved English/French lawyer-controlled Terms and Privacy content must not be modified by localization hardening.
- Cipher, Verify and Support remain separate hostnames and trust surfaces.
- No third-party translation service, analytics, advertising, tracking identifier or localization JavaScript is introduced.
- No localization may strengthen security, certification, availability, response, recovery, client-evidence or other operational claims beyond the approved English source.

## Translation lifecycle and provenance

Phase 4 introduces the lifecycle:

`DRAFT → TRANSLATED → TECHNICAL_REVIEWED → LEGAL_REVIEWED (where applicable) → APPROVED → PUBLISHED → STALE`

A translation is public only when its registry state is `PUBLISHED`. Translation-file existence alone is not publication authority.

Each published translation records the English source hash/revision against which it was approved. Current English source content is deterministically hashed from the route's public content/metadata representation, excluding localization-only metadata.

When current English content no longer matches a translation's approved source hash, the translation is effectively `STALE`:

- `critical` and `legal` stale translations fail the production release gate;
- `standard` stale translations are surfaced in the translation-status report and may remain temporarily published for editorial follow-up.

Critical coverage includes Services, Trust, incident/contact guidance, methodology, security baseline, Cipher corporate guidance, external-verification/client-evidence and other security/assurance-sensitive routes. Lawyer-controlled Privacy/Terms are `legal` risk.

## Phase 4 audit scope

The release gate will compare published route families and validate:

- language and locale markers;
- self-canonical URLs;
- reciprocal `hreflang` and `x-default` only for actually published counterparts;
- title/description/Open Graph/Twitter metadata consistency;
- structured-data canonical, article and breadcrumb targets;
- sitemap exactness and absence of synthetic build-time freshness;
- localized breadcrumb/internal-link destinations;
- locale-pure search classification;
- crawlable language-selector equivalent links;
- unpublished Spanish legal boundaries;
- cross-language preservation of claim qualifiers and non-public capability boundaries.

The rendered-browser Phase 4 audit will extend existing tests with storage failure/corruption, unknown locales, unavailable translations, direct deep links, browser history, no-JavaScript progressive access, fresh/incognito-style storage state, keyboard/focus behavior, accessibility-tree semantics, reduced-motion behavior and narrow-screen layout.

## Release discipline

1. Build the persistent translation registry from the exact Phase 3 production baseline.
2. Replace bootstrap tooling with permanent status/drift reporting and release checks.
3. Add unified SEO/link/claim integrity checks across EN/FR/ES.
4. Add rendered-browser abuse/failure tests.
5. Run the complete existing Blackpine suite plus Phase 4 structural, browser and external-link checks.
6. Test the exact final candidate head. Any subsequent commit requires a new exact-head run.
7. Mark PR #31 ready and merge only after the final head is green and review state is clear.
8. Retest the exact merge commit on `main`.
9. Verify that Cloudflare Pages reports deployment of that exact merge commit before calling Phase 4 production-complete. Independent custom-domain observation is reported separately and is never fabricated if the execution environment cannot resolve it.
