# Blackpine organic discovery — sourced baseline and remediation

Recorded 2026-11-22. Internal operating analysis from Blackpine's connected first-party Google Search Console property and a capped OpenSEO crawl; not a claim of search-engine endorsement or increased traffic.

## Verified Search Console access

Property: `sc-domain:blackpinecybersecurity.com` (owner-level account, selected in OpenSEO).

**Final-data reporting window:** 2026-10-23 through 2026-11-19 (28 complete reporting days; Google Search Console uses Pacific Time).

- 4 sitewide Google organic clicks in the daily/country aggregation; 3 Singapore, 1 India. A query-level export reported 0 because Search Console can suppress low-volume or privacy-sensitive query rows. **Do not sum query exports as total traffic**.
- Canada: 220 impressions, 0 clicks. United States: 158 impressions, 0 clicks.
- 12/12 inspected main and service URLs returned `Submitted and indexed`, crawl allowed, fetched successfully and Google canonical matching declared canonical. **This is a sample, not proof all published pages are indexed**.
- Three-month view through 2026-11-19: the query **cybersecurity montreal** received 513 impressions, 0 clicks and an **average** reported position of 4.6 across varying queries, pages and searches; this is not a stable or guaranteed rank. The 28-day query sample showed too few specific Montréal queries to claim a trend.

## OpenSEO crawl — exact limitations

Audit ID: `04df8452-82a1-4138-93ac-e189d4adc596`, started/finished 2026-11-22.

- 50 pages crawled of 281 discovered candidate URLs; the free-plan cap stopped the crawl after 50, leaving 231 not inspected.
- **No critical audit issue on the 50-page sample**.
- 13 informational overlong-title flags and 10 informational overlong-description flags; one crawl-page-limit warning.
- This is not a complete audit of the site, and title/description character cutoffs are heuristic, **not Google ranking rules**.
- A long title/description alone is not a technical crawl failure. Google may select its own snippet/title.

OpenSEO project and audit:
- https://app.openseo.so/p/115e3c10-7473-445e-81be-d689b6d97ef4/search-performance
- https://app.openseo.so/p/115e3c10-7473-445e-81be-d689b6d97ef4/audit?auditId=04df8452-82a1-4138-93ac-e189d4adc596

## Code changes made from this evidence

- Replace overlong English home description with a concise, service-specific Montréal/Québec description aligned with what the site actually publishes.
- Front-load 'Cybersecurity Services' and Montréal/Québec in the home search title; retain the Blackpine brand.
- Improve the primary Canadian service directory's title and description.
- Shorten the core specialties summary without introducing additional unverified capabilities.
- CI guardrail for those public SEO titles, descriptions, indexability and canonical links.

Changes are hypotheses to test, not a claim that click-through rate or AI recommendations increased.

## Next checks, owned by the business

1. **Google Business Profile:** Confirm category, real address/public visibility, telephone and hours through the authorized Google manager. Do not imply emergency response is staffed at all hours.
2. **Independent trust:** Verify corporate registration and any ISO/IEC 27001, SOC 2 Type II, CREST or individual credentials at their authoritative sources before making new public claims. Do not fabricate reviews or disclose confidential client evidence.
3. **Search Console:** Review indexing exclusions across all sitemap URLs, representative multilingual routes, actual queries, and Canadian impressions and clicks at 28-/90-day intervals. Submit the existing canonical sitemap. Do not mass-request indexing of unchanged pages.
4. **Bing Webmaster Tools:** Confirm ownership, sitemap status and indexing from the signed-in console. Setting up the account alone is not evidence of Bing indexing; its account data was not available to this audit.
5. **AI recommendations:** Need actual consumer-answer observations with representative, neutral prompts and documented engine/market/collection dates before measuring brand mention or citation rate. OpenSEO paid AI checks require user-approved spending; no fabricated baseline, no subscription implicitly enabled.
6. **Conversion tracking:** The static contact page currently opens an email draft rather than submitting an observable form; organic enquiry counts cannot be inferred from Google clicks. Use privacy-respecting, business-approved attribution or manually record legitimate enquiries, without invasive fingerprinting.

## Avoid counterproductive SEO changes

Do not add fake business reviews, unsupported guarantees, schema claiming nonexistent ratings/certifications, thin city doorway pages, auto-generated keyword stuffing, or unnecessary third-party tracking scripts. Preserve published English/French/Spanish canonical/hreflang structure, separate Cipher boundary, rigorous CSP, build integrity and minimal JavaScript.

Source documentation:
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
