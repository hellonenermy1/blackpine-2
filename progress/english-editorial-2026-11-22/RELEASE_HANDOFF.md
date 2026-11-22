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
