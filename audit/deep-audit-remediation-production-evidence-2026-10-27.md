# Deep-audit remediation production evidence — 2026-10-27

This addendum supplements `audit/deep-audit-remediation-2026-10-25.md` with canonical post-merge evidence collected after the repository remediation was merged to `main`.

Current production/repository commit at this evidence point: `8695de05a988f4a0801ceef4bc35c887a2d3b7e9`.

Allowed statuses remain `OPEN`, `FIXED`, and `ACCEPTED RISK` only.

## H-01 / P1-02 — mandatory protection of `main`

Status: **OPEN**.

Fresh repository evidence on 27 October 2026 still reports:

- `main` `protected:false`;
- branch protection disabled;
- no required status-check contexts;
- repository rulesets endpoint returns an empty list.

The connected GitHub App used for this remediation can read repository/ruleset state but does not expose repository-administration mutation needed to create branch protection or a ruleset. No repository file or self-check is treated as equivalent to an actual control-plane rule.

The intended rule remains: changes to `main` should require a pull request and the established release checks, without introducing a privileged repository-administration credential into CI merely to let CI administer itself.

Residual risk: a write-capable actor can still bypass the PR/check workflow by writing directly to `main` until the GitHub repository control is enabled.

## M-01 / P1-01 — CSP and Cloudflare JavaScript Detection conflict

Status: **OPEN**, with the normal 200-HTML path remediated and one Cloudflare/Pages 404 edge case remaining.

### What is verified fixed

Post-merge production run `40472797384` on `main` proves the strict exact-release control passes on five representative canonical 200 routes:

- `Cache-Control` contains `no-transform`;
- live HTML equals the generated release exactly;
- Cloudflare JavaScript Detection is absent;
- Cloudflare Web Analytics is absent;
- Rocket Loader is absent;
- Cloudflare email-address protection is absent;
- the CSP remains strict and does not add `unsafe-inline`.

The exact-release log reports:

`Exact live-release match passed for 5 representative routes with Cache-Control no-transform and no Cloudflare JavaScript Detection, Analytics, Rocket Loader, email protection, or other recognized HTML injection.`

### Remaining production defect

A real unknown-route response is still transformed by Cloudflare:

- HTTP status remains a real `404`;
- Cloudflare changes its cache policy to `Cache-Control: no-store`;
- the `no-transform` directive present on normal static HTML is not retained on that error response;
- Cloudflare injects `/cdn-cgi/challenge-platform/scripts/jsd/main.js` and `window.__CF$cv$params` into the 404 HTML.

Because the corporate CSP is intentionally `script-src 'self'` without an inline nonce/hash or `unsafe-inline`, the injected inline JSD bootstrap is not an acceptable final state. The live production gate therefore remains red rather than normalizing or ignoring this transform.

Cloudflare documents both relevant platform behaviours: JavaScript Detections is suppressed by an origin `Cache-Control: no-transform` response, and Bot Fight Mode customers receive JavaScript Detections automatically with no separate disable control. The correct final account-level action depends on the active bot product: disable JavaScript Detections directly where the plan exposes that control, or disable Bot Fight Mode if it is the product forcing zone-wide JSD.

### Alternatives rejected

- Adding `script-src 'unsafe-inline'`: rejected because it weakens the CSP to accommodate an optional edge feature.
- Static/reusable CSP nonce: rejected because a predictable nonce does not provide the intended nonce security property.
- Ignoring or stripping the injected block in release verification: rejected because that would hide the original security-control conflict.
- Converting the entire static site to a Pages Function/Worker solely to rewrite 404 headers: not adopted because it adds a serverless runtime, invocation/quota/failure modes, and operational complexity to an otherwise static site for one edge-setting conflict.
- Replacing real 404s with a 200 SPA-style fallback: rejected because it breaks the existing HTTP/SEO/error contract.

Residual risk: the ordinary corporate pages are now deterministic and injection-free, but unknown-route 404 HTML still receives the Cloudflare JSD block until the Cloudflare bot/JSD setting is changed or Cloudflare preserves `no-transform` on that response class.

## P2/P3 production verification

The remediation changes for the remaining audit findings are deployed on `main` and their relevant checks are green at this evidence point:

- structural/security/localization verification: **PASS**;
- complete Git-history secret audit: **PASS**;
- rendered browser audit: **PASS**;
- external links: **PASS**;
- Cloudflare Pages deployment for `8695de05a988f4a0801ceef4bc35c887a2d3b7e9`: **PASS**;
- GitHub Pages build/deploy/report: **PASS**.

The browser run explicitly proves:

- maximum local contact inquiry remains in the prepared summary while mailto stays bounded to recipient/subject;
- clipboard copy and blocked-clipboard manual selection both work;
- all 168 published French/Spanish indexed routes pass 320px and 1440px rendered reflow;
- ten representative localized routes additionally pass 375/430/768/1024/1920px rendering;
- the existing Chromium interaction, accessibility/reduced-motion, EN/FR/ES localization and Firefox smoke suites remain green.

`M-07` remains **ACCEPTED RISK** exactly as recorded in the primary remediation record: seven photographer creator names cannot be independently reconstructed from the pinned evidence and are kept as `UNVERIFIED` rather than guessed. Source/photo IDs, licence basis, source/production fingerprints, transformations, intended use and derivative mappings are CI-enforced.

## Current readiness boundary

The deployed corporate-site code/configuration remediation is substantially complete, but the overall release system must not be labelled fully production-ready while either P1 item remains OPEN.

Outstanding control-plane actions are limited to:

1. enable real GitHub protection/ruleset enforcement for `main`;
2. stop Cloudflare JavaScript Detection from being injected into 404 HTML without weakening Blackpine's CSP.

Cipher, Verify, Support, private backend systems, Safari/WebKit, physical-device and assistive-technology testing remain outside this addendum's verified scope unless separately evidenced.
