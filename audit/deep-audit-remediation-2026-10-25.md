# Deep production audit remediation — 2026-10-25

Baseline production commit: `4b99f02464b5261d9e396cc9eb29ffdb8570204f`

Remediation branch: `remediation/deep-audit-2026-10-25`

This record follows three allowed final states only: `OPEN`, `FIXED`, and `ACCEPTED RISK`. An item remains `OPEN` until the relevant regression and, where applicable, production verification has passed. Source changes by themselves are not proof of resolution.

## H-01 / P1-02 — mandatory protection of `main`

- Original severity: HIGH
- Status: **OPEN**
- Root cause: the GitHub `main` branch has no branch protection/ruleset and no required status checks enforced at the repository-control layer.
- Files/configuration affected: GitHub repository administration; `.github/workflows/verify.yml`; `DEPLOYMENT.md`; `governance/RELEASE_EVIDENCE_REGISTER.json`.
- Solution chosen: keep the existing read-only CI token model, require the full source/browser/external/history-secret suite on pull requests, and enable an actual GitHub branch/ruleset control for `main` requiring pull requests and the relevant checks. Repository documentation must not stand in for the GitHub control.
- Why: this preserves the existing CI architecture while making its checks mandatory instead of merely advisory.
- Alternatives considered: a workflow that fails when protection is absent cannot by itself protect `main`; self-mutating administration from CI would require elevated repository credentials and adds unnecessary privilege.
- Implementation summary: release documentation and evidence records continue to treat branch protection as an external governance control. The connected GitHub integration can inspect but cannot mutate repository administration, so the real protection still has to be enabled in GitHub administration and then re-read for proof.
- Tests added/changed: final verification must inspect the branch/ruleset state and confirm required checks are configured; no code-only test may mark this fixed.
- Verification performed: baseline and remediation reads show the branch remains unprotected.
- Production evidence: none yet; this is repository governance rather than site runtime behavior.
- Residual risk: until enabled, a write-capable actor can bypass otherwise strong release checks by changing `main` directly.

## M-01 / P1-01 — CSP and Cloudflare JavaScript Detection conflict

- Original severity: MEDIUM, promoted to P1 by the remediation plan.
- Status: **OPEN**
- Root cause: Cloudflare JavaScript Detection used an injected inline bootstrap while the corporate CSP intentionally permits only same-origin external scripts and does not allow inline script.
- Files/configuration affected: `public/_headers`; `netlify.toml`; `governance/CLOUDFLARE_EDGE_TRANSFORM_CONTROL.md`; `governance/RELEASE_EVIDENCE_REGISTER.json`; `scripts/check-hosting.mjs`; `scripts/check-live-exact-release.mjs`; `.github/workflows/verify.yml`.
- Solution chosen: retain the strict CSP and prevent edge HTML transformation with `Cache-Control: no-transform`; treat JSD/challenge-platform injection, Web Analytics, Rocket Loader, and Email Obfuscation as forbidden transformations on the corporate origin; require exact live HTML equality after deployment rather than normalizing an injected security block.
- Why: the static corporate site does not need an inline JSD bootstrap, and weakening the CSP with `unsafe-inline` would reduce a stronger control merely to accommodate optional edge JavaScript.
- Alternatives considered: add `unsafe-inline` — rejected; maintain a nonce/hash for Cloudflare-generated inline code — operationally brittle for third-party generated markup; continue normalizing the challenge block — rejected because it hides an ineffective CSP-conflicting transform.
- Implementation summary: `no-transform` is now part of the hosting policy and the exact-release matcher rejects all recognized Cloudflare HTML/JS injections rather than accepting them.
- Tests added/changed: hosting-policy parity asserts `no-transform`; exact-live release rejects JSD, Analytics, Rocket Loader and Email Obfuscation markers and requires the production HTML to match the built release.
- Verification performed: source/hosting checks pass on the remediation branch.
- Production evidence: pending merge and production deployment; this item must remain OPEN until the canonical production response carries `no-transform`, contains no forbidden injection, and passes exact-release comparison.
- Residual risk: Cloudflare may ignore or override the source header; post-merge live verification is required.

## M-02 — stale canonical-host operational documentation

- Original severity: MEDIUM
- Status: **OPEN**
- Root cause: operational documents retained the original Phase 6 `www` defect after the Cloudflare redirect was fixed.
- Files/configuration affected: `DEPLOYMENT.md`; `governance/CLOUDFLARE_CANONICAL_HOST_CONTROL.md`.
- Solution chosen: update active documentation to describe the current verified redirect and retain the original incident only as history.
- Why: operators need one current description while historical evidence remains available separately.
- Alternatives considered: delete the history entirely — rejected because it removes useful provenance.
- Implementation summary: active docs now state that `www` permanently redirects to the apex and that root/deep-path/query preservation is revalidated by recurring checks.
- Tests added/changed: canonical-host live check remains part of release verification.
- Verification performed: structural checks pass on the remediation branch; production canonical behavior was already verified before remediation and will be rechecked after merge.
- Production evidence: pending final post-merge rerun for this remediation.
- Residual risk: documentation can drift again; the live check protects behavior but not prose accuracy, so review remains necessary.

