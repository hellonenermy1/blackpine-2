# Production deployment

This document describes the intended production integration for `blackpinecybersecurity.com`.

## Platform

The repository is configured for Netlify.

- Build command: `npm run build`
- Publish directory: `dist`
- Required Node version: Node 22 is used by CI; the package supports Node 20+
- Core production output requires no runtime package installation
- Netlify Form Detection must remain enabled for the contact workflow

## Canonical host

Canonical origin:

`https://blackpinecybersecurity.com`

`https://www.blackpinecybersecurity.com/*` permanently redirects to the apex host.

Do not add a catch-all 200 rewrite to `/index.html`. Unknown routes must remain real 404 responses.

## Forms

The contact page contains a Netlify-detectable static form:

- form name: `contact`
- honeypot: `company-website`
- success route: `/contact/thanks/`

The public form is initial intake only. It must not be presented as a secure evidence-transfer channel, live emergency hotline, guaranteed-response mechanism, or substitute for a separately established customer incident channel.

Before release, submit a safe non-sensitive production test and verify that the intended operational recipient/process actually receives or handles it. Source markup alone is not form-delivery proof.

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
- no unrelated third-party JavaScript.

### Cipher

`cipher.blackpinecybersecurity.com`

Purpose: encryption application.

Do not inherit corporate marketing dependencies. Release-specific security claims belong to the current Cipher implementation and project documentation.

### Verify

`verify.blackpinecybersecurity.com`

Purpose: verification surface.

Keep separate from marketing code and unrelated scripts.

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
- permanent legacy redirects;
- real 404 behavior.

Before a DNS/hosting cutover, preserve any existing Search Console and backlink baseline so unexpected legacy URLs can be added as direct single-hop redirects.

## Security headers

`netlify.toml` is the Netlify source of truth for:

- HSTS;
- MIME sniffing protection;
- frame denial;
- Referrer Policy;
- Permissions Policy;
- CSP;
- Cross-Origin-Opener-Policy;
- Cross-Origin-Resource-Policy;
- cache behavior.

`public/_headers` maintains equivalent deployable header policy for compatible static hosts and preview environments. Changes to one must be checked for policy parity with the other.

Do not loosen the CSP to add a service without documenting the reason.

## Release process

1. Keep the phase/release pull request pointed at its real dependency branch.
2. Require the `Verify Blackpine` workflow to pass all source jobs, including the rendered-browser audit and external-reference validation.
3. Review generated routes, redirects, public capability publication states, claims, and browser evidence.
4. Confirm that no unresolved operational claim is being made publicly.
5. Obtain explicit release approval before merging the release chain to `main`.
6. Let Netlify build production from the exact merged commit.
7. Run the final live audit in `AUDIT.md` against the deployed commit.
8. Verify the production contact workflow with safe non-sensitive data.
9. Compare the deployed V4 performance against the pre-V4 baseline using the same measurement method.

## Production-only proof

These checks cannot be replaced by source CI:

- apex and `www` behavior;
- real HTTP status and redirect behavior;
- deployed CSP/security headers;
- CDN cache headers and cache behavior;
- HTTP protocol/compression behavior;
- form delivery and operational handling;
- actual production performance;
- Search Console/canonical behavior after release;
- externally reachable Cipher/Verify/Support boundaries.

A green source branch is necessary, but it is not production proof.
