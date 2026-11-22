# Blackpine V4 English editorial — implementation handoff

Date: 2026-11-22
Base: `main` at `f14c9e20d0173497529589679fdd087d282e22c8`
Branch: `editorial-v4-english-2026-11-22`
PR: #53 (DRAFT, unmerged)

## Purpose and scope
Improve public-facing **English** prose without rewriting security contracts, technical findings, client evidence, legal documents, operating commitments, or the site's existing architecture.

The current route registry and CI confirm **87 English routes**, including 85 indexable routes. The earlier 78-route source editorial audit is an imperfect historical starting point, NOT the definitive current route count. Shared templates and content modules affect more than one route. This handoff does not claim every rendered sentence was human-reviewed.

## Implementation
- Homepage: clarify headline and introductory headings while retaining the exact Phase 2 problem-first safety/UX statement.
- Core and specialist services: simplify effective service intros and help readers identify relevant work. Keep the literal headings required by established service tests.
- Company, careers, contact: remove staffing-memo language and repeated contact instructions; keep realistic hiring and intake boundaries.
- Browser tools and resources: use clear, action-oriented labels; retain local-only tool/privacy warnings.
- Trust/assurance and Labs: reduce public-facing internal jargon; retain contract, accreditation, portal, incident, Cipher isolation, and disclosure boundaries.
- Research and methodology: explain publication standards and assessment process more directly; maintain source/authorization requirements and technical conclusions.
- Client evidence and sample report: keep an explicit line between reconstructed sample material, client feedback, and confirmed outcomes. Do not strengthen claims about the underlying engagement without approved records.
- Additional editorial pass: improve English method, team, trust and client case-study explanations, as well as backup-recovery, compromised-mailbox, vendor-access and research-evidence summaries.
- Reuse of existing reviewed FR/ES translations through `src/i18n/english-editorial-legacy.mjs` prevents untranslated text from appearing in non-English pages. These compatibility aliases **do not** reapprove translations or their source hashes.

## Deliberate non-changes
- No modified lawyer-approved legal clauses or documentation hashes.
- No changed client identification, professional credentials, insurance coverage, or operational guarantees.
- No changed forms, contact transport, Cipher app, worker, authentication, storage, security headers, CSS or client-side runtime code.
- No blanket thesaurus replacement of technical terms.
- No change to published FR/ES translations and no automated approval of their new English source text.

## Verification
GitHub Actions `Verify Blackpine` run **45005680332** (commit `056151e6`), after the final additional research/editing pass:
- PASS: site build; 262 generated HTML files; 253 indexable canonical routes; uniqueness of titles/descriptions, internal links, sitemap, robots, CSP, social preview/asset checks.
- PASS: V3, V4 Phase 1–4, Trust phases, production/deep source audits, legal document integrity, company consistency, claims and release checks.
- PASS: 87 English / 87 French / 85 Spanish route foundation; FR/ES rendered metadata and body checks, Spanish final editorial gate.
- FAIL, by design: Phase 4 translation approval detects 72 blocking stale FR/ES records. Existing translations need human review for changes in meaning before source hashes may be legitimately refreshed. There are also nonblocking standard-risk drift warnings.
- Subsequent browser and live-production validation remain unverified because CI stops at the approval gate.

**English editorial implementation is staged and the source/production regression checks preceding localization approval are passing. Release status: NOT READY TO MERGE OR DEPLOY.** This is a staged English editorial implementation, not a verified multilingual production release.

## Required release steps
1. Review the English diff against the approved factual claims, client-evidence and legal boundaries; correct any semantic drift.
2. Perform proper French/Spanish review of all affected routes. Update translation approvals ONLY after meaning and reviewed locale text are verified.
3. Run the full unchanged `npm run verify` GitHub pipeline and all browser/live checks; fix substantive failures without removing safety gates.
4. Reconcile PR #52 (older homepage-only change), review PR #53, then merge/deploy through the normal release path after checks and approvals.
5. Confirm the live Cloudflare Pages deployment matches the merged commit. Do not infer deployment success from repository checks alone.

## Editorial standard
Prioritize usefulness, clarity, specifics, appropriate register, and supported claims. Do not promise that text is undetectable as AI-generated. Keep effective concise phrases such as “Plans fail at handoffs”; preserve security terms where they carry necessary meaning.

