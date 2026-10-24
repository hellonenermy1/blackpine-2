# Lawyer Legal Documents + Deep Code Audit

Date: 2026-10-24
Branch: `legal-lawyer-docs-deep-audit`
PR: #25

## Scope

This audit covers the lawyer-supplied Website Terms and Conditions and Privacy Policy, their website implementation, Blackpine's existing production/security requirements, and a repository-wide code/config review.

## Lawyer document fidelity

Source: the 25-page lawyer-drafted PDF supplied by Blackpine on 2026-10-24.

### Website Terms and Conditions

- Effective Date: March 09, 2026
- Last Updated: October 24, 2026
- 17 sections (A-Q)
- 150 numbered clauses
- Canonical document-only SHA-256: `d19e78928da10a4b4cc38feb60c41d41dfd0b4c0af1e49138f27e7a815bf1e54`

### Privacy Policy

- Effective Date: March 09, 2026
- Last Updated: October 24, 2026
- 15 sections (A-O)
- 150 numbered clauses
- Canonical SHA-256: `5885e0887be0a5240e62dd03b9846158bc98e2189ae383f4cd1c6c2c4f2cd4f9`

The Terms hash excludes the `BLACKPINE CYBERSECURITY INC.` heading that begins the separate Privacy Policy on the following PDF page. An earlier audit hash accidentally included that next-document heading after Terms clause 150; the source document itself was not changed to resolve that audit error.

The release gate verifies exact structured-document hashes, section counts, clause counts, clause order, rendered section headings, clause anchors, dates, and selected high-impact provisions. Lawyer wording is stored separately from presentation code in `src/legal-documents.mjs`.

## Implementation

- Replaced the former short `/legal/terms/` summary with the complete lawyer-drafted Website Terms and Conditions.
- Replaced the former short `/legal/privacy/` summary with the complete lawyer-drafted Privacy Policy.
- Preserved the existing public routes.
- Removed superseded short legal summaries from `src/pages/contact-legal.mjs`.
- Added semantic section navigation and clause anchors.
- All lawyer document text is HTML-escaped by the renderer.
- Added an explicit public Privacy Officer / Person in Charge contact block using Blackpine's published business contact routes. This is presentation/implementation material and is not represented as lawyer-drafted clause text.
- Existing privacy/hosting regression tests were rebound to the lawyer-approved wording instead of preserving obsolete summary phrases.

## Security/privacy defect fixed during review

The prior contact form used `method="post" action="/contact/"`. JavaScript normally intercepted submission and composed a local email, but a no-JavaScript or failed-script path could still attempt to submit entered fields to the static site. That conflicted with the intended local-composer/no-transmission boundary.

The contact form now has no network-capable `action` or `method`; the compose control is `type="button"`; JavaScript prepares the local `mailto:` flow; and no-JavaScript users are instructed to use the published direct email route. Hosting regression checks now require this non-submitting architecture.

## Production/security audit coverage

The release suite verifies:

- canonical routes, titles, descriptions and sitemap coverage;
- robots and RFC 9116 `security.txt`;
- Content Security Policy and security headers;
- Cloudflare/Netlify header parity;
- no unrelated external executable scripts/styles;
- fingerprinted immutable runtime assets;
- no runtime package installation/dependencies;
- privacy/contact data-flow boundaries;
- local search safety and retry behavior;
- redirect/migration safety;
- accessibility structure and focus behavior;
- company/claim consistency;
- client-evidence and assurance claim boundaries;
- legal-document fidelity;
- GitHub Pages noncanonical-surface safety;
- external destinations;
- rendered desktop/mobile/tablet behavior plus Firefox smoke coverage.

## Repository-wide line review

The line-review gate examines every included code/config line under `src/`, `scripts/`, `public/`, `.github/`, and critical root build/config files. It checks for hidden Unicode controls, NUL/BOM anomalies, embedded secrets/private keys, credential-like assignments, dynamic application execution, application-process execution, TLS verification bypasses, dangerous browser HTML/eval sinks, and insecure URL indicators.

The exact release-candidate scan covered 83 code/config files and 8,990 lines with zero unresolved line-review warnings. The independent deep-production audit additionally scanned 82 source/config files / 8,988 lines, all five browser runtimes, and 88 generated HTML pages.

Manual semantic review was concentrated on the high-risk execution and data-flow paths rather than claiming that automated pattern matching substitutes for human reasoning. Reviewed high-risk files include the static build pipeline, shared layout/escaping components, routing, lawyer-document renderer/source, contact implementation, all five browser runtimes, browser-test harness, CI workflow, Cloudflare/Netlify hosting controls, deep-production/privacy/hosting/Page-safety gates, and the legal fidelity gate.

## Performance/capacity

Current measured production sizes on the audited head:

- CSS: 43.9 KiB / 64 KiB
- runtime JavaScript: 35.2 KiB / 64 KiB
- search index: 246.7 KiB / 256 KiB
- largest ordinary HTML page: 30.1 KiB / 48 KiB
- largest lawyer legal page: Privacy Policy at 50.6 KiB / dedicated 64 KiB legal-document ceiling

The ordinary 48 KiB HTML ceiling was not relaxed. Only `/legal/privacy/` and `/legal/terms/` are eligible for the dedicated legal-document ceiling. The search index currently has limited remaining headroom and should be watched as public content grows rather than increasing the budget without review.

## Legal/current-law implementation checks

- Public Privacy Officer role/contact coordinates are exposed without inventing a named individual.
- The Privacy Policy's current Cloudflare Pages, local inquiry composer, no-analytics, no-ad-network, no-tag-manager, no-social-tracking-widget and local-search baselines remain aligned with site implementation.
- The Terms preserve the Quebec/consumer/language provisions and the CAD $500 public-site commercial liability cap exactly as supplied.

## Release blocker: French legal version

Terms clause 147 states that the Terms should be made available in French in accordance with applicable Quebec language requirements and that the English version will not be used to circumvent a requirement to provide French first. No lawyer-approved French version was supplied with this change.

A machine-generated translation has deliberately not been created. Before production release/merge, obtain the lawyer-approved French Terms (and confirm with counsel whether the Privacy Policy or any additional predetermined/public legal documents require a French counterpart in Blackpine's circumstances), then implement language selection/presentation without weakening the English source-of-truth checks.

## Release status

**CODE / TECHNICAL RELEASE GATES: PASS on the audited release candidate, subject to the exact final-head browser/external jobs completing successfully after this audit record is committed.**

**LEGAL PUBLICATION STATUS: BLOCKED pending the lawyer-approved French Terms required by the supplied Terms clause 147 / applicable Quebec-language implementation.**

Do not merge PR #25 solely because the technical CI is green while this blocker remains open.
