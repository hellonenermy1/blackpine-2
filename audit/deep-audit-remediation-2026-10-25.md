# Deep production audit remediation — 2026-10-25

Baseline production commit: `4b99f02464b5261d9e396cc9eb29ffdb8570204f`

Remediation branch: `remediation/deep-audit-2026-10-25`

Verified remediation candidate before this record update: `226931e84f9d374234b587e252cd33ce291eb5b4`

Verification workflow: `40269687867`

This record uses only `OPEN`, `FIXED`, and `ACCEPTED RISK`. `FIXED` means the relevant implementation and regression verification have passed. Production-specific findings remain `OPEN` until canonical production evidence exists.

## H-01 / P1-02 — mandatory protection of `main`

- Original severity: HIGH
- Status: **OPEN**
- Root cause: GitHub `main` has no branch protection/ruleset and no mandatory status checks at the repository-control layer.
- Files/configuration affected: GitHub repository administration; `.github/workflows/verify.yml`; `DEPLOYMENT.md`; `governance/RELEASE_EVIDENCE_REGISTER.json`.
- Solution chosen: preserve the read-only CI-token model and require an actual GitHub branch/ruleset control for `main` that requires pull requests and the release checks. Do not substitute a workflow assertion for repository enforcement.
- Why chosen: protection belongs at the control plane that can actually reject a direct write. Self-mutating administration from CI would require unnecessary elevated credentials.
- Alternatives considered: CI-only warning/failure — insufficient because an actor able to bypass CI could also bypass that check; privileged administration token in CI — rejected.
- Implementation summary: PR CI now includes `verify`, `history-secret-audit`, `browser-audit`, `external-links`, plus the Cloudflare Pages check supplied by the hosting integration. Active deployment documentation explicitly says the GitHub control must exist outside the repository.
- Tests added/changed: complete-history secret audit was added; existing PR verification remains separated into structural, browser, external-link and hosting checks.
- Verification performed: repository reads on 26 October 2026 still report `protected:false`; repository rulesets endpoint returns an empty list.
- Production evidence: not applicable; this is repository governance.
- Residual risk: until the actual GitHub rule is enabled, a write-capable actor can bypass otherwise strong release checks by writing to `main` directly.

## M-01 / P1-01 — CSP and Cloudflare JavaScript Detection conflict

- Original severity: MEDIUM, promoted to P1 by the remediation plan.
- Status: **OPEN**
- Root cause: Cloudflare JavaScript Detection injected an inline bootstrap while the corporate CSP intentionally permits same-origin external scripts and does not permit arbitrary inline script.
- Files/configuration affected: `public/_headers`; `netlify.toml`; `governance/CLOUDFLARE_EDGE_TRANSFORM_CONTROL.md`; `governance/RELEASE_EVIDENCE_REGISTER.json`; `scripts/check-hosting.mjs`; `scripts/check-live-exact-release.mjs`; deployment documentation.
- Solution chosen: retain the strict CSP; add `Cache-Control: no-transform` to the corporate response policy; treat Cloudflare JSD/challenge-platform injection, Web Analytics, Rocket Loader and Email Obfuscation as forbidden HTML transformations; require exact live HTML equality after deployment.
- Why chosen: the static corporate site does not need an inline JSD bootstrap, and weakening CSP with `unsafe-inline` would sacrifice a stronger control for an optional edge feature. Cloudflare documents `no-transform` as preventing supported HTML transformations, including JavaScript Detection injection when Origin Cache Control is respected.
- Alternatives considered: add `unsafe-inline` — rejected; maintain a third-party-generated nonce/hash — brittle; continue stripping/normalizing the JSD block in the production matcher — rejected because it would hide the conflict.
- Implementation summary: Cloudflare/Netlify policy parity includes `no-transform`; the exact-release matcher now rejects all recognized Cloudflare HTML injection and requires representative canonical HTML to equal the generated release.
- Tests added/changed: hosting parity asserts `no-transform`; exact-live comparison checks the live header, forbidden edge markers and exact body hash.
- Verification performed: source/hosting/security gates pass on candidate `226931e84f9d374234b587e252cd33ce291eb5b4`; Cloudflare branch preview deployment also reports success.
- Production evidence: pending merge. The finding remains OPEN until canonical production carries `no-transform`, contains no forbidden injection, and the post-merge exact-release check passes.
- Residual risk: CDN/account configuration may differ from the source policy until the canonical live response proves otherwise.

## M-02 — stale canonical-host operational documentation

