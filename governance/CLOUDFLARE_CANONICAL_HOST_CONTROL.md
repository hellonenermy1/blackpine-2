# Cloudflare Canonical Host Control

## Requirement

The canonical public origin is:

`https://blackpinecybersecurity.com`

Requests to `https://www.blackpinecybersecurity.com/*` must return a permanent redirect to the equivalent apex URL while preserving the path and query string.

## Phase 6 live finding

On 25 October 2026, the external GitHub-runner live audit received HTTP `200` from `https://www.blackpinecybersecurity.com/` instead of a permanent redirect.

This is a hosting/account configuration issue, not a static-site source issue.

Cloudflare Pages `_redirects` does not support domain-level source matching. Do not add a fake host-level rule to `public/_redirects` and assume it works.

## Required Cloudflare rule

Use a Cloudflare Redirect Rule or Bulk Redirect for the zone:

- source host: `www.blackpinecybersecurity.com`
- destination host: `blackpinecybersecurity.com`
- scheme: HTTPS
- status: `301`
- preserve path suffix: enabled
- preserve query string: enabled

The current `www` DNS record already resolves publicly because the live request returns a page. Do not replace working DNS merely to satisfy this document; the release requirement is the HTTP redirect behavior.

## Verification

After the Cloudflare rule is enabled, the Phase 6 live audit must prove all of the following:

1. `https://www.blackpinecybersecurity.com/` returns 301/302/307/308 without first serving a 200 document.
2. Its `Location` resolves to `https://blackpinecybersecurity.com/`.
3. A nested path preserves the path when redirected.
4. The apex continues to return the audited V4 release.

Cloudflare documentation reference: `https://developers.cloudflare.com/pages/how-to/www-redirect/`.
