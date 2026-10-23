# Phase 2 Checklist

Legend: `DONE`, `IN PROGRESS`, `PENDING`, `BLOCKED`, `NOT APPLICABLE`.

| Item | Status | Evidence / note |
|---|---|---|
| Branch Phase 2 from green Phase 1 head | DONE | `v4-phase2-experience` from `e7e89be...` |
| Create Phase 2 progress folder | DONE | `progress/v4-phase2/` |
| Add six indexable problem-first family routes | DONE | `/services/emergency-response/`, `/investigate/`, `/recover/`, `/protect/`, `/monitor/`, `/security-desk/` |
| Preserve all existing specialist service routes | DONE | Existing `services` route generation retained |
| Make Capabilities index problem-first | DONE | Six family routes first, specialist services below |
| Make homepage problem-first | DONE | Six plain-language situation rows |
| Publish three agreed engagement models | DONE | On-Demand, Response Retainer, Managed Security |
| Keep restricted SLA/24-7/guarantee claims gated | DONE | Phase 1 gate remains active |
| Add intent-aware contact selection | DONE | Contact form uses six problem families plus defined-project/other |
| Add alternate safe email/callback fields for possible compromise | IN PROGRESS | Markup added; enhancement script wiring/validation pending |
| Carry service/family/capability context into intake | IN PROGRESS | Query/data support added; validation pending |
| Do not persist incident descriptions in site-managed storage | IN PROGRESS | No persistence added; Phase 2 check pending |
| Add plain-language search coverage | IN PROGRESS | Family page body/search terms added; search validation pending |
| Add intelligent 404 routing | IN PROGRESS | Self-hosted enhancement added; page wiring/validation pending |
| Add navigation family layer | PENDING | Existing mega navigation still lists V3 core/specialist links |
| Add quiet accessibility improvements | PENDING | Target size/focus/forced-colors checks pending |
| Add Phase 2 regression checker | PENDING | Must validate routes, intake, storage, R&D isolation and claims |
| Keep R&D candidate services non-public | DONE | Phase 1 architecture unchanged |
| Confirm no thin 31-page service explosion | DONE | Only six new family routes; declared capabilities without specialist pages route to family/contact context |
| Run full build and all existing checks | PENDING | CI required |
| Run Phase 2-specific checks | PENDING | CI required |
| Run external-reference check | PENDING | CI required |
| Create dependent draft PR | PENDING | Target should be Phase 1 branch until Phase 1 is merged |
| Phase 2 approval for merge | PENDING | Do not merge without user approval |
