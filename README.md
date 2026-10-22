# Blackpine Cybersecurity V2

Ground-up corporate website rebuild for Blackpine Cybersecurity.

## Architecture

- Zero runtime/framework dependencies.
- Build-time static HTML generation with Node.js only.
- No client-side rendering for core content.
- Minimal JavaScript for theme selection, mobile navigation, progressive reveal, and research filtering.
- Netlify-compatible contact form.
- Restrictive CSP and security headers in `netlify.toml`.
- Generated sitemap and robots.txt.
- RFC 9116-oriented `/.well-known/security.txt`.
- Real HTTP 404 behavior in the local preview server and no production catch-all-to-home route.

The hardened build entrypoint is `build-v2.mjs`. It loads the base content model plus the reviewed launch additions in `src/research-extra.mjs`, runs the static generator, and removes synthetic site-wide sitemap modification dates rather than claiming every route changed on the same day.

## Local build

```bash
npm run verify
npm run dev
```

`npm run verify` builds the site and then runs the structural/SEO/security/design audit. `npm run dev` serves `dist/` on port 4173 by default and returns the generated 404 page with HTTP 404 for unknown routes.

## V2 design principles

Blackpine should feel like a security engineering institution: controlled, technically credible, premium, and deliberately designed. Avoid generic SaaS landing-page grammar, fake dashboards, hacker clichés, invented metrics, fake client logos, fabricated certifications, and absolute security claims.

Primary navigation stays intentionally small: Services, Research, Labs, Trust, Company, Contact.

The visual system is intentionally editorial rather than card-driven: graphite/mineral dark and light themes, 1px structural rules, a restrained pine/network topology motif, real photography, purposeful motion, and substantial whitespace.

## Content model

- Seven service areas with scope, method, deliverables, illustrative evidence, and explicit boundaries.
- Engagement models replace preset “packages”.
- Twelve launch Research pieces cover assessment, identity/email, cloud administration, web administration, incident response, readiness, recovery, and vendor access.
- Research articles are specific and source-backed instead of generic keyword-volume posts.
- Trust content covers security practices, data handling, responsible disclosure, and website security.
- Labs introduces Blackpine Cipher without making cryptographic claims that belong in the Cipher project/release documentation.

Base content lives in `src/content.mjs`. The four additional launch research pieces live in `src/research-extra.mjs` so they can receive focused editorial review while still generating into the same Research index.

## Important pre-production gates

1. **Claim verification:** confirm legal company name/status, public location, actual service boundaries, response commitments, team/careers claims, certifications, insurance, client/case-study claims, and publishable Cipher claims.
2. **Legal review:** `legal/privacy` and `legal/terms` are technical drafts and require qualified legal review before production publication.
3. **Media:** the current development build uses two free-to-use Unsplash images remotely. Review `MEDIA.md`; self-host optimized copies before production if licensing/process review approves them.
4. **Typography:** V2 currently uses a deliberate system-font baseline to avoid third-party font calls. Select and self-host a properly licensed production typeface only after typography testing.
5. **Quebec/French:** if Blackpine operates or actively markets commercial services in Quebec, complete a legal/language review before launch and plan proper French localization if required.
6. **Search baseline:** export current Search Console URLs/queries/backlinks before changing production URLs. Preserve valuable URLs or add single-hop 301 redirects.
7. **Cipher separation:** corporate marketing dependencies must not be copied into `cipher.blackpinecybersecurity.com` or Verify.
8. **Photography:** replace temporary remote image delivery with an approved, self-hosted responsive asset set before production. Preserve creator/source/license records.

## Security and release model

The corporate site is not the authoritative source for Blackpine Cipher cryptographic implementation details. Current Cipher claims must come from the Cipher repository, release tests, and release-specific technical documentation.

`AUDIT.md` defines the production gate. The automated checker verifies route presence, unique metadata, canonical host consistency, internal links, sitemap coverage, RFC 9116 fields, CSP directives, prohibited marketing claims, absence of third-party scripts/styles, and anti-vibe-coded design guardrails.

GitHub Actions runs the same build and audit for pull requests and pushes to `main`.
