# Search visibility and independent credibility — owner handoff

Last reviewed: 2026-11-22. This is an operational checklist, **not** proof that Blackpine ranks or is recommended by any AI system.

## Done in the repository

- Static crawlable English, French-Canadian and Spanish public routes; no core-content JavaScript rendering dependency.
- Canonical URLs, reciprocal page-level `hreflang`, structured Organization/Breadcrumb/Article data, title/description tags, `robots.txt`, and `sitemap.xml`.
- Added sitemap-level reciprocal `hreflang` for published pages; withheld unpublished Spanish legal routes.
- `public/llms.txt` is a company-authored guide, not a search-engine protocol or a guarantee of AI inclusion.
- Automated build and live discovery checks. Do not change robots, canonicals, security policy, or service claims solely to attract search bots.
- The site has a known Google Business Profile record linked on the external verification page. **Do not infer the current profile owner, rating, category, hours, or verification from this repository.**

## Only an authorized Blackpine business owner can complete these steps

### 1. Google Search Console (owner sign-in and DNS verification)

1. Open https://search.google.com/search-console/ and select a **Domain property** for `blackpinecybersecurity.com`.
2. Copy the exact DNS TXT value that Google generates into the domain's authoritative DNS provider, verify ownership, and retain the record. Do not share account passwords or verification secrets.
3. Under Sitemaps, submit `https://blackpinecybersecurity.com/sitemap.xml`.
4. Inspect the main English, French and Spanish homepage and representative service/trust URLs for canonical/indexing errors. Do not repeatedly request indexing for unchanged pages.
5. Export baseline data covering total indexed pages, sitemap-discovered pages, organic search impressions/clicks, queries, and geographic/language distribution. Preserve evidence and record the date.

Reference: https://support.google.com/webmasters/answer/34592 and https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

### 2. Bing Webmaster Tools (owner sign-in)

1. Open https://www.bing.com/webmasters/ and import the verified Google Search Console property **if authorized**, or verify ownership separately.
2. Confirm `https://blackpinecybersecurity.com/sitemap.xml` is accepted and test the principal English/French/Spanish landing pages.
3. Keep a dated report of discovered/indexed pages and crawl issues.

Reference: https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b

### 3. Google Business Profile (legitimate manager only)

1. Confirm control of the real Blackpine business listing and match the website's legal name, **actual** address, direct business telephone and official URL.
2. Choose only accurate business categories, applicable service areas, and verified operating hours. Do **not** label a 24/7 emergency service unless staffed coverage is real and the published/contractual terms support it.
3. If the address is not a genuine customer-facing staffed location, review Google's service-area/address visibility guidelines before showing it to customers.
4. Solicit only voluntary reviews from genuine customers without incentives, review gating, scripts or pre-written praise. Never expose confidential incident evidence in reviews.
5. Record the profile URL, owner/controller, review date and evidence in the existing external reputation register; never write account credentials into Git.

References: https://support.google.com/business/answer/3038177 and https://support.google.com/business/answer/3039617

### 4. Third-party authority and credentials (requires real source evidence)

- Independently establish the company legal entity in a relevant Canadian government corporate registry before publishing a registration number or incorporation claim.
- Collect issuer-verifiable proof (scope, current validity, entity name, authorization to disclose) for any advertised ISO/IEC 27001, SOC 2 Type II, CREST, staff qualification, Microsoft partnership, or other credential. A company declaration and a gated request form are **not independent proof**.
- If a credential cannot be substantiated, correct the relevant claim rather than generating a badge or testimonial.
- Claim/create LinkedIn and Clutch company records only for the real company with approved ownership, accurate details and truthful evidence. Do not create a fabricated third-party citation network.
- Obtain written permission for any named customer case study, client logo, statistics, or external reference.

### 5. Measure actual discovery

Capture once before and after changes (30/60/90 days) rather than inventing a baseline:
- branded/unbranded Google Search Console impressions and clicks;
- indexing count, excluded page causes and canonical conflicts by EN/FR/ES;
- Bing indexed URLs and errors;
- genuine Google Business Profile searches/interactions;
- independently verifiable citations/reviews and referred qualified enquiries;
- a reproducible set of relevant Montreal/Quebec buyer queries tested without personalization, with exact date, country, language, query and model/search provider logged.

Do **not** claim an improved AI recommendation rate without a reproducible baseline and controlled re-test. Search-engine inclusion is neither a quality certificate nor an endorsement.

## Production release acceptance

Before claiming this hardening is live, confirm the Cloudflare Pages deployment includes the merged `main` SHA and that the post-merge live production workflow passes, including the canonical host, `llms.txt`, sitemap, French/Spanish landing pages, TLS/security policy and exact-release verification.

## Business-owner decisions required

- Is the published 26-person/team structure and Montréal staffing factually current?
- Are the registered address and Ontario-area-code business telephone correct and appropriate for public listings?
- What hours and response SLA can operations actually deliver?
- Which organizational credentials can the issuer or audit body verify today, and what can be disclosed?
- Who is authorized to manage Search Console, Bing Webmaster Tools, Google Business Profile, and external company directories?

No code change can substitute for those answers.
