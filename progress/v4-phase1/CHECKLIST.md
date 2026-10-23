# Phase 1 Checklist

Legend: `DONE`, `IN PROGRESS`, `PENDING`, `BLOCKED`, `NOT APPLICABLE`.

| Item | Status | Evidence / note |
|---|---|---|
| Create isolated Phase 1 branch from verified V3 main | DONE | `v4-phase1-foundation` from `90b0f3e...` |
| Create durable progress folder | DONE | `progress/v4-phase1/` |
| Add six Blackpine customer problem families | DONE | `src/capabilities.mjs` |
| Add three engagement models | DONE | `src/capabilities.mjs` |
| Record all 31 user-declared offerings | DONE | Enforced by `scripts/check-v4-phase1.mjs` |
| Preserve provenance for user-declared services | DONE | `verification: USER_DECLARED_OFFERING` |
| Keep R&D ideas separate from live offerings | DONE | Five `RESEARCH_CANDIDATE` records are non-public |
| Map every current public service page into the capability model | DONE | `publicServiceBindings` + build-time validation |
| Wire capability metadata into existing service data | DONE | `src/data.mjs` enriches every service |
| Add operational claim controls | DONE | Restricted claim registry + generated-output scan |
| Add exact duplicate service-copy detection | DONE | Phase 1 check |
| Add high-similarity service-introduction detection | DONE | Phase 1 check |
| Keep existing V3 design/routes unchanged during Phase 1 | DONE | No new visible V4 family routes/navigation added in Phase 1 |
| Remove stale local V2 preview label | DONE | `scripts/serve.mjs` now uses version-neutral label |
| Remove stale V2/Unsplash source-only content | DONE | Clean `src/content-v4.mjs` is now the production source and legacy `src/content.mjs` was deleted |
| Prevent stale V2/Unsplash source drift from returning | DONE | Phase 1 checker fails if legacy content source or known stale references return |
| Preserve the intended eight published research articles | DONE | Production regression gate still enforces exactly eight |
| Consolidate service architecture metadata | DONE | Families, engagement models, offering status, publication state, route bindings, aliases, and claim controls live in `src/capabilities.mjs` |
| Enforce Phase 1 checker in normal verification | DONE | Added to `npm run check` |
| Make package/workflow naming version-neutral | DONE | `blackpine-cybersecurity-site`; workflow `Verify Blackpine` |
| Verify Phase 1 implementation with GitHub Actions | DONE | Implementation head `e0d234d...`, run `39896117971` |
| Verify final documentation-inclusive Phase 1 head | DONE | Head `e7e89be851486ab09f80521a3e0bb3f1cfba6aa1`, run `39896295302`; `verify` and `external-links` succeeded |
| Confirm all legacy V3 regression gates still pass | DONE | Normal audit chain including V3/V3-final passed on final validated head |
| Review branch protection / required checks | BLOCKED | `main` is unprotected; connected GitHub tool does not expose repository-administration write actions for protection/rulesets |
| Confirm no structural/public-route regression | DONE | Existing build/route/media/accessibility/production gates passed; no new public family navigation was introduced |
| Pixel-level/browser visual regression comparison | PENDING | Not equivalent to structural CI; no screenshot-level comparison is claimed |
| Phase 1 review | DONE | 2026-10-23 review found the tracker status was stale; implementation architecture/claim gates remained consistent with the approved Phase 1 plan |
| Phase 1 approval for merge | PENDING | Keep PR draft/unmerged until explicit user approval |
