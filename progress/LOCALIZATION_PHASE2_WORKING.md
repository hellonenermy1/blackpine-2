# Blackpine Localization — Phase 2 Final Audit Record

Date: 2026-10-24

Status: PRE-MERGE RELEASE CANDIDATE — human editorial audit and all pre-merge technical gates passed. Do not call Phase 2 production-complete until PR #29 is merged, the resulting `main` SHA passes post-merge verification, and the canonical Cloudflare Pages origin is verified against that merged release.

Branch: `phase2-french-localization`

PR: #29 — `Phase 2 — complete Canadian-French corporate-site localization`

Base production commit: `0c6b2f9a5f30cbe19793d378aa2231bb34c66f57`

Final audited code head before this documentation-only record update: `1f3b55aef10cdd307e1d22c8ade9d240f37ae336`

Final audited workflow run: `40105089160`

Final audited browser artifact:
- ID: `12563954145`
- Name: `blackpine-browser-audit`
- Digest: `sha256:3e5db2ca76eccc1c605103bbc5d383a169a151d3c1be65623616888169d7f6f8`
- Head: `1f3b55aef10cdd307e1d22c8ade9d240f37ae336`

## Phase 2 objective

Publish a complete Canadian-French (`fr-CA`) corporate-site experience for approved public corporate content while preserving lawyer-controlled legal text, factual and claim boundaries, Canadian cybersecurity terminology, accessibility, privacy/security controls, performance budgets, and the separate Cipher/Verify/Support trust boundaries.

Passing automated tests is necessary but not sufficient. The French must read like professional Canadian cybersecurity writing rather than a literal English translation.

## Final verified localization state

- 87 English routes and 87 French routes have exact counterpart parity.
- 85 routes per locale are indexable.
- Build output contains 170 indexable routes and 6 noindex/error documents.
- Phase 2 gap report: 0 untranslated metadata fields, 0 untranslated rendered page-body/attribute strings, 0 catalog conflicts.
- Spanish remains unpublished in Phase 2: 0 Spanish routes.
- English and French search indexes are locale-pure with 85 entries each.
- French routes use self-canonicals and reciprocal `en-CA`, `fr-CA`, and `x-default` alternates where applicable.
- French internal navigation stays under `/fr/...` except deliberate language-switch links and separate Cipher/Verify/Support hostnames.
- Shared chrome, navigation, breadcrumbs, search, preference controls, contact guidance, smart 404 behavior, tools, research filtering, JavaScript-generated states, accessibility labels, and runtime messages are localized.
- French 404 behavior is locale-specific without fabricating crawlable error routes.

## Legal, security, and claim integrity

- Lawyer-controlled English and French Terms/Privacy source hashes pass exactly.
- All four lawyer documents preserve required section/clause structure, anchors, dates, bilingual counterpart links, Privacy Officer routes, and checked key provisions.
- No lawyer-controlled legal body text was regenerated or editorially rewritten during Phase 2.
- Existing operational-claim gates remain intact: no unsupported 24/7, SLA, certification, insurance, recovery, containment, uptime, RTO/RPO, or equivalent claims were introduced.
- The non-public/unproven hotline remains non-public.
- Cipher, Verify, and Support remain separate trust boundaries; locale prefixes are not appended to those hostnames.
- CSP, hosting-header parity, privacy exposure, source/security scans, Pages safety, company consistency, external reputation, credibility, and deep-production checks all passed.

## Human Canadian-French editorial audit

A second sentence-level audit was completed after the first technically green release candidate. The audit deliberately rejected wording that was grammatically valid but still sounded translated.

Authoritative terminology was cross-checked against the Canadian Centre for Cyber Security and Québec terminology sources. Reviewed terminology includes `assurance de la sécurité`, `centre des opérations de sécurité (COS)`, `services infonuagiques`, `intervention en cas d’incident`, `rançongiciel`, `reprise/rétablissement`, `criminalistique numérique`, and `hameçonnage`.

The final pass improved wording including:

- ambiguous `Assurance d’entreprise` / `Demandes d’assurance` → explicit `Assurance de la sécurité pour les entreprises` / `Demandes d’assurance de la sécurité`;
- `Contacts de sécurité` → `Coordonnées de sécurité`;
- `MFA inhabituel` → `demande MFA inattendue`;
- uneven specialist list wording → natural parallel phrasing covering engineering, incident response, COS, and GRC;
- literal `chemin de contrôle` → wording based on which functions the reviewed controls actually involve;
- stiff `profondeur en criminalistique` → `expertise approfondie en criminalistique numérique`;
- `dépendances marketing` → `dépendances liées au marketing`;
- `outil d’analytique tiers` → `service d’analyse tiers`;
- earlier audit fixes for `site corporatif`, commercial-retainer `rétention`, keyboard hints, internal English practice names, `Gouvernance et risque`, `continuité client`, and literal scanner/proxy wording remain preserved.

A dedicated final editorial regression gate now fails CI if the reviewed anti-calque wording reappears. It passed on the audited head.

## Exact-head evidence

Workflow `40105089160` on code head `1f3b55aef10cdd307e1d22c8ade9d240f37ae336` passed:

- `verify` — SUCCESS
- `external-links` — SUCCESS
- `browser-audit` — SUCCESS

The verify log explicitly reports:
- 0 untranslated metadata fields;
- 0 untranslated page-body/attribute strings;
- 0 catalog conflicts;
- Phase 2 localization gate passed;
- final Phase 2 French editorial gate passed;
- lawyer legal-document checks passed;
- deep/source review passed with 0 unresolved warnings.

Measured budgets remained within the existing limits without raising a threshold:
- CSS: 49.0 KiB / 64.0 KiB
- Runtime JS: 60.0 KiB / 64.0 KiB
- English search index: 239.4 KiB / 256.0 KiB
- Largest ordinary HTML: `fr/index.html` at 34.4 KiB / 48.0 KiB
- Largest lawyer legal HTML: `fr/legal/privacy/index.html` at 63.0 KiB / 64.0 KiB

The rendered-browser suite passed after the final wording changes and uploaded artifact `12563954145`, tied to the same code head.

Telemetry note retained from the earlier browser review: the existing English `/legal/company-information/` page may report a tolerated 2 px horizontal overflow at 320 px. It is not a French-localization regression and was not hidden from the audit record.

## Remaining release steps

This record update is documentation-only but creates a new PR head. Therefore the latest PR head must again pass the exact-head CI before merge.

After that:
1. Merge PR #29 through the PR workflow.
2. Fetch the resulting `main` SHA.
3. Confirm post-merge `main` verification succeeds.
4. Verify the canonical Cloudflare Pages origin serves the merged French release, rather than treating GitHub CI or GitHub Pages as proof of canonical deployment.
5. Only then record Phase 2 as production-complete and branch Phase 3 from that verified `main` state.
