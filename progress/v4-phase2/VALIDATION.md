# Phase 2 Validation Record

## Release state

`REVIEWED — REVIEW CORRECTIONS PENDING FINAL HEAD VALIDATION`

Phase 2 remains a draft, unmerged pull request and depends on Phase 1. The original final Phase 2 head passed the full repository workflow. A later 2026-10-23 review found two small robustness/progressive-enhancement issues and one stale-tracker issue; those are corrected on the Phase 2 branch and require one new green final-head run before Phase 3 uses this branch as its base.

## Base evidence

- Phase 1 original green head used when Phase 2 branched: `e7e89be851486ab09f80521a3e0bb3f1cfba6aa1`
- Phase 2 branch: `v4-phase2-experience`
- Phase 2 draft pull request: #10

## Validated implementation head

Implementation head `71307317012578461c17886dea223fa41c8a443a` passed GitHub Actions run `39897767217`.

Results:

- build: PASS
- structural and production audits: PASS
- established V3 regression safeguards: PASS
- V3 final output safeguards: PASS
- V4 Phase 1 safeguards: PASS
- V4 Phase 2 safeguards: PASS
- no runtime dependency installation required: PASS
- external reference validation: PASS

## Prior documentation-inclusive final head

- Commit: `4ece10afb4427ca5c9e74c6cc9602c0780b79692`
- GitHub Actions run: `39897944425`
- `verify`: SUCCESS
- build: SUCCESS
- structural/production audits: SUCCESS
- V3 + V3-final safeguards: SUCCESS
- V4 Phase 1 safeguards: SUCCESS
- V4 Phase 2 safeguards: SUCCESS
- no-runtime-dependency verification: SUCCESS
- `external-links`: SUCCESS
- external research-reference validation: SUCCESS

## Earlier failed checker run

Run `39897602800` failed only in the newly introduced Phase 2 checker after all preceding established gates had passed. The three errors were checker false positives caused by HTML entity encoding and an incorrect checker expectation about a field ID in JavaScript. The checker was repaired without removing any product/security requirement.

## 2026-10-23 Phase 1/2 review findings

### Finding 1 — stale progress state

The Phase 2 validation/checklist still described final-head validation as pending even though `4ece10af...` had already passed run `39897944425`. The tracker is corrected.

### Finding 2 — safe-contact progressive enhancement

The alternate safe email/callback fields existed, but the generated HTML initially marked them `hidden`, so a visitor with JavaScript disabled could not access those fields. Review changed the baseline markup so the fields are visible without JavaScript. The enhancement script may hide them only after it runs and determines the selected inquiry type is non-urgent.

### Finding 3 — malformed 404 pathname robustness

`phase2.js` called `decodeURIComponent(window.location.pathname)` without a guard. A malformed percent-encoded path could throw and prevent local 404 suggestions. Review added a safe decoding function that falls back to the raw pathname.

### Gate changes from review

The Phase 2 checker now also requires:

- safe alternate-contact fields are not pre-hidden in generated no-JavaScript markup;
- smart-404 path decoding has a guarded fallback;
- the existing no-storage and no-network restrictions remain enforced.

## Scope retained from Phase 2

- exactly six problem-first family routes exist and are indexable;
- family routes are in sitemap and self-hosted search;
- existing specialist service routes remain discoverable;
- three approved engagement models are public;
- contact context remains problem-first;
- safe alternate-contact information remains optional and public intake still warns against sensitive evidence/malware samples;
- `phase2.js` uses no local/session/indexed storage and makes no network requests;
- R&D candidates remain non-public;
- Phase 1 restricted operational claims remain enforced;
- privacy wording remains version-neutral;
- navigation/accessibility improvements remain intact.

## Deliberately not claimed

- No named article authors/reviewers without confirmed authorship.
- No R&D-only capability converted into a live Blackpine service.
- No invented telephone number, 24/7 coverage, guaranteed response/recovery, or response-time SLA.
- No pixel-by-pixel screenshot comparison, manual Safari/iOS/Android matrix, or manual 400% zoom test.

## Merge rule

Keep Phase 2 draft/unmerged until explicit user approval and a green workflow on the current review-correction head. Phase 1 dependency must remain intact.