- Original severity: MEDIUM
- Status: **FIXED**
- Root cause: active deployment documents retained wording from the original Phase 6 `www` defect after the Cloudflare redirect had already been corrected.
- Files/configuration affected: `DEPLOYMENT.md`; `governance/CLOUDFLARE_CANONICAL_HOST_CONTROL.md`.
- Solution chosen: describe the current verified `www` → apex control in active documentation while retaining the original failure only as historical provenance.
- Why chosen: operators need a current source of truth without deleting useful incident history.
- Alternatives considered: delete all historical context — rejected.
- Implementation summary: active docs state that `www` must preserve path/query while redirecting to the apex and that the behavior is revalidated for releases.
- Tests added/changed: existing canonical-host root/deep-path regression remains part of live release verification.
- Verification performed: documentation review completed; structural hosting/canonical checks pass on the remediation candidate.
- Production evidence: the canonical redirect was already verified before remediation; the post-merge release will rerun it again.
- Residual risk: documentation can drift again, so active docs still require release review.

## M-03 — long `mailto:` contact handoff

- Original severity: MEDIUM
- Status: **FIXED**
- Root cause: the full inquiry, including up to 2,000 message characters, was percent-encoded into a `mailto:` URI whose practical handler limits differ across browser/OS/mail clients.
- Files/configuration affected: `public/phase2.js`; `src/pages/contact-legal.mjs`; contact/browser/security tests; deployment documentation.
- Solution chosen: retain inquiry content locally in a readonly prepared summary, keep the `mailto:` URL limited to recipient and bounded subject, add clipboard copy, and select the summary for manual copy when clipboard access fails.
- Why chosen: it preserves the no-backend/no-third-party-processing privacy model without relying on long external-handler URIs.
- Alternatives considered: server/form processor — unnecessary new processing; silently shorten the user message — rejected; clipboard-only flow — rejected because permissions can fail.
- Implementation summary: the complete message never appears in the `mailto:` body; users can copy the local prepared summary and then open their email application.
- Tests added/changed: source/security checks assert bounded mailto behavior; `scripts/check-contact-composer-browser.mjs` exercises a maximum valid 2,000-character message, focus, subject-only mailto, clipboard success and blocked-clipboard manual selection.
- Verification performed: workflow `40269687867` browser job passed the contact-composer regression explicitly.
- Production evidence: Cloudflare branch preview for the verified candidate deployed successfully; canonical post-merge checks will still run.
- Residual risk: actual sending remains dependent on the user's configured mail application, which the site discloses; the full inquiry is no longer dependent on mailto URI length.

## M-04 — internal governance/audit language in customer-facing pages

- Original severity: MEDIUM
- Status: **FIXED**
- Root cause: internal publication states and audit mechanics (`OPEN`, `READINESS`, claim IDs, release gates and repository/evidence-process commentary) were rendered as normal customer copy.
- Files/configuration affected: `src/pages/authority-evidence.mjs`; `src/pages/engineering-evidence.mjs`; `src/pages/phase5-enterprise.mjs`; EN/FR/ES editorial overrides; credibility/proof/enterprise tests.
- Solution chosen: keep the substantive evidence and assurance boundaries, but present them as customer-facing explanations; keep internal IDs/states in governance data.
- Why chosen: truthful qualification remains visible without making the site read like an internal control console.
- Alternatives considered: remove the evidence boundaries — rejected; retain internal labels — rejected because that was the defect.
- Implementation summary: public pages now describe inspectable evidence, primary sources, current assurance limits and publication criteria in ordinary language.
- Tests added/changed: proof/enterprise/credibility regressions were converted from literal internal-label requirements to semantic boundary assertions; localization and claim gates remain active.
- Verification performed: all structural claim/credibility/localization gates pass and the full rendered-browser suite passes on candidate `226931e84f9d374234b587e252cd33ce291eb5b4`.
- Production evidence: Cloudflare branch preview deployed successfully; canonical deployment will be rechecked after merge.
- Residual risk: future governance data could leak into presentation if content review is bypassed.

## M-05 — incomplete French/Spanish rendered reflow coverage

