# Production deployment

This document describes the production integration for `blackpinecybersecurity.com`.

## Platform

The production site is connected to Cloudflare Pages through the repository's Cloudflare GitHub integration.

- Build command: `npm run build`
- Publish directory: `dist`
- Node 22 is used by CI; the package supports Node 20+
- Core production output requires no runtime package installation
- `public/_headers` and `public/_redirects` are the production static-host policy files for response headers and path-level redirects
- host-level canonical redirects are Cloudflare zone controls and are not implemented by Pages `_redirects`
- `netlify.toml` is retained only as a portability/reference configuration and is not the production form backend

## Canonical host

Canonical origin:

`https://blackpinecybersecurity.com`

The required production behavior is for `https://www.blackpinecybersecurity.com/*` to permanently redirect to the equivalent apex URL, preserving the path and query string. This is a Cloudflare account/zone redirect control, not a Pages `_redirects` rule.

Phase 6 live validation on 25 October 2026 found the `www` hostname serving HTTP 200 instead of redirecting. Until the Cloudflare Redirect/Bulk Redirect rule described in `governance/CLOUDFLARE_CANONICAL_HOST_CONTROL.md` is enabled and the live audit passes, the canonical-host release control remains open.

Do not add a catch-all 200 rewrite to `/index.html`. Unknown routes must remain real 404 responses.

## Contact intake

The production contact page intentionally does not depend on a website form processor.

The visitor enters ordinary inquiry context in the browser. Blackpine site JavaScript validates the local fields and opens a prefilled email draft addressed to:

`contact@blackpinecybersecurity.com`

Blackpine receives none of the field contents from the website itself. The information leaves the browser only if the visitor sends the prepared email through their email application.

This avoids pretending that Netlify form syntax works on Cloudflare Pages and avoids adding an unconfigured Cloudflare Function, KV/D1 binding, email-service binding, or third-party form processor.

The public inquiry path must not be presented as a secure evidence-transfer channel, live emergency hotline, guaranteed-response mechanism, or substitute for a separately established customer incident channel. Passwords, private keys, regulated records, full log exports, confidential client files, malware samples, and sensitive incident evidence remain outside ordinary email intake.

If a future server-side contact workflow is introduced, its storage or delivery backend, bindings, retention, access, abuse controls, legal/privacy implications, and failure behavior must be configured and documented before the public page claims that submissions are received.

## V4 service-publication control

`src/capabilities.mjs` records user-declared capabilities separately from whether they are approved for public publication.

A capability may remain in the internal registry while being withheld from public output when its operating model has not been evidenced. In particular, the Cybersecurity Emergency Hotline remains contract-dependent and non-public until Blackpine has a confirmed monitored channel, coverage model, activation process, and any related response terms.

Do not invent a telephone number, 24/7 coverage, response SLA, response time, guaranteed priority, guaranteed containment, or guaranteed recovery.

## Cross-domain boundaries

### Corporate

`blackpinecybersecurity.com`

Purpose: company, capabilities, research, Labs overview, Trust, contact, and legal material.

Production baseline:

- no third-party analytics;
- no ad networks;
- no tag manager;
- no remote fonts;
- no externally hosted imagery;
- no unrelated third-party JavaScript;
- no third-party website form processor.

### Cipher

`cipher.blackpinecybersecurity.com`

Purpose: encryption application.

Do not inherit corporate marketing dependencies. Release-specific security claims belong to the current Cipher implementation and project documentation.

### Verify

`verify.blackpinecybersecurity.com`

Purpose: verification surface.

Keep separate from marketing code and unrelated scripts. The bare root may reject a generic request; reachability testing must not assume that `/` is a public landing page.

### Support

`support.blackpinecybersecurity.com`

Purpose: support/operational surface.

It may have different operational requirements, but links and dependencies must not blur the security boundary of Cipher or Verify.

## SEO and migration

The production build provides:

- canonical URLs on the apex domain;
- XML sitemap;
- `robots.txt`;
- Organization, BreadcrumbList, and Article JSON-LD;
- Open Graph and Twitter metadata;
- self-hosted 1200×630 social-preview imagery;
- permanent legacy path redirects;
- real 404 behavior.

Preserve Search Console and backlink baselines when changing routes so unexpected legacy URLs can be added as direct single-hop redirects.

## Security headers and caching

`public/_headers` is the Cloudflare Pages production source of truth for:

- HSTS;
- MIME sniffing protection;
- frame denial;
- Referrer Policy;
- Permissions Policy;
- CSP;
- Cross-Origin-Opener-Policy;
- Cross-Origin-Resource-Policy;
- cache behavior;
- preview noindex policy.

`public/_redirects` is the Cloudflare Pages source of truth for path-level redirects. Host-level redirects such as `www` to apex are Cloudflare zone controls. `netlify.toml` keeps an equivalent portable/static-host policy where practical and is checked for drift.

Do not loosen the CSP or add a data-processing service without documenting the reason and the new trust boundary.

## Release process

1. Require the `Verify Blackpine` workflow to pass source/build checks, rendered-browser audit, external-reference validation, and the applicable live-production checks.
2. Review generated routes, redirects, public capability publication states, claims, contact behavior, and browser evidence.
3. Confirm no unresolved operational claim is being made publicly.
4. Merge the reviewed release to `main` only after all release-blocking pre-merge checks are satisfied.
5. Require the Cloudflare Pages GitHub check for the exact merged commit to report a successful deployment.
6. Verify the canonical apex/custom-domain behavior separately from a crawler cache.
7. Require the post-merge live audit to match representative canonical HTML to the exact merged build after deployment propagation.
8. Record any manual/device or governance deferrals explicitly; do not convert them to PASS without evidence.

## Production-only proof

These checks are separate from source CI:

- exact Cloudflare deployment status for the merged commit;
- apex and `www` behavior;
- real HTTP status and redirect behavior;
- deployed CSP/security headers;
- CDN cache headers and cache behavior;
- HTTP protocol/compression behavior;
- actual production performance;
- Search Console/canonical behavior after release;
- externally reachable Cipher/Verify/Support boundaries.

The local email composer removes server-side form-delivery as a production dependency. The actual delivery of an email still depends on the visitor sending it and the configured mail infrastructure, not on Cloudflare Pages.
