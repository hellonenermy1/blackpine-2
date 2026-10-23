# Phase 2 Validation Record

## Release state

`READY FOR FINAL BRANCH-HEAD VALIDATION`

Phase 2 remains a draft, unmerged pull request. It depends on the Phase 1 foundation and must be reviewed against `v4-phase1-foundation` after validation is complete.

## Base evidence

- Phase 1 base head: `e7e89be851486ab09f80521a3e0bb3f1cfba6aa1`
- Phase 1 validation: both `verify` and `external-links` succeeded before Phase 2 branched.
- Phase 2 branch: `v4-phase2-experience`
- Phase 2 draft pull request: #10

## Required automated checks

The final Phase 2 branch head must pass:

1. `npm run build`
2. `scripts/check.mjs`
3. `scripts/check-og-images.mjs`
4. `scripts/check-production.mjs`
5. `scripts/check-v3.mjs`
6. `scripts/check-v3-final.mjs`
7. `scripts/check-v4-phase1.mjs`
8. `scripts/check-v4-phase2.mjs`
9. `scripts/check-hosting.mjs`
10. `scripts/check-pages-safety.mjs`
11. no-runtime-dependency verification
12. external research-reference validation

## Implementation validation

Implementation head `71307317012578461c17886dea223fa41c8a443a` passed GitHub Actions run `39897767217`.

Results:

- build: PASS
- structural and production audits: PASS
- established V3 regression safeguards: PASS
- V3 final output safeguards: PASS
- V4 Phase 1 capability/claim/originality safeguards: PASS
- V4 Phase 2 customer-experience safeguards: PASS
- no runtime dependency installation required: PASS
- external reference validation: PASS

## Earlier failed run

Run `39897602800` failed only in the newly introduced Phase 2 checker after all preceding established gates had passed.

The three errors were traced to checker logic:

- two homepage customer-intent strings contained apostrophes that were HTML-escaped in generated output;
- the checker incorrectly required the literal `safe-email` ID inside the enhancement JavaScript even though the ID is correctly enforced in generated form markup and JavaScript toggles `data-contact-urgent` containers.

The checker was repaired to decode visible HTML text and verify the behavior marker actually used by the script. Separate contact-markup checks still require both `safe-email` and `safe-phone`. No product requirement was removed.

## Scope verified by the Phase 2 gate

- exactly six problem-first family routes exist and are indexable;
- family routes appear in sitemap and self-hosted search index;
- the homepage carries all six family routes and customer-language intents;
- all existing specialist service routes remain discoverable from `/services/`;
- all three agreed engagement models appear on `/engagements/`;
- contact intake contains all six problem intents plus safe alternate-contact fields;
- family/service/capability context is carried through query parameters without browser persistence;
- `phase2.js` makes no network requests and uses no local/session/indexed storage;
- the 404 page has local problem-route suggestions;
- navigation exposes the six family routes while retaining specialist access;
- R&D candidate services do not leak into public search content;
- Phase 1 restricted operational claims remain enforced;
- version-neutral privacy wording and browser-storage disclosure remain present;
- accessibility markers for target sizing, sticky-header focus offset, mobile targets, and forced-colors handling are present.

## Deliberately not claimed

- No named individual article authors or reviewers were published because confirmed authorship data was not supplied.
- No R&D-only capability was converted into a public Blackpine service.
- No telephone number, around-the-clock coverage, guaranteed response, or response-time SLA was invented for the Emergency Hotline/Response offerings.
- No pixel-by-pixel visual regression, manual Safari/iOS/Android browser matrix, or manual 400% zoom test is claimed. Those require a real branch preview/browser validation and belong in later release hardening if not performed sooner.

## CI-trigger note

The repository workflow currently triggers pull requests only when their base is `main`. PR #10 normally targets `v4-phase1-foundation`, so it was temporarily retargeted to `main` for CI validation. After the final branch-head CI run, PR #10 must be restored to `v4-phase1-foundation` before review.

## Merge rule

Do not merge Phase 2 solely because automated checks are green. Keep it draft and unmerged until the user explicitly approves the phase and the Phase 1 dependency has been reconciled.
