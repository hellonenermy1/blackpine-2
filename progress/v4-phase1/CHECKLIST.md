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
| Preserve the intended eight published research articles | DONE | Five core articles + three published `research-extra` articles remain in the production allowlist |
| Consolidate service architecture metadata | DONE | Families, engagement models, offering status, publication state, route bindings, aliases, and claim controls now live in `src/capabilities.mjs` |
| Enforce Phase 1 checker in normal verification | DONE | Added to `npm run check` |
| Verify Phase 1 branch with GitHub Actions | PENDING | Draft PR #9 is exercising the branch; final branch-head run must be green |
| Verify external reference job | PENDING | Final PR branch-head run must be green |
| Review branch protection / required checks | BLOCKED | `main` is unprotected; connected GitHub tool does not expose repository-administration write actions for protection/rulesets |
| Confirm no visual regression | PENDING | Generated-output/CI review required after final branch head |
| Confirm all V3 checks still pass | PENDING | Final PR branch-head CI required |
| Phase 1 approval for merge | PENDING | Do not merge until validation is green and user approves |
