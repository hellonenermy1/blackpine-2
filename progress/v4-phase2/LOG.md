# Phase 2 Implementation Log

## 2026-10-23 — branch and dependency

- Created `v4-phase2-experience` from the final green Phase 1 head `e7e89be851486ab09f80521a3e0bb3f1cfba6aa1`.
- Did not modify the Phase 1 branch or merge Phase 1 to `main`.
- Phase 2 is therefore explicitly dependent on Phase 1 until the repository history is reconciled.

## 2026-10-23 — problem-first capability routes

- Added stable public paths to the six Phase 1 capability families.
- Added `src/pages/capability-families.mjs` with six substantive customer-facing entry pages:
  - Blackpine Emergency Response
  - Blackpine Investigate
  - Blackpine Recover
  - Blackpine Protect
  - Blackpine Monitor
  - Blackpine Security Desk
- The six pages are intentionally not thirty-one thin service pages. They present the customer problem first and list the relevant declared offerings underneath.
- Existing specialist services remain separate technical pages and keep their existing URLs.
- Declared capabilities that do not yet need a standalone specialist page route into the correct family/contact context instead of generating low-value SEO pages.

## 2026-10-23 — capabilities and engagements

- Updated `/services/` so the six problem routes appear before the specialist-service directory.
- Preserved the existing specialist-service directory for technical buyers who already know the scope.
- Added family context links to specialist pages.
- Updated `/engagements/` around the three user-approved commercial models:
  - Blackpine On-Demand
  - Blackpine Response Retainer
  - Blackpine Managed Security
- Kept response windows, coverage, guaranteed outcomes, and similar operational claims outside public copy unless separately approved.

## 2026-10-23 — homepage

- Replaced the old capability-first homepage section with a plain-language `What is happening?` entry layer.
- Homepage rows now begin from situations such as suspected compromise, suspicious activity, recovery, protection, monitoring, and everyday Security Desk questions.
- Preserved the existing Blackpine design language, methodology, work, Labs/Cipher, research, team, trust, and contact sections.

## 2026-10-23 — contact intake

- Reworked the public contact reason selector around the six problem families rather than technical service names.
- Added a defined-project option for buyers who already know the service they need.
- Added optional safe email and callback fields for situations where the normal mailbox/account/device may be compromised.
- Added a hidden requested-capability context field for links from declared offerings without standalone pages.
- Updated public guidance to exclude passwords, keys, regulated records, full logs, confidential files, malware samples, and sensitive incident evidence from public intake.
- Updated Privacy copy to state that Blackpine site code does not deliberately store contact-form or incident-description fields in local storage.

## 2026-10-23 — local experience enhancement

- Added self-hosted `public/phase2.js`.
- The script contains only local contact-context and smart-404 behavior; it adds no third-party dependency, remote request, analytics provider, or browser storage.
- Smart 404 suggestions are based on the requested path and point to the six family routes.
- Further wiring and Phase 2 regression tests are still required before the branch is considered complete.
