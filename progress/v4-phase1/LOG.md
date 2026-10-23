# Phase 1 Implementation Log

## 2026-10-23 — baseline verification

- Re-read the current `main` branch before changing anything.
- Confirmed `main` at `90b0f3eefc702d014c3f2349faaf69c19cf417b5` (`Blackpine Cybersecurity V3`).
- Confirmed the V3 GitHub verification workflow and GitHub Pages build for that base commit had succeeded.
- Confirmed `main` was reported by GitHub as unprotected with no enforced required status checks.
- Created `v4-phase1-foundation` directly from the verified V3 commit. No Phase 1 work was made directly on `main`.

## 2026-10-23 — capability architecture

- Added `src/capabilities.mjs`.
- Added the six agreed customer problem families:
  - Blackpine Emergency Response
  - Blackpine Investigate
  - Blackpine Recover
  - Blackpine Protect
  - Blackpine Monitor
  - Blackpine Security Desk
- Added the three agreed engagement models:
  - Blackpine On-Demand
  - Blackpine Response Retainer
  - Blackpine Managed Security
- Recorded all 31 services supplied by the user as `USER_DECLARED_OFFERING` rather than presenting them as independently verified operational facts.
- Added priority, primary family, engagement-model mapping, current-route mapping, publication state, and customer-language search aliases.
- Added five research candidates separately as `PLANNED` + `NOT_PUBLIC` + `RESEARCH_CANDIDATE`:
  - Compromise Assessment
  - Threat Hunting
  - Detection Engineering
  - Incident Coordination
  - CyberSecure Canada Readiness
- These research candidates are deliberately not treated as live Blackpine services.

## 2026-10-23 — current V3 service bindings

- Added `publicServiceBindings` so all existing V3 public service pages map into the V4 capability architecture.
- Updated `src/data.mjs` so every current service object receives derived capability IDs, family IDs, and engagement-model IDs.
- Did not change the public navigation to the six-family model yet. That visible restructuring remains Phase 2 work.

## 2026-10-23 — claims and anti-template gates

- Added `scripts/check-v4-phase1.mjs`.
- The new gate validates:
  - exactly six customer families;
  - exactly three engagement models;
  - exactly 31 user-declared service records;
  - unique capability IDs;
  - valid family/engagement/status references;
  - provenance remains `USER_DECLARED_OFFERING` until explicitly reviewed;
  - research candidates remain non-public;
  - every current service page is mapped;
  - exact duplicate service short/intro/boundary copy is rejected;
  - service introductions with very high 4-gram similarity are rejected;
  - generated pages are scanned for unapproved operational claims.
- Restricted claim classes currently include:
  - 24/7 coverage;
  - guaranteed response;
  - guaranteed recovery;
  - specific response-time SLA language;
  - continuous/always-on monitoring wording;
  - real-time dark-web monitoring wording.
- Existing negative/limitation statements such as “not a 24/7 emergency service” remain allowed.
- Wired the new Phase 1 check into the normal `npm run check` chain.

## 2026-10-23 — source cleanup

- Removed the stale local-preview label `Blackpine V2 preview`; the preview server now uses a version-neutral label.
- Replaced the legacy production content source with `src/content-v4.mjs`.
- Preserved the seven core service bodies used by the production site.
- Preserved the five published core research articles used by the production filter.
- Kept the three published articles supplied by `src/research-extra.mjs`; this preserves the intended eight-article public research set.
- Did not carry forward draft/unpublished research entries that were already excluded by the production allowlist.
- Replaced stale Unsplash source references with Blackpine-hosted/self-hosted media references.
- Replaced `V2 baseline` / `V2 build pipeline` trust wording with version-neutral production wording.
- Updated `src/data.mjs` to use `content-v4.mjs`.
- Deleted the old `src/content.mjs` so the stale V2/Unsplash source cannot silently drift back into production later.

## 2026-10-23 — progress tracking and review safety

- Added `progress/v4-phase1/README.md`.
- Added `progress/v4-phase1/CHECKLIST.md`.
- Added this implementation log.
- Added `progress/v4-phase1/VALIDATION.md` for CI and release evidence.
- Opened draft pull request #9: `V4 Phase 1 — service architecture foundation`.
- The PR remains draft. It is not approved for merge while Phase 1 validation is incomplete.
- GitHub repository administration writes for branch protection/rulesets are not exposed by the connected GitHub tool. The repo state can be read, but enforcing required checks on `main` remains an owner/admin action unless that permission becomes available.
