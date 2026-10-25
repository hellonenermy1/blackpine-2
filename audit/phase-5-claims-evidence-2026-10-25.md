# Blackpine new production audit — Phase 5 claims, evidence, proof and wording

Date: 2026-10-25
Branch: `audit/phase-5-claims-evidence`
Baseline production commit: `45f73d618cf057b2f5e5513fafd85ac803485e6b`
Validated implementation candidate: `40227f7fb3da10eeb2b7a8620b0fedbc2c276b37`
PR: #37

## Phase result

**PASS WITH DEFERRED RELEASE / GOVERNANCE ITEMS**

Phase 5 met its claim-governance and wording exit criteria on the immutable implementation candidate identified above. No Critical or High finding introduced by this phase remains open, and no Phase 5 Medium finding remains unresolved.

This record intentionally treats `40227f7fb3da10eeb2b7a8620b0fedbc2c276b37` as the implementation evidence point. The documentation commit that adds this file is not itself treated as the Phase 5 implementation SHA, preventing a self-referential closeout loop.

## Exact-head evidence

GitHub Actions workflow `Verify Blackpine` run `40181406293` completed successfully for implementation candidate `40227f7fb3da10eeb2b7a8620b0fedbc2c276b37`.

Candidate checks:

- `verify`: PASS
- `external-links`: PASS
- `browser-audit`: PASS
- Cloudflare Pages preview: PASS / deployed successfully

Cloudflare reported:

- latest commit: `40227f7`;
- commit preview: `https://afe554e6.blackpine-cybersecurity.pages.dev`;
- branch preview: `https://audit-phase-5-claims-evidenc.blackpine-cybersecurity.pages.dev`.

The browser job explicitly reports:

- generic rendered-browser audit: PASS across every indexed route plus key noindex/404 routes, desktop, 320 px, representative tablet reflow, screenshots and Firefox smoke;
- Phase 3 engineering browser checks: PASS;
- Phase 4 customer-experience browser checks: PASS;
- French localization browser audit: PASS;
- Spanish localization browser audit: PASS;
- Phase 4 storage/no-JavaScript/accessibility/reduced-motion/320 px browser audit: PASS.

Browser artifact for the candidate:

- name: `blackpine-browser-audit`;
- artifact ID: `12593423615`;
- SHA-256 digest: `dac15e7ba183578cba5372ac35123e17231bf811f504e56d3949379f7fc61b86`.

## Canonical Phase 5 claim system

Phase 5 adds three linked controls:

1. `governance/PUBLIC_CLAIM_EVIDENCE_STANDARD.md` defines what counts as a material claim and what each evidence class can and cannot prove.
2. `governance/PUBLIC_CLAIM_REGISTER.json` is the canonical evidence decision record for material claims.
3. `governance/PUBLIC_CLAIM_PUBLICATION_MAP.json` records the public routes where each claim, qualifier, or not-public boundary appears.

`CLAIMS.md` remains a broad publication-control document but now points maintainers to the Phase 5 register and route map for material claim decisions.

The validated implementation candidate contains **28 material claim records**:

- **11 Critical**;
- **14 High**;
- **3 Standard**;
- **6 explicitly evidence-gated as `NOT_PUBLIC`**.

The Phase 5 evidence gate verifies schema integrity, stable IDs, risk/status values, repository evidence references, release-gate references, external-evidence review dates, required critical claim families, current team/hiring/client-evidence counts and protected not-public states.

The Phase 5 route gate verifies all 28 claim IDs have exactly one publication-map record, every mapped route exists in the English public route registry, and not-public claims can appear only as boundary/status disclosures rather than affirmative claims.

## Evidence-strength model

Phase 5 separates evidence into explicit classes rather than treating all repository facts as equivalent proof:

- `USER_DECLARED` — current facts supplied and approved by Blackpine; valid for Blackpine's own factual statements but not independent verification;
- `SOURCE_BUILD_VERIFIED` — facts directly demonstrated by source, generated output, build checks or browser behavior; bounded to the inspected build/deployment layer;
- `EXTERNAL_VERIFIED` — facts checked against a qualifying third-party source and subject to a review date;
- `CLIENT_SUPPLIED` — client-supplied/approved material bounded to exactly what the client evidence supports;
- `BLACKPINE_PUBLIC_EVIDENCE` — inspectable Blackpine-owned evidence; proof that the artifact exists, not independent endorsement;
- `CONTRACT_DEPENDENT` — commitments valid only when established by the relevant written agreement/operating model;
- `OPEN_EVIDENCE` — evidence is insufficient for an affirmative public claim.

The standard explicitly enforces these rules:

- consistency is not independent evidence;
- a plan is not an operating capability;
- a policy is not operating evidence;
- a testimonial is not a case study;
- readiness is not certification or independent assurance;
- a third-party profile verifies only the fields actually checked;
- source/build proof has a deployment boundary;
- contractual commitments remain contractual;
- negative security/privacy claims must be bounded to what was inspected;
- time-sensitive evidence must be re-checked.

## Phase 5 findings and disposition

### P5-001 — material claims lacked one canonical evidence-strength register

Severity: Medium
Disposition: **FIXED**

Before Phase 5, Blackpine had several useful controls including `CLAIMS.md`, authority evidence, assurance evidence, client-evidence rules, external-reputation rules and release checks. They did not provide one canonical material-claim record connecting approved wording to evidence strength, evidence status, sources, release gates, owner/review state and publication boundary.

Phase 5 adds the structured 28-claim register and release gate without deleting the narrower specialist registers.

### P5-002 — About-page address/phone non-duplication claim contradicted the actual site

Severity: Medium
Disposition: **FIXED**

The About page stated that street-level address and phone details were not duplicated across the corporate site. That was too absolute: approved contact facts are intentionally present on Contact, Company Information and external-verification surfaces and in tightly scoped structured data.

The public wording now states that Blackpine's public business location is Montreal, Quebec, Canada and directs users to Contact and Company Information for current address/phone details.

The change was reviewed in English, French and Spanish. The localization approval for `/company/about/` was updated to the exact new source hash, and the final candidate reports zero blocking or standard translation drift.

### P5-003 — repository consistency could be mistaken for independent verification

Severity: Medium
Disposition: **FIXED**

The site consistently presents a 26-person team and current leadership roles, but source consistency alone is not independent headcount or corporate-ownership verification.

Phase 5 keeps current approved company facts publishable while classifying them correctly as `USER_DECLARED` / `INTERNAL_CURRENT`. The register expressly prohibits describing repository consistency as an external audit or independent verification.

The same evidence-strength rule is applied to internal governance documents: a documented policy or control model proves the documentation exists, not that every control operated effectively over a period or received independent certification.

### P5-004 — unsupported high-impact claims needed one explicit canonical not-public state

Severity: High
Disposition: **FIXED**

The existing site already avoided unsupported affirmative wording, but Phase 5 makes the following states explicit and machine-gated:

- full client case study: `NOT_PUBLIC` / `OPEN`;
- dynamic Google rating/review-count claim: `NOT_PUBLIC` / `OPEN`;
- unverified LinkedIn, Clutch, partnership, CVE, media, conference, award or similar external-recognition claim: `NOT_PUBLIC` / `OPEN`;
- ISO/SOC or other independent certification/attestation claim without qualifying evidence: `NOT_PUBLIC` / `OPEN`;
- professional/E&O/cyber insurance affirmative claim without current authoritative evidence approved for disclosure: `NOT_PUBLIC` / `OPEN`;
- generally available public cybersecurity emergency hotline: `NOT_PUBLIC` / `OPEN`, with the capability remaining contract-dependent rather than deleted.

The release gate fails if these evidence-gated claim records are silently promoted to a public affirmative state.

### P5-005 — client-supplied proof required a stronger inference boundary

Severity: Medium
Disposition: **FIXED**

The current client evidence supports 20 testimonials and three bounded testimonial-derived evidence snapshots. Phase 5 classifies these as `CLIENT_SUPPLIED` / `CLIENT_APPROVED`, not as independent performance evidence.

The evidence boundary prohibits inferring or inventing client size, architecture, location, project value, incident status, tools, findings, remediation completion, timing, quantitative outcomes or other unsupported case-study details from a testimonial.

A full case study remains evidence-gated until the case-study release standard is actually satisfied.

### P5-006 — verified external business-profile data needed field-level scope and expiry

Severity: Medium
Disposition: **FIXED**

Google Business Profile remains the currently approved third-party company profile. It was re-verified on 2026-10-25 for Blackpine's approved public business identity, address and phone and is scheduled for review again by 2027-01-25.

That evidence does **not** independently verify ownership, team size, certifications, insurance, service quality, partnerships, ratings, review count, business hours, category or descriptive profile text.

Dynamic rating, review count and hours remain source-of-truth data on the third-party profile and are not frozen into the corporate-site evidence record.

### P5-007 — claim evidence did not have an explicit public-route map

Severity: Medium
Disposition: **FIXED**

The evidence register records what supports a claim, while the new publication map records where the claim or its restriction is presented to customers.

All 28 material claim IDs have exactly one route-map entry, and the release gate verifies every referenced route exists. `NOT_PUBLIC` claims can map only as `not-public-boundary`, preventing a status page from being misinterpreted as permission to publish the unsupported affirmative claim.

### P5-008 — broad claim control contained stale theme-persistence wording

Severity: Low
Disposition: **FIXED**

