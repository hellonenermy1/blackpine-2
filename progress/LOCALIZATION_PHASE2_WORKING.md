# Blackpine Localization — Phase 2 Working Record

Date started: 2026-10-24

Status: RELEASE CANDIDATE — implementation/editorial gates have passed on the verified code head below. Do not treat Phase 2 as production-complete until the latest PR head is green, PR #29 is merged, post-merge `main` verification passes, and the canonical Cloudflare Pages origin is verified against the merged release.

Branch: `phase2-french-localization`

PR: #29 — `Phase 2 — complete Canadian-French corporate-site localization`

Base production commit: `0c6b2f9a5f30cbe19793d378aa2231bb34c66f57`

Verified implementation head: `38e3b7af279c8607f12beedd8e3b28f26436f6f2`

Verified implementation workflow run: `40104085867`

Phase 2 objective: publish a complete Canadian-French (`fr-CA`) corporate-site experience for approved public corporate content while preserving lawyer-controlled French legal text, claim boundaries, technical terminology, accessibility, privacy/security controls, performance budgets, and the separate Cipher/Verify/Support trust boundaries.

Quality rule: passing technical tests is not sufficient. French copy must read naturally to a professional Canadian cybersecurity audience and must not be a literal or mechanically structured English translation.

## Verified localization state

- 87 English routes and 87 French routes have exact counterpart parity.
- 85 routes per locale are indexable; noindex/search/contact-thanks behavior remains mirrored appropriately.
- Build output contains 170 indexable routes and 6 noindex/error documents.
- Phase 2 gap report: 0 untranslated metadata fields, 0 untranslated rendered page-body/attribute strings, 0 catalog conflicts.
- Spanish remains unpublished: 0 Spanish routes.
- English and French search are separated into locale-pure indexes with 85 entries each.
- French pages use self-canonicals plus reciprocal `en-CA`, `fr-CA`, and `x-default` alternates where applicable.
- French internal navigation remains under `/fr/...` except explicit language-switch links and the intentionally separate Cipher/Verify/Support hostnames.
- French shared chrome, navigation, breadcrumbs, search UI, privacy/language preferences, contact guidance, smart 404 behavior, tools, research filtering, and other JavaScript-generated states are localized.
- The French 404 uses the locale-specific static error document without inventing crawlable `/404/` or `/fr/404/` routes.

## Legal and claim integrity

- Lawyer-controlled English and French Terms/Privacy source hashes pass exactly.
- All four lawyer documents retain their required 17/15 section structure and 150 ordered clauses, rendered anchors/dates, bilingual counterpart links, Privacy Officer routes, and checked key provisions.
- No legal-body translation was regenerated or editorially rewritten during Phase 2.
- Existing operational-claim boundaries remain enforced, including no unsupported continuous-availability, SLA, certification, insurance, recovery, containment, or equivalent claims.
- The non-public/unproven hotline control remains non-public.
- Cipher, Verify, and Support remain separate trust boundaries and are not localized by appending `/fr/` to their hostnames.

## Canadian-French editorial review

The final editorial pass reviewed terminology and sentence quality separately from automated translation coverage. Canadian Centre for Cyber Security and Québec/OQLF terminology was used as a reference for terms such as centre des opérations de sécurité (COS), services infonuagiques, intervention en cas d’incident, rançongiciel, reprise/rétablissement, criminalistique numérique, and hameçonnage.

The review corrected non-native or overly literal wording including:

- `site corporatif` and related corporate-site calques → `site Web institutionnel` or context-specific institutional-site wording;
- service-retainer wording that had been rendered as data `rétention` → `entente de disponibilité` where the commercial relationship is meant;
- awkward keyboard hints → `Entrée : ouvrir` and `Échap : fermer`;
- `le risque` in the practice description → `la gestion des risques`;
- literal `case-study theatre` wording → a natural evidence-first French heading;
- `scanner`/`proxy` tool wording → `outil d’analyse`, `outil d’interrogation DNS`, and `serveur mandataire` where appropriate;
- untranslated internal practice names inside French prose → `Direction de pratique et services-conseils` and `Évaluations techniques et ingénierie défensive`;
- `Gouvernance et risque` → `Gouvernance et gestion des risques`;
- `continuité client` → `continuité de la relation client`.

