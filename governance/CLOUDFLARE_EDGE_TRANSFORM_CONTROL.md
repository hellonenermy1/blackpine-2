# Cloudflare Edge Transformation Control

## Purpose

The Blackpine corporate site is intentionally static and does not include analytics, advertising code, tag managers, remote fonts, Rocket Loader, email-address obfuscation, or unrelated third-party JavaScript.

Cloudflare can modify HTML after the Pages build has been generated. The production control is therefore to prevent HTML transformation rather than permit a changing inline security snippet that conflicts with Blackpine's strict Content Security Policy.

## Approved production state

For `https://blackpinecybersecurity.com`:

- Cloudflare Pages Web Analytics: **disabled**
- Rocket Loader: **disabled**
- Cloudflare email-address obfuscation: **disabled / must not be injected**
- Cloudflare JavaScript Detection / Challenge Platform HTML injection: **must not be injected into the corporate site**
- static responses carry `Cache-Control: no-transform`
- Content Security Policy remains `script-src 'self'` without `unsafe-inline`

Cloudflare documents that JavaScript Detections injects an inline bootstrap and that sites using `script-src 'self'` without a nonce can see the browser refuse that inline script. Cloudflare also documents `Cache-Control: no-transform` as the supported way to prevent JavaScript Detection injection for responses where it is not required.

Blackpine uses the no-transform path because the corporate site does not have an authenticated browser application or server-side public form flow that requires JavaScript Detection, and weakening CSP to accommodate an injected inline bootstrap would be the worse security tradeoff.

This decision does not disable Cloudflare's ordinary CDN, TLS, DDoS, WAF, or other edge protections that do not require modifying Blackpine's HTML response body.

## Release-gate requirements

The exact live-release gate must verify all of the following on representative canonical pages:

1. `Cache-Control` includes `no-transform`.
2. The live response body matches the generated release without removing or normalizing injected HTML.
3. No JavaScript Detection marker is present, including `/cdn-cgi/challenge-platform/scripts/jsd/main.js` or `window.__CF$cv$params`.
4. No Cloudflare Web Analytics marker is present.
5. No Rocket Loader marker is present.
6. No Cloudflare email-protection marker is present.

If Cloudflare injects any of those features, exact-release verification fails for review. The matcher must not be broadened merely to make an unexpected edge transformation pass.

## Forbidden edge transformations

The live release gate fails if canonical HTML contains any of the following:

- `/cdn-cgi/challenge-platform/scripts/jsd/main.js`
- `window.__CF$cv$params`
- `static.cloudflareinsights.com`
- `beacon.min.js`
- `data-cf-beacon`
- Rocket Loader markers such as `rocket-loader` or `data-cfasync`
- Cloudflare email-protection markers such as `/cdn-cgi/l/email-protection`, `data-cfemail`, or `email-decode.min.js`

## Rationale

A CSP nonce is only useful when it is unpredictable per response. The corporate site is static, so embedding a reusable build-time nonce would weaken the nonce model. A fixed hash is not suitable for Cloudflare's request-specific inline JavaScript Detection bootstrap, and adding `unsafe-inline` would materially weaken the existing CSP. Preventing the transformation is therefore the simplest and strongest fit for this architecture.

## Verification record

The remediation is not complete until the changed headers are deployed and production verification proves that canonical HTML carries `no-transform`, contains no JavaScript Detection injection, and matches the generated release exactly.
