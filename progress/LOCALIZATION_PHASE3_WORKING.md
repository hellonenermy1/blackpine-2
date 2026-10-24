# Blackpine Localization — Phase 3 Working Record

Date started: 2026-10-24

Status: IN PROGRESS — do not treat Spanish as published, approved, or production-ready until the Phase 3 release gates and post-merge checks pass.

Branch: `phase3-spanish-localization`

Base commit: `812adc3f02d549c4a9bdb3a36fe1416e23d801a8` (Phase 2 merged `main`)

## Objective

Publish a professional international-Spanish (`es`) corporate-site experience for all approved non-lawyer-controlled public content while preserving factual meaning, uncertainty, authorization boundaries, contractual qualifiers, security limitations, accessibility, privacy/security controls, SEO correctness, performance budgets, and the separate Cipher/Verify/Support trust boundaries.

## Language standard

Spanish must be neutral, fluent, professional international Spanish. The work must not read like literal English, generic machine translation, or region-specific copy accidentally optimized for only Spain or one Latin American market.

Terminology register: `governance/LOCALIZATION_TERMINOLOGY_ES.md`.

## Legal boundary

The lawyer-controlled English/French Terms and Privacy documents are not to be machine-translated or presented as approved Spanish legal text. Phase 3 must not publish `/es/legal/terms/` or `/es/legal/privacy/` without an approved Spanish legal source. The language switcher must therefore show Spanish as unavailable on those two documents rather than fabricating a counterpart.

Other public pages may be localized when their content is not subject to that lawyer-source integrity gate.

## Planned technical scope

- Spanish route counterparts under `/es/...` for approved pages.
- Spanish-specific 404 state without a crawlable fake `/es/404/` route.
- Locale-pure `/es/search-index.json`.
- Complete Spanish shared chrome, navigation, breadcrumbs, accessibility labels, search, preferences, contact guidance, tools, client-side messages, smart 404 behavior, and runtime states.
- Reciprocal `en-CA`, `fr-CA`, `es`, and `x-default` alternates only where a counterpart actually exists.
- English and French routes remain unchanged except for language-switch availability and reciprocal Spanish alternates on pages with reviewed Spanish counterparts.
- Cipher/Verify/Support remain separate hostnames and never receive an `/es/` prefix.
- No analytics, trackers, remote fonts, advertising, new runtime dependencies, or weakened CSP/security controls.

## Quality gates

1. Controlled Spanish terminology register.
2. Full rendered-string inventory coverage for the approved Spanish route set.
3. Zero accidental untranslated metadata/body/accessibility/runtime strings, excluding protected names/tokens.
4. Human editorial pass after translation coverage reaches zero gaps.
5. Technical cybersecurity terminology review.
6. Claim/qualifier preservation review.
7. Route parity for approved Spanish routes and explicit absence of Spanish lawyer-controlled Terms/Privacy.
8. Correct canonicals/hreflang and locale-pure search indexes.
9. Desktop/tablet/320px rendered-browser checks and Firefox smoke testing.
10. External-link validation.
11. Security/privacy/legal-regression/hosting/performance checks remain green.
12. Exact-head CI before merge, post-merge `main` verification, then canonical Cloudflare-origin verification where the environment permits it.

## Phase 2 handoff note

Phase 2 was merged as `812adc3f02d549c4a9bdb3a36fe1416e23d801a8`, and post-merge verify/external/browser jobs passed. The current execution environment could not resolve/open `blackpinecybersecurity.com` for the final canonical Cloudflare-origin observation, so that live-origin proof was not fabricated. Phase 3 starts from the verified repository merge state.