## M-03 — long `mailto:` contact handoff

- Original severity: MEDIUM
- Status: **OPEN**
- Root cause: the full inquiry, including a long user message, was percent-encoded into a `mailto:` URI whose practical length/handler limits vary by browser, OS and mail client.
- Files/configuration affected: `public/phase2.js`; `src/pages/contact-legal.mjs`; `src/styles/layout.css`; contact/security regression checks and browser tests.
- Solution chosen: keep inquiry content local, remove the inquiry body from the mailto URI, show a readonly prepared summary, provide copy-to-clipboard, and retain selectable manual-copy fallback when clipboard access is unavailable. The mailto URI carries only the fixed recipient and bounded subject.
- Why: this preserves the no-backend/no-third-party-processing privacy architecture while eliminating dependence on very long external-handler URIs.
- Alternatives considered: introduce a server/form processor — rejected as unnecessary new processing; shorten the user's message silently — rejected; depend only on clipboard — rejected because permission/API failure must have a fallback.
- Implementation summary: local composition now separates the bounded mail-client launch from the full inquiry summary.
- Tests added/changed: source/security checks assert no inquiry body appears in mailto URLs; browser regressions exercise contact routing and the new copy/manual-summary state.
- Verification performed: structural/security checks pass; rendered-browser exact-head verification is pending completion.
- Production evidence: pending deployment and live release verification.
- Residual risk: the final act of sending still depends on the user's configured email application, as disclosed by the site.

## M-04 — internal governance/audit language in customer-facing pages

- Original severity: MEDIUM
- Status: **OPEN**
- Root cause: internal publication-state machinery (`OPEN`, `READINESS`, claim IDs, release gates, repository/evidence-boundary commentary) leaked into ordinary Trust/Research/Work presentation.
- Files/configuration affected: `src/pages/authority-evidence.mjs`; `src/pages/engineering-evidence.mjs`; `src/pages/phase5-enterprise.mjs`; related EN/FR/ES localization overrides and credibility/proof/enterprise regression tests.
- Solution chosen: keep the substantive claim/evidence boundaries while rewriting public pages around inspectable evidence, current assurance limits, and publication criteria. Keep internal IDs/states in governance data rather than customer UI.
- Why: this preserves evidence discipline without making the site read like an internal audit console.
- Alternatives considered: delete evidence-boundary content — rejected because it would weaken truthful qualification; keep old labels — rejected because it was the finding.
- Implementation summary: internal state labels and repository-process commentary were removed or replaced with customer-facing prose; tests were updated to assert the semantic boundaries instead of exact internal labels.
- Tests added/changed: `check-phase3-proof`, `check-phase5-enterprise`, `check-credibility-phase3`, translation/claim gates.
- Verification performed: all structural claim/credibility/localization gates pass on the current remediation branch; rendered-browser verification remains pending.
- Production evidence: pending deployment.
- Residual risk: future governance copy can again leak into page modules unless content review remains part of release review.

## M-05 — incomplete French/Spanish rendered reflow coverage

- Original severity: MEDIUM
- Status: **OPEN**
- Root cause: exhaustive 320/1440 reflow coverage was driven by the English search index; French and Spanish browser suites tested representative workflows rather than every indexed translated route.
- Files/configuration affected: `scripts/check-localized-reflow.mjs`; `package.json`; browser CI workflow.
- Solution chosen: render every published indexed French and Spanish route at 320 and 1440 pixels, plus representative routes at 375/430/768/1024/1920.
- Why: it directly exercises text-expansion/reflow risk without multiplying the already-long browser matrix across every possible viewport.
- Alternatives considered: apply every viewport to every route — rejected as disproportionate CI cost; rely on structural translation parity — rejected because it cannot detect visual overflow.
- Implementation summary: a dedicated dependency-free Chrome/CDP localized reflow audit has been added to the browser suite.
- Tests added/changed: main/H1/overflow/locale/lang assertions for all indexed FR/ES routes and broader representative widths.
- Verification performed: structural wiring passes; final rendered-browser job is pending.
- Production evidence: not applicable beyond the generated/rendered site; physical devices remain explicitly unverified.
- Residual risk: this is browser emulation, not physical iOS/Android/Safari testing.

## M-06 — no full Git-history secret scan

