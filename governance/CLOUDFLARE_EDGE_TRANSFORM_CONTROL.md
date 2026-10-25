# Cloudflare Edge Transformation Control

## Purpose

The audited Blackpine corporate build is intentionally static and does not include analytics, advertising code, tag managers, remote fonts, Rocket Loader, email-address obfuscation, or unrelated third-party JavaScript.

Cloudflare can modify HTML after the Pages build has been generated. Phase 6 therefore treats edge transformation as a separate production control rather than assuming the deployed HTML is byte-identical to `dist/`.

## Approved production state

For `https://blackpinecybersecurity.com`:

- Cloudflare Pages Web Analytics: **disabled**
- Rocket Loader: **disabled**
- Cloudflare email-address obfuscation: **not present in the observed release**
- Cloudflare JavaScript Detection / Challenge Platform: **allowed as a security-layer transformation**

The allowed security transform is the Cloudflare-injected inline block that loads the same-origin path:

`/cdn-cgi/challenge-platform/scripts/jsd/main.js`

It may contain request-specific Cloudflare parameters such as `window.__CF$cv$params`. Those values are expected to change between requests and therefore cannot be compared byte-for-byte with the static build.

## What the release gate permits

The exact-release gate may normalize **one recognized Cloudflare JavaScript Detection block immediately before `</body>`** when comparing the canonical live HTML with the locally generated `dist/` HTML.

Normalization is deliberately narrow:

1. The block must contain `/cdn-cgi/challenge-platform/scripts/jsd/main.js`.
2. The block must contain the Cloudflare challenge parameter marker `window.__CF$cv$params`.
3. The block must be the known inline Cloudflare security injection placed immediately before `</body>`.
4. At most one such block may be normalized from a page.
5. All remaining HTML must match the generated release exactly.

If Cloudflare changes the injection shape enough that the gate no longer recognizes it, the release check must fail for human review rather than broadening the matcher automatically.

## Forbidden edge transformations

The live release gate must fail if canonical HTML contains any of the following:

- `static.cloudflareinsights.com`
- `beacon.min.js`
- `data-cf-beacon`
- Rocket Loader markers such as `rocket-loader` or `data-cfasync`
- Cloudflare email-protection markers such as `/cdn-cgi/l/email-protection`, `data-cfemail`, or `email-decode.min.js`

These are outside the approved corporate-site runtime boundary. In particular, Cloudflare Web Analytics would contradict Blackpine's published no-third-party-analytics baseline.

## Phase 6 observed evidence

On 25 October 2026, after Cloudflare configuration changes and a fresh production retry deployment:

- the Pages default deployment HTML matched the local generated homepage byte-for-byte;
- the canonical custom domain contained no Cloudflare Web Analytics markers;
- the canonical custom domain contained no Rocket Loader markers;
- the canonical custom domain contained no Cloudflare email-protection markers;
- the only observed canonical HTML transformation was the Cloudflare JavaScript Detection / Challenge Platform block described above.

This document does not claim that Cloudflare's bot-detection system has been independently security-audited by Blackpine. It records the production transformation that Blackpine intentionally permits at the corporate edge.
