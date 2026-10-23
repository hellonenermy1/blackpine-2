# Blackpine Cybersecurity V4

Production-oriented corporate website for Blackpine Cybersecurity.

## Architecture

- Zero runtime/framework dependencies.
- Build-time static HTML generation with Node.js only.
- No client-side rendering for core content.
- Minimal JavaScript for theme selection, navigation, local search, research filters, problem-first contact routing, local inquiry-email composition, smart 404 recovery, accessibility behavior, and conservative same-origin prefetching.
- Cloudflare Pages is the production static host.
- The public inquiry fields are processed locally and prepare an email in the visitor's email application; the website does not depend on a server-side form processor.
- Restrictive CSP and security headers in `public/_headers`, with `netlify.toml` retained as portability/reference configuration.
- Generated sitemap and `robots.txt`.
- RFC 9116-oriented `/.well-known/security.txt`.
- Real HTTP 404 behavior; no catch-all-to-home soft 404 route.
- Self-hosted brand artwork and social-preview assets.
- Content-addressed runtime assets under `/build/`.

The production build entrypoint is `build.mjs`.

## Local build

```bash
npm run verify
npm run dev
```

`npm run verify` builds the site and runs structural, security, SEO, claims, migration, V3-regression, and V4 Phase 1–4 release checks. `npm run dev` serves `dist/` on port 4173 by default and returns the generated 404 page with HTTP 404 for unknown routes.

Rendered-browser release checks are available separately:

```bash
npm run build
npm run check:browser
```

That browser audit is dependency-free and is run in GitHub Actions on the hosted Chrome/Chromium and Firefox installations.

## Site structure

The customer-facing capability model starts with six problem routes:

- Blackpine Emergency Response
- Blackpine Investigate
- Blackpine Recover
- Blackpine Protect
- Blackpine Monitor
- Blackpine Security Desk

Specialist service pages remain available underneath those routes. Commercial engagement models are separate from the technical hierarchy:

- Blackpine On-Demand
- Blackpine Response Retainer
- Blackpine Managed Security

The public site also includes Research, Labs/Cipher material, Trust, company pages, local diagnostic tools, contact intake, Privacy, and Terms.

## Content model

- `src/content-v4.mjs` contains the primary public service, research, trust, and site source content.
- `src/capabilities.mjs` is the V4 capability/service architecture and operational-publication control layer.
- `src/data.mjs` normalizes public production data, specialist-service metadata, current references, and the curated research set.
- `src/pages/` contains route-family page templates.
- `src/layout.mjs` owns shared page structure, metadata, Open Graph/Twitter tags, and JSON-LD.
- `src/routes.mjs` is the explicit route/indexability registry.
- `src/styles/` contains the modular visual system.
- `public/` contains source assets and progressive-enhancement scripts that are fingerprinted by the build.

Only capabilities whose operational and publication states permit public use should be rendered as public offerings. User-declared capabilities may remain recorded internally while being withheld from publication when an operational claim has not been evidenced.

## Contact intake

The production contact page does not submit visitor-entered inquiry fields to Cloudflare Pages or a third-party website form processor. JavaScript validates the local fields and opens a prefilled email draft addressed to `contact@blackpinecybersecurity.com`. Blackpine receives the entered details only if the visitor sends that email.

This preserves the problem-first intake UX without inventing an unconfigured backend or widening the site's data-processing surface. Sensitive evidence, credentials, keys, malware samples, regulated records, and full logs remain outside ordinary email intake.

## Research publishing

Only the curated research set exported by `src/data.mjs` is routed, indexed, linked in the sitemap, and exposed through the Research library. Research candidates remain explicitly non-public until separately approved.

Research must remain source-backed and specific. Publishing volume is not a quality target.

## Production deployment

The GitHub repository is connected to Cloudflare Pages. Production builds use:

```text
Build command: npm run build
Publish directory: dist
```

`public/_headers` and `public/_redirects` are the Cloudflare Pages production header/redirect sources. `netlify.toml` remains a portability/reference configuration and is checked for policy parity where applicable; it is not the production form backend.

See `DEPLOYMENT.md` for domain, cross-domain, contact, and release notes.

## Security boundaries

The corporate site is separate from:

- `https://cipher.blackpinecybersecurity.com`
- `https://verify.blackpinecybersecurity.com`
- `https://support.blackpinecybersecurity.com`

Corporate-site dependencies must not be copied into Cipher or Verify. The corporate site is not the authoritative source for release-specific Cipher cryptographic claims.

## Release verification

GitHub Actions validates pull requests regardless of their base branch. Push validation remains restricted to `main`.

The workflow runs:

1. build + structural/security/release gates;
2. rendered-browser audit with evidence artifacts;
3. external research-reference validation.

The Cloudflare GitHub integration reports the deployment status for the exact merged commit. A green source branch is still not a substitute for checking production-specific routing, headers, caching, and custom-domain behavior after a release.

## Publication controls

- `CLAIMS.md` records the public claim policy.
- `MEDIA.md` records production media and future asset requirements.
- `SECURITY.md` describes private vulnerability reporting.
- `AUDIT.md` defines the final audit/release verification standard.
- `progress/v4-phase*/` records implementation and release evidence for each V4 phase.
