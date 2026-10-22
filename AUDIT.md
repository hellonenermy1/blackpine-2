# Blackpine V2 Audit Standard

A page is not finished because it renders. V2 should pass the following gates before production.

## 1. Claims and factual integrity

- [ ] Every company, team, location, certification, insurance, partner, client, response-time, and capability claim is verified.
- [ ] Cipher claims are traceable to current project documentation/tests rather than copied marketing text.
- [ ] No fake metrics, dashboards, customer logos, reviews, case studies, offices, awards, or certifications.
- [ ] No absolute claims such as “unbreakable”, “military-grade”, or “100% secure”.
- [ ] `CLAIMS.md` has no unresolved production-critical items.

## 2. Anti-vibe-coded visual audit

- [ ] No page defaults to eyebrow → heading → paragraph → three rounded cards repeatedly.
- [ ] Cards exist only where the content is genuinely an independent object.
- [ ] No hacker hoodies, neon locks, Matrix rain, fake terminals, scanlines, cursor glows, generic 3D globes, or decorative SOC dashboards.
- [ ] Empty space is allowed to remain empty when it improves hierarchy.
- [ ] Each important page contains at least one deliberate editorial/layout decision that is not a generic component-library default.
- [ ] Photography has a clear informational or brand purpose.
- [ ] Dark and light themes both look intentionally art-directed rather than inverted.
- [ ] Typography, 1px rules, image crops, motion, focus states, diagrams, footer, and 404 feel like one system.

## 3. Content quality

- [ ] Every paragraph answers a real user question or communicates a concrete method, action, object, limitation, consequence, or decision.
- [ ] Remove interchangeable corporate phrases such as “cutting-edge solutions”, “trusted partner”, “digital landscape”, “world-class”, or repetitive uses of “practical/premium/robust”.
- [ ] Homepage remains selective; detailed material lives in hubs and deep pages.
- [ ] Service pages explain outcome, when to involve Blackpine, scope, method, deliverables, illustrative evidence, boundaries, related research, and next action.
- [ ] Research has real authorship/review, sources, dates, assumptions, and technical specificity before production publication.
- [ ] No scaled SEO articles, doorway pages, or generic industry pages created only to capture keyword variants.

## 4. Information architecture

- [ ] Primary navigation stays understandable: Services, Research, Labs, Trust, Company, Contact.
- [ ] Most information is reachable within two meaningful navigation levels.
- [ ] No deep cascading flyout menus.
- [ ] Research filters do not create an uncontrolled indexable parameter space.
- [ ] Breadcrumbs appear where they improve orientation.
- [ ] No important page is orphaned.
- [ ] Footer is organized, not a second giant sitemap.

## 5. SEO and migration

- [ ] Search Console baseline exported before replacing V1.
- [ ] Existing URLs/backlinks/impressions reviewed before changing routes.
- [ ] Old URLs map directly to their final destination with one-hop 301 redirects.
- [ ] Exactly one canonical URL for each indexable page.
- [ ] Unique title and useful meta description for each important page.
- [ ] Exactly one clear H1.
- [ ] `robots.txt` references the canonical sitemap.
- [ ] Sitemap contains only canonical indexable URLs and truthful `lastmod` values.
- [ ] 404 returns HTTP 404; no catch-all homepage 200 behavior.
- [ ] Structured data/microdata reflects visible, verified information.
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
- [ ] Dependencies locked and vulnerability-reviewed if dependencies are introduced.
- [ ] Public forms validate input, resist spam/abuse, and never request secrets.
- [ ] `/.well-known/security.txt` validates against RFC 9116-required fields and is kept current.
- [ ] Responsible disclosure email/process works.
- [ ] Cipher/Verify do not inherit corporate analytics, ads, or unrelated third-party JS.

## 7. Privacy/legal

- [ ] Privacy notice describes the production implementation, not a template.
- [ ] Terms and privacy receive qualified legal review before production.
- [ ] Contact forms collect minimum necessary data.
- [ ] Actual retention/access processes are documented before publishing retention claims.
- [ ] If marketing email is introduced, CASL/consent requirements are reviewed.
- [ ] If Blackpine operates or actively markets commercial services in Quebec, French-language requirements are reviewed before launch.

## 8. Accessibility — WCAG 2.2 AA target

- [ ] Keyboard-only navigation works in logical order.
- [ ] Skip link works.
- [ ] Focus is always visible.
- [ ] Mobile navigation exposes correct state and Escape closes it.
- [ ] Theme toggle is keyboard/screen-reader usable.
- [ ] Semantic landmarks/headings are logical.
- [ ] Inputs have labels and errors are understandable.
- [ ] Touch targets and focus targets are adequate.
- [ ] Contrast passes in both themes, including muted text and focus indicators.
- [ ] Content works at 200% and 400% zoom/reflow.
- [ ] `prefers-reduced-motion` produces a complete low-motion experience.
- [ ] Meaningful images have useful alt text; decorative visuals are hidden appropriately.

## 9. Responsive/device audit

- [ ] Small phone, standard phone, large phone, tablet, laptop, desktop, and wide desktop inspected.
- [ ] No accidental horizontal overflow.
- [ ] Long titles wrap intentionally.
- [ ] Diagrams remain readable or adapt on small screens.
- [ ] Image crops preserve the subject.
- [ ] Sticky elements do not hide content.
- [ ] Safari/iOS Safari, Chrome/Android, Firefox, Edge, and desktop Safari receive a manual pass.

## 10. Performance

Targets at the 75th percentile where field data is available:

- LCP ≤ 2.5 s
- INP ≤ 200 ms
- CLS ≤ 0.1

Checks:

- [ ] LCP media is appropriately sized and not lazy-loaded.
- [ ] Below-fold images are responsive and lazy-loaded.
- [ ] Image dimensions are declared to prevent layout shift.
- [ ] Production media is optimized (AVIF/WebP where appropriate).
- [ ] Fonts are properly licensed, self-hosted, subset, and only critical assets preloaded.
- [ ] JavaScript remains limited to interactions that materially improve the experience.
- [ ] No heavy animation/client framework is introduced without a strong reason.

## 11. Forms and conversion

- [ ] Each page has one clear dominant next action where conversion is appropriate.
- [ ] No page presents multiple equally dominant CTAs without a reason.
- [ ] Button labels describe what happens next rather than generic “Learn more”.
- [ ] Public intake is short and does not ask questions needed only after qualification.
- [ ] Active-incident messaging accurately reflects real availability and does not imply a 24/7 SLA unless verified.
- [ ] Success and error states are accessible and clear.

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

## 14. Automated gate

Before every production release:

```bash
npm run build
npm run check
```

GitHub Actions runs the same build/audit for pushes and pull requests to `main`.

## 15. Post-launch

- [ ] Search Console validates sitemap, canonical selection, and rendered content.
- [ ] Major routes are inspected individually for indexability.
- [ ] 404s, redirect chains, broken internal links, schema errors, and soft-404 reports are reviewed.
- [ ] Core Web Vitals and conversion performance are monitored.
- [ ] Research performance is reviewed by usefulness, qualified traffic, links/citations, and service relevance — not raw article count.
- [ ] Content is updated when facts change, not merely to manufacture freshness.