- Original severity: MEDIUM
- Status: **FIXED**
- Root cause: exhaustive 320/1440 browser reflow was driven by English routes; French and Spanish browser suites focused on representative workflows.
- Files/configuration affected: `scripts/check-localized-reflow.mjs`; `src/styles/responsive.css`; `package.json`; browser CI.
- Solution chosen: render every indexed French and Spanish route at 320 and 1440 pixels, plus representative routes at 375/430/768/1024/1920.
- Why chosen: this directly exercises translation text expansion without multiplying every route by every possible viewport.
- Alternatives considered: every viewport on every route — disproportionate CI cost; structural translation parity only — insufficient for visual overflow.
- Implementation summary: dependency-free Chrome/CDP localized reflow audit was added. It found a real 17px overflow on `/fr/tools/domain-dns/` at 320px; the responsive page-hero title rule was corrected with safe narrow-screen wrapping rather than shortening the translation.
- Tests added/changed: all indexed FR/ES routes require visible H1/main, correct locale/lang and no material horizontal overflow at 320/1440; representative routes add five wider/intermediate sizes.
- Verification performed: workflow `40269687867` reports `Localized rendered reflow passed: 168 published French/Spanish indexed routes at 320px and 1440px, plus 10 representative routes at 375/430/768/1024/1920px.`
- Production evidence: generated/rendered branch release passed; physical devices and Safari remain separate unverified scopes.
- Residual risk: browser emulation is not a physical-device/Safari test.

## M-06 — no full Git-history secret scan

- Original severity: MEDIUM
- Status: **FIXED**
- Root cause: existing secret guards covered the current tree but did not prove that removed credentials were absent from historical commits.
- Files/configuration affected: `scripts/check-secret-history.mjs`; `.github/workflows/verify.yml`.
- Solution chosen: add an isolated `history-secret-audit` job using `fetch-depth: 0` and a high-confidence history scanner, while leaving ordinary CI checkouts shallow.
- Why chosen: removed secrets remain recoverable from a public Git history, but an external scanning service/dependency is unnecessary for the current patterns.
- Alternatives considered: current-tree scan only — insufficient; third-party scanner service — unnecessary new dependency/processing.
- Implementation summary: complete history is fetched only for the dedicated secret job.
- Tests added/changed: `history-secret-audit` runs independently on PRs and pushes.
- Verification performed: the history-secret job passed on candidate `226931e84f9d374234b587e252cd33ce291eb5b4`.
- Production evidence: not applicable; this is repository-history assurance.
- Residual risk: pattern-based detection cannot prove the absence of every conceivable secret format.

## M-07 — incomplete production photography provenance

- Original severity: MEDIUM
- Status: **ACCEPTED RISK**
- Root cause: the old media table lacked production lineage and creator/licence/use detail. Some selected source files also lost metadata during the approved production recompression process, and seven photographer names cannot currently be independently recovered from the pinned public source evidence without guessing.
- Files/configuration affected: `MEDIA.md`; `media-library/blackpine-shortlist/PRODUCTION-PROVENANCE.tsv`; `scripts/check-media-provenance.mjs`; `package.json`.
- Solution chosen: create a production-specific immutable provenance register and CI gate; explicitly record unavailable creator names as `UNVERIFIED` rather than inventing them.
- Why chosen: the Pexels licence basis recorded for these assets does not require attribution, while source/photo IDs, licence review, exact source/production fingerprints, processing, intended use, derivatives and rights notes are the material traceability controls. Inventing a creator would make the record less trustworthy.
- Alternatives considered: guess creator names — rejected; restore original bytes solely to preserve metadata — does not recover metadata already absent and would undo approved asset processing; remove all seven images — disproportionate when the source/licence lineage remains pinned.
- Implementation summary: all 12 production originals are mapped to source pages and immutable source/production Git-blob IDs; 9 recompressed originals and 3 identity copies are distinguished; 30 responsive derivatives are mapped/dimension-checked; third-party depicted-subject notes are recorded.
- Tests added/changed: media provenance CI validates source/photo IDs, licence basis/review date, intended use, rights note, immutable source/production fingerprints, approved processing mode, derivative coverage and encoded dimensions.
- Verification performed: media-provenance gate passes on candidate `226931e84f9d374234b587e252cd33ce291eb5b4` and explicitly reports 7 unresolved creator fields.
- Production evidence: the served image bytes were not changed by this record correction; lineage is pinned to the actual production assets.
- Residual risk: seven photographer names remain independently unverified and separate depicted-person/brand/property rights are not universally cleared by the Pexels licence. These unknowns remain explicit.

## L-01 — public AI-specific handoff artifact

