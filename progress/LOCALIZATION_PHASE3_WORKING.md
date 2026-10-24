# Blackpine Localization — Phase 3 Working Record

Date started: 2026-10-24

Status: PRE-MERGE IMPLEMENTATION AND AUDIT COMPLETE — final documentation commit still requires exact-head CI before merge. Spanish must not be treated as deployed to the canonical Cloudflare origin until post-merge and live-origin verification complete.

Branch: `phase3-spanish-localization`

Base commit: `812adc3f02d549c4a9bdb3a36fe1416e23d801a8` (Phase 2 merged `main`)

Last fully green implementation head before this record update: `fd5e587db901af1a4e4e3799c17b793a0c70a110`

Verified workflow run on that implementation head: `40112866593`

## Objective

Publish a professional international-Spanish (`es`) corporate-site experience for all approved non-lawyer-controlled public content while preserving factual meaning, uncertainty, authorization boundaries, contractual qualifiers, security limitations, accessibility, privacy/security controls, SEO correctness, performance budgets, and the separate Cipher/Verify/Support trust boundaries.

## Language standard

Spanish is neutral, fluent, professional international Spanish. It is not implemented as a runtime machine-translation layer or a third-party localization widget.

Terminology register: `governance/LOCALIZATION_TERMINOLOGY_ES.md`.

A final manual editorial and cybersecurity-claim review was completed across services, Trust/assurance, client evidence/testimonials, research/publications, company/external verification, reports/advisories, Labs/Cipher, public tools, shared UI, and metadata. The authoritative final editorial layer is `src/i18n/es-final-editorial.mjs`; its reviewed refinements are enforced by `scripts/check-i18n-phase3-editorial-final.mjs`.

## Legal boundary

The lawyer-controlled English/French Terms and Privacy documents were not translated, edited, or presented as approved Spanish legal text. Phase 3 does not publish:

- `/es/legal/terms/`
- `/es/legal/privacy/`

Those routes remain unavailable in the Spanish language switcher, search index, sitemap, and generated output until an approved Spanish legal source exists.

The four approved EN/FR Terms/Privacy main document bodies remain protected by their existing source-hash/legal-document checks. The shared preferences UI on those long legal pages is compacted only outside `<main id="main">`; the compaction script aborts if legal main content changes.

## Implemented technical scope

- Reviewed Spanish counterparts under `/es/...` for 85 approved routes.
- 83 indexable/searchable Spanish routes; Spanish search is isolated in `/es/search-index.json`.
- Spanish-specific 404 rendering and locale-aware unknown-path behavior without a crawlable `/es/404/` route.
- Complete Spanish shared chrome, navigation, breadcrumbs, accessibility labels, search, preferences, contact guidance, public tools, research filters, smart 404 behavior, and client-side states.
- Reciprocal `en-CA`, `fr-CA`, `es`, and `x-default` alternates only where the counterpart exists.
- Self-canonical `lang="es"` Spanish pages.
- English and French remain their own locale surfaces; Spanish lawyer Terms/Privacy remain intentionally absent.
- Cipher/Verify/Support remain separate hostnames and do not receive `/es/` prefixes.
- No analytics, trackers, remote fonts, advertising, third-party localization JavaScript, runtime translation service, or new runtime package dependency was introduced.
- Preferences dialog moved to server-rendered localized HTML so the three-language experience stays inside the existing JavaScript budget; runtime JavaScript retains behavior/storage/navigation only.
- Long EN/FR lawyer legal pages use a compact preference control to stay within the existing legal HTML budget without changing approved legal content.

## Translation and editorial release gates

Phase 3 now has both reporting and hard release gates:

- `scripts/report-i18n-phase3-gaps.mjs`
- `scripts/check-i18n-phase3.mjs`
- `scripts/check-i18n-phase3-editorial-final.mjs`
- `scripts/check-i18n-phase3-browser.mjs`

The hard gates enforce:

