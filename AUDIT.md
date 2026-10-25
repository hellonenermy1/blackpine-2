# Blackpine V4 Audit Standard

A page is not finished because it renders. V4 must pass the following gates before production.

## 1. Claims and factual integrity

- [ ] Every company, team, location, certification, insurance, partner, client, response-time, operating-coverage, and capability claim is verified.
- [ ] User-declared capabilities remain distinguishable from capabilities approved for public publication.
- [ ] Contract-dependent or operationally unverified capabilities remain non-public until their delivery model is evidenced.
- [ ] Cipher claims are traceable to current project documentation/tests rather than copied marketing text.
- [ ] No fake metrics, dashboards, customer logos, reviews, case studies, offices, awards, or certifications.
- [ ] No absolute claims such as “unbreakable”, vague “military-grade”, or “100% secure”.
- [ ] `CLAIMS.md` has no unresolved production-critical public claim.

## 2. Anti-template / human visual audit

- [ ] No page repeatedly defaults to eyebrow → heading → paragraph → identical cards without a content reason.
- [ ] Cards exist only where the content is genuinely an independent object.
- [ ] No hacker hoodies, neon locks, Matrix rain, fake terminals, scanlines, cursor glows, generic 3D globes, or decorative SOC dashboards.
- [ ] Empty space is allowed to remain empty when it improves hierarchy.
- [ ] Important pages contain deliberate editorial/layout choices rather than generic component-library defaults.
- [ ] Dark and light themes both look intentionally art-directed rather than mechanically inverted.
- [ ] Typography, rules, motion, focus states, diagrams, footer, 404, and forms feel like one system.
- [ ] Customer-problem language feels specific to real security situations rather than AI-generated SaaS copy.

## 3. Content quality

- [ ] Every paragraph answers a real user question or communicates a concrete method, action, object, limitation, consequence, or decision.
- [ ] Remove interchangeable corporate phrases such as “cutting-edge solutions”, “trusted partner”, “digital landscape”, “world-class”, or repetitive “practical/premium/robust” language.
- [ ] Homepage remains selective; detailed material lives in hubs and deep pages.
- [ ] Six customer-facing capability routes answer “why am I here?” before specialist jargon is introduced.
- [ ] Specialist pages explain outcome, when to involve Blackpine, scope, method, deliverables, illustrative evidence, boundaries, related research, and next action.
- [ ] Research has real authorship/review, sources, dates, assumptions, and technical specificity before production publication.
- [ ] No scaled SEO articles, doorway pages, or generic industry pages created only to capture keyword variants.

## 4. Information architecture

- [ ] The six customer-facing routes remain: Emergency Response, Investigate, Recover, Protect, Monitor, Security Desk.
- [ ] Specialist services remain reachable for buyers who already know the technical scope.
- [ ] Engagement models remain separate from the technical service hierarchy: On-Demand, Response Retainer, Managed Security.
- [ ] Primary navigation remains understandable and does not force customers to diagnose a discipline before asking for help.
- [ ] Most information is reachable within two meaningful navigation levels.
- [ ] No deep cascading flyout menus.
- [ ] Research filters do not create an uncontrolled indexable parameter space.
- [ ] Breadcrumbs appear where they improve orientation.
- [ ] No important page is orphaned.
- [ ] Footer is organized, not a second giant sitemap.

## 5. SEO and migration

- [ ] Search Console baseline exported before replacing the previous production site.
- [ ] Existing URLs/backlinks/impressions reviewed before changing routes.
- [ ] Old URLs map directly to their final destination with one-hop 301 redirects.
- [ ] Exactly one canonical URL for each indexable page.
- [ ] Unique title and useful meta description for each important page.
- [ ] Exactly one clear H1.
- [ ] `robots.txt` references the canonical sitemap.
- [ ] Sitemap contains only canonical indexable URLs; omit fabricated `lastmod` values.
- [ ] 404 returns HTTP 404; no catch-all homepage 200 behavior.
- [ ] Structured data reflects visible, verified information.
- [ ] Social metadata and preview imagery are page-appropriate.
- [ ] Internal links use descriptive anchors and point directly to canonical URLs.
- [ ] No duplicate `.html` and clean-route versions.

## 6. Security

- [ ] HTTPS/HSTS configuration verified in production.
- [ ] CSP tested against the exact production resource set.
- [ ] `default-src`, `script-src`, `style-src`, `img-src`, `font-src`, `connect-src`, `frame-src`, `object-src`, `base-uri`, `form-action`, and `frame-ancestors` reviewed.
- [ ] No inline-script/style shortcuts added without a justified policy decision.
- [ ] Third-party hosts documented and justified.
- [ ] No secrets or private environment values in the client bundle/repository.
- [ ] Runtime remains dependency-free unless a dependency is explicitly justified, pinned/locked, and reviewed.
- [ ] Public forms validate input, resist spam/abuse, and never request secrets or sensitive evidence.
- [ ] `/.well-known/security.txt` validates against RFC 9116-required fields and is kept current.
- [ ] Responsible disclosure email/process works.
- [ ] Cipher/Verify do not inherit corporate analytics, ads, or unrelated third-party JavaScript.
- [ ] `netlify.toml` and `public/_headers` remain policy-aligned.

## 7. Privacy/legal

- [ ] Privacy notice describes the production implementation, not a template.
- [ ] Terms and privacy receive qualified legal review before production.
- [ ] Contact forms collect minimum necessary data.
- [ ] Actual retention/access processes are documented before publishing retention claims.
- [ ] If marketing email is introduced, CASL/consent requirements are reviewed.
- [ ] If Blackpine operates or actively markets commercial services in Quebec, French-language requirements are reviewed before launch.

## 8. Accessibility — WCAG 2.2 AA target

