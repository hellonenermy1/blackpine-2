# V4 Phase 4 — Public Production Baseline

Observation date: 2026-10-23.

This is a baseline of the currently public site before V4 release. It is not proof of V4 production behavior.

## Apex corporate site

Public web retrieval shows `https://blackpinecybersecurity.com/` still serving the pre-V4 corporate site. Its public navigation/content includes the older Services / Packages / Resources structure and explicitly states that the website form is not a live emergency service.

This is expected while V4 Phases 1–3 remain draft/unmerged.

Production implication:
- current public content is the comparison baseline;
- V4 production checks cannot be marked PASS until the V4 release candidate is actually deployed;
- a pre-release branch should not be described as live merely because CI is green.

## Current public contact baseline

Search-engine/public-web retrieval of the existing contact page shows the older inquiry flow and a stated response-time expectation on that deployed version. That legacy wording must not be carried into V4 unless independently approved and operationally supported.

The V4 source intentionally removes a public response-time promise and instead states that scope, availability and response timing are confirmed separately.

## Current public incident baseline

The currently indexed/deployed incident-response page provides triage guidance but does not represent itself as a live emergency hotline. This is consistent with the current production site's conservative claim posture.

## Support surface

The separate Support origin is publicly indexed and describes Cipher support/documentation separately from the corporate site. Phase 4 must preserve that separation after release.

## Verification limits of this baseline

The available public-web retrieval could inspect indexed/page content but did not provide reliable raw-response proof for:
- live response headers;
- HTTP/3 negotiation;
- Brotli/Zstandard compression;
- CDN cache HIT/MISS behavior;
- direct robots.txt/security.txt response status;
- all Cipher/Verify/Support live response headers.

The local execution environment also has no external DNS/network access, so no curl result is treated as production evidence.

These items remain explicitly **BLOCKED** until they can be measured against the deployed release with a network-capable production check.