- Original severity: MEDIUM
- Status: **OPEN**
- Root cause: existing secret guards covered the current tree but did not prove removed secrets were absent from historical commits.
- Files/configuration affected: `scripts/check-secret-history.mjs`; `.github/workflows/verify.yml`.
- Solution chosen: add an independent history-secret job with `fetch-depth: 0` and scan the complete Git history for high-confidence secret patterns while retaining reviewed false-positive handling.
- Why: deleted credentials remain recoverable from a public repository's history.
- Alternatives considered: current-tree-only scanning — insufficient; external scanning service — unnecessary dependency.
- Implementation summary: full history is fetched only in the isolated secret job; ordinary jobs retain shallow checkout.
- Tests added/changed: `history-secret-audit` GitHub Actions job.
- Verification performed: the history-secret job passes on current remediation heads; final exact-head run still required before status moves to FIXED.
- Production evidence: not applicable; repository-history control.
- Residual risk: pattern-based scanners cannot guarantee detection of every possible secret format.

## M-07 — incomplete production photography provenance

- Original severity: MEDIUM
- Status: **OPEN**
- Root cause: the media policy required creator/licence/use/derivative provenance, while the old source table recorded only a subset; an initial remediation check also incorrectly assumed every served original had to remain byte-identical to the downloaded shortlist file even though the documented image-production phase recompressed selected JPEGs.
- Files/configuration affected: `MEDIA.md`; `media-library/blackpine-shortlist/PRODUCTION-PROVENANCE.tsv`; `scripts/check-media-provenance.mjs`; `package.json` check chain.
- Solution chosen: maintain a production-specific provenance register with source page/photo ID, creator verification state, licence review, intended use, third-party-rights note, exact source and production Git-blob fingerprints, explicit processing mode, and responsive derivative list. Verify JPEG derivative dimensions in CI.
- Why: provenance should describe the actual processing lineage, not manufacture byte identity or guess missing creator information.
- Alternatives considered: copy source files back over optimized production assets — rejected; infer creator names — rejected; accept unpinned lineage — rejected.
- Implementation summary: all 12 production originals are mapped; 9 are explicitly recorded as metadata-stripped/recompressed and 3 as identity copies; 30 derivatives are mapped and dimension-checked. Unknown creator fields remain visibly `UNVERIFIED`.
- Tests added/changed: media-provenance gate validates immutable fingerprints, approved processing relationships, licence/source metadata, rights notes, derivative coverage and encoded widths.
- Verification performed: the media-provenance gate passes on the current remediation branch.
- Production evidence: production assets themselves are unchanged by this provenance correction; final deployment verification still required for the overall release.
- Residual risk: 7 creator fields remain independently unverified; the register does not claim otherwise, and third-party depicted-subject rights still require case-specific review.

## L-01 — public AI-specific handoff artifact

- Original severity: LOW
- Status: **OPEN**
- Root cause: `progress/AI-HANDOFF.md` duplicated project continuity instructions in assistant-oriented language inside the public repository.
- Files/configuration affected: `progress/AI-HANDOFF.md`; `progress/README.md`.
- Solution chosen: remove the AI-specific file and retain neutral source-of-truth/continuity guidance in the progress archive index.
- Why: the useful engineering continuity does not require assistant-specific public material.
- Alternatives considered: rename only — rejected because most content duplicated the archive/source-of-truth guidance.
- Implementation summary: AI-specific artifact deleted; `progress/README.md` now describes historical records and current source-of-truth precedence neutrally.
- Tests added/changed: repository/page-safety/secret scans continue to cover public artifacts; final branch diff review will confirm deletion.
- Verification performed: source update completed; final exact-head suite pending.
- Production evidence: file was not a production website asset.
- Residual risk: historical commit history still contains the deleted file, as expected for a public Git repository.

## L-02 — developer-facing GitHub Pages wording

- Original severity: LOW
- Status: **OPEN**
- Root cause: the noindex GitHub Pages redirect explained repository/development topology to visitors.
- Files/configuration affected: root `index.html`; Pages safety check.
- Solution chosen: retain noindex/canonical/immediate redirect behavior but reduce visible content to a neutral link to Blackpine Cybersecurity.
- Why: repository topology is unnecessary customer-facing commentary.
- Alternatives considered: blank page — worse fallback/accessibility; remove Pages deployment — unnecessary.
- Implementation summary: developer-facing sentence removed.
- Tests added/changed: existing Pages safety check continues to verify noindex, canonical and redirect behavior.
- Verification performed: structural Pages safety check passes on the remediation branch.
- Production evidence: GitHub Pages deployment will be reverified after merge.
- Residual risk: none material.

## L-03 — French typography/editorial issue