- Original severity: LOW
- Status: **FIXED**
- Root cause: `progress/AI-HANDOFF.md` duplicated project-continuity instructions in assistant-oriented language inside the public repository.
- Files/configuration affected: `progress/AI-HANDOFF.md`; `progress/README.md`.
- Solution chosen: delete the AI-specific file and retain neutral source-of-truth/history guidance in the progress archive index.
- Why chosen: engineering continuity does not require assistant-specific public material.
- Alternatives considered: rename only — rejected because most content duplicated archive/source-of-truth guidance.
- Implementation summary: AI-specific artifact is deleted; `progress/README.md` identifies historical files as provenance rather than current authority.
- Tests added/changed: repository/page-safety/secret scans continue; PR diff confirms deletion.
- Verification performed: exact remediation branch no longer contains the file and structural checks pass.
- Production evidence: it was never a website runtime asset.
- Residual risk: old Git commits retain the historical file, as expected in a public immutable history.

## L-02 — developer-facing GitHub Pages wording

- Original severity: LOW
- Status: **FIXED**
- Root cause: the noindex GitHub Pages redirect explained repository/development topology to visitors.
- Files/configuration affected: root `index.html`; Pages safety checks.
- Solution chosen: retain noindex/canonical/automatic redirect behavior with neutral visitor-facing official-site wording.
- Why chosen: repository topology is unnecessary customer-facing commentary, while an accessible fallback link is useful.
- Alternatives considered: blank page — poorer fallback/accessibility; remove Pages deployment — unnecessary.
- Implementation summary: developer-facing wording was removed.
- Tests added/changed: existing Pages safety gate still verifies noindex, canonical target, redirect and exclusion of source/internal paths.
- Verification performed: Pages safety check passes on the remediation candidate.
- Production evidence: final GitHub Pages deployment after merge will revalidate the actual surface.
- Residual risk: none material.

## L-03 — French typography/editorial issue

- Original severity: LOW
- Status: **FIXED**
- Root cause: some governance-heavy French text retained English-style punctuation and state-machine register wording.
- Files/configuration affected: reviewed French editorial overrides and corresponding customer-facing source pages.
- Solution chosen: targeted Canadian-French editorial corrections; no global punctuation rewrite and no modification of lawyer-controlled legal wording.
- Why chosen: fixes the identified quality issue without mechanically touching approved legal or code-like strings.
- Alternatives considered: global substitution — rejected.
- Implementation summary: identified punctuation/register issues were rewritten in reviewed overrides alongside the humanized English source.
- Tests added/changed: French editorial anti-calque gates, translation drift/current-hash checks and localized reflow.
- Verification performed: French editorial/localization gates pass with 0 stale approvals; all indexed French routes pass the new rendered reflow audit.
- Production evidence: branch preview deployed successfully; canonical deployment will follow merge.
- Residual risk: automated checks cannot replace native editorial review of every sentence.

## L-04 — Spanish infrastructure anglicism

- Original severity: LOW
- Status: **FIXED**
- Root cause: literal localization rendered tenant-aware RBAC as `RBAC consciente del tenant`.
- Files/configuration affected: `src/i18n/es-final-editorial.mjs`; effective Spanish catalog.
- Solution chosen: describe the control naturally as `RBAC con aislamiento por cliente`, preserving least-privilege and administrative-separation meaning.
- Why chosen: technically accurate, professional Spanish is preferable to infrastructure calque jargon.
- Alternatives considered: retain `tenant` jargon — rejected; literal translation — less natural/precise.
- Implementation summary: targeted reviewed Spanish override updated.
- Tests added/changed: Spanish editorial/anti-calque, translation drift and rendered reflow gates.
- Verification performed: final Spanish editorial gate passes; 0 catalog conflicts/stale approvals; all indexed Spanish routes pass rendered reflow.
- Production evidence: branch preview deployed successfully; canonical deployment will follow merge.
- Residual risk: full native-editor review of the entire corpus remains separate from automated proof.

## L-05 — limited legal/search artifact headroom

- Original severity: LOW; prioritized during P2 cleanup because growth risk was concrete.
- Status: **FIXED**
- Root cause: search stored up to 6,000 low-weight body characters per route and lawyer-controlled legal pages carried avoidable non-legal chrome whitespace close to the 64 KiB ceiling.
- Files/configuration affected: `build.mjs`; `scripts/compact-lawyer-legal-preferences.mjs`; `scripts/check-remediation-headroom.mjs`; package/check chain.
- Solution chosen: cap only the low-weight search-body field at 4,000 characters while preserving title/description/headings/curated terms; compact only non-legal chrome whitespace while proving lawyer-controlled `<main>` remains byte-identical.
- Why chosen: creates headroom without changing approved legal text, removing indexed routes, adding a compression dependency or simply raising budgets.
- Alternatives considered: raise budgets — rejected; modify legal prose — rejected; drop high-value search fields — rejected.
- Implementation summary: search and non-legal chrome compaction are in the deterministic build; a tighter remediation budget prevents silent regrowth.
- Tests added/changed: compaction proves legal `<main>` byte identity; headroom gate requires search ≤240 KiB and lawyer-controlled legal page ≤63 KiB.
- Verification performed: candidate measures search at 226.6 KiB / 240.0 KiB and largest lawyer-controlled page at 62.0 KiB / 63.0 KiB; all search/browser/legal gates pass.
- Production evidence: generated branch release and Cloudflare preview succeed; canonical deployment will be rechecked after merge.
- Residual risk: corpus growth still requires budget enforcement.