## Final rendered-English inventory and quality review
- Added `scripts/report-english-editorial-inventory.mjs` and an additive CI step that inventories the built English pages before the unchanged release checks. The generated inventory is available as the `english-editorial-inventory` GitHub Actions artifact.
- Final reviewed code revision: `7112edffd4926b6d22ca0d3d1f37d968371c7210`, run **45006137440**.
- Generated site: **87 English routes, 4,518 rendered text fragments, and 33,654 main-content words**. The inventory also captures English titles, descriptions, headings and relevant accessibility attributes.
- The diagnostic identified 40 lengthy text fragments reused across routes. These are mostly shared service descriptions, safety notices and standard research disclaimers, not 40 proven copy defects. No blanket rewrite was applied.
- Seven example findings in the reconstructed sample assessment now have **distinct verification guidance** matching each illustrative condition; existing sample disclosure and underlying-engagement caveats remain intact. The existing reviewed FR/ES sample wording is preserved, but locale translation approvals remain stale.
- The final follow-up clarified contact-page data handling and sample assessment methodology without adding new service promises or changing the contact mechanism.
- On run 45006137440, build, structured production checks, metadata uniqueness, internal links, security/claims/legal checks, French/Spanish translation coverage and editorial checks passed through Phase 3. The **Phase 4 translation-approval gate failed with 72 stale records**, so browser/external/live jobs did not complete.
- This is a **source-plus-generated-text editorial review**, not a claim that 33,654 words received independent human-editor signoff. Legal texts are preserved and must not be simplified just to look more conversational.

## English implementation freeze — 2026-11-22
- English-content implementation is **ready for a separate English editorial audit**, not yet independently human-approved word by word and not production deployed.
- This final pass reviewed generated text and simplified four Trust introductions: vendor disclosure, retention, security/careers contacts, and assurance requests. These are source-only English changes; existing approved FR/ES strings are retained through legacy-key lookups pending dedicated language review.
- Final English source build: `ff29e3386b0756246b97b41823815c4dded8e33b`; GitHub Actions run **45006589507**: **87 English routes, 4,518 visible text fragments, 33,692 main-content words** across the rendered English main landmarks, plus route titles, descriptions, headings and accessibility text. The `english-editorial-inventory` workflow artifact is the audit baseline.
- PASS: static build, route/SEO link integrity, CSP, source/deep production check, company/claim/legal controls, original site contracts, French/Spanish rendered language completeness.
- BLOCKED: **80 stale FR/ES source-hash approval records** following the English wording changes. This is expected and must be resolved through future per-language review, never bulk approval hash replacement.
- Remaining browser/external/live validation was not run because the verify job stopped at the unchanged localization gate. PR #53 stays draft and unmerged; production stays unchanged.
- For the forthcoming English-only audit, review the captured 87-route inventory phrase by phrase; do not interpret a successful build as an independent editorial signoff.

## English correction audit closeout — 2026-11-22
- **Final source QA commit:** `fd96c48a031f9f96004de3e9a2448cf7e0388e09`; GitHub Actions **45008760860**.
- **English generation verified:** 87 registered routes, 4,518 visible fragments and 33,659 words of main content. Source-aware English editorial regression check passed.
- **Audit reconciliation:** all 112 findings re-evaluated against regenerated English HTML: 52 original flagged phrases no longer occur on their audited routes; 21 intentional keeps; 12 additionally retained on technical/accuracy/editorial grounds; 15 claim-evidence items require independent proof; 8 technical verification items await runtime/operational confirmation; 3 lawyer-controlled legal text items unchanged; 1 research publication-date item requires source confirmation. An exact-phrase comparison alone does not independently prove every rewrite is optimal.
- **Specific fixes:** differentiate previously repeated capability descriptions, replace overbroad recovery and awkward monitoring language, clarify homepage service choice and review method, improve service-team explanations, clarify planned client portal, reduce research source-count boilerplate, and improve contact, Trust, report and advisory copy.
- **Non-negotiable release boundary:** 80 FR/ES source-hash approvals remain stale and block the unchanged Phase 4 localization gate. Existing reviewed FR/ES text is retained; do not reapprove or update hashes before future language-by-language semantic reviews. Browser/external/live production audits did not complete beyond that gate.
- **State:** English correction pass finished for follow-up audit; PR #53 must remain DRAFT and unmerged. Production site remains unchanged.
