# V4 Phase 4 — Release Checklist

Legend: `PASS`, `IN PROGRESS`, `PENDING`, `BLOCKED`, `NOT APPLICABLE`.

Phase 4 goal: prove the deployable V4 release works operationally and publicly. Source-only success is not a production PASS.

| Release category | Status | Evidence / requirement |
|---|---|---|
| Reviewed Phase 3 base | PASS | Phase 4 branched from green Phase 3 head `990d1dc0fe83e02255623fc77a1cdf558ed88ac1` |
| BUILD | IN PROGRESS | Full static build + all inherited regression gates + Phase 4 gate |
| STRUCTURAL | IN PROGRESS | Route integrity, navigation, contact routing, specialist-service preservation, release-chain checks |
| SECURITY | IN PROGRESS | Existing CSP/header/cross-surface/no-third-party/no-service-worker gates plus release journey checks |
| ACCESSIBILITY | IN PROGRESS | Static accessibility gate now; manual browser/device/400% zoom matrix still required |
| PERFORMANCE | IN PROGRESS | Phase 3 build-size budgets retained; live V3-vs-V4 browser/field comparison requires deployed V4 |
| CONTENT | IN PROGRESS | Human-language/service-completeness/AI-pattern audit + public route review |
| CLAIMS | IN PROGRESS | Restricted operational claims + engagement-model reality checks |
| PRODUCTION | BLOCKED | Current public apex still serves the pre-V4 site; V4 has not been merged/deployed |
| Public-domain smoke test after V4 deploy | BLOCKED | Must test canonical apex, www redirect, routes, forms, 404, robots, sitemap, security.txt and separate Blackpine surfaces after deployment |
| Live HTTP security headers | BLOCKED | Must verify actual deployed response headers, not config alone |
| HTTP/3 / compression / CDN caching | BLOCKED | Must verify live production behavior after deployment; do not infer from Cloudflare config |
| Emergency Response journey | IN PROGRESS | Source journey audit + post-deploy manual submission/safe-contact check |
| Ransomware journey | IN PROGRESS | Source journey audit + post-deploy route/form check |
| Security Desk journey | IN PROGRESS | Source journey audit + post-deploy route/form check |
| Response Retainer reality check | IN PROGRESS | Public wording can remain bounded; actual SLA/coverage/activation terms must not be invented |
| Managed Security reality check | IN PROGRESS | Public wording must not imply 24/7/continuous coverage unless operationally supported |
| Emergency Hotline reality check | BLOCKED | Public capability exists, but a monitored emergency channel and coverage model have not been evidenced in this release record |
| Form-processing proof | BLOCKED | Must submit a safe non-sensitive production test after deploy and verify expected handling |
| Browser matrix | BLOCKED | Chrome/Chromium, Firefox, Safari/WebKit; mobile iOS/Android or equivalent evidence after deploy |
| 200% / 400% zoom and keyboard-only pass | BLOCKED | Manual/browser evidence required |
| V3-vs-V4 performance comparison | BLOCKED | Baseline public site observed; V4 must be deployed to the same production surface before comparison is meaningful |
| External-reference validation | PENDING | GitHub workflow final head |
| Human final pass | PENDING | Navigation, copy, claim tone, emergency wording, visual sanity, no AI-template feel |
| Merge to main | BLOCKED | Requires all release categories PASS and explicit user approval |
| Production deploy | BLOCKED | Follows approved merge/release sequence; no implicit deploy from this branch |

## Release rule

V4 is releasable only when **BUILD, STRUCTURAL, SECURITY, ACCESSIBILITY, PERFORMANCE, CONTENT, CLAIMS, and PRODUCTION are all PASS**. A green source branch alone is not a production release.
