# Phase 2 Checklist

Legend: `DONE`, `IN PROGRESS`, `PENDING`, `BLOCKED`, `NOT APPLICABLE`.

| Item | Status | Evidence / note |
|---|---|---|
| Branch Phase 2 from green Phase 1 head | DONE | `v4-phase2-experience` originally branched from `e7e89be...`; review-status Phase 1 docs are mirrored in this dependency branch |
| Create Phase 2 progress folder | DONE | `progress/v4-phase2/` |
| Add six indexable problem-first family routes | DONE | `/services/emergency-response/`, `/investigate/`, `/recover/`, `/protect/`, `/monitor/`, `/security-desk/` |
| Preserve all existing specialist service routes | DONE | Existing specialist route generation retained and checker verifies every route remains on `/services/` |
| Make Capabilities index problem-first | DONE | Six family routes first, specialist services below |
| Make homepage problem-first | DONE | Six plain-language situation rows |
| Publish three agreed engagement models | DONE | On-Demand, Response Retainer, Managed Security |
| Keep restricted SLA/24-7/guarantee claims gated | DONE | Phase 1 claim gate remains in the Phase 2 verification chain |
| Add intent-aware contact selection | DONE | Six problem families plus defined-project/other; local query-context wiring |
| Add alternate safe email/callback fields | DONE | Safe fields are present for enhanced urgent flows and remain visible when JavaScript is unavailable |
| Carry service/family/capability context into intake | DONE | `intent`, `service`, and `capability` query context handled locally |
| Do not persist incident descriptions in site-managed storage | DONE | `phase2.js` has no localStorage/sessionStorage/indexedDB |
| Add plain-language search coverage | DONE | Family pages and capability aliases are included in the self-hosted search index |
| Add intelligent 404 routing | DONE | Self-hosted path-based suggestions with malformed-URL-safe decoding and no remote lookup |
| Add navigation family layer | DONE | `src/nav-v4.mjs` presents six family routes plus specialist links |
| Add quiet accessibility improvements | DONE | Focus scroll offset, minimum target sizing, larger mobile on-page links, forced-colors handling |
| Add Phase 2 regression checker | DONE | `scripts/check-v4-phase2.mjs` is in normal `npm run check` |
| Keep R&D candidate services non-public | DONE | Phase 2 gate confirms candidate names do not leak into public search content |
| Confirm no thin 31-page service explosion | DONE | Six family routes only; existing specialist pages retained; other declared offerings route into family/contact context |
| Keep research authorship truthful | DONE | No author/reviewer identities added because no confirmed individual authors/reviewers were supplied |
| Keep researched additions non-public until confirmed | DONE | Compromise Assessment, Threat Hunting, Detection Engineering, Incident Coordination, CyberSecure Canada Readiness remain research candidates |
| Record initial Phase 2 validation failure and repair | DONE | Run `39897602800` exposed three checker false positives; fixed without weakening requirements |
| Validate implementation head | DONE | `71307317...`, run `39897767217`, both jobs succeeded |
| Validate prior documentation-inclusive final head | DONE | `4ece10afb4427ca5c9e74c6cc9602c0780b79692`, run `39897944425`, both jobs succeeded |
| Review progressive-enhancement emergency intake | DONE | Review found safe-contact fields were hidden without JS; corrected so no-JS users retain them |
| Review smart-404 failure handling | DONE | Review found unguarded `decodeURIComponent`; corrected with a safe fallback |
| Phase 2 review | DONE | Architecture and claim boundaries remain aligned with the approved plan; review corrections require a fresh green final head |
| Browser screenshot / manual 400% zoom matrix | PENDING | Not claimed; requires actual rendered browser testing |
| Phase 2 review-correction head validation | PENDING | New review corrections must pass full CI before Phase 3 treats Phase 2 as its base |
| Phase 2 approval for merge | PENDING | Keep draft/unmerged until explicit user approval; Phase 1 dependency must be respected |
