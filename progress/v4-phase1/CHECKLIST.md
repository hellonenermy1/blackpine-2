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
| Keep existing V3 design/routes unchanged during Phase 1 | IN PROGRESS | No new visible family routes/navigation added yet |
| Remove stale local V2 preview label | DONE | `scripts/serve.mjs` now uses version-neutral label |
| Remove stale V2/Unsplash source-only content | PENDING | Still exists in legacy `src/content.mjs`; production normalization already prevents it from reaching output, but Phase 1 should clean the source rather than leave dead drift |
| Consolidate duplicated/dead service metadata where safe | IN PROGRESS | Registry is authoritative for architecture metadata; editorial bodies remain in existing source files to avoid an unsafe wholesale rewrite |
| Enforce Phase 1 checker in normal verification | DONE | Added to `npm run check` |
| Verify Phase 1 branch with GitHub Actions | PENDING | Requires PR/run after branch changes are ready |
| Verify external reference job | PENDING | Requires CI run |
| Review branch protection / required checks | IN PROGRESS | `main` observed unprotected; current connector exposes read but not repository administration write for protection/rulesets |
| Confirm no visual regression | PENDING | CI/build + generated output review needed |
| Confirm all V3 checks still pass | PENDING | CI required |
| Phase 1 approval for merge | PENDING | Do not merge until validation is green and user approves |
