# Cloudflare Canonical Host Control

## Requirement

The canonical public origin is:

`https://blackpinecybersecurity.com`

Requests to `https://www.blackpinecybersecurity.com/*` must permanently redirect to the equivalent apex URL while preserving the path and query string.

## Current verified state

The original Phase 6 finding on 25 October 2026 observed the `www` hostname serving HTTP 200 instead of redirecting. That configuration was corrected later the same day.

Current release evidence verifies:

- the `www` root redirects to the apex origin;
- a nested `/company/about/` request preserves its path;
- the `phase6=canonical-check` query string is preserved;
- the apex remains the canonical application origin.

The recurring production audit continues to verify the redirect on every merged release. A previous successful observation is not treated as permanent proof.

## Control location

This is a Cloudflare zone/account control, not a static Pages `_redirects` rule. Cloudflare Pages `_redirects` does not provide the host-level source matching needed for this control.

The intended zone rule is:

- source host: `www.blackpinecybersecurity.com`
- destination host: `blackpinecybersecurity.com`
- scheme: HTTPS
- permanent redirect;
- preserve path suffix;
- preserve query string.

Do not add a fake host-level rule to `public/_redirects` and assume that it enforces this behavior.

## Verification

`scripts/check-www-canonical.mjs` and `scripts/check-live-production.mjs` must continue to prove:

1. `https://www.blackpinecybersecurity.com/` returns a redirect rather than serving a 200 document;
2. its `Location` resolves to the apex origin;
3. a nested path and query string are preserved;
4. the apex continues to serve the audited release.

If any of those checks fail, the canonical-host control is no longer verified even though this document records a previously successful state.

Cloudflare documentation reference: `https://developers.cloudflare.com/pages/how-to/www-redirect/`.