Permanent Phase 2 regression guards now reject the reviewed calques/internal-English-practice regressions across every rendered French route so these fixes are not only one-time edits.

## Exact-head verification evidence

Workflow run `40104085867` on implementation head `38e3b7af279c8607f12beedd8e3b28f26436f6f2` passed all three jobs:

- `verify` — SUCCESS
- `external-links` — SUCCESS
- `browser-audit` — SUCCESS

The `verify` job passed the full existing production/security/legal stack plus the Phase 2 localization release gate. It also confirmed no runtime dependency installation is required.

Measured budgets on that head:

- CSS: 49.0 KiB / 64.0 KiB
- Runtime JS: 60.0 KiB / 64.0 KiB
- English search index: 239.4 KiB / 256.0 KiB
- Largest ordinary HTML: `fr/index.html` at 34.4 KiB / 48.0 KiB
- Largest lawyer legal HTML: `fr/legal/privacy/index.html` at 63.0 KiB / 64.0 KiB

No budget was raised to obtain a pass.

Deep/source review on the same head checked 114 source/config files and 176 generated HTML pages; the line review covered 115 code/config files and reported 0 unresolved warnings. Privacy, company consistency, external reputation, credibility, hosting-header parity, GitHub Pages safety, and lawyer-document gates all passed.

## Rendered-browser evidence

Final implementation browser artifact:

- Artifact ID: `12564455434`
- Artifact name: `blackpine-browser-audit`
- Artifact digest: `sha256:b107db0dbf8a8b226b56f107c4a481739b6e4d316fbd8fe9b3ee6ec3f7c69b98`
- Workflow run: `40104085867`
- Head: `38e3b7af279c8607f12beedd8e3b28f26436f6f2`

Artifact report state:

- warnings: 0
- errors: 0
- 85 indexed routes / 88 audited route states in the main reflow pass
- desktop and 320 px route coverage, representative 768 px tablet checks, and Firefox smoke coverage
- 87 English routes captured in the localization inventory
- 2,903 unique rendered English strings inventoried for Phase 2 review

The browser suites also passed repeated-search-shortcut handling, modal background isolation/inert behavior, focus restoration, mobile navigation/Escape behavior, intent-aware contact routing, smart 404 behavior, EN→FR home navigation, explicit-URL language precedence, French preference UI, EN↔FR legal mapping, locale-pure French search, French contact guidance, French 404 suggestions, French tool/research runtime states, preference clearing, and corrupt-storage recovery.

Telemetry note: the browser report observed a 2 px horizontal overflow on the existing English `/legal/company-information/` page at 320 px (`clientWidth 320`, `scrollWidth 322`). The audit reports 0 warnings and 0 errors and accepts this within its current tolerance. It is not introduced by the French localization, but it is recorded here rather than omitted.

The final Chrome desktop/mobile and Firefox screenshots from the artifact were visually inspected and showed the expected layout without an observed Phase 2 localization rendering defect.

## Release boundary / remaining work

This record update itself creates a newer documentation-only PR head, so that latest head must receive the same exact-head PR CI before merge. After that:

1. PR #29 can move out of draft only if its newest head remains fully green and mergeable.
2. Merge through the PR workflow rather than bypassing the release gates.
3. Fetch the resulting `main` SHA and verify post-merge `main` CI.
4. Verify the canonical Cloudflare Pages production origin serves the merged release; GitHub Pages or a successful repository build is not proof of the canonical Cloudflare deployment.
5. Only after those checks may Phase 2 be recorded as production-complete.
