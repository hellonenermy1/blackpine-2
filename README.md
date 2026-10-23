# Blackpine Cybersecurity V4

Production-oriented corporate website for Blackpine Cybersecurity.

## Architecture

- Zero runtime/framework dependencies.
- Build-time static HTML generation with Node.js only.
- No client-side rendering for core content.
- Minimal JavaScript for theme selection, navigation, local search, research filters, problem-first contact routing, smart 404 recovery, accessibility behavior, and conservative same-origin prefetching.
- Netlify-compatible static contact form.
- Restrictive CSP and security headers in `netlify.toml` and `public/_headers`.
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

## Research publishing

Only the curated research set exported by `src/data.mjs` is routed, indexed, linked in the sitemap, and exposed through the Research library. Research candidates remain explicitly non-public until separately approved.

Research must remain source-backed and specific. Publishing volume is not a quality target.

## Production deployment

The repository is configured for Netlify:

```text
Build command: npm run build
Publish directory: dist
```

`netlify.toml` contains canonical-host redirects, legacy migration redirects, security headers, CSP, and cache policy. Netlify Form Detection must remain enabled for the production contact workflow.

See `DEPLOYMENT.md` for domain, form, cross-domain, and release notes.

## Security boundaries

The corporate site is separate from:

- `https://cipher.blackpinecybersecurity.com`
- `https://verify.blackpinecybersecurity.com`
- `https://support.blackpinecybersecurity.com`

Corporate-site dependencies must not be copied into Cipher or Verify. The corporate site is not the authoritative source for release-specific Cipher cryptographic claims.

## Release verification

GitHub Actions validates every pull request regardless of its base branch, so stacked V4 phase PRs can remain pointed at their real dependency branch. Push validation remains restricted to `main`.

The workflow runs:

1. build + structural/security/release gates;
2. rendered-browser audit with evidence artifacts;
3. external research-reference validation.

A green branch is not production proof. Live headers, redirects, form delivery, CDN/protocol behavior, and production performance are checked after deployment.

## Publication controls

- `CLAIMS.md` records the public claim policy.
- `MEDIA.md` records production media and future asset requirements.
- `SECURITY.md` describes private vulnerability reporting.
- `AUDIT.md` defines the final audit/release verification standard.
- `progress/v4-phase*/` records implementation and release evidence for each V4 phase.
