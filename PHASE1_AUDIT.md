# Phase 1 — Trust Foundation Audit

Date: 2026-10-24

Scope: legal identity, public trust basics, leadership publication controls, legal pages, responsible disclosure, security contact, security.txt, and corporate/Cipher surface separation.

## Implemented in this phase

- Added a public Legal & Company Information page.
- Added a public Acceptable Use Policy.
- Replaced the public About route with a verification-gated company page that publishes only confirmed facts.
- Replaced the public Team route with a verification-gated leadership publication page rather than presenting the existing unverified 26-person directory as established fact.
- Strengthened the Responsible Disclosure Policy with explicit scope, allowed testing, prohibited testing, good-faith research expectations, disclosure process, and researcher-recognition boundaries.
- Preserved the existing security contact at security@blackpinecybersecurity.com.
- Preserved the existing RFC-style /.well-known/security.txt record and its canonical Policy link.
- Added sitewide footer links for company information, Privacy, Terms, Acceptable Use, and security.txt.
- Added Organization structured data using the legal name Blackpine Cybersecurity Inc.
- Preserved the existing separation between the corporate site and Cipher, Verify, and Support surfaces.
- Added an automated Phase 1 trust-foundation check to the normal verification pipeline.

## Existing controls confirmed during audit

- Privacy page exists.
- Website Terms page exists.
- Responsible Disclosure page existed before this phase and has been strengthened.
- /.well-known/security.txt exists with contact, canonical URL, policy URL, and expiry.
- Corporate contact and security-contact addresses are centralized.
- The corporate site documents that Cipher, Verify, and Support use separate surfaces.
- The corporate-site baseline already rejects advertising/marketing trackers on sensitive Blackpine surfaces.

## Items intentionally NOT invented

The following are not considered complete until Blackpine supplies authoritative evidence and approves publication:

- Province/jurisdiction of incorporation.
- Corporate registration number.
- Registered-office address.
- Leadership names and titles unless confirmed for public use.
- Leadership biographies, previous employers, years of experience, photographs, LinkedIn profiles, and certifications.
- PGP security-reporting key and fingerprint.
- Technology partnerships.
- Insurance claims or certificates.
- ISO/SOC certifications or audit claims.

## Phase 1 acceptance matrix

| Requirement | Status | Evidence / note |
|---|---|---|
| Correct legal name | PASS | Blackpine Cybersecurity Inc. is used on the Phase 1 company/legal surfaces. |
| Canada-based status | PASS | Published without inventing a province. |
| Official website/contact | PASS | blackpinecybersecurity.com and centralized contact addresses. |
| Leadership page | PARTIAL | Safe publication gate implemented; real profiles still require verified source data. |
| Privacy Policy | PASS (technical) | Existing page retained; legal-counsel review remains outside this code audit. |
| Website Terms | PASS (technical) | Existing page retained; legal-counsel review remains outside this code audit. |
| Acceptable Use Policy | PASS (technical) | Added in this phase. |
| Responsible Disclosure Policy | PASS (technical) | Expanded in this phase. |
| Cookie Policy | NOT REQUIRED CURRENTLY | Current site states no ad network, marketing analytics, tag manager, or equivalent tracking stack. Reassess if that changes. |
| security.txt | PASS | Existing canonical record retained. |
| Security contact | PASS | security@blackpinecybersecurity.com. |
| PGP security contact | OPEN | No verified public key supplied; none was generated or invented. |
| Company registration details | OPEN | Awaiting authoritative corporate record. |
| Corporate/legal footer | PASS | Added company info, Privacy, Terms, AUP; security.txt remains sitewide under Trust. |
| Cipher separation | PASS | Existing separate Cipher/Verify/Support architecture preserved. |
| No fabricated credentials/certifications | PASS | Phase 1 public leadership route removes unverified employee-directory claims. |

## Audit conclusion

Phase 1 is code-complete for everything that can be implemented truthfully from the information currently available. It is not evidence-complete. The two material blockers to a full credibility PASS are (1) authoritative corporate-registration details and (2) verified leadership profile data. A PGP key is optional but remains open because no approved key material was supplied.

Legal-policy pages are implementation-ready drafts, not a substitute for review by qualified Canadian legal counsel. No certification, audit, customer-logo, partnership, insurance, or regulatory claim has been added.
