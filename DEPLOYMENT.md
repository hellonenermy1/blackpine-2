# Production deployment

This document describes the intended production integration for `blackpinecybersecurity.com`.

## Platform

The repository is configured for Netlify.

- Build command: `npm run build`
- Publish directory: `dist`
- Required Node version: Node 22 is used by CI; the package supports Node 20+
- Core production output requires no runtime package installation

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

Netlify Form Detection must remain enabled for the production site. The public form is initial intake only and must not be presented as a secure evidence-transfer channel or guaranteed emergency-response mechanism.

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
- permanent V1 redirects;
- real 404 behavior.

Before a DNS/hosting cutover, preserve any existing Search Console and backlink baseline so unexpected legacy URLs can be added as direct single-hop redirects.

## Security headers

`netlify.toml` is the source of truth for:

- HSTS;
- MIME sniffing protection;
- frame denial;
- Referrer Policy;
- Permissions Policy;
- CSP;
- Cross-Origin-Opener-Policy;
- Cross-Origin-Resource-Policy;
- cache behavior.

Do not loosen the CSP to add a service without documenting the reason.

## Release process

1. Open a pull request from the release branch.
2. Require the Verify Blackpine V2 workflow to pass.
3. Review the generated route and redirect changes.
4. Merge to `main`.
5. Let the production platform build from the exact merged commit.
6. Run the separate final audit defined in `AUDIT.md` against the deployed site.

The final deployed-site audit is intentionally separate from the three implementation phases.
