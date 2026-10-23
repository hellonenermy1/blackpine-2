# Phase 2 Checklist

Legend: `DONE`, `IN PROGRESS`, `PENDING`, `BLOCKED`, `NOT APPLICABLE`.

| Item | Status | Evidence / note |
|---|---|---|
| Branch Phase 2 from green Phase 1 head | DONE | `v4-phase2-experience` from `e7e89be...` |
| Create Phase 2 progress folder | DONE | `progress/v4-phase2/` |
| Add six indexable problem-first family routes | DONE | `/services/emergency-response/`, `/investigate/`, `/recover/`, `/protect/`, `/monitor/`, `/security-desk/` |
| Preserve all existing specialist service routes | DONE | Existing specialist route generation retained and Phase 2 checker verifies every route remains on `/services/` |
| Make Capabilities index problem-first | DONE | Six family routes first, specialist services below |
| Make homepage problem-first | DONE | Six plain-language situation rows; verified in generated output |
| Publish three agreed engagement models | DONE | On-Demand, Response Retainer, Managed Security |
| Keep restricted SLA/24-7/guarantee claims gated | DONE | Phase 1 claim gate passed on Phase 2 implementation head |
| Add intent-aware contact selection | DONE | Six problem families plus defined-project/other; local query-context wiring |
| Add alternate safe email/callback fields for possible compromise | DONE | Generated contact page + `phase2.js`; Phase 2 checker passed |
| Carry service/family/capability context into intake | DONE | `intent`, `service`, and `capability` query context handled locally |
| Do not persist incident descriptions in site-managed storage | DONE | `phase2.js` has no localStorage/sessionStorage/indexedDB; automated gate passed |
| Add plain-language search coverage | DONE | Family pages and capability aliases are included in the self-hosted search index |
| Add intelligent 404 routing | DONE | Self-hosted path-based suggestions; no remote lookup/network call |
| Add navigation family layer | DONE | `src/nav-v4.mjs` presents six family routes plus specialist links |
| Add quiet accessibility improvements | DONE | Focus scroll offset, minimum target sizing, larger mobile on-page links, forced-colors handling |
| Add Phase 2 regression checker | DONE | `scripts/check-v4-phase2.mjs` is in normal `npm run check` |
| Keep R&D candidate services non-public | DONE | Phase 2 gate confirms candidate names do not leak into public search content |
| Confirm no thin 31-page service explosion | DONE | Six family routes only; existing specialist pages retained; other declared offerings route into family/contact context |
| Keep research authorship truthful | DONE | No author/reviewer identities added because no confirmed individual authors/reviewers were supplied |
| Consider researched specialist additions without fabricating services | DONE | Compromise Assessment, Threat Hunting, Detection Engineering, Incident Coordination, CyberSecure Canada Readiness remain non-public research candidates |
| Run full build and all existing checks | DONE | GitHub Actions run `39897767217` verify job SUCCESS on implementation head `71307317...` |
| Run Phase 2-specific checks | DONE | Same verify job passed `check-v4-phase2.mjs` |
| Run external-reference check | DONE | GitHub Actions run `39897767217` external-links SUCCESS |
| Record initial Phase 2 validation failure and repair | DONE | Run `39897602800` exposed three checker false positives; fixed without weakening product requirements |
| Create dependent draft PR | DONE | PR #10; temporarily based on `main` only to trigger existing CI, must be restored to Phase 1 base after final validation |
| Browser screenshot / manual 400% zoom matrix | PENDING | Not claimed; requires an actual branch preview/browser test rather than source inspection |
| Phase 2 approval for merge | PENDING | Keep draft/unmerged until user approval; Phase 1 dependency must be respected |
