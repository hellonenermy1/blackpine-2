# Image Phase 3 — production polish

Status: implemented on `phase-3-production-polish`.

## Delivery

- Production editorial JPEGs are stripped of unnecessary metadata and recompressed conservatively.
- Every actively used editorial image has 640px, 960px, and 1280px responsive variants.
- Page markup uses `srcset` and page-specific `sizes` so mobile and card layouts do not download desktop-sized imagery.
- Existing intrinsic width/height attributes remain in place to protect layout stability.
- Below-the-fold editorial imagery remains lazy-loaded and low fetch priority.

## Visual QA rules

- Preserve page-specific crop/focal-point rules established in Phases 1–2.
- Do not make Trust or service-detail pages image-heavy simply for visual consistency.
- Human and location photography remains contextual and must not imply staff, clients, or office ownership.
- Prefer removing an image over using one without a clear structural role.

## Production guardrails

The build now verifies responsive variants exist for every active editorial image and checks image-bearing page families for `srcset` delivery. Browser audits remain the final responsive-layout gate.
