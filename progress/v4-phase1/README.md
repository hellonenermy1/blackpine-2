# Blackpine V4 — Phase 1 Progress

## Purpose

This folder is the durable record for Phase 1 of the Blackpine V4 improvement program. It records what was verified, what changed, what was deliberately not claimed, what remains, and the validation evidence before Phase 1 is approved for merge.

## Phase 1 goal

Make the underlying service model correct before changing the customer-facing V3 design substantially.

Phase 1 covers:

- one structured Blackpine capability registry;
- all user-declared service offerings;
- six customer problem families;
- three engagement models;
- mappings from current V3 service pages to the new capability model;
- operational-claim controls;
- anti-template / anti-AI content checks;
- removal of known hidden V2/source drift;
- verification/merge safety improvements where repository permissions allow them;
- no intentional visual redesign.

## Verified baseline

- Repository: `hellonenermy1/blackpine-2`
- Base branch: `main`
- Phase 1 branch: `v4-phase1-foundation`
- Base commit: `90b0f3eefc702d014c3f2349faaf69c19cf417b5`
- Base commit title: `Blackpine Cybersecurity V3`
- V3 verification workflow for the base commit: successful
- GitHub Pages build/deployment for the base commit: successful
- `main` was observed as unprotected at Phase 1 start.

## Truth rules

1. A service listed by the user as something Blackpine offers is recorded with provenance `USER_DECLARED_OFFERING`.
2. That declaration does not automatically approve claims such as `24/7`, a specific response SLA, guaranteed recovery, continuous monitoring, or real-time dark-web monitoring.
3. Research ideas are recorded separately as `RESEARCH_CANDIDATE`; they are not presented as live Blackpine services.
4. Phase 1 does not silently publish the new six-family navigation. Customer-facing restructuring belongs to Phase 2 after review.
5. Existing V3 routes must continue to build and pass the V3 regression suite.

## Files in this folder

- `CHECKLIST.md` — phase requirements and current status.
- `LOG.md` — chronological implementation record.
- `VALIDATION.md` — tests, CI evidence, known blockers, and release decision.
