# Blackpine Cybersecurity V2

Production-oriented corporate website for Blackpine Cybersecurity.

## Architecture

- Zero runtime/framework dependencies.
- Build-time static HTML generation with Node.js only.
- No client-side rendering for core content.
- Minimal JavaScript for theme selection, mobile navigation, research filtering, and contact-context preselection.
- Netlify-compatible contact form.
- Restrictive CSP and security headers in `netlify.toml`.
- Generated sitemap and robots.txt.
- RFC 9116-oriented `/.well-known/security.txt`.
- Real HTTP 404 behavior; no catch-all-to-home soft 404 route.
- Self-hosted brand artwork and social-preview assets.

The production build entrypoint is `build.mjs`.

## Local build

```bash
npm run verify
npm run dev
```

`npm run verify` builds the site and runs the structural/security/SEO regression checks. `npm run dev` serves `dist/` on port 4173 by default and returns the generated 404 page with HTTP 404 for unknown routes.

## Site structure

Primary navigation:

- Capabilities
- Research
- Labs
- Trust
- Company
- Contact

The site contains seven capability areas, engagement models, eight curated research publications, Blackpine Labs/Cipher project material, a public Trust Center, company pages, contact intake, and published Privacy/Terms pages.

## Design system

Blackpine uses graphite/mineral dark and light modes, structural rules, large editorial typography, restrained topology graphics, self-hosted brand artwork, and minimal functional motion.

`BRAND_SYSTEM.md` is the durable standard for voice, visual language, claim handling, photography, motion, and anti-template guardrails.

## Content model

- `src/content.mjs` contains the source service, research, and trust content.
- `src/data.mjs` applies production editorial overrides, current reference normalization, production media paths, and the curated public research set.
- `src/pages/` contains route-family page templates.
- `src/layout.mjs` owns shared page structure, metadata, Open Graph/Twitter tags, and JSON-LD.
- `src/routes.mjs` is the explicit route/indexability registry.
- `src/styles/` contains the modular visual system.
- `public/assets/` contains self-hosted production artwork.

## Research publishing

Only the curated research set exported by `src/data.mjs` is routed, indexed, linked in the sitemap, and exposed through the Research library. Draft/source material may remain in source files without becoming a public route.

Research must remain source-backed and specific. Publishing volume is not a quality target.

## Production deployment

The repository is configured for Netlify:

```text
Build command: npm run build
Publish directory: dist
```

`netlify.toml` contains canonical-host redirects, V1 migration redirects, security headers, CSP, and cache policy.

See `DEPLOYMENT.md` for domain, form, cross-domain, and release notes.

## Security boundaries

The corporate site is separate from:

- `https://cipher.blackpinecybersecurity.com`
- `https://verify.blackpinecybersecurity.com`
- `https://support.blackpinecybersecurity.com`

Corporate-site dependencies must not be copied into Cipher or Verify. The corporate site is not the authoritative source for release-specific Cipher cryptographic claims.

## Publication controls

- `CLAIMS.md` records the public claim policy.
- `MEDIA.md` records production media and future asset requirements.
- `SECURITY.md` describes private vulnerability reporting.
- `AUDIT.md` defines the separate final audit/release verification stage.

GitHub Actions builds and verifies pull requests and pushes to `main`, with a scheduled external-reference/security maintenance run.