Automated/browser CI must cover what it can, and manual review must cover what automation cannot prove.

- [ ] Keyboard-only navigation works in logical order.
- [ ] Skip link is first useful keyboard focus and works.
- [ ] Focus is visible and restored after modal/menu dismissal.
- [ ] Mobile navigation exposes correct state and Escape closes it.
- [ ] Search dialog traps/restores focus correctly.
- [ ] Theme toggle is keyboard/screen-reader usable.
- [ ] Semantic landmarks/headings are logical.
- [ ] Inputs have labels and guidance is understandable.
- [ ] Touch targets and focus targets are adequate.
- [ ] Contrast passes in both themes, including muted text and focus indicators.
- [ ] Content works at 200% and 400% zoom/reflow; 320 CSS px reflow is checked as the 400%-equivalent layout case.
- [ ] `prefers-reduced-motion` produces a complete low-motion experience.
- [ ] Meaningful images have useful alt text; decorative visuals are hidden appropriately.

## 9. Responsive/browser audit

- [ ] 1440px desktop, tablet-width, and 320px reflow passes have no accidental horizontal overflow on representative routes.
- [ ] Long titles wrap intentionally.
- [ ] Diagrams remain readable or adapt on small screens.
- [ ] Sticky elements do not hide content.
- [ ] Chrome/Chromium rendered interaction audit passes in CI.
- [ ] Firefox rendered smoke audit passes in CI.
- [ ] Safari/WebKit and mobile-device behavior receive a real manual/device pass before production if no equivalent automated environment is available.
- [ ] Browser evidence artifacts are reviewed, not merely uploaded.

## 10. Performance

Targets at the 75th percentile where field data is available:

- LCP ≤ 2.5 s
- INP ≤ 200 ms
- CLS ≤ 0.1

Checks:

- [ ] Runtime CSS/JS/search/HTML size budgets remain below the Phase 3 release limits.
- [ ] LCP media is appropriately sized and not lazy-loaded.
- [ ] Below-fold images are responsive and lazy-loaded where relevant.
- [ ] Image dimensions are declared to prevent layout shift.
- [ ] Production media is optimized for its actual format/use.
- [ ] No remote fonts are introduced.
- [ ] JavaScript remains limited to interactions that materially improve the experience.
- [ ] No heavy animation/client framework is introduced without a strong reason.
- [ ] Pre-V4 and deployed-V4 measurements use the same tool, region/device profile, and methodology before drawing conclusions.

## 11. Forms and conversion

- [ ] Each page has one clear dominant next action where conversion is appropriate.
- [ ] No page presents multiple equally dominant CTAs without a reason.
- [ ] Button labels describe what happens next rather than generic “Learn more”.
- [ ] Public intake is short and does not ask questions needed only after qualification.
- [ ] Active-incident messaging accurately reflects real availability and does not imply a hotline, 24/7 coverage, SLA, or guaranteed response unless verified.
- [ ] The production contact path matches the documented Cloudflare/local-composer architecture; no dormant Netlify/server-form markers or network-capable form action are present.
- [ ] The local composer validates required fields, percent-encodes user-controlled mail content, opens only the fixed Blackpine mailbox, and does not deliberately persist inquiry text.
- [ ] Direct-email/no-JavaScript fallback and composer failure behavior are accessible and clear.

## 12. Media licensing

- [ ] Every third-party image has source, creator, license/rights, download date, and modification/attribution notes recorded.
- [ ] Production images are self-hosted when the approved licensing/process calls for it.
- [ ] No asset is taken from Google Images, press articles, social media, or a commercial library without explicit rights.
- [ ] Original Blackpine photography/diagrams take priority over generic stock.

## 13. Cross-domain boundaries

- [ ] `blackpinecybersecurity.com` remains the corporate/research/trust surface.
- [ ] `cipher.blackpinecybersecurity.com` remains the encryption application.
- [ ] `verify.blackpinecybersecurity.com` remains verification-focused.
- [ ] `support.blackpinecybersecurity.com` remains operationally separate.
- [ ] Marketing-site dependencies are never copied into Cipher/Verify by convenience.
- [ ] Ordinary navigation links do not become runtime cross-origin data/execution dependencies.

## 14. Automated source gate

Before every production release:

```bash
npm run build
npm run check
npm run check:browser
npm run check:external
```

GitHub Actions runs source validation on every pull request regardless of its base branch, plus pushes to `main`. The browser job stores screenshots and a machine-readable report as a short-lived artifact.

## 15. Production-only gate

After deployment, verify against the exact deployed commit:

- [ ] apex and `www` behavior;
- [ ] representative routes and real 404 status;
- [ ] `robots.txt`, sitemap, and `/.well-known/security.txt`;
- [ ] live CSP/security headers;
- [ ] immutable caching for fingerprinted `/build/*` assets;
- [ ] mutable cache/revalidation behavior for all locale search indexes and other mutable metadata assets;
- [ ] actual HTTP protocol/compression behavior;
- [ ] safe contact-composer behavior, fixed recipient, direct-email/no-JS fallback, and no website-side inquiry transmission before the user sends email;
- [ ] Cipher/Verify/Support reachability and separation;
- [ ] same-method pre-V4 vs V4 performance comparison;
- [ ] final human visual/content/navigation review.

## 16. Post-launch

- [ ] Search Console validates sitemap, canonical selection, and rendered content.
- [ ] Major routes are inspected individually for indexability.
- [ ] 404s, redirect chains, broken internal links, schema errors, and soft-404 reports are reviewed.
- [ ] Core Web Vitals and conversion performance are monitored.
- [ ] Research performance is reviewed by usefulness, qualified traffic, links/citations, and service relevance — not raw article count.
- [ ] Content is updated when facts change, not merely to manufacture freshness.