- zero untranslated Spanish metadata fields;
- zero untranslated Spanish body/attribute strings within the approved corpus;
- zero Spanish catalog conflicts;
- exact Spanish route/search/sitemap boundaries;
- correct document language, self-canonical URLs and reciprocal hreflang;
- no accidental Spanish lawyer Terms/Privacy publication;
- locale-pure Spanish search;
- final reviewed terminology and anti-calque regressions;
- preservation of readiness/certification, recovery, service-availability, Cipher, testimonial/client-evidence and hiring claim boundaries;
- rendered Spanish preference/search/contact/404/tool/research behavior.

## Claim and security boundaries preserved

The Spanish release does not strengthen the English source claims. In particular:

- readiness is not represented as certification, attestation, regulatory approval, or audit opinion;
- `OPEN` / `ABIERTO` evidence states mean the claim is not asserted;
- active security testing remains authorization-gated;
- public website intake remains unsuitable for credentials, private keys, malware samples, full logs, regulated records, or sensitive client/incident evidence;
- no public 24/7, universal response-time, uptime, RTO/RPO, containment, remediation, or recovery guarantee is introduced;
- client testimonials are identified as Spanish translations of supplied English feedback and do not support invented metrics, ROI, client facts, or case studies;
- advisories do not invent CVEs, acknowledgements, affected versions, or vendor relationships;
- Blackpine Cipher remains a separate application; the corporate site is not presented as the authoritative cryptographic specification;
- Cipher, Verify and Support retain separate hostname/trust boundaries;
- no absolute-security, “unbreakable”, or equivalent claim was introduced.

## Performance and architecture evidence

Latest measured budgets on the fully green implementation head:

- CSS: 49.0 KiB / 64.0 KiB
- runtime JS: 62.9 KiB / 64.0 KiB
- search: 239.4 KiB / 256.0 KiB
- largest ordinary HTML: `fr/index.html` at 38.2 KiB / 48.0 KiB
- largest lawyer legal HTML: `fr/legal/privacy/index.html` at 63.9 KiB / 64.0 KiB

These caps were not increased for localization.

## Pre-merge verification evidence

On implementation head `fd5e587db901af1a4e4e3799c17b793a0c70a110`, workflow run `40112866593` completed with:

- `verify`: SUCCESS
- `external-links`: SUCCESS
- `browser-audit`: SUCCESS

That run included:

- 0 Phase 2 localization gaps / 0 French catalog conflicts;
- 0 Phase 3 Spanish metadata gaps;
- 0 Phase 3 Spanish body/attribute gaps;
- 0 Spanish catalog conflicts;
- 85 Spanish routes / 83 indexable Spanish search records;
- all established production, security, legal, privacy, hosting, roadmap, client-proof, Trust, performance and Pages-safety gates;
- the hard Phase 3 Spanish release gate;
- the final Spanish editorial/claim-integrity gate;
- rendered browser tests for existing behavior, French localization, Spanish localization, locale-pure search, preferences, contact, tools and locale-aware 404 behavior;
- external destination validation.

PR #30 had no unresolved review threads or submitted review blockers during the final pre-merge inspection. Its changed-file inventory is limited to localization content/architecture, shared localized UI/runtime behavior, build/audit scripts, workflow/package wiring, terminology/progress records, and related tests. No lawyer legal source document, dependency lockfile, or unrelated Cipher implementation file is changed.

## Remaining release sequence

1. Run exact-head CI for this final documentation commit.
2. Confirm PR #30 remains mergeable and all required checks are green.
3. Mark the draft PR ready and merge to `main` with head-SHA protection.
4. Verify the resulting `main` head and its post-merge workflow/deployment checks.
5. Verify the canonical Cloudflare origin against the merged release where the environment can resolve it. Do not claim canonical deployment parity if that live-origin proof cannot be obtained.

## Phase 2 handoff note

Phase 2 was merged as `812adc3f02d549c4a9bdb3a36fe1416e23d801a8`, and post-merge verify/external/browser jobs passed. The execution environment could not resolve/open `blackpinecybersecurity.com` for the final canonical Cloudflare-origin observation, so that live-origin proof was not fabricated. Phase 3 preserves that rule: repository/CI success is not silently treated as proof of the canonical Cloudflare deployment.