# V4 Phase 4 — Release Checklist

Legend: `PASS`, `IN PROGRESS`, `PENDING`, `BLOCKED`, `NOT APPLICABLE`.

Phase 4 goal: prove the deployable V4 release works operationally and publicly. Source-only success is not a production PASS.

| Release category | Status | Evidence / requirement |
|---|---|---|
| Reviewed Phase 3 base | PASS | Phase 4 branched from green Phase 3 head `990d1dc0fe83e02255623fc77a1cdf558ed88ac1` |
| BUILD | PASS | Repaired implementation `8a7c0981117225c7775fc2f1c23081edd8588c7b` passed workflow `39923953793`; documentation-inclusive head `cfbcca3e3ebc3c68c87fdc8b3dd5bd0c76e0df37` passed workflow `39924206599` |
| STRUCTURAL | PASS | 62 generated HTML files / 59 indexable routes retain inherited route, canonical, navigation, specialist-service and Phase 1–4 checks |
| SECURITY | PASS | Source/build controls passed: CSP/config, no third-party executable runtime, no service worker, cross-surface execution separation, security.txt lifecycle, safe intake and inherited security gates. Live deployed headers remain a separate PRODUCTION gate |
| ACCESSIBILITY | IN PROGRESS | Static release gate passed labels, landmarks, skip links, image-alt and tabindex checks. Manual browser/device, keyboard and 200%/400% zoom evidence is still required |
| PERFORMANCE | IN PROGRESS | Phase 3 size budgets remain green. V3/pre-V4 versus deployed-V4 browser/field comparison still requires V4 production |
| CONTENT | IN PROGRESS | Automated service completeness, R&D isolation and generic/AI-copy gates passed. Final human visual/copy/navigation review remains required |
| CLAIMS | BLOCKED | Source wording passes restricted-claim and engagement-boundary checks, but `Cybersecurity Emergency Hotline` cannot be production-approved until an actual monitored emergency channel and coverage/activation model are evidenced |
| PRODUCTION | BLOCKED | Current public apex still serves the pre-V4 site; V4 has not been merged/deployed |
| First Phase 4 CI attempt | PASS | Run `39923770282` correctly failed after a successful build: Security Desk omitted its public-intake safety boundary; new checker also incorrectly treated the wrapped honeypot as a visible unlabeled control |
| Security Desk safety-boundary repair | PASS | Commit `ca75ebcdc142d6318f9e2c52d527d1495b33d091` renders the profile boundary on the public Security Desk page |
| Honeypot checker repair | PASS | Commit `8a7c0981117225c7775fc2f1c23081edd8588c7b` exempts only the intentional hidden honeypot while retaining explicit-label checks for visible controls |
| Repaired source validation | PASS | Workflow `39923953793`: `verify` SUCCESS and `external-links` SUCCESS |
| Documentation-inclusive validation | PASS | Head `cfbcca3e3ebc3c68c87fdc8b3dd5bd0c76e0df37`, workflow `39924206599`: `verify` SUCCESS and `external-links` SUCCESS. This tracker-only synchronization contains no runtime/product change; current-head GitHub status remains the canonical final check |
| Public-domain smoke test after V4 deploy | BLOCKED | Must test canonical apex, www redirect, representative routes, form, 404, robots, sitemap, security.txt and separate Blackpine surfaces after deployment |
| Live HTTP security headers | BLOCKED | Must verify actual deployed response headers, not config alone |
| HTTP/3 / compression / CDN caching | BLOCKED | Must verify live production behavior after deployment; do not infer from Cloudflare config |
| Emergency Response journey | IN PROGRESS | Automated source journey passes safe-contact, evidence-preservation, specialist routing and response-boundary checks; post-deploy manual path/form check remains |
| Ransomware journey | IN PROGRESS | Automated source mapping to Emergency Response + specialist Incident Response passes; post-deploy route/form check remains |
| Security Desk journey | IN PROGRESS | Automated source journey now passes and public intake boundary is rendered; post-deploy route/form/escalation check remains |
| Response Retainer reality check | IN PROGRESS | Public wording remains bounded; actual coverage/activation/SLA contract basis must be confirmed before release claims go further |
| Managed Security reality check | IN PROGRESS | Public wording avoids 24/7/continuous/guaranteed-containment claims; actual service definition and operational ownership must be confirmed |
| Emergency Hotline reality check | BLOCKED | Public capability exists, but a monitored emergency channel and coverage/activation model have not been evidenced in this release record |
| Form-processing proof | BLOCKED | Must submit a safe non-sensitive production test after deploy and verify expected operational handling |
| Browser matrix | BLOCKED | Chrome/Chromium, Firefox, Safari/WebKit; mobile iOS/Android or equivalent evidence after deploy |
| 200% / 400% zoom and keyboard-only pass | BLOCKED | Manual/browser evidence required |
| V3-vs-V4 performance comparison | BLOCKED | Baseline public site observed; V4 must be deployed to the same production surface before comparison is meaningful |
| External-reference validation | PASS | Runs `39923953793` and `39924206599` both passed the external research-reference job |
| Final human pass | PENDING | Navigation, copy, claim tone, emergency wording, visual sanity, no AI-template feel |
| Merge to main | BLOCKED | Requires all release categories PASS and explicit user approval |
| Production deploy | BLOCKED | Follows approved merge/release sequence; no implicit deploy from this branch |

## Release rule

V4 is releasable only when **BUILD, STRUCTURAL, SECURITY, ACCESSIBILITY, PERFORMANCE, CONTENT, CLAIMS, and PRODUCTION are all PASS**. A green source branch alone is not a production release.
