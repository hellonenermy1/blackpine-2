# V4 Phase 4 — Release Checklist

Legend: `PASS`, `IN PROGRESS`, `PENDING`, `BLOCKED`, `NOT APPLICABLE`.

Phase 4 goal: prove the deployable V4 release works operationally and publicly. Source/browser success is not a production PASS.

| Release category | Status | Evidence / requirement |
|---|---|---|
| Reviewed Phase 3 base | PASS | Phase 4 branched from green Phase 3 head `990d1dc0fe83e02255623fc77a1cdf558ed88ac1` |
| BUILD | PASS | 62 HTML files / 59 indexable routes; full inherited + V4 Phase 1–4 source gates green |
| STRUCTURAL | PASS | Canonicals, sitemap, internal links, redirects, navigation, specialist-service preservation, 404 behavior and route registry checks pass |
| SECURITY | PASS | Source/build controls pass: restrictive CSP/config, fingerprinted runtime assets, no runtime dependencies, no service worker, safe intake, security.txt lifecycle, cross-surface execution separation and hosting checks. Deployed headers remain a PRODUCTION gate |
| ACCESSIBILITY | IN PROGRESS | Static checks pass; rendered Chrome keyboard/focus/navigation/contact/search tests pass; all public routes pass 320px reflow; Firefox render smoke passes. Safari/WebKit, real-device/screen-reader and final manual zoom review remain |
| PERFORMANCE | IN PROGRESS | Phase 3 budgets remain green: CSS 38.0 KiB, JS 33.2 KiB, search 154.2 KiB, largest HTML 24.0 KiB. Same-method pre-V4 vs deployed-V4 production comparison remains |
| CONTENT | IN PROGRESS | Capability completeness, R&D isolation, generic/AI-copy gates and representative rendered visual review pass. Final whole-release human editorial/visual pass remains before production |
| CLAIMS | PASS | Unsupported hotline publication fixed: capability remains `CONTRACT_DEPENDENT` + `NOT_PUBLIC`; generated public output must not contain it. No 24/7, response-SLA, guaranteed-recovery/containment, continuous-monitoring or real-time dark-web claims are approved by implication |
| PRODUCTION | BLOCKED | Current public apex still serves the pre-V4 site; V4 has not been merged/deployed |
| Security Desk safety boundary | PASS | Public page explicitly rejects malware samples, passwords, private keys, confidential files and sensitive evidence through public intake |
| Contact intake | PASS | Problem-first intent routing, safe email/callback fields, no unsupported response-time promise, explicit labels and no-JS fallback pass source/browser gates |
| Emergency Response journey | PASS | Source/browser checks cover safe-contact guidance, evidence preservation, specialist routing and bounded response wording |
| Ransomware journey | PASS | Mapped through Emergency Response + specialist Incident Response; source/browser routing checks pass |
| Security Desk journey | PASS | Public-intake boundary and escalation routing pass source/browser checks |
| Response Retainer public wording | PASS | Website does not invent SLA, coverage hours or guaranteed priority; exact commitments stay in written engagement terms |
| Managed Security public wording | PASS | Website does not imply 24/7/continuous coverage or guaranteed containment; telemetry/coverage/escalation remain scoped contractually |
| Emergency Hotline publication control | PASS | Internal user-declared capability retained, but `CONTRACT_DEPENDENT` + `NOT_PUBLIC` until monitored channel/coverage/activation evidence exists |
| CI stacked-PR behavior | PASS | Workflow now validates every pull request regardless of base; PR #12 can remain correctly based on Phase 3 |
| Rendered browser audit | PASS | Run `39927082217`: all 59 indexed routes plus key noindex/404 routes audited; 62 routes / 131 reflow checks; zero overflow, missing H1, missing main landmark, warnings or errors; Chrome interaction tests + Firefox render smoke pass |
| Browser evidence artifact | PASS | Run `39927082217`, artifact `12488904521`, SHA-256 `678f4da5d2564ac3bdd97ec145d744de39041c0392d49a516662ccc3c6d19bf0` |
| 320px / keyboard reflow evidence | PASS | Every indexed route plus key noindex/404 routes passes 320 CSS px reflow; skip-link order, search focus restoration and mobile menu Escape focus restoration pass in Chrome |
| Stale V2 release documentation | PASS | README, DEPLOYMENT, AUDIT and CLAIMS now describe the V4 architecture/release controls |
| Deterministic footer | PASS | Build output no longer changes solely because the calendar year changes |
| Public-domain smoke test after V4 deploy | BLOCKED | Must test apex/www, routes, form, 404, robots, sitemap, security.txt and separate Blackpine surfaces on the deployed V4 commit |
| Live HTTP security headers | BLOCKED | Must verify actual deployed response headers, not config alone |
| HTTP protocol / compression / CDN caching | BLOCKED | Must measure live production behavior after deployment rather than infer it from config |
| Form-processing proof | BLOCKED | Must submit safe non-sensitive production data after deploy and verify operational handling |
| Safari/WebKit + real mobile/device pass | BLOCKED | Requires a real compatible browser/device environment; cannot be truthfully inferred from Linux Chrome/Firefox CI |
| V3/pre-V4 vs V4 performance comparison | BLOCKED | Requires V4 on the same production surface and measurement method |
| Final production human pass | PENDING | Full deployed navigation/copy/visual/claim sanity pass after release candidate is live |
| Merge to main | BLOCKED | Requires remaining release categories PASS and explicit user approval |
| Production deploy | BLOCKED | No implicit merge/deploy from Phase 4 branch |

## Release rule

V4 is releasable only when **BUILD, STRUCTURAL, SECURITY, ACCESSIBILITY, PERFORMANCE, CONTENT, CLAIMS, and PRODUCTION** are all PASS and the user explicitly approves the release. A green source/browser branch alone is not production proof.