## Historical/stale documentation cleanup

- Original priority: P3 cleanup request.
- Status: **FIXED**
- Root cause: historical phase/progress records could be mistaken for active source of truth and one AI-specific handoff duplicated continuity guidance.
- Files/configuration affected: `progress/README.md`; active deployment/governance documents; deleted `progress/AI-HANDOFF.md`.
- Solution chosen: preserve historical records for provenance but clearly define current source-of-truth precedence and update active documents instead of rewriting old snapshots.
- Why chosen: deleting history removes useful decision provenance; leaving it unclassified creates operator ambiguity.
- Alternatives considered: purge historical phase records — rejected.
- Implementation summary: progress archive is explicitly historical; current Git/Actions/Cloudflare/governance evidence outranks archived snapshots.
- Tests added/changed: source/page-safety scans and final diff review.
- Verification performed: active documentation is current on the remediation branch and AI-specific duplicate artifact is gone.
- Production evidence: documentation/repository-only change.
- Residual risk: historical records intentionally contain old states and commit references, but are clearly labelled as history.

## Informational observations / accepted architecture boundaries

- No npm runtime/development dependency graph is intentional; native Node/browser APIs and pinned GitHub Actions remain the chosen supply-chain model. Status: **ACCEPTED RISK**.
- Build/runtime assets are fingerprinted and deterministic. Status: **ACCEPTED RISK**; no defect identified.
- Search constructs DOM nodes and uses `textContent`, not user-controlled HTML injection. Status: **ACCEPTED RISK**; no vulnerability identified.
- Preference storage has a schema/version marker without a complex migration engine. Status: **ACCEPTED RISK** while storage remains limited to bounded language/theme data.
- Cipher, Verify, Support and private/backend systems are separate audit scopes. Status: **ACCEPTED RISK** for the scope boundary only; this remediation makes no claim that those systems were audited.

## Exact pre-merge verification evidence

Candidate `226931e84f9d374234b587e252cd33ce291eb5b4`, workflow `40269687867`:

- `verify`: PASS.
- `history-secret-audit`: PASS with complete-history checkout.
- `external-links`: PASS.
- `browser-audit`: PASS.
- Cloudflare Pages branch preview: PASS.
- 262 generated HTML files; 253 indexable routes.
- 172 published translation approvals; 0 blocking stale; 0 standard-risk stale.
- 0 unresolved line-review warnings.
- Contact composer regression: PASS with maximum local inquiry content, bounded subject-only mailto, clipboard copy and manual fallback.
- Localized rendered reflow: PASS for 168 indexed French/Spanish routes at 320/1440 and 10 representative routes at 375/430/768/1024/1920.
- History secret scan: PASS.
- Media provenance: PASS for 12 production originals and 30 responsive derivatives, with 7 creator names explicitly unresolved.
- Search headroom: 226.6 KiB / 240.0 KiB remediation limit.
- Largest lawyer-controlled legal page: 62.0 KiB / 63.0 KiB remediation limit.

## Remaining OPEN items before production readiness

1. H-01 / P1-02: enable and verify actual GitHub `main` protection/ruleset with mandatory pull-request/status-check enforcement.
2. M-01 / P1-01: merge/deploy the `no-transform` policy and obtain canonical live proof that JSD/other recognized injection is absent and exact release comparison passes.

## Coverage boundaries that remain unverified

The following are not converted into passes without qualifying evidence: Safari/WebKit, physical iOS/Android, NVDA/JAWS/VoiceOver/TalkBack, real external email-client behavior, field Core Web Vitals, Search Console/indexation, independent legal advice, independent verification of all company-supplied facts, Cipher cryptography, Verify/Support/private infrastructure internals, real staffing/availability claims, same-method historical performance, the seven unresolved photographer names, and universal independent clearance of depicted-person/brand/building/property rights.