`CLAIMS.md` previously described both `blackpine.preferences.v1` and `blackpine-theme` as browser persistence keys in a way that could imply current dual ownership. Phase 3 had already made the primary preference record authoritative and retained the legacy key only for one-way migration/cleanup.

Phase 5 updates the broad claim control to match that proven runtime state.

## External evidence boundary

The current Google Business verification supports only the approved company identity/location/contact facts recorded by the register. Dynamic third-party profile data is intentionally not treated as a static Blackpine fact.

No LinkedIn company page, Clutch company profile, vendor partnership, certification, insurance certificate, CVE recognition, award, conference/media appearance or other independent-recognition claim is promoted merely because it is desirable, planned or mentioned internally.

## Claim categories intentionally not converted into affirmative marketing

Phase 5 does not manufacture evidence to make the site appear larger or more established. In particular:

- ISO/SOC readiness remains readiness, not certification/attestation;
- insurance remains evidence-gated;
- the public emergency hotline remains unproven/contract-dependent;
- client snapshots remain bounded snapshots, not full case studies;
- third-party ratings remain dynamic source data, not a frozen corporate headline;
- public service pages do not create universal 24/7, SLA, RTO/RPO, uptime or monitoring-coverage commitments;
- recovery, containment and assessment completeness are not guaranteed;
- release-specific Cipher cryptographic claims remain governed by current project documentation/tests rather than corporate-site marketing copy.

## Measured candidate state

The implementation candidate retained the Phase 4 engineering budgets:

- CSS: ~49.1 KiB / 64.0 KiB;
- ordinary-page JavaScript: ~33.1 KiB / 64.0 KiB across 5 JS assets;
- search index: ~239.3 KiB / 256.0 KiB;
- largest ordinary HTML: `fr/index.html`, ~37.5 KiB / 48.0 KiB;
- largest lawyer-controlled legal HTML: `fr/legal/privacy/index.html`, ~63.8 KiB / 64.0 KiB.

The final implementation-candidate source audits reported:

- 253 indexable routes + 9 noindex/error routes;
- 85 English, 85 French and 83 Spanish search-index routes;
- 262 generated HTML files;
- 175 source/config files / 19,660 lines in the deep-production scan;
- 176 code/config files / 19,662 lines in the line-by-line review;
- **0 unresolved line-review warnings**;
- 172 published localization approvals with zero blocking stale, zero standard-risk stale and zero non-published records in the Phase 4 translation-status system;
- no runtime dependency installation required.

## Preserved security / architecture boundaries

Phase 5 did not introduce:

- analytics, advertising, tag managers or remote web fonts;
- new browser persistence mechanisms;
- new contact-form submission/storage paths;
- new third-party runtime dependencies;
- cross-surface corporate runtime dependencies into Cipher, Verify or Support;
- unsupported certification, insurance, partnership, rating, case-study or emergency-hotline claims;
- sensitive evidence, contracts, personnel records, client records, credentials, insurance documents or other protected proof copied into the public repository merely to satisfy the claim register.

Cipher, Verify, Support and the corporate site remain separate public trust surfaces.

## Deferred items not falsely closed by Phase 5

The following remain intentionally open:

- `main` branch protection / required-status enforcement remains off;
- Safari/WebKit and real-device release evidence remains Phase 6 work;
- lawyer-controlled legal HTML remains near its 64 KiB budget (~63.8 KiB on the largest page);
- the 26-person team size and leadership/ownership facts remain Blackpine-supplied current facts and are not labelled independently audited;
- ISO/SOC and other independent assurance claims remain OPEN until qualifying evidence exists;
- professional/E&O/cyber insurance claims remain OPEN until qualifying current evidence approved for disclosure exists;
- full customer case studies remain evidence-gated;
- public emergency-hotline availability remains evidence-gated and contract-dependent;
- unverified LinkedIn/Clutch/partnership/CVE/media/conference/award recognition remains OPEN;
- dynamic Google rating, review count and hours remain third-party source-of-truth data rather than static Blackpine claims.

## Exit-gate result

Critical findings introduced by Phase 5: **0 open**
High findings introduced by Phase 5: **0 open**
Phase 5 Medium findings: **0 open**
Phase 5 material claim records: **28**
Critical claim records: **11**
High claim records: **14**
Evidence-gated `NOT_PUBLIC` records: **6**
Claim records lacking route-map coverage: **0**
Invalid mapped public routes: **0**
Blocking/stale reviewed translations: **0**
Unresolved line-review warnings: **0**

## Handoff

This file closes the implementation-candidate portion of the new Phase 5 claims/evidence audit. The documentation commit containing this record must itself pass the same verify, external-link, browser and Cloudflare preview checks before PR #37 is eligible to merge.

After PR #37 merges, verify the exact resulting `main` commit, Cloudflare production deployment, GitHub Pages build/deployment/report and push browser suite before declaring Phase 5 complete.
