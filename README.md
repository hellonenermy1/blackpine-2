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

## Local build

```bash
npm run build
npm run check
```

Serve `dist/` with any local static server.

## V2 design principles

Blackpine should feel like a security engineering institution: controlled, technically credible, premium, and deliberately designed. Avoid generic SaaS landing-page grammar, fake dashboards, hacker clichés, invented metrics, fake client logos, fabricated certifications, and absolute security claims.

Primary navigation stays intentionally small: Services, Research, Labs, Trust, Company, Contact.

## Important pre-production gates

1. **Claim verification:** confirm legal company name/status, public location, actual service boundaries, response commitments, team/careers claims, certifications, insurance, client/case-study claims, and publishable Cipher claims.
2. **Legal review:** `legal/privacy` and `legal/terms` are explicitly marked as technical drafts and require qualified legal review.
3. **Media:** the current build uses two free-to-use Unsplash images remotely. Review `MEDIA.md`; self-host optimized copies before production if licensing/process review approves it.
4. **Typography:** V2 currently uses a deliberate system-font baseline to avoid third-party font calls. Select and self-host a properly licensed production typeface only after typography testing.
5. **Quebec/French:** if Blackpine operates or actively markets commercial services in Quebec, complete a legal/language review before launch and plan proper French localization if required.
6. **Search baseline:** export current Search Console URLs/queries/backlinks before changing production URLs. Preserve valuable URLs or add single-hop 301 redirects.
7. **Cipher separation:** corporate marketing dependencies must not be copied into `cipher.blackpinecybersecurity.com` or Verify.

## Content model

`src/content.mjs` contains the initial service and research data. Research is intentionally specific and source-backed rather than generic SEO blog material.

## Security model

The corporate site is not the authoritative source for Blackpine Cipher cryptographic implementation details. Current Cipher claims must come from the project repository, release tests, and release-specific technical documentation.
