# Credibility Refresh Phase 2 — External Reputation

## Scope

Phase 2 makes Blackpine easier to verify outside Blackpine-owned pages while preserving strict evidence boundaries.

## Approved public business facts

- Legal name: Blackpine Cybersecurity Inc.
- Public business address: 6545 38e Avenue, Montréal, QC H1T 2X8, Canada
- Business phone: +1 226-241-5674
- Official site: https://blackpinecybersecurity.com
- Current verified external company profile: Google Business Profile

The public business address is not represented as the corporation's legally registered office. Province of incorporation, registration number and registered-office status remain evidence-gated until an authoritative corporate record is supplied and approved for publication.

## External reputation boundary

Google Business is the only third-party company profile promoted as verified in this phase. The website may link to that profile and publish the approved business address and phone that the listing corroborates.

Dynamic Google fields such as rating, review count and opening hours remain source-of-truth data on the third-party profile and are not fixed website claims.

No LinkedIn company profile or Clutch company profile is linked or claimed in this phase because no such profile has been independently verified and approved for publication.

## Review integrity

Blackpine's external reputation program prohibits purchased or fabricated reviews, review gating, client impersonation, pre-written reviews posted as the client's own words, conflicted reviews presented as independent customers, and disclosure of confidential engagement details.

## Automated release gates

Phase 2 adds or strengthens checks for:

- exact business address and phone consistency;
- Organization JSON-LD PostalAddress and telephone fields;
- Google Business destination and place identifier;
- business-address versus registered-office distinction;
- no fixed star-rating or review-count marketing claim;
- no unverified LinkedIn or Clutch profile links;
- ethical review-program controls;
- evidence register status boundaries;
- existing privacy, GitHub-exposure, claim, browser, hosting and external-link checks.

## Audit finding and correction

The first CI run caught a brittle new assertion in the company-consistency checker. The generated Organization JSON-LD already contained the Google Business `sameAs` destination and place identifier, but the assertion expected one exact serialization of ampersands in the URL. The checker was corrected to validate the `sameAs` destination and place identifier independently of equivalent JSON escaping. No production claim or structured-data field was added merely to satisfy the test.

## Verified implementation-head results

On implementation head `c9dceea8421e188ae41bcba02f053b5ac70ee364`:

- core build and structural/production verification — PASS;
- all existing Phase 1–5, V3/V4, claim, privacy, hosting and Pages-safety gates — PASS;
- company-consistency gate — PASS;
- external-reputation gate — PASS;
- site-wide external-destination audit — PASS: 86 generated HTML files and 15 unique external HTTPS destinations checked, with no confirmed HTTP 400/404/410 public-entry failures;
- rendered-browser audit — PASS across every indexed route plus key noindex/404 routes at desktop and 320px, representative tablet reflow, interaction checks, Chrome screenshots and Firefox render smoke;
- deep production scan — PASS across 75 source/config files (7,941 lines), five browser runtimes and all 86 generated HTML pages;
- privacy exposure scan — PASS: no public GitHub destinations/repository identifiers and no consumer/personal email addresses in the checked publication surface.

Build measurements on that verified head:

- 83 indexable routes + 3 noindex/error routes;
- CSS: 43.9 KiB / 64 KiB budget;
- JavaScript: 35.2 KiB / 64 KiB budget;
- search index: 225.3 KiB / 256 KiB budget;
- largest HTML: 30.0 KiB / 48 KiB budget.

## Release status

IMPLEMENTATION PASS. The implementation head above passed all three release jobs. Because this audit-record update creates a new branch head, the exact final head must pass the same core, external-destination and rendered-browser jobs before merge. Merge remains blocked until that final-head verification is complete.