- Original severity: LOW
- Status: **OPEN**
- Root cause: some governance-heavy French text retained English-style punctuation/register language.
- Files/configuration affected: French remediation/final-editorial localization overrides and customer-facing source pages.
- Solution chosen: use proper French punctuation and replace state-machine prose where the English source itself was humanized.
- Why: fixes language quality without broad machine translation or legal-text modification.
- Alternatives considered: global punctuation substitution — rejected because it could alter approved legal or code-like strings.
- Implementation summary: the identified semicolon spacing and related customer-facing translations are corrected in targeted reviewed overrides.
- Tests added/changed: French editorial, translation drift and localized reflow gates.
- Verification performed: all French structural/editorial/translation gates pass; rendered reflow remains pending.
- Production evidence: pending deployment.
- Residual risk: automated gates cannot replace a native human editorial review of every sentence.

## L-04 — Spanish infrastructure anglicism

- Original severity: LOW
- Status: **OPEN**
- Root cause: a literal translation rendered tenant-aware RBAC as `RBAC consciente del tenant`.
- Files/configuration affected: `src/i18n/es-final-editorial.mjs` and effective Spanish localization catalog.
- Solution chosen: describe the control as `RBAC con aislamiento por cliente` with least privilege, explicit engagement membership and separated administrative privileges.
- Why: preserves the security meaning in natural professional Spanish instead of retaining an infrastructure calque.
- Alternatives considered: keep `tenant` as jargon — understandable but lower-quality Spanish; translate `tenant` literally — less accurate in this context.
- Implementation summary: targeted editorial override updated.
- Tests added/changed: Spanish anti-calque/editorial gate and translation drift checks.
- Verification performed: Spanish editorial and localization gates pass; rendered reflow remains pending.
- Production evidence: pending deployment.
- Residual risk: native-editor review of the entire Spanish corpus remains outside automated proof.

## L-05 — limited legal/search artifact headroom

- Original severity: LOW in the audit; prioritized with P2 cleanup because growth risk was concrete.
- Status: **OPEN**
- Root cause: local search stored up to 6,000 low-weight body characters per route, and lawyer-controlled legal pages carried ordinary non-legal whitespace/chrome while the legal main content was close to its dedicated 64 KiB ceiling.
- Files/configuration affected: `build.mjs`; `scripts/compact-lawyer-legal-preferences.mjs`; size-budget/search/browser regression checks.
- Solution chosen: cap only the low-weight body-text search field at 4,000 characters while retaining title/description/headings/curated terms; compact only newline/indent whitespace outside legal `<main>` after the existing removal of search chrome and compact preferences dialog. Keep lawyer-controlled `<main>` byte-identical.
- Why: creates real headroom without deleting indexed routes, changing approved legal wording, adding compression dependencies, or simply raising budgets.
- Alternatives considered: raise size budgets — rejected; alter lawyer-controlled legal text — rejected; remove useful search fields such as title/headings/terms — rejected.
- Implementation summary: source changes are committed; exact size improvement is being measured by CI before the budget is tightened.
- Tests added/changed: legal compaction script proves `<main>` is byte-identical before and after; existing search/browser regressions remain, and the final budget will be set from measured output rather than guessed.
- Verification performed: pending the exact head containing the size changes.
- Production evidence: pending deployment.
- Residual risk: future corpus growth still needs budget enforcement.

## Informational observations from the audit

These were observations rather than defects requiring architectural change. They remain part of the final verification boundary:

- The project intentionally has no npm runtime/development dependency graph. Status: **ACCEPTED RISK**; native Node/browser APIs and pinned GitHub Actions remain the chosen supply-chain model.
- Build/runtime assets are fingerprinted and deterministic. Status: **ACCEPTED RISK**; no remediation required beyond regression checks.
- Search uses DOM creation and `textContent` rather than HTML injection. Status: **ACCEPTED RISK**; no vulnerability was identified.
- Preference storage has a schema/version marker without a complex migration engine. Status: **ACCEPTED RISK** while only the current bounded language/theme fields exist; add migration behavior if stored settings become materially more complex.
- Cipher, Verify, Support and private/backend systems are separate audit scopes. Status: **ACCEPTED RISK** for this corporate-site remediation only; no claim is made that those systems were audited here.

## Coverage boundaries that must not be converted into passes without evidence

The following remain explicitly outside current automated proof unless qualifying evidence is added during remediation: Safari/WebKit, physical iOS/Android, NVDA/JAWS/VoiceOver/TalkBack, real external mail-client behavior, field Core Web Vitals, Search Console/indexation, independent legal advice, independent verification of all company-supplied facts, Cipher cryptography, Verify/Support/private infrastructure internals, real staffing/availability claims, same-method historical performance, and independent clearance of all third-party depicted-subject rights.
