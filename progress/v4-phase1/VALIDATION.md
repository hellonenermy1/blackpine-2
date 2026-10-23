# Phase 1 Validation Record

## Release state

`NOT READY TO MERGE`

Phase 1 remains on the draft PR until the current branch head has completed all required GitHub verification successfully and the checklist is reviewed.

## Baseline evidence

- Base commit: `90b0f3eefc702d014c3f2349faaf69c19cf417b5`
- Base workflow: `Verify Blackpine V3`
- Base verification result: success
- Base GitHub Pages build/deployment result: success

## Phase 1 validation requirements

The final Phase 1 branch head must pass all of the following before merge:

1. `npm run build`
2. `scripts/check.mjs`
3. `scripts/check-og-images.mjs`
4. `scripts/check-production.mjs`
5. `scripts/check-v3.mjs`
6. `scripts/check-v3-final.mjs`
7. `scripts/check-v4-phase1.mjs`
8. `scripts/check-hosting.mjs`
9. `scripts/check-pages-safety.mjs`
10. external research-reference validation

Additional manual verification required:

- no new public V4 family navigation has appeared prematurely;
- current V3 service routes remain present;
- exactly eight intended research articles remain generated;
- stale V2/Unsplash production source has been removed;
- restricted operational claims are not newly asserted;
- progress files accurately reflect the implementation;
- branch remains unmerged until user approval.

## CI runs

CI is triggered by draft pull request #9. This file must be updated with the final run ID, branch head SHA, job conclusions, and any repairs performed after failures.

## Known repository-administration limitation

At Phase 1 start GitHub reported `main` as unprotected. The connected GitHub integration exposes branch/protection state for reading, but does not expose an administration write action for branch protection or repository rulesets. Therefore Phase 1 can add and exercise the verification workflow, but cannot truthfully claim that GitHub is enforcing it as a required merge gate until repository administration is changed by an authorized owner/admin or a tool with that permission.

## Merge rule

Do not merge Phase 1 solely because the site renders. Merge approval requires a green final branch-head CI run, review of this record, and explicit user approval.
